import React from 'react';
import { 
  BadgeCheck, 
  MapPin, 
  Share2, 
  QrCode, 
  UserPlus, 
  ArrowUpRight, 
  FolderGit2,
  Sparkles,
  Sliders,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Mail,
  MessageSquare,
  Music,
  Star,
  User,
  Zap,
  Code2,
  Cpu
} from 'lucide-react';
import { downloadVCard } from '../../utils/vcard';

const ICON_MAP = {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Mail,
  MessageSquare,
  Music,
  Zap,
  Code2,
  Cpu
};

export default function BioPage({ profileData = {}, onOpenQR, onOpenEditor, isFullView = false }) {
  const { profile = {}, socials = [], portfolio = [], theme = {} } = profileData || {};

  const buttonRadius = theme?.buttonRadius || 'rounded-2xl';
  const accentColor = theme?.accentColor || '#6366f1';
  const buttonGlow = theme?.buttonGlow !== false;

  const handleSaveContact = () => {
    downloadVCard(profile, socials);
  };

  const activeSocials = (socials || []).filter(s => s && s.enabled);
  const isEmptyProfile = !profile?.name && !profile?.username && activeSocials.length === 0 && (!portfolio || portfolio.length === 0);

  const displayAvatar = profile?.avatar || null;
  const displayName = profile?.name || (isEmptyProfile ? "Your Name" : "");
  const displayUsername = profile?.username || (isEmptyProfile ? "your_username" : "");
  const displayTitle = profile?.title || (isEmptyProfile ? "Digital Creator & Developer" : "");
  const displayBio = profile?.bio || (isEmptyProfile ? "Customize your name, headshot, bio and links in the editor tabs to build your digital bio card." : "");

  return (
    <div className={`w-full min-h-full flex flex-col items-center justify-center ${theme.bgStyle || 'bg-[#090d16]'} p-4 sm:p-8 transition-all`}>
      
      {/* Floating Action Controls for Standalone View */}
      {isFullView && (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
          {onOpenQR && (
            <button
              onClick={onOpenQR}
              className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-105"
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4 text-purple-400" />
            </button>
          )}
          {onOpenEditor && (
            <button
              onClick={onOpenEditor}
              className="px-3.5 py-2 bg-indigo-600/90 hover:bg-indigo-500 text-white border border-indigo-400/30 rounded-full text-xs font-semibold shadow-lg shadow-indigo-600/30 backdrop-blur-md flex items-center space-x-1.5 transition-all hover:scale-105"
              title="Open Studio Editor"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Studio Editor</span>
            </button>
          )}
        </div>
      )}

      {/* Outer Card Container (Matches CEAL / Modern Linktree Card aesthetic) */}
      <div className={`w-full ${isFullView ? 'max-w-md my-6 p-6 sm:p-8' : 'max-w-md p-4'} bg-[#0f1422]/90 border border-slate-800/90 rounded-[32px] shadow-2xl backdrop-blur-2xl space-y-6 text-center`}>
        
        {/* Header / Profile Info */}
        <div className="flex flex-col items-center text-center space-y-3">
          
          {/* Avatar / Logo */}
          {displayAvatar ? (
            <div className="relative group mb-1">
              <div 
                className="absolute -inset-1 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse-glow"
                style={{ backgroundColor: accentColor }}
              />
              <img
                src={displayAvatar}
                alt={displayName || "Profile"}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#0f1422] shadow-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="relative mb-1">
              <div 
                className="absolute -inset-1 rounded-full blur-md opacity-40 animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-xl">
                <User className="w-9 h-9 opacity-80" />
              </div>
            </div>
          )}

          {/* Title / Name */}
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1.5">
              {displayName && (
                <h1 className={`text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight ${isEmptyProfile ? 'text-slate-300' : 'text-white'}`}>
                  {displayName}
                </h1>
              )}
              {(profile.verified || isEmptyProfile) && (
                <BadgeCheck className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
              )}
            </div>
            
            {displayUsername && (
              <p className="text-xs font-mono text-indigo-300/90">
                @{displayUsername}
              </p>
            )}
          </div>

          {/* Headline Title */}
          {displayTitle && (
            <p className="text-xs font-semibold text-slate-300 tracking-wide uppercase px-3 py-1 bg-slate-800/60 rounded-full border border-slate-700/60">
              {displayTitle}
            </p>
          )}

          {/* Bio / Description */}
          {displayBio && (
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              {displayBio}
            </p>
          )}

          {/* Status Banner */}
          {profile.statusText && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-medium">
              <span>{profile.statusText}</span>
            </div>
          )}

          {/* Location Tag */}
          {profile.location && (
            <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {/* vCard Save Contact Button */}
          <div className="pt-2 w-full">
            <button
              onClick={handleSaveContact}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/20 border border-emerald-400/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95 group"
            >
              <UserPlus className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
              <span>Save to Phone Contacts (vCard)</span>
            </button>
          </div>

        </div>

        {/* Links Cards List (CEAL / Linktree Card Style) */}
        <div className="space-y-3 w-full pt-1">
          {activeSocials.map((social) => {
            const IconComponent = ICON_MAP[social.icon] || Globe;
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-full p-4 bg-[#141a29] hover:bg-[#1a2235] border border-slate-800/80 hover:border-slate-600 ${buttonRadius} flex items-center justify-between transition-all duration-300 shadow-md transform hover:-translate-y-0.5`}
                style={{
                  boxShadow: buttonGlow ? `0 0 12px ${accentColor}25` : 'none',
                }}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Optional Icon */}
                  {social.icon && (
                    <div 
                      className={`w-10 h-10 ${buttonRadius === 'rounded-full' ? 'rounded-full' : 'rounded-xl'} flex items-center justify-center text-white shadow-md flex-shrink-0 transition-transform group-hover:scale-105`}
                      style={{ backgroundColor: social.color || accentColor }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                  )}

                  {/* Title & Subtitle */}
                  <div className="flex-1 min-w-0 text-left">
                    <span className="block text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {social.title}
                    </span>
                    {social.subtitle && (
                      <span className="block text-xs text-slate-400 font-normal truncate mt-0.5">
                        {social.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side Arrow Icon */}
                <div className="flex items-center space-x-2 pl-2">
                  {social.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                      {social.badge}
                    </span>
                  )}
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            );
          })}

        </div>

        {/* Portfolio Showcase Grid */}
        {portfolio && portfolio.length > 0 && (
          <div className="space-y-3 pt-2 w-full text-left">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                Featured Portfolio
              </h3>
              <span className="text-[10px] text-slate-500">{portfolio.length} Projects</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {portfolio.map((project) => (
                <a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group bg-[#141a29] hover:bg-[#1a2235] border border-slate-800 ${buttonRadius} p-3.5 flex gap-3 transition-all duration-300`}
                  style={{
                    boxShadow: buttonGlow ? `0 0 10px ${accentColor}15` : 'none',
                  }}
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {project.title}
                        </h4>
                        {project.stars && (
                          <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {project.stars}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags && project.tags.map((tag, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-[9px] bg-white/5 text-slate-300 rounded border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            {profile.footerText || "© UG_SIDHARTH"}
          </p>
        </div>

      </div>
    </div>
  );
}
