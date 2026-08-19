import React from 'react';
import { 
  FolderGit2, 
  Plus, 
  Trash2
} from 'lucide-react';

export default function PortfolioTab({ portfolio = [], onChange }) {
  const [editingId, setEditingId] = React.useState(null);

  const safePortfolio = Array.isArray(portfolio) ? portfolio : [];

  const handleAddProject = () => {
    const newProject = {
      id: "p_" + Date.now(),
      title: "New Featured Project",
      description: "Briefly explain what this project does and tech stack used...",
      url: "https://github.com/",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
      tags: ["React", "Tailwind"],
      featured: true,
      stars: "100+"
    };
    onChange([newProject, ...safePortfolio]);
    setEditingId(newProject.id);
  };

  const handleUpdate = (id, field, value) => {
    onChange(
      safePortfolio.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleRemove = (id) => {
    onChange(safePortfolio.filter((p) => p.id !== id));
  };

  const handleTagsChange = (id, tagsString) => {
    const tagsArray = tagsString.split(',').map(t => t.trim()).filter(Boolean);
    handleUpdate(id, 'tags', tagsArray);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            Featured Portfolio & Projects
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Showcase your best open-source repositories, case studies, or client projects.
          </p>
        </div>

        <button
          onClick={handleAddProject}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-4">
        {safePortfolio.map((project) => (
          <div
            key={project.id}
            className={`p-4 rounded-2xl border transition-all ${
              editingId === project.id
                ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex space-x-3 flex-1 min-w-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-semibold text-slate-100 truncate">
                      {project.title}
                    </h4>
                    {project.featured && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">
                        ★ FEATURED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags && project.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setEditingId(editingId === project.id ? null : project.id)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700"
                >
                  {editingId === project.id ? 'Done' : 'Edit'}
                </button>
                <button
                  onClick={() => handleRemove(project.id)}
                  className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 hover:border-rose-800/40"
                  title="Remove Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Editing Form */}
            {editingId === project.id && (
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Project Title</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleUpdate(project.id, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Live Demo / Repo URL</label>
                  <input
                    type="text"
                    value={project.url}
                    onChange={(e) => handleUpdate(project.id, 'url', e.target.value)}
                    className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={project.image}
                    onChange={(e) => handleUpdate(project.id, 'image', e.target.value)}
                    className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={project.description}
                    onChange={(e) => handleUpdate(project.id, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 glass-input rounded-xl text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tech Stack Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={project.tags ? project.tags.join(', ') : ''}
                    onChange={(e) => handleTagsChange(project.id, e.target.value)}
                    placeholder="React, Next.js, Tailwind"
                    className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Stars / Highlights Badge</label>
                  <input
                    type="text"
                    value={project.stars || ''}
                    onChange={(e) => handleUpdate(project.id, 'stars', e.target.value)}
                    placeholder="e.g. 1.2k Stars, v2.0"
                    className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id={`featured_${project.id}`}
                    checked={project.featured || false}
                    onChange={(e) => handleUpdate(project.id, 'featured', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor={`featured_${project.id}`} className="text-slate-300 font-medium">
                    Mark as Featured Project Highlight
                  </label>
                </div>

              </div>
            )}
          </div>
        ))}

        {portfolio.length === 0 && (
          <div className="text-center py-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
            No portfolio projects added yet. Click "+ Add Project" to showcase your work!
          </div>
        )}
      </div>
    </div>
  );
}
