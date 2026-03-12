export type LayoutBlock = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type CompareInput = {
  width: number;
  height: number;
};

export type DiffResult = {
  positionScore: number;
  sizeScore: number;
  colorScore: number;
  similarityScore: number;
};

export function compareLayouts(
  targetBlocks: LayoutBlock[],
  userBlocks: LayoutBlock[],
  canvas: CompareInput
): DiffResult {
  const pairCount = Math.max(targetBlocks.length, userBlocks.length);

  if (pairCount === 0) {
    return { positionScore: 100, sizeScore: 100, colorScore: 100, similarityScore: 100 };
  }

  let positionTotal = 0;
  let sizeTotal = 0;
  let colorTotal = 0;

  for (let index = 0; index < pairCount; index += 1) {
    const target = targetBlocks[index];
    const user = userBlocks[index];

    if (!target || !user) {
      continue;
    }

    positionTotal += scorePosition(target, user, canvas);
    sizeTotal += scoreSize(target, user, canvas);
    colorTotal += scoreColor(target.color, user.color);
  }

  const positionScore = (positionTotal / pairCount) * 100;
  const sizeScore = (sizeTotal / pairCount) * 100;
  const colorScore = (colorTotal / pairCount) * 100;
  const similarityScore = positionScore * 0.4 + sizeScore * 0.3 + colorScore * 0.3;

  return {
    positionScore: round2(positionScore),
    sizeScore: round2(sizeScore),
    colorScore: round2(colorScore),
    similarityScore: round2(similarityScore),
  };
}

function scorePosition(target: LayoutBlock, user: LayoutBlock, canvas: CompareInput): number {
  const targetCenterX = target.x + target.width / 2;
  const targetCenterY = target.y + target.height / 2;
  const userCenterX = user.x + user.width / 2;
  const userCenterY = user.y + user.height / 2;

  const dx = targetCenterX - userCenterX;
  const dy = targetCenterY - userCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
  return clamp(1 - distance / maxDistance, 0, 1);
}

function scoreSize(target: LayoutBlock, user: LayoutBlock, canvas: CompareInput): number {
  const dw = Math.abs(target.width - user.width) / canvas.width;
  const dh = Math.abs(target.height - user.height) / canvas.height;
  return clamp(1 - (dw + dh) / 2, 0, 1);
}

function scoreColor(targetColor: string, userColor: string): number {
  const target = parseHexColor(targetColor);
  const user = parseHexColor(userColor);

  const dr = target.r - user.r;
  const dg = target.g - user.g;
  const db = target.b - user.b;
  const distance = Math.sqrt(dr * dr + dg * dg + db * db);
  return clamp(1 - distance / 441.67295593, 0, 1);
}

function parseHexColor(color: string): { r: number; g: number; b: number } {
  const value = color.replace("#", "");
  const expanded = value.length === 3 ? value.split("").map((part) => part + part).join("") : value;

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}