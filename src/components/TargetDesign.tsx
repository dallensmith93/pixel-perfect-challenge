import type { LayoutTemplate } from "../engine/layoutCompare";

export const targetTemplates: LayoutTemplate[] = [
  {
    id: "hero-layout",
    name: "Hero + CTA",
    width: 640,
    height: 360,
    elements: [
      { id: "t1", kind: "div", x: 40, y: 40, width: 560, height: 280, color: "#e2e8f0" },
      { id: "t2", kind: "text", x: 80, y: 80, width: 320, height: 42, color: "#0f172a", text: "Build Faster" },
      { id: "t3", kind: "button", x: 80, y: 145, width: 140, height: 44, color: "#2563eb", text: "Get Started" },
      { id: "t4", kind: "image", x: 420, y: 80, width: 140, height: 140, color: "#94a3b8" },
    ],
  },
  {
    id: "dashboard-card",
    name: "Dashboard Card",
    width: 640,
    height: 360,
    elements: [
      { id: "d1", kind: "div", x: 60, y: 50, width: 520, height: 240, color: "#ffffff" },
      { id: "d2", kind: "text", x: 90, y: 85, width: 260, height: 32, color: "#111827", text: "Team Velocity" },
      { id: "d3", kind: "text", x: 90, y: 130, width: 180, height: 24, color: "#10b981", text: "+12%" },
      { id: "d4", kind: "button", x: 90, y: 205, width: 110, height: 38, color: "#0f172a", text: "Details" },
    ],
  },
];

type TargetDesignProps = {
  template: LayoutTemplate;
};

export default function TargetDesign({ template }: TargetDesignProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Target Design</h2>
        <span>{template.name}</span>
      </div>

      <div className="canvas-preview" style={{ width: template.width, height: template.height }}>
        {template.elements.map((element) => (
          <PreviewElement key={element.id} element={element} />
        ))}
      </div>
    </section>
  );
}

function PreviewElement({ element }: { element: LayoutTemplate["elements"][number] }) {
  const style = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    backgroundColor: element.kind === "text" ? "transparent" : element.color,
    color: element.kind === "text" ? element.color : "#ffffff",
  };

  return (
    <div className={`layout-element ${element.kind}`} style={style}>
      {element.kind === "text" || element.kind === "button" ? element.text : null}
    </div>
  );
}
