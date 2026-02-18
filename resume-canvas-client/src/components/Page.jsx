import { useEditorStore } from "../store/editorStore";
import Block from "./Block";

export default function Page({ pageId, blocks: pageBlocks, pageNumber }) {
  const page = useEditorStore((s) => s.pages.find(p => p.id === pageId));
  
  if (!page) return null;

  return (
    <div
      className="relative bg-white shadow-2xl"
      style={{
        width: `${page.width}px`,
        height: `${page.height}px`,
      }}
    >
      {/* Page Number Indicator (optional, for visual reference) */}
      {pageNumber && (
        <div className="absolute top-2 right-2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-50 pointer-events-none pdf hidden">
          Page {pageNumber}
        </div>
      )}
      
      {/* Render blocks for this page */}
      {pageBlocks && pageBlocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}