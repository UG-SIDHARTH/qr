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

export default function BioPage({ profileData, onOpenQR, isFullView = false }) {
  const { profile = {}, socials = [], portfolio = [], theme = {} } = profileData;

  const handleSaveContact = () => {
    downloadVCard(profile, socials);
  };

  const activeSocials = socials.filter(s => s.enabled);

  return (
    <div className={`w-full min-h-full flex flex-col items-center justify-center ${theme.bgStyle || 'bg-[#090d16]'} p-4 sm:p-8 transition-all`}>
      
      {/* Outer Card Container (Matches CEAL / Modern Linktree Card aesthetic) */}
      <div className={`w-full ${isFullView ? 'max-w-md my-6 p-6 sm:p-8' : 'max-w-md p-4'} bg-[#0f1422]/90 border border-slate-800/90 rounded-[32px] shadow-2xl backdrop-blur-2xl space-y-6 text-center`}>
        
        {/* Header / Profile Info */}
        <div className="flex flex-col items-center text-center space-y-3">
          
          {/* Avatar / Logo */}
          {profile.avatar && (
            <div className="relative group mb-1">
              <div 
                className="absolute -inset-1 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse-glow"
                style={{ backgroundColor: theme.accentColor || '#6366f1' }}
              />
              <img
                src={profile.avatar}
                alt={profile.name || "Profile"}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#0f1422] shadow-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Title / Name */}
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1.5">
              {profile.name && (
                <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-tight">
                  {profile.name}
                </h1>
              )}
              {profile.verified && (
                <BadgeCheck className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
              )}
            </div>
            
            {profile.username && (
              <p className="text-xs font-mono text-indigo-300">
                @{profile.username}
              </p>
            )}
          </div>

          {/* Headline Title */}
          {profile.title && (
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {profile.title}
            </p>
          )}

          {/* Bio / Description */}
          {profile.bio && (
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm px-2">
              {profile.bio}
            </p>
          )}

          {/* Status Banner */}
          {profile.statusText && (
            <div className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium inline-flex items-center space-x-1.5 shadow-sm">
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
                className="group relative w-full p-4 bg-[#141a29] hover:bg-[#1a2235] border border-slate-800/80 hover:border-slate-600 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Optional Icon */}
                  {social.icon && (
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: social.color || theme.accentColor || '#6366f1' }}
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
                  className="group bg-[#141a29] hover:bg-[#1a2235] border border-slate-800 rounded-2xl p-3.5 flex gap-3 transition-all duration-300"
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
        {profile.footerText && (
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[10px] text-slate-500">
              {profile.footerText}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
