import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Plus, Edit, Trash2, Copy, Clock,
  Search, Grid3x3, LayoutList, Layers, TrendingUp, Sparkles, AlertCircle
} from 'lucide-react';
import { resumeAPI } from '../services/api';

// ─── Mini Resume Preview ───────────────────────────────────────────────────────
// Renders a scaled-down read-only snapshot of the resume's first page
function MiniPreview({ resume }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.2);

  const PAGE_W = 794;
  const PAGE_H = 1123;

  useEffect(() => {
    if (containerRef.current) {
      const containerW = containerRef.current.offsetWidth;
      setScale(containerW / PAGE_W);
    }
  }, []);

  const blocks = (resume.blocks || []).filter(
    (b) => b.pageId === (resume.pages?.[0]?.id ?? 'page-1')
  );

  const hasContent = blocks.length > 0;

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-xl border border-neutral-800 bg-white"
      style={{ height: Math.round(PAGE_H * scale) }}
    >
      {hasContent ? (
        <div
          style={{
            width: PAGE_W,
            height: PAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            background: 'white',
            position: 'relative',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {blocks.map((block) => (
            <MiniBlock key={block.id} block={block} />
          ))}
        </div>
      ) : (
        // Fallback skeleton when no blocks exist yet
        <div className="w-full h-full bg-white flex flex-col gap-2 p-4">
          <div className="h-4 w-3/4 rounded bg-neutral-200 animate-pulse" />
          <div className="h-2 w-1/2 rounded bg-neutral-100 animate-pulse" />
          <div className="h-px w-full bg-neutral-200 my-1" />
          <div className="h-2 w-full rounded bg-neutral-100 animate-pulse" />
          <div className="h-2 w-5/6 rounded bg-neutral-100 animate-pulse" />
          <div className="h-2 w-4/6 rounded bg-neutral-100 animate-pulse" />
          <div className="h-px w-full bg-neutral-200 my-1" />
          <div className="h-3 w-1/3 rounded bg-neutral-200 animate-pulse" />
          <div className="h-2 w-full rounded bg-neutral-100 animate-pulse" />
          <div className="h-2 w-3/4 rounded bg-neutral-100 animate-pulse" />
        </div>
      )}
    </div>
  );
}

// Renders a single block in the mini preview (no drag, no edit — purely visual)
function MiniBlock({ block }) {
  const s = block.style || {};

  const baseStyle = {
    position: 'absolute',
    left: block.x,
    top: block.y,
    width: block.w,
    height: block.h,
    fontSize: s.fontSize ?? 14,
    fontWeight: s.fontWeight ?? 400,
    color: s.color ?? '#111111',
    textAlign: s.align ?? 'left',
    lineHeight: s.lineHeight ?? 1.35,
    letterSpacing: s.letterSpacing ?? 'normal',
    fontStyle: s.fontStyle ?? 'normal',
    overflow: 'hidden',
    padding: '2px 4px',
    boxSizing: 'border-box',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  if (block.type === 'divider') {
    return (
      <div style={{ position: 'absolute', left: block.x, top: block.y, width: block.w, height: block.h, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', height: 1.5, backgroundColor: s.color ?? '#e5e7eb' }} />
      </div>
    );
  }

  if (block.type === 'list') {
    const items = Array.isArray(block.content) ? block.content : [];
    return (
      <div style={{ ...baseStyle, padding: '2px 4px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 4 }}>
            <span>•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  }

  if (block.type === 'link') {
    const displayText = block.content || block.meta?.href || 'Link';
    return (
      <div style={{ ...baseStyle, color: s.color ?? '#1a56db', textDecoration: 'underline' }}>
        {displayText}
      </div>
    );
  }

  // text / heading
  const content = typeof block.content === 'string' ? block.content : '';
  return <div style={baseStyle}>{content}</div>;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('updated');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.getAll();
      setResumes(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => navigate('/editor');
  const handleEdit = (id) => navigate(`/editor/${id}`);

  const handleDuplicate = async (id) => {
    try {
      const response = await resumeAPI.duplicate(id);
      setResumes([response.data, ...resumes]);
    } catch (err) {
      console.error('Error duplicating resume:', err);
      alert('Failed to duplicate resume');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeAPI.delete(id);
      setResumes(resumes.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume');
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const filteredResumes = resumes
    .filter(r =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.resumeData?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
      if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500 mx-auto mb-4" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={24} />
          </div>
          <p className="text-neutral-400 font-medium">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="relative border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-900/50">
                  <FileText size={32} className="text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black text-white tracking-tight">My Resumes</h1>
                  {resumes.length > 0 && (
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-bold">
                      {resumes.length}
                    </span>
                  )}
                </div>
                <p className="text-neutral-400 flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-500" />
                  Manage and export your professional resumes
                </p>
              </div>
            </div>

            <button
              onClick={handleCreateNew}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl shadow-blue-900/50 hover:shadow-blue-800/60 hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Plus size={24} className="relative group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative text-lg">Create New Resume</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-hover:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search resumes by title or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800/50 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-all duration-200 hover:border-neutral-700"
              >
                <option value="updated">Recently Updated</option>
                <option value="created">Recently Created</option>
                <option value="title">Title (A-Z)</option>
              </select>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white hover:bg-neutral-800/50'}`}
                  title="Grid View"
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white hover:bg-neutral-800/50'}`}
                  title="List View"
                >
                  <LayoutList size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <p className="text-red-400 flex items-center gap-2">
              <AlertCircle size={20} /> {error}
            </p>
          </div>
        )}

        {filteredResumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 flex items-center justify-center">
                <FileText size={40} className="text-neutral-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              {searchQuery ? 'No resumes found' : 'No resumes yet'}
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-md mx-auto">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first professional resume to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
              >
                <Plus size={20} /> Create Your First Resume
              </button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResumes.map((resume) => (
                  <ResumeCardGrid
                    key={resume._id}
                    resume={resume}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
            {viewMode === 'list' && (
              <div className="space-y-3">
                {filteredResumes.map((resume) => (
                  <ResumeCardList
                    key={resume._id}
                    resume={resume}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    formatDate={formatDate}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Grid Card ─────────────────────────────────────────────────────────────────
function ResumeCardGrid({ resume, onEdit, onDuplicate, onDelete, formatDate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 border border-neutral-800/50 rounded-2xl overflow-hidden hover:border-neutral-700 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 rounded-2xl transition-all duration-300 pointer-events-none" />

      {/* ✅ Mini Preview — actual resume content scaled down */}
      <div className="relative mx-4 mt-4 rounded-xl overflow-hidden shadow-lg ring-1 ring-neutral-700/50">
        <MiniPreview resume={resume} />

        {/* Hover overlay with Edit button */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => onEdit(resume._id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-900 font-bold text-sm hover:bg-blue-50 transition-colors shadow-xl"
          >
            <Edit size={16} />
            Open Editor
          </button>
        </div>
      </div>

      {/* Card Footer */}
      <div className="relative p-4">
        <h3 className="font-bold text-white text-base mb-1 truncate group-hover:text-blue-400 transition-colors">
          {resume.title || 'Untitled Resume'}
        </h3>

        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Clock size={11} />
            <span>{formatDate(resume.updatedAt)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Layers size={11} />
            <span>{resume.blocks?.length || 0} blocks</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(resume._id)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600/20 border border-blue-600/50 text-blue-400 hover:bg-blue-600/30 hover:border-blue-500 transition-all duration-200 font-medium text-sm"
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={() => onDuplicate(resume._id)}
            className="p-2 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-neutral-400 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all duration-200"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => onDelete(resume._id)}
            className="p-2 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-neutral-400 hover:bg-red-950/30 hover:border-red-800/50 hover:text-red-400 transition-all duration-200"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── List Card ─────────────────────────────────────────────────────────────────
function ResumeCardList({ resume, onEdit, onDuplicate, onDelete, formatDate, formatTime }) {
  return (
    <div className="group relative bg-gradient-to-r from-neutral-900/50 to-neutral-900/30 border border-neutral-800/50 rounded-xl p-4 hover:border-neutral-700 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-200">
      <div className="flex items-center gap-5">

        {/* ✅ Mini thumbnail for list view */}
        <div
          className="flex-shrink-0 w-16 h-[90px] rounded-lg overflow-hidden border border-neutral-700 cursor-pointer hover:border-blue-500/50 transition-colors"
          onClick={() => onEdit(resume._id)}
        >
          <div style={{ transform: 'scale(0.085)', transformOrigin: 'top left', width: 794, height: 1123, background: 'white', pointerEvents: 'none' }}>
            {(resume.blocks || [])
              .filter(b => b.pageId === (resume.pages?.[0]?.id ?? 'page-1'))
              .map(block => (
                <MiniBlock key={block.id} block={block} />
              ))
            }
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg mb-1 truncate group-hover:text-blue-400 transition-colors">
            {resume.title || 'Untitled Resume'}
          </h3>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>Updated {formatDate(resume.updatedAt)} at {formatTime(resume.updatedAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Layers size={14} />
              <span>{resume.blocks?.length || 0} blocks • {resume.pages?.length || 1} page(s)</span>
            </div>
          </div>
          {resume.resumeData?.fullName && (
            <p className="text-sm text-neutral-500 mt-1">{resume.resumeData.fullName}</p>
          )}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(resume._id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 border border-blue-600/50 text-blue-400 hover:bg-blue-600/30 transition-all duration-200 font-medium"
          >
            <Edit size={16} /> Edit
          </button>
          <button
            onClick={() => onDuplicate(resume._id)}
            className="p-2.5 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all duration-200"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => onDelete(resume._id)}
            className="p-2.5 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-neutral-400 hover:bg-red-950/30 hover:border-red-800/50 hover:text-red-400 transition-all duration-200"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}