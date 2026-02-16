import { Plus, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { useEditorStore } from "../store/editorStore";

export default function PageManagement() {
  const pages = useEditorStore((s) => s.pages);
  const currentPageId = useEditorStore((s) => s.currentPageId);
  const blocks = useEditorStore((s) => s.blocks);
  
  const addPage = useEditorStore((s) => s.addPage);
  const deletePage = useEditorStore((s) => s.deletePage);
  const duplicatePage = useEditorStore((s) => s.duplicatePage);
  const setCurrentPage = useEditorStore((s) => s.setCurrentPage);

  const getPageBlockCount = (pageId) => {
    return blocks.filter(b => b.pageId === pageId).length;
  };

  return (
    <div className="bg-neutral-900 border-t border-neutral-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-200">Pages</h3>
        <button
          onClick={addPage}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
          title="Add New Page"
        >
          <Plus size={14} />
          New Page
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {pages.map((page, index) => {
          const isActive = page.id === currentPageId;
          const blockCount = getPageBlockCount(page.id);
          
          return (
            <div
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`group p-3 rounded-lg border cursor-pointer transition-all ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-750 hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`text-xs font-mono px-2 py-1 rounded ${
                    isActive ? 'bg-blue-700' : 'bg-neutral-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      Page {index + 1}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-neutral-500'}`}>
                      {blockCount} element{blockCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicatePage(page.id);
                    }}
                    className={`p-1.5 rounded hover:bg-opacity-20 ${
                      isActive ? 'hover:bg-white' : 'hover:bg-neutral-600'
                    }`}
                    title="Duplicate Page"
                  >
                    <Copy size={14} />
                  </button>
                  
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete Page ${index + 1}?`)) {
                          deletePage(page.id);
                        }
                      }}
                      className={`p-1.5 rounded hover:bg-opacity-20 ${
                        isActive ? 'hover:bg-white' : 'hover:bg-red-600'
                      }`}
                      title="Delete Page"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-8 text-neutral-500 text-sm">
          No pages yet. Click "New Page" to get started.
        </div>
      )}
    </div>
  );
}