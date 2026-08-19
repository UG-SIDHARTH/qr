import React from 'react';
import { QrCode, Sliders, Sparkles, ArrowRight, Network } from 'lucide-react';

export default function WelcomeLanding({ onCreateLinktree, onOpenQR }) {
  return (
    <div className="relative w-full min-h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center p-4 sm:p-8 bg-[#060713] text-white overflow-hidden select-none">
      
      {/* Background Spatial Orbs (Slow Moving Atmospheric Glows) */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-purple-600/25 rounded-full blur-[120px] pointer-events-none animate-orb-1" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none animate-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Central Floating Antigravity Hero Card */}
      <div className="relative z-10 w-full max-w-2xl antigravity-card rounded-[38px] p-6 sm:p-12 text-center space-y-9 my-auto transition-all">
        
        {/* 3D Holographic Floating Hero Icon (Antigravity Levitation) */}
        <div className="flex justify-center">
          <div className="relative group animate-antigravity cursor-pointer">
            {/* Diffused Light Aura */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
            
            {/* Holographic 3D Glass Box */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#0a0c20]/90 rounded-3xl border-t border-white/40 border-x border-white/20 border-b border-white/10 flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
              <Network className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            </div>
          </div>
        </div>

        {/* Title & Tagline with Luminous Liquid Gradient */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-outfit tracking-tight text-white leading-tight">
            Welcome to OpenSource{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              Linktree
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto font-medium">
            Create your custom digital bio card, add social links, showcase portfolio projects, and generate high-res QR codes — 100% free and open source.
          </p>
        </div>

        {/* Main Action Buttons (Tactile Floating CTAs) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          
          {/* Primary High-Energy Purple Glowing Button */}
          <button
            onClick={onCreateLinktree}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_0_35px_rgba(168,85,247,0.6)] flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-1 active:scale-95 border border-purple-400/40 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-cyan-200" />
            <span>+ Create Your Linktree</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

        </div>

        {/* Bottom Floating Glass Feature Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10 text-left">
          
          <div className="p-4.5 antigravity-tile rounded-2xl space-y-1.5 cursor-pointer">
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Bio Cards & Social Links</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug font-normal">
              Add custom links, avatar, bio, theme styles & portfolio projects.
            </p>
          </div>

          <div className="p-4.5 antigravity-tile rounded-2xl space-y-1.5 cursor-pointer">
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-300">
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>QR Generator & Sharing</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug font-normal">
              Generate crisp, instant PNG QR codes & shareable links.
            </p>
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="pt-3 text-center">
          <p className="text-xs text-slate-400 font-medium">
            © UG_SIDHARTH
          </p>
        </div>

      </div>

    </div>
  );
}

