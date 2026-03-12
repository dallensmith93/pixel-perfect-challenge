import { useEffect, useRef } from "react";
import type { LayoutBlock } from "../engine/diff";

type BuilderCanvasProps = {
  width: number;
  height: number;
  blocks: LayoutBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onMoveBlock: (id: string, x: number, y: number) => void;
};

type DragState = {
  id: string;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
} | null;

export default function BuilderCanvas({
  width,
  height,
  blocks,
  selectedBlockId,
  onSelectBlock,
  onMoveBlock,
}: BuilderCanvasProps) {
  const dragRef = useRef<DragState>(null);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) {
        return;
      }

      const block = blocks.find((item) => item.id === drag.id);
      if (!block) {
        return;
      }

      const dx = event.clientX - drag.startClientX;
      const dy = event.clientY - drag.startClientY;
      const nextX = clamp(drag.startX + dx, 0, width - block.width);
      const nextY = clamp(drag.startY + dy, 0, height - block.height);

      onMoveBlock(drag.id, nextX, nextY);
    };

    const onPointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [blocks, height, onMoveBlock, width]);

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Builder Canvas</h2>
        <span>Drag blocks to match target</span>
      </div>
      <div className="layout-stage" style={{ width, height }} onPointerDown={() => onSelectBlock(null)}>
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`layout-block builder${selectedBlockId === block.id ? " selected" : ""}`}
            style={{
              left: block.x,
              top: block.y,
              width: block.width,
              height: block.height,
              backgroundColor: block.color,
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
              onSelectBlock(block.id);
              dragRef.current = {
                id: block.id,
                startClientX: event.clientX,
                startClientY: event.clientY,
                startX: block.x,
                startY: block.y,
              };
            }}
          />
        ))}
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}