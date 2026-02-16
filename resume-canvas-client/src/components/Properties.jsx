import { useState } from "react";
import { Settings, FileText, Palette, Plus, Trash2, Copy, Sparkles } from "lucide-react";
import ResumeForm from "./ResumeForm";
import { useEditorStore } from "../store/editorStore";

// Tabs
const TABS = {
  FORM: "form",
  STYLE: "style",
  PAGES: "pages",
};

// Styling Panel Component
function StylePanel() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const blocks = useEditorStore((s) => s.blocks);
  const updateBlockStyle = useEditorStore((s) => s.updateBlockStyle);

  const selectedBlock = blocks.find(b => b.id === selectedId);

  if (!selectedBlock) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-500 p-8 text-center">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 border border-neutral-800/50 mb-4">
          <Palette size={48} className="text-neutral-600" />
        </div>
        <p className="text-sm font-medium text-neutral-400">No element selected</p>
        <p className="text-xs text-neutral-600 mt-2">Click any text block on the canvas to style it</p>
      </div>
    );
  }

  const style = selectedBlock.style || {};

  return (
    <div className="p-5 space-y-6">
      {/* Selected Block Info */}
      <div className="p-3 bg-gradient-to-br from-blue-950/30 to-blue-900/20 border border-blue-800/30 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/20">
            <Sparkles size={14} className="text-blue-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-300">Editing</div>
            <div className="text-[10px] text-neutral-400 capitalize">{selectedBlock.type} Block</div>
          </div>
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 mb-3">
          Font Size
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="8"
            max="48"
            value={style.fontSize || 14}
            onChange={(e) => updateBlockStyle(selectedId, { fontSize: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-neutral-800/70 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((style.fontSize || 14) - 8) / 40 * 100}%, rgb(38 38 38 / 0.7) ${((style.fontSize || 14) - 8) / 40 * 100}%, rgb(38 38 38 / 0.7) 100%)`
            }}
          />
          <span className="text-sm font-bold text-white bg-neutral-800/70 px-3 py-1.5 rounded-lg border border-neutral-700/50 min-w-[60px] text-center">
            {style.fontSize || 14}px
          </span>
        </div>
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 mb-3">
          Font Weight
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 400, label: 'Regular' },
            { value: 500, label: 'Medium' },
            { value: 600, label: 'SemiBold' },
            { value: 700, label: 'Bold' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateBlockStyle(selectedId, { fontWeight: value })}
              className={`px-2 py-2 text-xs rounded-xl border transition-all duration-200 ${
                (style.fontWeight || 400) === value
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/50 text-white shadow-lg shadow-blue-900/30 scale-105'
                  : 'bg-neutral-900/50 border-neutral-800/50 text-neutral-400 hover:bg-neutral-800/70 hover:text-white'
              }`}
            >
              <div className="font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 mb-3">
          Text Color
        </label>
        <div className="grid grid-cols-6 gap-2 mb-3">
          {[
            { color: '#111111', name: 'Black' },
            { color: '#374151', name: 'Gray' },
            { color: '#6b7280', name: 'Light Gray' },
            { color: '#1a56db', name: 'Blue' },
            { color: '#0ea5e9', name: 'Sky' },
            { color: '#dc2626', name: 'Red' },
            { color: '#16a34a', name: 'Green' },
            { color: '#ea580c', name: 'Orange' },
            { color: '#9333ea', name: 'Purple' },
            { color: '#0891b2', name: 'Cyan' },
            { color: '#ca8a04', name: 'Yellow' },
            { color: '#be123c', name: 'Rose' },
          ].map(({ color, name }) => (
            <button
              key={color}
              onClick={() => updateBlockStyle(selectedId, { color })}
              className={`w-full h-10 rounded-lg border-2 transition-all duration-200 relative group ${
                (style.color || '#111111') === color
                  ? 'border-white ring-2 ring-white/30 scale-110 shadow-lg'
                  : 'border-neutral-700/50 hover:scale-105 hover:border-neutral-500'
              }`}
              style={{ backgroundColor: color }}
              title={name}
            >
              {(style.color || '#111111') === color && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                </div>
              )}
            </button>
          ))}
        </div>
        
        {/* Custom Color Picker */}
        <div className="flex items-center gap-2 p-2 bg-neutral-900/50 border border-neutral-800/50 rounded-xl">
          <input
            type="color"
            value={style.color || '#111111'}
            onChange={(e) => updateBlockStyle(selectedId, { color: e.target.value })}
            className="w-10 h-10 rounded-lg border border-neutral-700/50 cursor-pointer bg-neutral-800"
          />
          <input
            type="text"
            value={style.color || '#111111'}
            onChange={(e) => updateBlockStyle(selectedId, { color: e.target.value })}
            className="flex-1 px-3 py-2 text-xs bg-neutral-800/70 border border-neutral-700/50 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Text Align */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 mb-3">
          Text Align
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              onClick={() => updateBlockStyle(selectedId, { align })}
              className={`px-3 py-2.5 text-xs rounded-xl border transition-all duration-200 capitalize font-medium ${
                (style.align || 'left') === align
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/50 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-neutral-900/50 border-neutral-800/50 text-neutral-400 hover:bg-neutral-800/70 hover:text-white'
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Line Height */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 mb-3">
          Line Height
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.1"
            value={style.lineHeight || 1.35}
            onChange={(e) => updateBlockStyle(selectedId, { lineHeight: parseFloat(e.target.value) })}
            className="flex-1 h-2 bg-neutral-800/70 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((style.lineHeight || 1.35) - 1) / 1.5 * 100}%, rgb(38 38 38 / 0.7) ${((style.lineHeight || 1.35) - 1) / 1.5 * 100}%, rgb(38 38 38 / 0.7) 100%)`
            }}
          />
          <span className="text-sm font-bold text-white bg-neutral-800/70 px-3 py-1.5 rounded-lg border border-neutral-700/50 min-w-[60px] text-center">
            {(style.lineHeight || 1.35).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 mb-3">
          Letter Spacing
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="-2"
            max="5"
            step="0.5"
            value={parseFloat(style.letterSpacing || '0')}
            onChange={(e) => updateBlockStyle(selectedId, { letterSpacing: `${e.target.value}px` })}
            className="flex-1 h-2 bg-neutral-800/70 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(parseFloat(style.letterSpacing || '0') + 2) / 7 * 100}%, rgb(38 38 38 / 0.7) ${(parseFloat(style.letterSpacing || '0') + 2) / 7 * 100}%, rgb(38 38 38 / 0.7) 100%)`
            }}
          />
          <span className="text-sm font-bold text-white bg-neutral-800/70 px-3 py-1.5 rounded-lg border border-neutral-700/50 min-w-[60px] text-center">
            {parseFloat(style.letterSpacing || '0').toFixed(1)}px
          </span>
        </div>
      </div>

      {/* Quick Style Presets */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 mb-3">
          Quick Presets
        </label>
        <div className="space-y-2">
          <button
            onClick={() => updateBlockStyle(selectedId, {
              fontSize: 24,
              fontWeight: 800,
              color: '#111111',
              lineHeight: 1.2,
            })}
            className="w-full px-4 py-3 text-left bg-gradient-to-br from-neutral-900/70 to-neutral-800/50 hover:from-neutral-800/70 hover:to-neutral-700/50 border border-neutral-800/50 hover:border-neutral-700 rounded-xl transition-all duration-200 group"
          >
            <div className="font-bold text-sm group-hover:text-white transition-colors">Large Heading</div>
            <div className="text-neutral-500 text-[10px] mt-0.5">24px, Bold, Black</div>
          </button>
          <button
            onClick={() => updateBlockStyle(selectedId, {
              fontSize: 16,
              fontWeight: 700,
              color: '#1a56db',
              lineHeight: 1.3,
            })}
            className="w-full px-4 py-3 text-left bg-gradient-to-br from-neutral-900/70 to-neutral-800/50 hover:from-neutral-800/70 hover:to-neutral-700/50 border border-neutral-800/50 hover:border-neutral-700 rounded-xl transition-all duration-200 group"
          >
            <div className="font-bold text-sm text-blue-600 group-hover:text-blue-500 transition-colors">Section Title</div>
            <div className="text-neutral-500 text-[10px] mt-0.5">16px, Bold, Blue</div>
          </button>
          <button
            onClick={() => updateBlockStyle(selectedId, {
              fontSize: 11,
              fontWeight: 400,
              color: '#374151',
              lineHeight: 1.6,
            })}
            className="w-full px-4 py-3 text-left bg-gradient-to-br from-neutral-900/70 to-neutral-800/50 hover:from-neutral-800/70 hover:to-neutral-700/50 border border-neutral-800/50 hover:border-neutral-700 rounded-xl transition-all duration-200 group"
          >
            <div className="text-sm text-neutral-300 group-hover:text-white transition-colors">Body Text</div>
            <div className="text-neutral-500 text-[10px] mt-0.5">11px, Regular, Gray</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Pages Panel Component
function PagesPanel() {
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
    <div className="h-full flex flex-col">
      {/* Add Page Button */}
      <div className="p-5 border-b border-neutral-800/50">
        <button
          onClick={addPage}
          className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-[1.02] active:scale-[0.98] group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
          Add New Page
        </button>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {pages.map((page, index) => {
          const isActive = page.id === currentPageId;
          const blockCount = getPageBlockCount(page.id);
          
          return (
            <div
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/50 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-neutral-900/50 border-neutral-800/50 text-neutral-300 hover:bg-neutral-800/70 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                    isActive ? 'bg-blue-700/50 text-white' : 'bg-neutral-800/70 text-neutral-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      Page {index + 1}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-neutral-500'}`}>
                      {blockCount} element{blockCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-1 transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicatePage(page.id);
                    }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'hover:bg-white/10' 
                        : 'hover:bg-neutral-700/50'
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
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'hover:bg-white/10' 
                          : 'hover:bg-red-600/20 text-red-400'
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

      {/* Page Info */}
      <div className="p-5 border-t border-neutral-800/50 bg-neutral-900/30">
        <div className="text-xs space-y-2">
          <div className="flex items-center justify-between p-2 bg-neutral-800/30 rounded-lg">
            <span className="text-neutral-500 font-medium">Total Pages</span>
            <span className="text-white font-bold">{pages.length}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-neutral-800/30 rounded-lg">
            <span className="text-neutral-500 font-medium">Total Elements</span>
            <span className="text-white font-bold">{blocks.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Properties Component
export default function Properties() {
  const [activeTab, setActiveTab] = useState(TABS.FORM);

  return (
    <aside className="w-80 bg-gradient-to-b from-neutral-950 to-neutral-900 border-l border-neutral-800/50 flex flex-col shadow-2xl">
      {/* Tabs Header */}
      <div className="flex border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl">
        <button
          onClick={() => setActiveTab(TABS.FORM)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-semibold transition-all duration-200 relative ${
            activeTab === TABS.FORM
              ? "text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          {activeTab === TABS.FORM && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"></div>
          )}
          <Settings size={16} className={activeTab === TABS.FORM ? "text-blue-500" : ""} />
          Data
        </button>
        <button
          onClick={() => setActiveTab(TABS.STYLE)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-semibold transition-all duration-200 relative ${
            activeTab === TABS.STYLE
              ? "text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          {activeTab === TABS.STYLE && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"></div>
          )}
          <Palette size={16} className={activeTab === TABS.STYLE ? "text-blue-500" : ""} />
          Style
        </button>
        <button
          onClick={() => setActiveTab(TABS.PAGES)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-semibold transition-all duration-200 relative ${
            activeTab === TABS.PAGES
              ? "text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          {activeTab === TABS.PAGES && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"></div>
          )}
          <FileText size={16} className={activeTab === TABS.PAGES ? "text-blue-500" : ""} />
          Pages
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === TABS.FORM && (
          <div className="h-full overflow-y-auto p-5">
            <ResumeForm />
          </div>
        )}

        {activeTab === TABS.STYLE && (
          <div className="h-full overflow-y-auto">
            <StylePanel />
          </div>
        )}

        {activeTab === TABS.PAGES && <PagesPanel />}
      </div>
    </aside>
  );
}