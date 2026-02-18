import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Canvas from "../components/Canvas.jsx";
import Properties from "../components/Properties.jsx";
import { useEditorStore } from "../store/editorStore.js";
import { generatePdfFilename } from "../utils/exportPdf.js";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const addBlock = useEditorStore((s) => s.addBlock);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const ensureBaseBlocks = useEditorStore((s) => s.ensureBaseBlocks);
  const loadResume = useEditorStore((s) => s.loadResume);
  const resetEditor = useEditorStore((s) => s.resetEditor);

  const blocks = useEditorStore((s) => s.blocks);
  const currentResumeId = useEditorStore((s) => s.currentResumeId);
  const title = useEditorStore((s) => s.title);
  const pages = useEditorStore((s) => s.pages);
  const zoom = useEditorStore((s) => s.canvasView.zoom); // ✅ need zoom to undo transform scaling

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

  const handleExportPdf = async () => {
    const element = printRef.current;
    if (!element) {
      console.error('No element to print');
      return;
    }

    console.log('📄 Exporting PDF...');

    const pageElements = element.querySelectorAll('[data-page-id]');
    const pagesToExport = pageElements.length > 0
      ? Array.from(pageElements)
      : Array.from(element.children);

    if (pagesToExport.length === 0) {
      console.error('No pages found to export');
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      });

      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;
      const PAGE_WIDTH_PX = 794;
      const PAGE_HEIGHT_PX = 1123;

      for (let i = 0; i < pagesToExport.length; i++) {
        const pageEl = pagesToExport[i];

        // ✅ Get the page element's bounding rect in viewport space
        const pageRect = pageEl.getBoundingClientRect();

        // ✅ Collect all anchor links on this page
        const linkData = [];
        const anchors = pageEl.querySelectorAll('a[href]');

        anchors.forEach((anchor) => {
          const href = anchor.getAttribute('href');
          if (!href || href.startsWith('#')) return;

          const anchorRect = anchor.getBoundingClientRect();

          // Position of anchor relative to the page element in viewport px
          // Both rects are in viewport space so subtraction is clean
          const viewportRelX = anchorRect.left - pageRect.left;
          const viewportRelY = anchorRect.top - pageRect.top;
          const viewportW = anchorRect.width;
          const viewportH = anchorRect.height;

          // ✅ Divide by zoom to get true page px (undo the CSS scale transform)
          const pagePxX = viewportRelX / zoom;
          const pagePxY = viewportRelY / zoom;
          const pagePxW = viewportW / zoom;
          const pagePxH = viewportH / zoom;

          // Skip invisible/unrendered links
          if (pagePxW <= 0 || pagePxH <= 0) return;

          // Convert page px → PDF mm
          const scaleX = A4_WIDTH_MM / PAGE_WIDTH_PX;
          const scaleY = A4_HEIGHT_MM / PAGE_HEIGHT_PX;

          const finalUrl = href.startsWith('http') ? href : `https://${href}`;

          linkData.push({
            url: finalUrl,
            x: pagePxX * scaleX,
            y: pagePxY * scaleY,
            w: pagePxW * scaleX,
            h: pagePxH * scaleY,
          });

          console.log(`🔗 Link: ${finalUrl} | pagePx x:${pagePxX.toFixed(1)} y:${pagePxY.toFixed(1)} w:${pagePxW.toFixed(1)} h:${pagePxH.toFixed(1)}`);
        });

        console.log(`📎 Page ${i + 1}: ${linkData.length} links found`);

        // Clone the page to strip editor UI styles before rendering
        const clone = pageEl.cloneNode(true);
        clone.style.cssText = `
          width: 794px !important;
          height: 1123px !important;
          min-height: unset !important;
          max-height: unset !important;
          overflow: hidden !important;
          position: fixed !important;
          left: -9999px !important;
          top: 0px !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
          outline: none !important;
          background: white !important;
          transform: none !important;
          opacity: 1 !important;
        `;

        document.body.appendChild(clone);

        // Double rAF — fonts + images fully paint before capture
        await new Promise((r) => requestAnimationFrame(r));
        await new Promise((r) => requestAnimationFrame(r));

        const canvas = await html2canvas(clone, {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: PAGE_WIDTH_PX,
          width: PAGE_WIDTH_PX,
          height: PAGE_HEIGHT_PX,
        });

        document.body.removeChild(clone);

        const imgData = canvas.toDataURL('image/jpeg', 0.98);

        if (i > 0) pdf.addPage();

        pdf.addImage(imgData, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);

        // ✅ Overlay invisible clickable rectangles on each link position
        linkData.forEach(({ url, x, y, w, h }) => {
          pdf.link(x, y, w, h, { url });
          console.log(`✅ PDF link added: ${url} at mm x:${x.toFixed(2)} y:${y.toFixed(2)}`);
        });

        console.log(`✅ Page ${i + 1}/${pagesToExport.length} done`);
      }

      pdf.save(generatePdfFilename(title));
      console.log('✅ PDF exported successfully');

    } catch (error) {
      console.error('❌ PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

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