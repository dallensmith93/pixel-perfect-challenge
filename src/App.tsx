import { useMemo, useState } from "react";
import BuilderCanvas from "./components/BuilderCanvas";
import DiffOverlay from "./components/DiffOverlay";
import TargetLayout, { templates } from "./components/TargetLayout";
import { compareLayouts, type LayoutBlock } from "./engine/diff";

function createBuilderBlocks(templateBlocks: LayoutBlock[]): LayoutBlock[] {
  return templateBlocks.map((block, index) => ({
    ...block,
    id: `b${index + 1}`,
    x: Math.max(0, block.x + 24),
    y: Math.max(0, block.y + 16),
  }));
}

export default function App() {
  const [templateId, setTemplateId] = useState(templates[0].id);
  const activeTemplate = templates.find((template) => template.id === templateId) ?? templates[0];

  const [builderBlocks, setBuilderBlocks] = useState<LayoutBlock[]>(() =>
    createBuilderBlocks(activeTemplate.blocks)
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const result = useMemo(
    () => compareLayouts(activeTemplate.blocks, builderBlocks, activeTemplate),
    [activeTemplate, builderBlocks]
  );

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>Pixel Perfect Challenge</h1>
          <p>Recreate the target layout by dragging blocks in the builder canvas.</p>
        </div>
        <div className="toolbar-row">
          <label>
            Template
            <select
              value={activeTemplate.id}
              onChange={(event) => {
                const next = templates.find((template) => template.id === event.target.value) ?? templates[0];
                setTemplateId(next.id);
                setBuilderBlocks(createBuilderBlocks(next.blocks));
                setSelectedBlockId(null);
              }}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setBuilderBlocks(createBuilderBlocks(activeTemplate.blocks));
              setSelectedBlockId(null);
            }}
          >
            Reset Builder
          </button>
        </div>
      </header>

      <section className="workspace-grid">
        <TargetLayout template={activeTemplate} />
        <BuilderCanvas
          width={activeTemplate.width}
          height={activeTemplate.height}
          blocks={builderBlocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
          onMoveBlock={(id, x, y) => {
            setBuilderBlocks((previous) =>
              previous.map((block) => (block.id === id ? { ...block, x, y } : block))
            );
          }}
        />
        <DiffOverlay result={result} />
      </section>
    </main>
  );
}