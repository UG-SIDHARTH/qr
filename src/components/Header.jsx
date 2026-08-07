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
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080914]/90 backdrop-blur-2xl">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-[0_0_20px_rgba(168,85,247,0.4)] flex-shrink-0">
            <div className="w-full h-full bg-[#0a0c1b] rounded-[10.5px] flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-outfit font-extrabold text-sm sm:text-base text-white tracking-tight">
                OpenSource
              </span>
              <span className="font-outfit font-extrabold text-sm sm:text-base text-purple-400 tracking-tight">
                Linktree
              </span>
            </div>
          </div>
        </div>

        {/* Middle Navigation Tabs (Screenshot style) */}
        <nav className="hidden md:flex items-center space-x-1 py-1 px-2 bg-[#0d0f22]/80 border border-slate-800/70 rounded-full">
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
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          
          {/* Studio Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'editor' ? 'preview' : 'editor')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#14162e] hover:bg-[#1a1e3d] border border-purple-500/40 text-purple-300 text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">{viewMode === 'editor' ? 'Card View' : 'Studio Editor'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0d0e21] hover:bg-slate-800/80 text-slate-300 text-xs font-medium rounded-xl border border-slate-800 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden lg:inline">{copied ? "Copied" : "Share"}</span>
          </button>

          {/* Account Login Button */}
          <button
            onClick={onRequestUnlock}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isUnlocked 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                : 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
            }`}
          >
            {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-purple-400" />}
            <span className="hidden sm:inline">{isUnlocked ? "Account" : "Sign In"}</span>
          </button>

          {/* Export / Import Button */}
          <button
            onClick={onOpenExport}
            className="p-1.5 bg-[#0d0e21] hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all hidden sm:flex"
            title="Export JSON"
          >
            <Download className="w-4 h-4 text-purple-400" />
          </button>

        </div>

      </div>
    </header>
  );
}

