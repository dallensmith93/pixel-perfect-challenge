export type ElementKind = "div" | "text" | "button" | "image";

export type LayoutElement = {
  id: string;
  kind: ElementKind;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
};

export type LayoutTemplate = {
  id: string;
  name: string;
  width: number;
  height: number;
  elements: LayoutElement[];
};

export type LayoutCompareDetail = {
  targetId: string;
  matchId: string | null;
  positionScore: number;
  sizeScore: number;
  colorScore: number;
  totalScore: number;
};

export type LayoutCompareResult = {
  positionScore: number;
  sizeScore: number;
  colorScore: number;
  matchScore: number;
  details: LayoutCompareDetail[];
};

export function createDefaultElement(id: string, kind: ElementKind, x: number, y: number): LayoutElement {
  const defaults: Record<ElementKind, Omit<LayoutElement, "id" | "x" | "y">> = {
    div: { kind: "div", width: 150, height: 90, color: "#94a3b8" },
    text: { kind: "text", width: 180, height: 30, color: "#0f172a", text: "Sample Text" },
    button: { kind: "button", width: 120, height: 40, color: "#2563eb", text: "Button" },
    image: { kind: "image", width: 130, height: 110, color: "#64748b" },
  };

  const base = defaults[kind];
  return { id, x, y, ...base };
}

export function layoutCompare(
  target: LayoutElement[],
  actual: LayoutElement[],
  canvas: { width: number; height: number }
): LayoutCompareResult {
  if (target.length === 0) {
    return { positionScore: 100, sizeScore: 100, colorScore: 100, matchScore: 100, details: [] };
  }

  const unusedActual = new Set(actual.map((element) => element.id));
  const details: LayoutCompareDetail[] = [];

  for (const targetElement of target) {
    const candidate = findBestMatch(targetElement, actual, unusedActual, canvas);

    if (!candidate) {
      details.push({
        targetId: targetElement.id,
        matchId: null,
        positionScore: 0,
        sizeScore: 0,
        colorScore: 0,
        totalScore: 0,
      });
      continue;
    }

    unusedActual.delete(candidate.id);

    const positionScore = scorePosition(targetElement, candidate, canvas);
    const sizeScore = scoreSize(targetElement, candidate);
    const colorScore = scoreColor(targetElement.color, candidate.color);
    const totalScore = (positionScore + sizeScore + colorScore) / 3;

    details.push({
      targetId: targetElement.id,
      matchId: candidate.id,
      positionScore,
      sizeScore,
      colorScore,
      totalScore,
    });
  }

  const aggregate = details.reduce(
    (sum, detail) => {
      sum.position += detail.positionScore;
      sum.size += detail.sizeScore;
      sum.color += detail.colorScore;
      return sum;
    },
    { position: 0, size: 0, color: 0 }
  );

  const count = details.length;
  return {
    positionScore: aggregate.position / count,
    sizeScore: aggregate.size / count,
    colorScore: aggregate.color / count,
    matchScore: (aggregate.position + aggregate.size + aggregate.color) / (count * 3),
    details,
  };
}

function findBestMatch(
  target: LayoutElement,
  actual: LayoutElement[],
  unusedActual: Set<string>,
  canvas: { width: number; height: number }
): LayoutElement | null {
  let best: LayoutElement | null = null;
  let bestScore = -1;

  for (const candidate of actual) {
    if (!unusedActual.has(candidate.id)) continue;
    if (candidate.kind !== target.kind) continue;

    const positionScore = scorePosition(target, candidate, canvas);
    const sizeScore = scoreSize(target, candidate);
    const colorScore = scoreColor(target.color, candidate.color);
    const total = positionScore * 0.45 + sizeScore * 0.35 + colorScore * 0.2;

    if (total > bestScore) {
      best = candidate;
      bestScore = total;
    }
  }

  return best;
}

function scorePosition(
  target: LayoutElement,
  actual: LayoutElement,
  canvas: { width: number; height: number }
): number {
  const dx = Math.abs(target.x - actual.x);
  const dy = Math.abs(target.y - actual.y);
  const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
  const distance = Math.sqrt(dx * dx + dy * dy);
  return clamp(100 - (distance / diagonal) * 180, 0, 100);
}

function scoreSize(target: LayoutElement, actual: LayoutElement): number {
  const widthDiff = Math.abs(target.width - actual.width);
  const heightDiff = Math.abs(target.height - actual.height);
  const maxDiff = Math.max(target.width, actual.width) + Math.max(target.height, actual.height);
  const sizePenalty = maxDiff === 0 ? 0 : ((widthDiff + heightDiff) / maxDiff) * 140;
  return clamp(100 - sizePenalty, 0, 100);
}

function scoreColor(targetColor: string, actualColor: string): number {
  const target = hexToRgb(targetColor);
  const actual = hexToRgb(actualColor);
  if (!target || !actual) return 0;

  const dr = target.r - actual.r;
  const dg = target.g - actual.g;
  const db = target.b - actual.b;
  const distance = Math.sqrt(dr * dr + dg * dg + db * db);
  const maxDistance = Math.sqrt(255 * 255 * 3);
  return clamp(100 - (distance / maxDistance) * 120, 0, 100);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
