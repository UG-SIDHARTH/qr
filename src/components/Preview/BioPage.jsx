import React from 'react';
import { 
  BadgeCheck, 
  MapPin, 
  Share2, 
  QrCode, 
  UserPlus, 
  ExternalLink, 
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
  User
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
};

export default function BioPage({ profileData, onOpenQR, isFullView = false }) {
  const { profile, socials = [], portfolio = [], theme = {} } = profileData;

  const handleSaveContact = () => {
    downloadVCard(profile, socials);
  };

  const activeSocials = socials.filter(s => s.enabled);

  return (
    <div className={`w-full min-h-full flex flex-col items-center ${theme.bgStyle || 'bg-preset-midnight'} p-4 sm:p-6 transition-all`}>
      <div className={`w-full ${isFullView ? 'max-w-xl py-8' : 'max-w-md py-4'} space-y-6`}>
        
        {/* Header / Profile Card */}
        <div className="flex flex-col items-center text-center space-y-3">
          
          {/* Avatar with Glow */}
          <div className="relative group">
            <div 
              className="absolute -inset-1 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse-glow"
              style={{ backgroundColor: theme.accentColor || '#6366f1' }}
            />
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name || "Profile"}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-slate-900 shadow-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center text-slate-500 shadow-2xl"
              style={{ display: profile.avatar ? 'none' : 'flex' }}
            >
              <User className="w-12 h-12 text-slate-600" />
            </div>
          </div>

          {/* Name & Handle */}
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1.5">
              <h1 className="text-xl sm:text-2xl font-bold font-outfit text-white tracking-tight">
                {profile.name || "Your Name Here"}
              </h1>
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

          {/* Title / Profession */}
          {profile.title && (
            <p className="text-xs font-medium text-slate-300 max-w-xs">
              {profile.title}
            </p>
          )}

          {/* Status Banner */}
          {profile.statusText && (
            <div className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium flex items-center space-x-1.5 shadow-sm">
              <span>{profile.statusText}</span>
            </div>
          )}

          {/* Bio paragraph */}
          {profile.bio && (
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {profile.bio}
            </p>
          )}

          {/* Location Tag */}
          {profile.location && (
            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {/* Quick Action Buttons: Save Contact vCard & QR Code Modal */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={handleSaveContact}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all transform active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Save Contact</span>
            </button>

            <button
              onClick={onOpenQR}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl backdrop-blur-md border border-white/10 flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Show QR</span>
            </button>
          </div>

        </div>

        {/* Social Links List */}
        <div className="space-y-3 w-full">
          {activeSocials.map((social) => {
            const IconComponent = ICON_MAP[social.icon] || Globe;
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-full p-3.5 ${theme.cardStyle || 'glass-card'} ${theme.buttonRadius || 'rounded-2xl'} flex items-center justify-between transition-all duration-300 transform hover:-translate-y-0.5`}
                style={{
                  boxShadow: theme.buttonGlow ? `0 0 15px ${social.color}25` : 'none'
                }}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: social.color || theme.accentColor || '#6366f1' }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <span className="block text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {social.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {social.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 text-white/90 rounded-full border border-white/10">
                      {social.badge}
                    </span>
                  )}
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </a>
            );
          })}

          {activeSocials.length === 0 && (
            <div className="text-center py-8 px-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs space-y-1">
              <p className="font-semibold text-slate-300">No social links added yet</p>
              <p className="text-[11px] text-slate-500">
                Use the Studio Editor to add your GitHub, LinkedIn, X/Twitter, or custom links.
              </p>
            </div>
          )}
        </div>

        {/* Portfolio Showcase Grid */}
        {portfolio && portfolio.length > 0 && (
          <div className="space-y-3 pt-4 w-full">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                Portfolio Showcase
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
                  className={`group ${theme.cardStyle || 'glass-card'} rounded-2xl p-3 flex gap-3 transition-all duration-300 hover:border-emerald-500/40`}
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-20 h-20 rounded-xl object-cover border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform"
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
        <div className="pt-6 text-center space-y-2">
          <button
            onClick={onOpenQR}
            className="inline-flex items-center space-x-1 text-[11px] text-slate-500 hover:text-indigo-400 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code to Share Profile</span>
          </button>
          <p className="text-[10px] text-slate-600 font-outfit">
            Powered by LinkTree & QR Studio
          </p>
        </div>

      </div>
    </div>
  );
}
