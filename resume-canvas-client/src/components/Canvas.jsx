import { useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Undo, Redo } from "lucide-react";
import Page from "./Page.jsx";
import { useEditorStore } from "../store/editorStore";

export default function Canvas({ printRef }) {
  const canvasRef = useRef(null);

  // Get zoom state from store
  const zoom = useEditorStore((s) => s.canvasView.zoom);
  const panOffset = useEditorStore((s) => s.canvasView.panOffset);
  const showGrid = useEditorStore((s) => s.canvasView.showGrid);
  const pages = useEditorStore((s) => s.pages);
  const currentPageId = useEditorStore((s) => s.currentPageId);
  const blocks = useEditorStore((s) => s.blocks);
  const historyIndex = useEditorStore((s) => s.historyIndex);
  const history = useEditorStore((s) => s.history);

  // Get actions from store
  const setZoom = useEditorStore((s) => s.setZoom);
  const setPanOffset = useEditorStore((s) => s.setPanOffset);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const resetCanvasView = useEditorStore((s) => s.resetCanvasView);
  const setCurrentPage = useEditorStore((s) => s.setCurrentPage);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.findIndex((z) => z >= zoom);
    const nextIndex = Math.min(currentIndex + 1, zoomLevels.length - 1);
    setZoom(zoomLevels[nextIndex]);
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.findIndex((z) => z >= zoom);
    const prevIndex = Math.max(currentIndex - 1, 0);
    setZoom(zoomLevels[prevIndex]);
  };

  const handleFitToScreen = () => {
    if (canvasRef.current) {
      const container = canvasRef.current;
      const containerWidth = container.clientWidth - 48;
      const containerHeight = container.clientHeight - 48;
      const pageWidth = 794;
      const pageHeight = 1123;

      const scaleX = containerWidth / pageWidth;
      const scaleY = containerHeight / pageHeight;
      const newZoom = Math.min(scaleX, scaleY, 1);

      setZoom(newZoom);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  // Pan state (local since it's temporary during drag)
  const panStartRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);

  const handleMouseDown = (e) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    }
  };

  const handleMouseMove = (e) => {
    if (isPanningRef.current) {
      setPanOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    isPanningRef.current = false;
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(
        zoomLevels[0],
        Math.min(zoomLevels[zoomLevels.length - 1], zoom + delta)
      );
      setZoom(newZoom);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      
      // Zoom shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        resetCanvasView();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "1") {
        e.preventDefault();
        handleFitToScreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoom, undo, redo]);

  return (
    <div className="flex-1 bg-neutral-900 flex flex-col">
      {/* Enhanced Zoom Controls Bar */}
      <div className="no-print flex items-center justify-between px-6 py-3 bg-gradient-to-b from-neutral-950 to-neutral-900 border-b border-neutral-800/50 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {/* Undo/Redo Buttons */}
          <div className="flex items-center gap-1.5 bg-neutral-900/50 rounded-xl p-1 border border-neutral-800/50">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
              title="Undo (Ctrl + Z)"
            >
              <Undo size={18} className="text-neutral-400 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
              title="Redo (Ctrl + Y)"
            >
              <Redo size={18} className="text-neutral-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-7 bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />

          {/* Zoom Controls Group */}
          <div className="flex items-center gap-1.5 bg-neutral-900/50 rounded-xl p-1 border border-neutral-800/50">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= zoomLevels[0]}
              className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
              title="Zoom Out (Ctrl + -)"
            >
              <ZoomOut size={18} className="text-neutral-400 group-hover:text-white transition-colors" />
            </button>

            {/* Zoom Percentage with Dropdown */}
            <select
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="px-4 py-2 bg-neutral-800/70 hover:bg-neutral-800 rounded-lg text-sm font-semibold text-white cursor-pointer min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 border border-neutral-700/50"
            >
              {zoomLevels.map((level) => (
                <option key={level} value={level}>
                  {Math.round(level * 100)}%
                </option>
              ))}
            </select>

            <button
              onClick={handleZoomIn}
              disabled={zoom >= zoomLevels[zoomLevels.length - 1]}
              className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
              title="Zoom In (Ctrl + =)"
            >
              <ZoomIn size={18} className="text-neutral-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-7 bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />

          {/* View Controls Group */}
          <div className="flex items-center gap-1.5 bg-neutral-900/50 rounded-xl p-1 border border-neutral-800/50">
            <button
              onClick={handleFitToScreen}
              className="p-2 rounded-lg hover:bg-white/5 transition-all duration-200 group"
              title="Fit to Screen (Ctrl + 1)"
            >
              <Maximize2 size={18} className="text-neutral-400 group-hover:text-blue-400 transition-colors" />
            </button>

            <button
              onClick={resetCanvasView}
              className="p-2 rounded-lg hover:bg-white/5 transition-all duration-200 group"
              title="Reset View (Ctrl + 0)"
            >
              <RotateCcw size={18} className="text-neutral-400 group-hover:text-blue-400 transition-colors" />
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-7 bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />

          {/* Grid Toggle */}
          <button
            onClick={toggleGrid}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
              showGrid
                ? "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/50 text-white shadow-lg shadow-blue-500/20"
                : "bg-neutral-900/50 border-neutral-800/50 text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
            title="Toggle Grid"
          >
            Grid
          </button>
        </div>

        {/* Shortcuts Info */}
        <div className="hidden lg:flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-neutral-800/70 border border-neutral-700/50 rounded-md text-neutral-300 font-mono shadow-sm">
                Ctrl
              </kbd>
              <span className="text-neutral-600">+</span>
              <kbd className="px-2 py-1 bg-neutral-800/70 border border-neutral-700/50 rounded-md text-neutral-300 font-mono shadow-sm">
                Z
              </kbd>
            </div>
            <span className="ml-1 text-neutral-500">Undo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-neutral-800/70 border border-neutral-700/50 rounded-md text-neutral-300 font-mono shadow-sm">
                Ctrl
              </kbd>
              <span className="text-neutral-600">+</span>
              <kbd className="px-2 py-1 bg-neutral-800/70 border border-neutral-700/50 rounded-md text-neutral-300 font-mono shadow-sm">
                Scroll
              </kbd>
            </div>
            <span className="ml-1 text-neutral-500">Zoom</span>
          </div>
        </div>
      </div>

      {/* Canvas Area with Grid */}
      <div
        ref={canvasRef}
        className="flex-1 overflow-auto relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: isPanningRef.current ? "grabbing" : "default",
          backgroundImage: showGrid
            ? `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `
            : "none",
          backgroundSize: showGrid ? "20px 20px" : "auto",
        }}
      >
        {/* Centered Pages Container */}
        <div className="min-h-full flex items-center justify-center p-6">
          <div
            className="transition-transform duration-150 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
              transformOrigin: "center center",
            }}
          >
            {/* printRef points to all pages for PDF export */}
            <div ref={printRef} className="flex flex-col gap-8">
              {pages.map((page, index) => {
                const pageBlocks = blocks.filter(b => b.pageId === page.id);
                const isCurrentPage = page.id === currentPageId;
                
                return (
                  <div
                    key={page.id}
                    data-page-id={page.id} 
                    onClick={(e) => {
                      // ✅ If user clicked a link, do NOT change page / re-render
                      if (e.target.closest("a")) return;
                      setCurrentPage(page.id);
                    }}                    
                    className={`transition-all duration-200 ${
                      isCurrentPage 
                        ? 'ring-2 ring-blue-500 shadow-2xl shadow-blue-500/10' 
                        : 'ring-1 ring-neutral-700/50 opacity-75 hover:opacity-95 hover:ring-neutral-600'
                    }`}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Page pageId={page.id} blocks={pageBlocks} pageNumber={index + 1} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="no-print px-6 py-2.5 bg-gradient-to-t from-neutral-950 to-neutral-900 border-t border-neutral-800/50 flex items-center justify-between text-xs shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Page</span>
            <span className="text-white font-semibold px-2 py-0.5 bg-neutral-800/50 rounded-md border border-neutral-700/50">
              {pages.findIndex(p => p.id === currentPageId) + 1} / {pages.length}
            </span>
          </div>
          <div className="w-px h-4 bg-neutral-800/50" />
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Zoom</span>
            <span className="text-white font-semibold px-2 py-0.5 bg-neutral-800/50 rounded-md border border-neutral-700/50 font-mono">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <div className="w-px h-4 bg-neutral-800/50" />
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Pan</span>
            <span className="text-neutral-400 font-mono text-[10px]">
              x:{Math.round(panOffset.x)} y:{Math.round(panOffset.y)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-neutral-500">A4 Paper</span>
          <span className="text-neutral-700">•</span>
          <span className="text-neutral-600 font-mono text-[10px]">794 × 1123 px</span>
        </div>
      </div>
    </div>
  );
}