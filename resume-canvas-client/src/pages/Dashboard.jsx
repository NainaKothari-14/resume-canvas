import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Plus, Edit, Trash2, Copy, Clock, Search, 
  Grid3x3, LayoutList, Eye, Layers, TrendingUp, Sparkles, AlertCircle
} from 'lucide-react';
import { resumeAPI } from '../services/api';

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

  const handleCreateNew = () => {
    navigate('/editor');
  };

  const handleEdit = (resumeId) => {
    navigate(`/editor/${resumeId}`);
  };

  const handleDuplicate = async (resumeId) => {
    try {
      const response = await resumeAPI.duplicate(resumeId);
      setResumes([response.data, ...resumes]);
    } catch (err) {
      console.error('Error duplicating resume:', err);
      alert('Failed to duplicate resume');
    }
  };

  const handleDelete = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      await resumeAPI.delete(resumeId);
      setResumes(resumes.filter(r => r._id !== resumeId));
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredResumes = resumes
    .filter(resume => 
      resume.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.resumeData?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
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
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500 mx-auto mb-4"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={24} />
          </div>
          <p className="text-neutral-400 font-medium">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-900/50">
                  <FileText size={32} className="text-white" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black text-white tracking-tight">
                    My Resumes
                  </h1>
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
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
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
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-neutral-500 hover:text-white hover:bg-neutral-800/50'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-neutral-500 hover:text-white hover:bg-neutral-800/50'
                  }`}
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
              <AlertCircle size={20} />
              {error}
            </p>
          </div>
        )}

        {filteredResumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 flex items-center justify-center">
                <FileText size={40} className="text-neutral-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              {searchQuery ? 'No resumes found' : 'No resumes yet'}
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first professional resume to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
              >
                <Plus size={20} />
                Create Your First Resume
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

// Grid Card Component
function ResumeCardGrid({ resume, onEdit, onDuplicate, onDelete, formatDate }) {
  return (
    <div className="group relative bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 border border-neutral-800/50 rounded-2xl p-6 hover:border-neutral-700 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 rounded-2xl transition-all duration-300"></div>

      <div className="relative">
        {/* Preview */}
        <div className="aspect-[8.5/11] bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-xl border border-neutral-800 mb-4 flex items-center justify-center overflow-hidden group/preview relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover/preview:opacity-100 transition-opacity"></div>
          <FileText size={64} className="text-neutral-700 group-hover/preview:text-neutral-600 group-hover/preview:scale-110 transition-all duration-300" />
          
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(resume._id)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
              title="Edit"
            >
              <Eye size={20} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mb-4">
          <h3 className="font-bold text-white text-lg mb-2 truncate group-hover:text-blue-400 transition-colors">
            {resume.title || 'Untitled Resume'}
          </h3>
          
          <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>{formatDate(resume.updatedAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Layers size={12} />
              <span>{resume.blocks?.length || 0} blocks</span>
            </div>
          </div>

          {resume.resumeData?.fullName && (
            <p className="text-sm text-neutral-400 truncate">
              {resume.resumeData.fullName}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(resume._id)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20 border border-blue-600/50 text-blue-400 hover:bg-blue-600/30 hover:border-blue-500 transition-all duration-200 group/btn font-medium"
          >
            <Edit size={16} className="group-hover/btn:scale-110 transition-transform" />
            <span className="text-sm">Edit</span>
          </button>

          <button
            onClick={() => onDuplicate(resume._id)}
            className="p-2.5 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-neutral-400 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all duration-200 group/btn"
            title="Duplicate"
          >
            <Copy size={16} className="group-hover/btn:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onDelete(resume._id)}
            className="p-2.5 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-neutral-400 hover:bg-red-950/30 hover:border-red-800/50 hover:text-red-400 transition-all duration-200 group/btn"
            title="Delete"
          >
            <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// List Card Component
function ResumeCardList({ resume, onEdit, onDuplicate, onDelete, formatDate, formatTime }) {
  return (
    <div className="group relative bg-gradient-to-r from-neutral-900/50 to-neutral-900/30 border border-neutral-800/50 rounded-xl p-5 hover:border-neutral-700 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-200">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-blue-600/30 transition-colors">
          <FileText size={28} className="text-neutral-600 group-hover:text-blue-500 transition-colors" />
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
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(resume._id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 border border-blue-600/50 text-blue-400 hover:bg-blue-600/30 transition-all duration-200 group/btn font-medium"
          >
            <Edit size={16} className="group-hover/btn:scale-110 transition-transform" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDuplicate(resume._id)}
            className="p-2.5 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all duration-200 group/btn"
            title="Duplicate"
          >
            <Copy size={16} className="group-hover/btn:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onDelete(resume._id)}
            className="p-2.5 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-neutral-400 hover:bg-red-950/30 hover:border-red-800/50 hover:text-red-400 transition-all duration-200 group/btn"
            title="Delete"
          >
            <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}