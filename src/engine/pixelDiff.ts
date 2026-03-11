export type PixelScoreInput = {
  positionScore: number;
  sizeScore: number;
  colorScore: number;
};

export function pixelDiff(input: PixelScoreInput): number {
  const positionWeight = 0.45;
  const sizeWeight = 0.35;
  const colorWeight = 0.2;

  return clamp(
    input.positionScore * positionWeight + input.sizeScore * sizeWeight + input.colorScore * colorWeight,
    0,
    100
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
