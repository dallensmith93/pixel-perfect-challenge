import type { ElementKind, LayoutElement, LayoutTemplate } from "../engine/layoutCompare";

type ControlPanelProps = {
  templates: LayoutTemplate[];
  activeTemplateId: string;
  onChangeTemplate: (id: string) => void;
  onAddElement: (kind: ElementKind) => void;
  selectedElement: LayoutElement | null;
  onColorChange: (color: string) => void;
  onRunDiff: () => void;
  onResetBuilder: () => void;
};

const elementKinds: ElementKind[] = ["div", "text", "button", "image"];

export default function ControlPanel({
  templates,
  activeTemplateId,
  onChangeTemplate,
  onAddElement,
  selectedElement,
  onColorChange,
  onRunDiff,
  onResetBuilder,
}: ControlPanelProps) {
  return (
    <section className="panel control-panel">
      <h2>Controls</h2>

      <label className="field">
        <span>Template</span>
        <select value={activeTemplateId} onChange={(event) => onChangeTemplate(event.target.value)}>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </label>

      <div className="field">
        <span>Add Element</span>
        <div className="kind-buttons">
          {elementKinds.map((kind) => (
            <button key={kind} type="button" onClick={() => onAddElement(kind)}>
              {kind}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span>Selected Color</span>
        <input
          type="color"
          value={selectedElement?.color ?? "#334155"}
          disabled={!selectedElement}
          onChange={(event) => onColorChange(event.target.value)}
        />
      </label>

      <div className="action-buttons">
        <button type="button" onClick={onRunDiff}>Run Diff</button>
        <button type="button" onClick={onResetBuilder}>Reset</button>
      </div>
    </section>
  );
}
