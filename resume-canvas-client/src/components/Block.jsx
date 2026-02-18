import { Rnd } from "react-rnd";
import { useEditorStore } from "../store/editorStore";
import { useMemo, useRef, useState, memo } from "react";

/** Adds https:// if missing */
const formatUrl = (url) => {
  if (!url) return "";
  const trimmed = String(url).trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

/** URL detector (covers https, www, and domain.tld paths) */
const URL_REGEX =
  /((https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?))/g;

/** Split text into parts: normal text + link objects */
const linkify = (text) => {
  const str = String(text ?? "");
  if (!str.trim()) return [str];

  const parts = [];
  let lastIndex = 0;

  str.replace(URL_REGEX, (match, _g1, _g2, _g3, _g4, offset) => {
    if (offset > lastIndex) parts.push(str.slice(lastIndex, offset));

    const href = formatUrl(match);
    parts.push({ type: "link", text: match, href });

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < str.length) parts.push(str.slice(lastIndex));
  return parts;
};

/** Render linkified text as React nodes */
const RenderLinkified = ({ text }) => {
  const parts = linkify(text);

  return (
    <>
      {parts.map((p, idx) => {
        if (typeof p === "string") return <span key={idx}>{p}</span>;

        return (
          <a
            key={idx}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline no-drag"
            // these help, but the REAL fix is Rnd.cancel
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {p.text}
          </a>
        );
      })}
    </>
  );
};

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
    // DIVIDER
    if (block.type === "divider") {
      const dividerColor = block.style?.color || "#e5e7eb";
      return (
        <div className="w-full h-full flex items-center">
          <div
            className="w-full"
            style={{
              height: "2px",
              backgroundColor: dividerColor,
              borderRadius: "1px",
            }}
          />
        </div>
      );
    }

    // LIST (✅ links clickable inside list items)
    // LIST (editable items)
    if (block.type === "list") {
      const items = Array.isArray(block.content) ? block.content : [];
    
      const updateItem = (index, value) => {
        const next = [...items];
        next[index] = value;
        updateBlock(block.id, { content: next });
      };
    
      const addItem = () => {
        updateBlock(block.id, { content: [...items, "New bullet"] });
      };
    
      const removeItem = (index) => {
        const next = items.filter((_, i) => i !== index);
        updateBlock(block.id, { content: next });
      };
    
      return (
        <div className="w-full h-full">
          <ul style={{ ...commonStyle }} className="list-none space-y-1">
            {items.map((t, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 select-none">•</span>
    
                {/* editable text */}
                <div
                  className="flex-1 outline-none cursor-text"
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onMouseDown={(e) => e.stopPropagation()}
                  onFocus={() => setIsEditing(true)}
                  onBlur={(e) => {
                    setIsEditing(false);
                    updateItem(idx, e.currentTarget.textContent ?? "");
                  }}
                  onKeyDown={(e) => {
                    // Enter = new bullet
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem();
                    }
                    // Backspace on empty bullet = delete it
                    if (e.key === "Backspace" && (e.currentTarget.textContent ?? "").trim() === "") {
                      e.preventDefault();
                      removeItem(idx);
                    }
                  }}
                >
                  {t}
                </div>
              </li>
            ))}
          </ul>
    
          {/* small add button (only when selected) */}
          {isSelected && (
            <button
              type="button"
              className="mt-2 text-xs px-2 py-1 rounded bg-neutral-100/70 hover:bg-neutral-200"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                addItem();
              }}
            >
              + Add bullet
            </button>
          )}
        </div>
      );
    }    

    // TEXT / HEADING
    if (isEditing) {
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
            overflowWrap: "break-word",
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
            if (e.key === "Enter") e.stopPropagation();
          }}
        >
          {block.content}
        </div>
      );
    }

    // Not editing -> clickable links
    return (
      <div
        style={{
          ...commonStyle,
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
        className="w-full h-full cursor-text select-text"
        onMouseDown={(e) => {
          e.stopPropagation();
          setSelected(block.id);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
          setTimeout(() => {
            editableRef.current?.focus?.();
          }, 0);
        }}
      >
        <RenderLinkified text={block.content} />
      </div>
    );
  };

  const resizeConfig =
    block.type === "divider"
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
      // ✅ THE KEY FIX: Rnd will NOT start drag from links / editable
      cancel="a, .no-drag, [contenteditable=true]"
    >
      <div
        className="w-full h-full relative"
        style={{
          padding: "8px",
          direction: "ltr",
        }}
      >
        {isSelected && (
          <div
            className="drag-handle absolute left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-neutral-400 hover:bg-neutral-500 cursor-move transition-colors"
            style={{
              top: block.type === "divider" ? "-10px" : "-12px",
            }}
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
