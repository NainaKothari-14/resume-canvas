import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Canvas from "../components/Canvas.jsx";
import Properties from "../components/Properties.jsx";
import { useEditorStore } from "../store/editorStore.js";
import { useReactToPrint } from "react-to-print";
import { getPrintTitle } from "../utils/exportPdf.js";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const addBlock = useEditorStore((s) => s.addBlock);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const ensureBaseBlocks = useEditorStore((s) => s.ensureBaseBlocks);
  const loadResume = useEditorStore((s) => s.loadResume);
  const resetEditor = useEditorStore((s) => s.resetEditor);
  
  // ✅ Add these debug logs
  const blocks = useEditorStore((s) => s.blocks);
  const currentResumeId = useEditorStore((s) => s.currentResumeId);
  const title = useEditorStore((s) => s.title);

  console.log('🔍 Editor State:', {
    urlId: id,
    currentResumeId,
    title,
    blocksCount: blocks.length
  });

  useEffect(() => {
    console.log('🔄 Editor useEffect triggered, ID:', id);
    
    if (id) {
      console.log('📥 Loading resume:', id);
      loadResume(id);
    } else {
      console.log('🆕 Creating new resume');
      resetEditor();
      ensureBaseBlocks();
    }
  }, [id, loadResume, resetEditor, ensureBaseBlocks]);

  const handleExportPdf = useReactToPrint({
    contentRef: printRef,
    documentTitle: getPrintTitle(),
  });

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col">
      <TopBar 
        onExportPdf={handleExportPdf} 
        onDelete={deleteSelected}
        onBack={handleBackToDashboard}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar onAdd={addBlock} />
        <Canvas printRef={printRef} />
        <Properties />
      </div>
    </div>
  );
}