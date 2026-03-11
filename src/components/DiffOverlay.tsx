import type { LayoutCompareResult } from "../engine/layoutCompare";

type DiffOverlayProps = {
  result: LayoutCompareResult;
};

export default function DiffOverlay({ result }: DiffOverlayProps) {
  return (
    <section className="panel">
      <h2>Diff Overlay</h2>
      <p className="match-score">Match: {result.matchScore.toFixed(1)}%</p>

      <ul className="metric-list">
        <li>
          <span>Position</span>
          <strong>{result.positionScore.toFixed(1)}%</strong>
        </li>
        <li>
          <span>Size</span>
          <strong>{result.sizeScore.toFixed(1)}%</strong>
        </li>
        <li>
          <span>Color</span>
          <strong>{result.colorScore.toFixed(1)}%</strong>
        </li>
      </ul>

      <p className="hint-text">Run diff after arranging builder elements to evaluate similarity.</p>
    </section>
  );
}
