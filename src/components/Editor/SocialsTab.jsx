import React from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube, 
  Globe, 
  Mail, 
  MessageSquare, 
  Music,
  Share2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const PRESET_PLATFORMS = [
  { name: 'FOSS Cell', platform: 'custom', icon: 'Globe', color: '#1e293b', defaultUrl: 'https://', subtitle: 'Free & Open Source Software' },
  { name: 'IEEE Student Branch', platform: 'custom', icon: 'Globe', color: '#1e293b', defaultUrl: 'https://', subtitle: 'Advancing Technology for Humanity' },
  { name: 'Alchemy IEDC', platform: 'custom', icon: 'Globe', color: '#1e293b', defaultUrl: 'https://', subtitle: 'Innovation & Entrepreneurship' },
  { name: 'ISTE', platform: 'custom', icon: 'Globe', color: '#1e293b', defaultUrl: 'https://', subtitle: 'Technical Education Excellence' },
  { name: 'TinkerHub CEAL', platform: 'custom', icon: 'Globe', color: '#1e293b', defaultUrl: 'https://', subtitle: 'Tinkering, Innovation & Community' },
  { name: 'GitHub', platform: 'github', icon: 'Github', color: '#333333', defaultUrl: 'https://github.com/', subtitle: 'Open Source Repositories' },
  { name: 'LinkedIn', platform: 'linkedin', icon: 'Linkedin', color: '#0a66c2', defaultUrl: 'https://linkedin.com/in/', subtitle: 'Professional Network' },
];

export default function SocialsTab({ socials, onChange }) {
  const [editingId, setEditingId] = React.useState(null);

  const handleAddSocial = (preset) => {
    const newSocial = {
      id: Date.now().toString(),
      platform: preset ? preset.platform : 'custom',
      title: preset ? preset.name : 'New Club / Link',
      subtitle: preset ? preset.subtitle : 'Subtitle description...',
      url: preset ? preset.defaultUrl : 'https://',
      icon: preset ? preset.icon : 'Globe',
      color: preset ? preset.color : '#1e293b',
      enabled: true,
      badge: '',
    };
    onChange([...socials, newSocial]);
    setEditingId(newSocial.id);
  };

  const handleUpdate = (id, field, value) => {
    onChange(
      socials.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleRemove = (id) => {
    onChange(socials.filter((s) => s.id !== id));
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= socials.length) return;
    const newSocials = [...socials];
    const [moved] = newSocials.splice(index, 1);
    newSocials.splice(targetIndex, 0, moved);
    onChange(newSocials);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-purple-400" />
          Clubs, Social Media & Custom Link Cards
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Add link cards with titles, subtitles, and destination URLs (matching CEAL Clubs model).
        </p>
      </div>

      {/* Preset Quick Add Buttons */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
        <label className="block text-xs font-medium text-slate-300">Quick Add CEAL Club Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_PLATFORMS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleAddSocial(preset)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/40 text-slate-200 text-xs font-medium rounded-xl flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>{preset.name}</span>
            </button>
          ))}
          <button
            onClick={() => handleAddSocial(null)}
            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Card</span>
          </button>
        </div>
      </div>

      {/* Social Links Manager List */}
      <div className="space-y-3">
        {socials.map((social, index) => (
          <div
            key={social.id}
            className={`p-3.5 rounded-2xl border transition-all ${
              editingId === social.id
                ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              
              {/* Drag handle & title */}
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className="flex flex-col space-y-0.5 text-slate-500">
                  <button 
                    disabled={index === 0}
                    onClick={() => handleMove(index, -1)}
                    className="hover:text-white disabled:opacity-30 text-[10px]"
                  >
                    ▲
                  </button>
                  <button 
                    disabled={index === socials.length - 1}
                    onClick={() => handleMove(index, 1)}
                    className="hover:text-white disabled:opacity-30 text-[10px]"
                  >
                    ▼
                  </button>
                </div>

                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: social.color || '#6366f1' }}
                >
                  {social.title.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">
                    {social.title || 'Untitled Card'}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {social.subtitle || social.url}
                  </p>
                </div>
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center space-x-2">
                {/* Enable/Disable Toggle */}
                <button
                  onClick={() => handleUpdate(social.id, 'enabled', !social.enabled)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    social.enabled
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-500'
                  }`}
                  title={social.enabled ? 'Enabled' : 'Disabled'}
                >
                  {social.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                {/* Edit Expansion Toggle */}
                <button
                  onClick={() => setEditingId(editingId === social.id ? null : social.id)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700"
                >
                  {editingId === social.id ? 'Done' : 'Edit'}
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleRemove(social.id)}
                  className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 hover:border-rose-800/40"
                  title="Remove Link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expanded Editor Form */}
            {editingId === social.id && (
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Card Title</label>
                  <input
                    type="text"
                    value={social.title}
                    onChange={(e) => handleUpdate(social.id, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                    placeholder="e.g. FOSS Cell"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Subtitle / Description</label>
                  <input
                    type="text"
                    value={social.subtitle || ''}
                    onChange={(e) => handleUpdate(social.id, 'subtitle', e.target.value)}
                    className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                    placeholder="e.g. Free & Open Source Software"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Destination URL</label>
                  <input
                    type="text"
                    value={social.url}
                    onChange={(e) => handleUpdate(social.id, 'url', e.target.value)}
                    className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Badge Tag (Optional)</label>
                  <input
                    type="text"
                    value={social.badge || ''}
                    onChange={(e) => handleUpdate(social.id, 'badge', e.target.value)}
                    className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                    placeholder="e.g. Active, Official"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Card Accent Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={social.color || '#1e293b'}
                      onChange={(e) => handleUpdate(social.id, 'color', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={social.color || '#1e293b'}
                      onChange={(e) => handleUpdate(social.id, 'color', e.target.value)}
                      className="flex-1 px-3 py-1.5 glass-input rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {socials.length === 0 && (
          <div className="text-center py-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
            No link cards added yet. Click one of the CEAL Club presets above!
          </div>
        )}
      </div>
    </div>
  );
}
