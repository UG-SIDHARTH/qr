import React from 'react';
import { 
  Share2, 
  Download, 
  QrCode,
  Check,
  Lock,
  Unlock,
  Sliders,
  Network,
  LayoutDashboard,
  Link2,
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  viewMode, 
  setViewMode, 
  onOpenExport, 
  onQuickQR,
  onPublish,
  isUnlocked,
  onRequestUnlock
}) {
  const [copied, setCopied] = React.useState(false);
  const [activeNav, setActiveNav] = React.useState('dashboard');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const NAV_ITEMS = [
    { id: 'qr-studio', label: 'QR Studio', icon: QrCode },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-links', label: 'My Links', icon: Link2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 pb-1">
      
      {/* Floating Pill-Shaped Glass Header Container */}
      <div className="max-w-[1550px] mx-auto h-16 px-4 sm:px-6 bg-[#080918]/75 backdrop-blur-2xl border border-white/10 border-t-white/25 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(168,85,247,0.15)] flex items-center justify-between gap-3 transition-all duration-300">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-[0_0_20px_rgba(168,85,247,0.5)] flex-shrink-0">
            <div className="w-full h-full bg-[#0a0c1b] rounded-[14px] flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-outfit font-extrabold text-sm sm:text-base text-white tracking-tight">
                QR Linktree
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Digital Bio Card & QR Studio
            </p>
          </div>
        </div>

        {/* Middle Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 py-1 px-2 bg-[#0d0f22]/80 border border-slate-800/80 rounded-full">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  if (item.id === 'qr-studio') onQuickQR();
                }}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/40 to-cyan-500/30 text-purple-200 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Floating Action Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          
          {/* Studio Editor Button */}
          <button
            onClick={() => setViewMode(viewMode === 'editor' ? 'preview' : 'editor')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/20 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-white" />
            <span>{viewMode === 'editor' ? 'Card View' : 'Studio Editor'}</span>
          </button>

          {/* Show QR Button */}
          <button
            onClick={onQuickQR}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-cyan-200 text-xs font-semibold rounded-full border border-cyan-400/30 hover:border-cyan-400/60 hover:-translate-y-0.5 transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Show QR</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium rounded-full border border-white/15 hover:-translate-y-0.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden lg:inline">{copied ? "Copied" : "Share"}</span>
          </button>

          {/* Account Login Button */}
          <button
            onClick={onRequestUnlock}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border hover:-translate-y-0.5 ${
              isUnlocked 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                : 'bg-purple-500/15 border-purple-400/30 text-purple-200 hover:bg-purple-500/25'
            }`}
          >
            {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-purple-400" />}
            <span className="hidden sm:inline">{isUnlocked ? "Account" : "Log In / Sign Up"}</span>
          </button>

          {/* Export JSON Button */}
          <button
            onClick={onOpenExport}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 rounded-full transition-all hover:-translate-y-0.5 hidden xl:flex"
            title="Export JSON"
          >
            <Download className="w-4 h-4 text-purple-400" />
          </button>

        </div>

      </div>
    </header>
  );
}


