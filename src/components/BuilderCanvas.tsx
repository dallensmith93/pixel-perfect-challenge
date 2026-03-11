import { useEffect, useRef } from "react";
import type { LayoutElement } from "../engine/layoutCompare";

type BuilderCanvasProps = {
  width: number;
  height: number;
  elements: LayoutElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onMoveElement: (id: string, x: number, y: number) => void;
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
  elements,
  selectedElementId,
  onSelectElement,
  onMoveElement,
}: BuilderCanvasProps) {
  const dragRef = useRef<DragState>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = event.clientX - drag.startClientX;
      const dy = event.clientY - drag.startClientY;

      onMoveElement(drag.id, Math.max(0, drag.startX + dx), Math.max(0, drag.startY + dy));
    };

    const handlePointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [onMoveElement]);

  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Builder Canvas</h2>
        <span>{elements.length} elements</span>
      </div>

      <div className="canvas-preview" style={{ width, height }} onPointerDown={() => onSelectElement(null)}>
        {elements.map((element) => {
          const style = {
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            backgroundColor: element.kind === "text" ? "transparent" : element.color,
            color: element.kind === "text" ? element.color : "#ffffff",
          };

          return (
            <div
              key={element.id}
              className={`layout-element ${element.kind}${
                selectedElementId === element.id ? " selected" : ""
              }`}
              style={style}
              onPointerDown={(event) => {
                event.stopPropagation();
                onSelectElement(element.id);
                dragRef.current = {
                  id: element.id,
                  startClientX: event.clientX,
                  startClientY: event.clientY,
                  startX: element.x,
                  startY: element.y,
                };
              }}
            >
              {element.kind === "text" || element.kind === "button" ? element.text : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
