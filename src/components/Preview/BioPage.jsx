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

export default function BioPage({ profileData = {}, onOpenQR, isFullView = false }) {
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
    <div className={`w-full min-h-full flex flex-col items-center justify-center ${theme.bgStyle || 'bg-preset-cyber'} p-4 sm:p-6 transition-all`}>
      
      {/* Outer Card Container */}
      <div className={`w-full ${isFullView ? 'max-w-md my-6 p-6 sm:p-8' : 'max-w-md p-5'} bg-[#0a0c1b]/95 border border-purple-500/30 rounded-[36px] shadow-[0_0_40px_rgba(168,85,247,0.2)] backdrop-blur-2xl space-y-6 text-center`}>
        
        {/* Header / Profile Info */}
        <div className="flex flex-col items-center text-center space-y-3">
          
          {/* Avatar with Neon Purple Ring */}
          <div className="relative mb-1 group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-cyan-400 to-pink-500 opacity-70 blur-md group-hover:opacity-100 transition duration-300 animate-pulse" />
            
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName || "Profile"}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#111329] border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                <User className="w-9 h-9 opacity-90 text-cyan-400" />
              </div>
            )}
          </div>

          {/* Title / Name */}
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1.5">
              {displayName && (
                <h1 className="text-xl sm:text-2xl font-extrabold font-outfit tracking-tight text-white">
                  {displayName}
                </h1>
              )}
              {profile.verified && (
                <BadgeCheck className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
              )}
            </div>
            
            {displayTitle && (
              <p className="text-xs font-semibold text-slate-300 tracking-wide">
                {displayTitle}
              </p>
            )}
          </div>

          {/* Subtitle / Bio */}
          {displayBio && (
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {displayBio}
            </p>
          )}

          {/* Social Icons Pills Row (Matching Screenshot: Twitter, LinkedIn, GitHub, Instagram) */}
          {activeSocials.length > 0 && (
            <div className="flex items-center justify-center gap-2.5 pt-1">
              {activeSocials.map((social) => {
                const IconComponent = ICON_MAP[social.icon] || Globe;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.title || social.platform}
                    className="w-10 h-10 rounded-2xl bg-[#12142d] border border-purple-500/50 hover:border-cyan-400 text-purple-300 hover:text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all transform hover:-translate-y-0.5"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}

        </div>

        {/* Primary Link Buttons (Matching Screenshot: Portfolio, Contact, Latest Project) */}
        <div className="space-y-3 w-full pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-left px-1">
            Primary Links
          </span>

          {portfolio && portfolio.length > 0 ? (
            portfolio.map((project, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-full py-3 px-4 bg-[#0d0e23] hover:bg-[#151736] ${
                    isEven 
                      ? 'border border-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.35)] text-cyan-200' 
                      : 'border border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.35)] text-purple-200'
                  } rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm tracking-wide transition-all transform hover:-translate-y-0.5`}
                >
                  <span>{project.title}</span>
                </a>
              );
            })
          ) : (
            <>
              <a
                href="#portfolio"
                className="w-full py-3 px-4 bg-[#0d0e23] border border-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.35)] rounded-2xl text-center font-bold text-xs sm:text-sm text-cyan-200 block"
              >
                Portfolio
              </a>
              <a
                href="#contact"
                className="w-full py-3 px-4 bg-[#0d0e23] border border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.35)] rounded-2xl text-center font-bold text-xs sm:text-sm text-purple-200 block"
              >
                Contact
              </a>
              <a
                href="#latest-project"
                className="w-full py-3 px-4 bg-[#0d0e23] border border-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.35)] rounded-2xl text-center font-bold text-xs sm:text-sm text-cyan-200 block"
              >
                Latest Project
              </a>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500 font-medium">
            opensourcelinktree.com/{profile.username || 'sarahjenkins'}
          </p>
        </div>

      </div>
    </div>
  );

}
