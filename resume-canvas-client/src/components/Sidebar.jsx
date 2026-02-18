import { useEditorStore } from "../store/editorStore";
import { Type, Heading1, List, Minus, Sparkles, Info, Link2 } from "lucide-react";

export default function Sidebar({ onAdd }) {
  const generateFromTemplate = useEditorStore((s) => s.generateFromTemplate);

  const handleGenerate = () => {
    if (typeof generateFromTemplate === "function") {
      generateFromTemplate("ats");
    } else {
      console.error("generateFromTemplate is not available in store");
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-neutral-950 to-neutral-900 border-r border-neutral-800/50 flex flex-col shadow-2xl">
      {/* Generate Button - Prominent at top */}
      <div className="p-5 border-b border-neutral-800/50">
        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-[1.02] active:scale-[0.98] group"
        >
          <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-200" />
          Generate Resume
        </button>
      </div>

      {/* Add Elements Section */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            Add Elements
          </h3>

          {/* Heading */}
          <button
            onClick={() => onAdd("heading")}
            className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-900/50 hover:bg-neutral-800/70 border border-neutral-800/50 hover:border-neutral-700 rounded-xl text-sm text-neutral-300 hover:text-white transition-all duration-200 group"
          >
            <div className="p-1.5 rounded-lg bg-neutral-800/50 group-hover:bg-blue-600/20 transition-colors duration-200">
              <Heading1
                size={16}
                className="text-neutral-400 group-hover:text-blue-400 transition-colors duration-200"
              />
            </div>
            <span className="font-medium">Heading</span>
          </button>

          {/* Text */}
          <button
            onClick={() => onAdd("text")}
            className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-900/50 hover:bg-neutral-800/70 border border-neutral-800/50 hover:border-neutral-700 rounded-xl text-sm text-neutral-300 hover:text-white transition-all duration-200 group"
          >
            <div className="p-1.5 rounded-lg bg-neutral-800/50 group-hover:bg-blue-600/20 transition-colors duration-200">
              <Type
                size={16}
                className="text-neutral-400 group-hover:text-blue-400 transition-colors duration-200"
              />
            </div>
            <span className="font-medium">Text Block</span>
          </button>

          {/* Link ✅ NEW */}
          <button
            onClick={() => onAdd("link")}
            className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-900/50 hover:bg-neutral-800/70 border border-neutral-800/50 hover:border-neutral-700 rounded-xl text-sm text-neutral-300 hover:text-white transition-all duration-200 group"
          >
            <div className="p-1.5 rounded-lg bg-neutral-800/50 group-hover:bg-blue-600/20 transition-colors duration-200">
              <Link2
                size={16}
                className="text-neutral-400 group-hover:text-blue-400 transition-colors duration-200"
              />
            </div>
            <span className="font-medium">Link</span>
          </button>

          {/* Bullet List */}
          <button
            onClick={() => onAdd("list")}
            className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-900/50 hover:bg-neutral-800/70 border border-neutral-800/50 hover:border-neutral-700 rounded-xl text-sm text-neutral-300 hover:text-white transition-all duration-200 group"
          >
            <div className="p-1.5 rounded-lg bg-neutral-800/50 group-hover:bg-blue-600/20 transition-colors duration-200">
              <List
                size={16}
                className="text-neutral-400 group-hover:text-blue-400 transition-colors duration-200"
              />
            </div>
            <span className="font-medium">Bullet List</span>
          </button>

          {/* Divider */}
          <button
            onClick={() => onAdd("divider")}
            className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-900/50 hover:bg-neutral-800/70 border border-neutral-800/50 hover:border-neutral-700 rounded-xl text-sm text-neutral-300 hover:text-white transition-all duration-200 group"
          >
            <div className="p-1.5 rounded-lg bg-neutral-800/50 group-hover:bg-blue-600/20 transition-colors duration-200">
              <Minus
                size={16}
                className="text-neutral-400 group-hover:text-blue-400 transition-colors duration-200"
              />
            </div>
            <span className="font-medium">Divider</span>
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-gradient-to-br from-blue-950/30 to-blue-900/20 border border-blue-800/30 rounded-xl backdrop-blur-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="p-1.5 rounded-lg bg-blue-600/20">
                <Info size={16} className="text-blue-400" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-300 mb-1">Quick Start</p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Click "Generate Resume" to create a full resume layout using your data from the Properties panel.
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-4 p-3 bg-neutral-900/30 border border-neutral-800/30 rounded-lg">
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            <span className="font-semibold text-neutral-400">Tip:</span> Click any element on
            the canvas to edit its properties in the right panel.
          </p>
        </div>
      </div>
    </aside>
  );
}
