import React from 'react';
import { QrCode, Sliders, Sparkles, ArrowRight, Network } from 'lucide-react';

export default function WelcomeLanding({ onCreateLinktree, onOpenQR }) {
  return (
    <div className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-4 sm:p-8 bg-[#050611] text-white overflow-hidden selection:bg-purple-500 selection:text-white">

      
      {/* Background Spatial Atmosphere: Slow-Moving Out-of-Focus Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Spatial Grid & Cosmic Dust Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      {/* Main Levitating Spatial Stack Container */}
      <div className="relative z-10 w-full max-w-3xl my-auto py-8">
        
        {/* Layer 3: Backmost Levitating Glass Sheet (Deep Parallax Layer) */}
        <div className="absolute -inset-4 rounded-[44px] bg-gradient-to-tr from-purple-900/20 via-indigo-900/10 to-cyan-900/20 border border-white/5 backdrop-blur-md transform -rotate-2 scale-98 pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.6)]" />

        {/* Layer 2: Middle Levitating Glass Sheet */}
        <div className="absolute -inset-2 rounded-[40px] bg-[#0c0e25]/40 border border-white/10 border-t-white/20 backdrop-blur-xl transform rotate-1 scale-99 pointer-events-none shadow-[0_25px_60px_rgba(0,0,0,0.7)]" />

        {/* Layer 1: Front Central Antigravity Hero Card */}
        <div className="relative w-full bg-[#0a0c20]/75 border border-white/15 border-t-white/30 rounded-[36px] p-6 sm:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(168,85,247,0.2)] backdrop-blur-2xl text-center space-y-9">
          
          {/* 3D Holographic Floating Hero Icon */}
          <div className="flex justify-center -mt-2">
            <div className="relative group cursor-pointer animate-float">
              {/* Outer Diffused Light Aura Casting Down */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-cyan-400 to-pink-500 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition duration-700 animate-pulse" />
              
              {/* Holographic Glowing 3D Glass Badge */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#0a0c1e]/90 rounded-3xl border-2 border-cyan-400/80 p-1 shadow-[0_0_35px_rgba(34,211,238,0.5),inset_0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center backdrop-blur-xl transform group-hover:scale-105 transition-all">
                <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                
                {/* Micro Node Overlay */}
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.9)] animate-ping" />
              </div>
            </div>
          </div>

          {/* Title & Spatial Description */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-outfit tracking-tight text-white leading-tight">
              Welcome to OpenSource <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">Linktree</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-xl mx-auto font-normal">
              Create your custom digital bio card, add social links, showcase portfolio projects, and generate high-res QR codes — 100% free and open source.
            </p>
          </div>

          {/* Main Levitating CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            
            {/* Primary Button (+ Create Your Linktree) */}
            <button
              onClick={onCreateLinktree}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.6)] border border-purple-300/40 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(168,85,247,0.85)] active:scale-95 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-purple-200" />
              <span>+ Create Your Linktree</span>
              <ArrowRight className="w-4 h-4 text-cyan-300" />
            </button>

            {/* Secondary Glass Button (Show QR Code) */}
            <button
              onClick={onOpenQR}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/30 hover:border-cyan-400/80 backdrop-blur-md flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Show QR Code</span>
            </button>

          </div>

          {/* Bottom Floating Glass Feature Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-left">
            
            {/* Tile 1: Bio Cards & Social Links */}
            <div className="p-4 bg-[#0e1028]/70 border border-white/10 border-t-white/25 rounded-2xl space-y-1.5 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-purple-500/50 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center space-x-2 text-xs font-bold text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Bio Cards & Social Links</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Add custom links, avatar, bio, theme styles & portfolio projects.
              </p>
            </div>

            {/* Tile 2: QR Generator & Sharing */}
            <div className="p-4 bg-[#0e1028]/70 border border-white/10 border-t-white/25 rounded-2xl space-y-1.5 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-cyan-400/50 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center space-x-2 text-xs font-bold text-cyan-300">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>QR Generator & Sharing</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Generate crisp, instant PNG QR codes & shareable links.
              </p>
            </div>

          </div>

          {/* Copyright Footer */}
          <div className="pt-2 text-center">
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              © UG_SIDHARTH
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
