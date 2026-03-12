import { describe, expect, it } from "vitest";
import { compareLayouts, type LayoutBlock } from "../engine/diff";

const canvas = { width: 640, height: 380 };

const target: LayoutBlock[] = [
  { id: "t1", x: 40, y: 40, width: 200, height: 120, color: "#334155" },
  { id: "t2", x: 300, y: 60, width: 180, height: 140, color: "#2563eb" },
];

describe("compareLayouts", () => {
  it("returns 100 similarity for identical layouts", () => {
    const result = compareLayouts(target, target, canvas);

    expect(result.positionScore).toBe(100);
    expect(result.sizeScore).toBe(100);
    expect(result.colorScore).toBe(100);
    expect(result.similarityScore).toBe(100);
  });

  it("reduces position score when blocks are shifted", () => {
    const shifted: LayoutBlock[] = [
      { ...target[0], id: "u1", x: 120, y: 100 },
      { ...target[1], id: "u2", x: 390, y: 170 },
    ];

    const result = compareLayouts(target, shifted, canvas);

    expect(result.positionScore).toBeLessThan(85);
  });

  it("reduces size and color scores for mismatches", () => {
    const mismatched: LayoutBlock[] = [
      { ...target[0], id: "u1", width: 260, height: 80, color: "#ff0000" },
      { ...target[1], id: "u2", width: 120, height: 200, color: "#00ff00" },
    ];

    const result = compareLayouts(target, mismatched, canvas);

    expect(result.sizeScore).toBeLessThan(90);
    expect(result.colorScore).toBeLessThan(70);
  });
});