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

  // For link block — local state while editing fields
  const [linkDisplayText, setLinkDisplayText] = useState("");
  const [linkHref, setLinkHref] = useState("");

  const renderContent = () => {
    // ─── DIVIDER ───────────────────────────────────────────────
    if (block.type === "divider") {
      const dividerColor = block.style?.color || "#e5e7eb";
      return (
        <div className="w-full h-full flex items-center">
          <div
            className="w-full"
            style={{ height: "2px", backgroundColor: dividerColor, borderRadius: "1px" }}
          />
        </div>
      );
    }

    // ─── LIST ──────────────────────────────────────────────────
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
                    if (e.key === "Enter") { e.preventDefault(); addItem(); }
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
          {isSelected && (
            <button
              type="button"
              className="mt-2 text-xs px-2 py-1 rounded bg-neutral-100/70 hover:bg-neutral-200"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); addItem(); }}
            >
              + Add bullet
            </button>
          )}
        </div>
      );
    }

    // ─── LINK BLOCK ────────────────────────────────────────────
    if (block.type === "link") {
      // Store: block.content = display text, block.meta?.href = URL
      // Fallback: if content looks like a URL, use it as href too
      const savedHref = block.meta?.href || "";
      const savedDisplay = block.content || savedHref || "Click here";
      const formattedHref = formatUrl(savedHref);

      // Editing mode — show two inputs: display text + URL
      if (isEditing) {
        return (
          <div
            className="w-full h-full flex flex-col gap-2 p-1"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Display text input */}
            <div>
              <div className="text-[10px] text-neutral-400 mb-0.5 font-medium">Display text</div>
              <input
                autoFocus
                className="w-full text-sm px-2 py-1.5 rounded-lg border-2 border-blue-400 bg-white text-neutral-800 outline-none"
                placeholder="Click here"
                value={linkDisplayText}
                onChange={(e) => setLinkDisplayText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") setIsEditing(false); }}
              />
            </div>

            {/* URL input */}
            <div>
              <div className="text-[10px] text-neutral-400 mb-0.5 font-medium">URL</div>
              <input
                className="w-full text-sm px-2 py-1.5 rounded-lg border-2 border-neutral-300 bg-white text-neutral-800 outline-none"
                placeholder="https://example.com"
                value={linkHref}
                onChange={(e) => setLinkHref(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    updateBlock(block.id, {
                      content: linkDisplayText || linkHref,
                      meta: { ...block.meta, href: linkHref },
                    });
                    setIsEditing(false);
                  }
                }}
              />
            </div>

            {/* Save button */}
            <button
              type="button"
              className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors self-start"
              onClick={() => {
                updateBlock(block.id, {
                  content: linkDisplayText || linkHref,
                  meta: { ...block.meta, href: linkHref },
                });
                setIsEditing(false);
              }}
            >
              Save
            </button>
          </div>
        );
      }

      // View mode — show clickable link
      return (
        <div
          className="w-full h-full flex items-center"
          onDoubleClick={(e) => {
            e.stopPropagation();
            // Pre-populate local state with current saved values
            setLinkDisplayText(savedDisplay);
            setLinkHref(savedHref);
            setIsEditing(true);
          }}
        >
          {savedHref ? (
            <a
              href={formattedHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...commonStyle,
                color: block.style?.color || "#1a56db",
                textDecoration: "underline",
              }}
              className="no-drag hover:opacity-75 transition-opacity cursor-pointer"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {savedDisplay}
            </a>
          ) : (
            // No URL set yet — show placeholder prompt
            <span
              className="text-sm text-neutral-400 italic select-none"
              style={commonStyle}
            >
              Double-click to set link URL
            </span>
          )}
        </div>
      );
    }

    // ─── TEXT / HEADING ────────────────────────────────────────
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

    // Not editing → render with clickable links via linkify
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
          setTimeout(() => { editableRef.current?.focus?.(); }, 0);
        }}
      >
        <RenderLinkified text={block.content} />
      </div>
    );
  };

  const resizeConfig =
    block.type === "divider"
      ? { top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }
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
      cancel="a, .no-drag, [contenteditable=true], input, button"
    >
      <div
        className="w-full h-full relative"
        style={{ padding: "8px", direction: "ltr" }}
      >
        {isSelected && (
          <div
            className="drag-handle absolute left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-neutral-400 hover:bg-neutral-500 cursor-move transition-colors"
            style={{ top: block.type === "divider" ? "-10px" : "-12px" }}
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
    JSON.stringify(prev.block.style) === JSON.stringify(next.block.style) &&
    JSON.stringify(prev.block.meta) === JSON.stringify(next.block.meta)
  );
});