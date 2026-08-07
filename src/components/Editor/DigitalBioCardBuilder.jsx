import React, { useState } from 'react';
import { 
  Eye, 
  Layout, 
  Moon, 
  Link2, 
  Sparkles, 
  Check,
  User,
  Share2,
  FolderGit2,
  Palette,
  QrCode
} from 'lucide-react';
import BioPage from '../Preview/BioPage';

export default function DigitalBioCardBuilder({ 
  profileData, 
  activeTab, 
  setActiveTab, 
  onOpenLivePreview,
  onOpenQR 
}) {
  const [selectedBottomOption, setSelectedBottomOption] = useState('neon-theme');

  const OPTIONS = [
    { id: 'layouts', label: 'Layouts', icon: Layout, tab: 'profile' },
    { id: 'themes', label: 'Themes', icon: Moon, tab: 'theme' },
    { id: 'neon-theme', label: 'Neon Purple/Cyan', icon: Sparkles, tab: 'theme', isPreset: true },
    { id: 'links', label: 'Links', icon: Link2, tab: 'socials' },
  ];

  const handleSelectOption = (opt) => {
    setSelectedBottomOption(opt.id);
    if (opt.tab) {
      setActiveTab(opt.tab);
    }
  };

  return (
    <div className="w-full bg-[#0c0d20]/95 border border-slate-800/90 rounded-[28px] p-5 sm:p-7 backdrop-blur-2xl shadow-2xl flex flex-col justify-between space-y-6">
      
      {/* Card Header: Title & Live Preview Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-white font-outfit tracking-tight">
          Digital Bio Card Builder
        </h2>

        {/* Live Preview Button */}
        <button
          type="button"
          onClick={onOpenLivePreview}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#14162e] hover:bg-[#1c1f40] border border-slate-700/70 text-slate-200 text-xs font-semibold rounded-xl transition-all active:scale-95 shadow-md"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Middle Interactive Profile Card Display */}
      <div className="w-full flex justify-center py-2">
        <div className="w-full max-w-sm rounded-[24px] border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] overflow-hidden bg-[#090a18]">
          <BioPage 
            profileData={profileData} 
            onOpenQR={onOpenQR} 
            isFullView={false} 
          />
        </div>
      </div>

      {/* Bottom Option Selector Pills (Screenshot Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedBottomOption === opt.id || (opt.isPreset && profileData?.theme?.id === 'neon-purple-cyan');
          
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectOption(opt)}
              className={`py-3 px-3 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition-all text-xs font-semibold border ${
                isSelected
                  ? 'bg-gradient-to-b from-purple-900/40 to-indigo-950/60 border-purple-500/80 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-500/40'
                  : 'bg-[#13152c] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {opt.isPreset ? (
                <div className="flex items-center space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </div>
              ) : (
                <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
              )}
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
