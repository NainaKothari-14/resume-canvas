import { Rnd } from "react-rnd";
import { useEditorStore } from "../store/editorStore";
import { useMemo, useRef, useState, memo } from "react";

function Block({ block }) {
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const moveResizeBlock = useEditorStore((s) => s.moveResizeBlock);
  const updateBlock = useEditorStore((s) => s.updateBlock);

  const isSelected = selectedId === block.id;

  const commonStyle = useMemo(() => {
    const s = block.style || {};
    return {
      fontSize: s.fontSize ?? 14,
      fontWeight: s.fontWeight ?? 400,
      color: s.color ?? "#111111",
      textAlign: s.align ?? "left",
      lineHeight: s.lineHeight ?? 1.35,
      letterSpacing: s.letterSpacing ?? "normal",
      fontStyle: s.fontStyle ?? "normal",
      textDecoration: s.textDecoration ?? "none",
    };
  }, [block.style]);

  const editableRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const renderContent = () => {
    if (block.type === "divider") {
      const dividerColor = block.style?.color || "#e5e7eb";
      return (
        <div className="w-full h-full flex items-center">
          <div 
            className="w-full" 
            style={{ 
              height: "2px", 
              backgroundColor: dividerColor,
              borderRadius: "1px"
            }} 
          />
        </div>
      );
    }

    if (block.type === "list") {
      const items = Array.isArray(block.content) ? block.content : [];
      return (
        <ul 
          style={{ ...commonStyle, whiteSpace: "pre-wrap" }} 
          className="list-none cursor-text"
        >
          {items.map((t, idx) => (
            <li key={idx}>{t}</li>
          ))}
        </ul>
      );
    }

    // TEXT / HEADING
    return (
      <div
        ref={editableRef}
        key={block.id}
        dir="ltr"
        style={{ 
          ...commonStyle, 
          direction: "ltr", 
          unicodeBidi: "plaintext",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          overflowWrap: "break-word"
        }}
        className="outline-none cursor-text w-full h-full"
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onFocus={(e) => {
          setIsEditing(true);
          e.currentTarget.setAttribute("dir", "ltr");
        }}
        onBlur={(e) => {
          setIsEditing(false);
          const newContent = e.currentTarget.textContent ?? "";
          if (newContent !== block.content) {
            updateBlock(block.id, { content: newContent });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.stopPropagation();
          }
        }}
      >
        {block.content}
      </div>
    );
  };

  const resizeConfig = block.type === "divider" 
    ? {
        top: false,
        right: true,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }
    : true;

  return (
    <Rnd
      size={{ width: block.w, height: block.h }}
      position={{ x: block.x, y: block.y }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setSelected(block.id);
      }}
      onDragStop={(e, d) =>
        moveResizeBlock(block.id, { x: d.x, y: d.y, w: block.w, h: block.h })
      }
      onResizeStop={(e, dir, ref, delta, pos) => {
        const w = parseInt(ref.style.width, 10);
        const h = parseInt(ref.style.height, 10);
        moveResizeBlock(block.id, { x: pos.x, y: pos.y, w, h });
      }}
      bounds="parent"
      enableResizing={resizeConfig}
      className={`${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
      dragHandleClassName="drag-handle"
      disableDragging={isEditing}
      style={{ direction: "ltr" }}
    >
      <div 
        className="w-full h-full relative"
        style={{ 
          padding: isSelected && block.type !== "divider" ? "24px 8px 8px 8px" : "8px",
          direction: "ltr" 
        }}
      >
        {isSelected && block.type !== "divider" && (
          <div 
            className="drag-handle absolute top-1 left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-neutral-400 hover:bg-neutral-500 cursor-move transition-colors"
          />
        )}
        {isSelected && block.type === "divider" && (
          <div 
            className="drag-handle absolute -top-2 left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-neutral-400 hover:bg-neutral-500 cursor-move transition-colors"
          />
        )}
        {renderContent()}
      </div>
    </Rnd>
  );
}

export default memo(Block, (prev, next) => {
  return (
    prev.block.id === next.block.id &&
    prev.block.content === next.block.content &&
    prev.block.x === next.block.x &&
    prev.block.y === next.block.y &&
    prev.block.w === next.block.w &&
    prev.block.h === next.block.h &&
    JSON.stringify(prev.block.style) === JSON.stringify(next.block.style)
  );
});