import { useMemo, useState } from "react";
import BuilderCanvas from "./components/BuilderCanvas";
import ControlPanel from "./components/ControlPanel";
import DiffOverlay from "./components/DiffOverlay";
import TargetDesign, { targetTemplates } from "./components/TargetDesign";
import { pixelDiff } from "./engine/pixelDiff";
import {
  createDefaultElement,
  layoutCompare,
  type ElementKind,
  type LayoutCompareResult,
  type LayoutElement,
} from "./engine/layoutCompare";

function getTemplate(templateId: string) {
  return targetTemplates.find((template) => template.id === templateId) ?? targetTemplates[0];
}

export default function App() {
  const [templateId, setTemplateId] = useState(targetTemplates[0].id);
  const [builderElements, setBuilderElements] = useState<LayoutElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [nextId, setNextId] = useState(1);
  const [diffResult, setDiffResult] = useState<LayoutCompareResult>({
    positionScore: 0,
    sizeScore: 0,
    colorScore: 0,
    matchScore: 0,
    details: [],
  });

  const template = useMemo(() => getTemplate(templateId), [templateId]);

  const selectedElement = builderElements.find((element) => element.id === selectedElementId) ?? null;

  const handleTemplateChange = (nextTemplateId: string) => {
    setTemplateId(nextTemplateId);
    setBuilderElements([]);
    setSelectedElementId(null);
    setDiffResult({
      positionScore: 0,
      sizeScore: 0,
      colorScore: 0,
      matchScore: 0,
      details: [],
    });
  };

  const handleAddElement = (kind: ElementKind) => {
    const element = createDefaultElement(`user-${nextId}`, kind, 40 + nextId * 14, 50 + nextId * 10);
    setNextId((value) => value + 1);
    setBuilderElements((previous) => [...previous, element]);
    setSelectedElementId(element.id);
  };

  const handleMoveElement = (id: string, x: number, y: number) => {
    setBuilderElements((previous) =>
      previous.map((element) => (element.id === id ? { ...element, x, y } : element))
    );
  };

  const handleColorChange = (color: string) => {
    if (!selectedElementId) return;
    setBuilderElements((previous) =>
      previous.map((element) => (element.id === selectedElementId ? { ...element, color } : element))
    );
  };

  const handleRunDiff = () => {
    const compare = layoutCompare(template.elements, builderElements, {
      width: template.width,
      height: template.height,
    });

    const matchScore = pixelDiff({
      positionScore: compare.positionScore,
      sizeScore: compare.sizeScore,
      colorScore: compare.colorScore,
    });

    setDiffResult({ ...compare, matchScore });
  };

  const handleResetBuilder = () => {
    setBuilderElements([]);
    setSelectedElementId(null);
    setDiffResult({
      positionScore: 0,
      sizeScore: 0,
      colorScore: 0,
      matchScore: 0,
      details: [],
    });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Pixel Perfect Challenge</h1>
        <p>Recreate the target layout and run diff to measure match accuracy.</p>
      </header>

      <main className="layout-grid">
        <TargetDesign template={template} />
        <BuilderCanvas
          width={template.width}
          height={template.height}
          elements={builderElements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onMoveElement={handleMoveElement}
        />
        <DiffOverlay result={diffResult} />
        <ControlPanel
          templates={targetTemplates}
          activeTemplateId={template.id}
          onChangeTemplate={handleTemplateChange}
          onAddElement={handleAddElement}
          selectedElement={selectedElement}
          onColorChange={handleColorChange}
          onRunDiff={handleRunDiff}
          onResetBuilder={handleResetBuilder}
        />
      </main>
    </div>
  );
}
