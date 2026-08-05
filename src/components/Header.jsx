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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-outfit font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                {profile?.name || "Bio Linktree"}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {profile?.title || "Digital Profile & Portfolio"}
            </p>
          </div>
        </div>

        {/* Studio View Controls (Only visible if creator is editing or unlocked) */}
        {isUnlocked && (
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'preview'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Public Preview</span>
            </button>
            
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'editor'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Studio Editor</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Quick QR Button */}
          <button
            onClick={onQuickQR}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium rounded-xl transition-all"
            title="Scan or View QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Show QR</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Share Link"}</span>
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
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all"
              title="Export / Import Profile JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Reset Button (Unlocked Only) */}
          {isUnlocked && (
            <button
              onClick={onReset}
              className="p-2 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/40 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
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
