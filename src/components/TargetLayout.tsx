import type { LayoutBlock } from "../engine/diff";

export type LayoutTemplate = {
  id: string;
  name: string;
  width: number;
  height: number;
  blocks: LayoutBlock[];
};

export const templates: LayoutTemplate[] = [
  {
    id: "card-stack",
    name: "Card Stack",
    width: 640,
    height: 380,
    blocks: [
      { id: "t1", x: 40, y: 34, width: 560, height: 72, color: "#1d4ed8" },
      { id: "t2", x: 40, y: 128, width: 260, height: 206, color: "#334155" },
      { id: "t3", x: 320, y: 128, width: 280, height: 90, color: "#0f766e" },
      { id: "t4", x: 320, y: 244, width: 280, height: 90, color: "#7c3aed" },
    ],
  },
  {
    id: "dashboard",
    name: "Mini Dashboard",
    width: 640,
    height: 380,
    blocks: [
      { id: "t1", x: 30, y: 32, width: 190, height: 140, color: "#0369a1" },
      { id: "t2", x: 234, y: 32, width: 376, height: 140, color: "#1e3a8a" },
      { id: "t3", x: 30, y: 190, width: 580, height: 58, color: "#475569" },
      { id: "t4", x: 30, y: 266, width: 280, height: 80, color: "#0f766e" },
      { id: "t5", x: 330, y: 266, width: 280, height: 80, color: "#be123c" },
    ],
  },
];

type TargetLayoutProps = {
  template: LayoutTemplate;
};

export default function TargetLayout({ template }: TargetLayoutProps) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Target Layout</h2>
        <span>{template.name}</span>
      </div>
      <div className="layout-stage" style={{ width: template.width, height: template.height }}>
        {template.blocks.map((block) => (
          <div
            key={block.id}
            className="layout-block target"
            style={{
              left: block.x,
              top: block.y,
              width: block.width,
              height: block.height,
              backgroundColor: block.color,
            }}
          />
        ))}
      </div>
    </section>
  );
}