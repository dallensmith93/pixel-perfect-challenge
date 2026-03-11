import { describe, expect, it } from "vitest";
import { pixelDiff } from "../engine/pixelDiff";
import { layoutCompare, type LayoutElement } from "../engine/layoutCompare";

const target: LayoutElement[] = [
  { id: "t1", kind: "div", x: 40, y: 40, width: 200, height: 120, color: "#334155" },
  { id: "t2", kind: "button", x: 60, y: 190, width: 110, height: 40, color: "#2563eb", text: "Save" },
];

describe("layoutCompare", () => {
  it("returns near-perfect scores for identical layouts", () => {
    const result = layoutCompare(target, target, { width: 640, height: 360 });

    expect(result.positionScore).toBeGreaterThan(99);
    expect(result.sizeScore).toBeGreaterThan(99);
    expect(result.colorScore).toBeGreaterThan(99);
  });

  it("drops position score when elements are shifted", () => {
    const shifted: LayoutElement[] = [
      { ...target[0], id: "u1", x: 180, y: 110 },
      { ...target[1], id: "u2", x: 220, y: 260 },
    ];

    const result = layoutCompare(target, shifted, { width: 640, height: 360 });
    expect(result.positionScore).toBeLessThan(75);
  });

  it("drops color score when colors differ", () => {
    const wrongColor: LayoutElement[] = [
      { ...target[0], id: "u1", color: "#ff0000" },
      { ...target[1], id: "u2", color: "#00ff00" },
    ];

    const result = layoutCompare(target, wrongColor, { width: 640, height: 360 });
    expect(result.colorScore).toBeLessThan(70);
  });
});

describe("pixelDiff", () => {
  it("combines channel scores into weighted match score", () => {
    const match = pixelDiff({ positionScore: 80, sizeScore: 60, colorScore: 100 });
    expect(match).toBeCloseTo(77, 0);
  });
});
