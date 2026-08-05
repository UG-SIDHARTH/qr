import React from 'react';
import { QrCode, Sliders, Sparkles, Share2, Shield, FolderGit2, ArrowRight } from 'lucide-react';

export default function WelcomeLanding({ onCreateLinktree, onOpenQR, onRequestUnlock }) {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-8 bg-[#090d16] text-white">
      
      {/* Central Hero Card */}
      <div className="w-full max-w-2xl bg-[#0f1422]/90 border border-slate-800/90 rounded-[32px] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-8 my-auto">
        
        {/* Animated Brand Icon */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-glow" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-slate-950 rounded-2xl border border-slate-700/80 flex items-center justify-center shadow-2xl">
              <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-outfit tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Welcome to OpenSource Linktree
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
            Create your custom digital bio card, add social links, showcase portfolio projects, and generate high-res QR codes — 100% free and open source.
          </p>
        </div>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onCreateLinktree}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Sliders className="w-4 h-4" />
            <span>+ Create Your Linktree</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenQR}
            className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>Show QR Code</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 text-left">
          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bio Cards & Social Links</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Add custom links, avatar, bio, theme styles & portfolio projects.
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-300">
              <QrCode className="w-3.5 h-3.5 text-purple-400" />
              <span>QR Generator & Sharing</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Generate crisp, instant PNG QR codes & shareable links.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
