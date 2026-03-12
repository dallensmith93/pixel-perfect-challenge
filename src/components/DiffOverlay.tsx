import type { DiffResult } from "../engine/diff";

type DiffOverlayProps = {
  result: DiffResult;
};

export default function DiffOverlay({ result }: DiffOverlayProps) {
  return (
    <section className="panel panel-metrics">
      <h2>Diff Overlay</h2>
      <p className="total-score">Similarity {result.similarityScore.toFixed(2)}%</p>

      <ul className="metrics-list">
        <li>
          <span>Position</span>
          <strong>{result.positionScore.toFixed(2)}%</strong>
        </li>
        <li>
          <span>Size</span>
          <strong>{result.sizeScore.toFixed(2)}%</strong>
        </li>
        <li>
          <span>Color</span>
          <strong>{result.colorScore.toFixed(2)}%</strong>
        </li>
      </ul>
    </section>
  );
}