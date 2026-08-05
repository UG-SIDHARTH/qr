import React from 'react';
import { 
  Share2, 
  Download, 
  RotateCcw, 
  QrCode,
  Check,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  Sliders
} from 'lucide-react';

export default function Header({ 
  viewMode, 
  setViewMode, 
  onOpenExport, 
  onReset, 
  onQuickQR,
  onPublish,
  profile,
  isUnlocked,
  onRequestUnlock
}) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2.5 min-w-0 flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="min-w-0 truncate">
            <span className="font-outfit font-extrabold text-sm sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 block whitespace-nowrap truncate">
              QR Linktree
            </span>
            <p className="text-[11px] text-slate-400 hidden md:block whitespace-nowrap truncate">
              Digital Bio Card & QR Studio
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
          
          {/* Publish / Finish Button in Editor Mode */}
          {viewMode === 'editor' && (
            <button
              onClick={onPublish}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95 border border-emerald-400/30 whitespace-nowrap"
            >
              <span>🚀 Publish</span>
            </button>
          )}

          {/* Studio vs Card View Button */}
          <button
            onClick={() => setViewMode(viewMode === 'editor' ? 'preview' : 'editor')}
            className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95 whitespace-nowrap"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{viewMode === 'editor' ? 'View Card' : 'Studio Editor'}</span>
          </button>

          {/* Quick QR Button */}
          <button
            onClick={onQuickQR}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300 text-xs font-medium rounded-xl transition-all whitespace-nowrap"
            title="Scan or View QR Code"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Show QR</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl transition-all border border-slate-800 whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-400" />}
            <span className="hidden md:inline">{copied ? "Copied!" : "Share"}</span>
          </button>

          {/* Creator Lock / Unlock Status Button */}
          <button
            onClick={onRequestUnlock}
            className={`p-2 rounded-xl border transition-all ${
              isUnlocked 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={isUnlocked ? "Creator Studio Unlocked" : "Creator Admin Login"}
          >
            {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4" />}
          </button>

          {/* Export / Import Button (Unlocked Only) */}
          {isUnlocked && (
            <button
              onClick={onOpenExport}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all hidden sm:flex"
              title="Export / Import Profile JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Reset Button (Unlocked Only) */}
          {isUnlocked && (
            <button
              onClick={onReset}
              className="p-2 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/40 text-slate-400 hover:text-rose-400 rounded-xl transition-all hidden sm:flex"
              title="Reset to Default Sample Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
