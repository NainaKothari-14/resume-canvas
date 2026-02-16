import { useState } from "react";
import { Download, Trash2, FileText, Save, Cloud, AlertCircle, ArrowLeft, Edit2, Check, X } from "lucide-react";
import { useEditorStore } from "../store/editorStore";

export default function TopBar({ onExportPdf, onDelete, onBack }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  // Get state from store
  const saveResume = useEditorStore((s) => s.saveResume);
  const isSaving = useEditorStore((s) => s.isSaving);
  const lastSaved = useEditorStore((s) => s.lastSaved);
  const saveError = useEditorStore((s) => s.saveError);
  const currentResumeId = useEditorStore((s) => s.currentResumeId);
  const title = useEditorStore((s) => s.title);
  const setTitle = useEditorStore((s) => s.setTitle);

  const handleSave = async () => {
    const success = await saveResume();
    if (!success && saveError) {
      alert(`Failed to save: ${saveError}`);
    }
  };

  const handleStartEdit = () => {
    setTempTitle(title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setTempTitle('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const saved = new Date(lastSaved);
    const diffMs = now - saved;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    return saved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-16 bg-gradient-to-r from-neutral-950 via-neutral-950 to-neutral-900 border-b border-neutral-800/50 flex items-center justify-between px-6 shadow-2xl backdrop-blur-xl">
      {/* Logo/Brand */}
      <div className="flex items-center gap-3">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-neutral-800/50 transition-all duration-200 group"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
          </button>
        )}
        
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-900/30">
          <FileText size={20} className="text-white" />
        </div>
        
        <div>
          {/* Editable Title */}
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveTitle}
                autoFocus
                className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
                placeholder="Enter resume title..."
              />
              <button
                onClick={handleSaveTitle}
                className="p-1 rounded hover:bg-green-600/20 text-green-400 transition-colors"
              >
                <Check size={14} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 rounded hover:bg-red-600/20 text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartEdit}
              className="group flex items-center gap-2 hover:bg-neutral-800/50 px-2 py-1 rounded transition-colors"
            >
              <h1 className="font-bold text-lg text-white tracking-tight">
                {title || 'Untitled Resume'}
              </h1>
              <Edit2 size={14} className="text-neutral-600 group-hover:text-blue-400 transition-colors" />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            {/* Save Status */}
            {isSaving && (
              <p className="text-[10px] text-blue-400 font-medium flex items-center gap-1">
                <Cloud size={10} className="animate-pulse" />
                Saving...
              </p>
            )}
            {!isSaving && lastSaved && (
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <Cloud size={10} />
                Saved {formatLastSaved()}
              </p>
            )}
            {!isSaving && saveError && (
              <p className="text-[10px] text-red-400 font-medium flex items-center gap-1">
                <AlertCircle size={10} />
                Failed to save
              </p>
            )}
            {!isSaving && !lastSaved && !saveError && (
              <p className="text-[10px] text-neutral-500 font-medium">Not saved yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 group ${
            isSaving
              ? 'bg-blue-600/20 border-blue-600/30 text-blue-300 cursor-wait'
              : 'bg-blue-600/20 border-blue-600/50 text-blue-400 hover:bg-blue-600/30 hover:border-blue-500'
          }`}
          title={currentResumeId ? "Save changes (Ctrl+S)" : "Save new resume"}
        >
          <Save 
            size={16} 
            className={isSaving ? 'animate-pulse' : 'group-hover:scale-110 transition-transform duration-200'}
          />
          <span className="font-medium text-sm">
            {isSaving ? 'Saving...' : currentResumeId ? 'Save' : 'Save New'}
          </span>
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800/50 text-neutral-300 hover:bg-red-950/30 hover:border-red-800/50 hover:text-red-400 transition-all duration-200 group"
          title="Delete selected element"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium text-sm">Delete</span>
        </button>

        {/* Export PDF Button */}
        <button
          onClick={onExportPdf}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-white to-neutral-100 text-neutral-900 font-semibold hover:from-neutral-100 hover:to-neutral-200 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group border border-neutral-300/20"
          title="Export as PDF"
        >
          <Download size={16} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
          <span className="text-sm">Export PDF</span>
        </button>
      </div>
    </div>
  );
}