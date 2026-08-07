import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { 
  Globe, 
  Download, 
  Network, 
  Sparkles, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import { getProfileUrl } from '../../utils/url';

export default function DashboardQRCard({ profileData, onUpdateQR }) {
  const canvasRef = useRef(null);
  const { profile = {}, qrConfig = {} } = profileData || {};
  
  const [format, setFormat] = useState('PNG');
  const [isDynamic, setIsDynamic] = useState(true);
  const [fgColor, setFgColor] = useState(qrConfig.fgColor || '#06b6d4');
  const [bgColor, setBgColor] = useState(qrConfig.bgColor || '#0d0f1d');

  const targetUrl = getProfileUrl(profile) || `https://opensourcelinktree.com/${profile.username || 'sarahjenkins'}`;

  // Render QR Canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      QRCode.toCanvas(
        canvasRef.current,
        targetUrl,
        {
          width: 210,
          margin: 1,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: 'H',
        },
        (err) => {
          if (err) console.error("Dashboard QR error:", err);
        }
      );
    } catch (e) {
      console.error("QR canvas rendering exception:", e);
    }
  }, [targetUrl, fgColor, bgColor]);

  const handleFgChange = (color) => {
    setFgColor(color);
    onUpdateQR?.({ ...qrConfig, fgColor: color, bgColor });
  };

  const handleBgChange = (color) => {
    setBgColor(color);
    onUpdateQR?.({ ...qrConfig, fgColor, bgColor: color });
  };

  const handleDownload = () => {
    if (format === 'SVG') {
      QRCode.toString(targetUrl, {
        type: 'svg',
        color: { dark: fgColor, light: bgColor }
      }, (err, string) => {
        if (!err && string) {
          const blob = new Blob([string], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${profile.username || 'linktree'}_qrcode.svg`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } else {
      if (!canvasRef.current) return;
      const image = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${profile.username || 'linktree'}_qrcode.png`;
      link.click();
    }
  };

  return (
    <div className="w-full bg-[#0c0d20]/95 border border-slate-800/90 rounded-[28px] p-5 sm:p-7 backdrop-blur-2xl shadow-2xl flex flex-col justify-between space-y-6">
      
      {/* Card Header: Title & Dynamic Switch */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-white font-outfit tracking-tight">
          High-Res QR Code Generator
        </h2>

        {/* Dynamic QR Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-purple-400 text-xs font-semibold">
            <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Dynamic QR</span>
          </div>
          <button
            type="button"
            onClick={() => setIsDynamic(!isDynamic)}
            className={`w-11 h-6 rounded-full p-1 transition-all duration-300 ${
              isDynamic 
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]' 
                : 'bg-slate-800'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              isDynamic ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Middle QR Container & Controls Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* QR Code Canvas Frame (Left Side of Card) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center space-y-3">
          <div className="relative group">
            {/* Glowing outer halo */}
            <div className="absolute -inset-2 rounded-[30px] bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 opacity-70 blur-lg group-hover:opacity-100 transition duration-500" />
            
            <div className="relative qr-glow-frame flex flex-col items-center justify-center p-4">
              <canvas ref={canvasRef} className="rounded-xl shadow-2xl" />
              
              {/* Center Logo Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-[#0d0f1d] border border-cyan-400/60 p-1 flex items-center justify-center shadow-lg">
                  <Network className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* URL Caption */}
          <span className="text-[11px] font-mono text-slate-400 tracking-tight truncate max-w-xs text-center">
            {targetUrl}
          </span>
        </div>

        {/* Customization Options (Right Side of Card) */}
        <div className="md:col-span-5 space-y-4 text-left">
          
          {/* Style Option */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Style</label>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-400 font-medium">Logo</span>
              <button 
                type="button"
                className="w-10 h-10 rounded-xl bg-[#14162e] border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform"
              >
                <Network className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Color Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Colors</label>
            
            {/* Foreground Color */}
            <div className="flex items-center justify-between bg-[#13152c] p-2 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Foreground</span>
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => handleFgChange(e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-10"
                />
                <div className="w-full h-full" style={{ backgroundColor: fgColor }} />
              </div>
            </div>

            {/* Background Color */}
            <div className="flex items-center justify-between bg-[#13152c] p-2 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Background</span>
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-700">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => handleBgChange(e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-10"
                />
                <div className="w-full h-full" style={{ backgroundColor: bgColor }} />
              </div>
            </div>
          </div>

          {/* Export Format Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Format</label>
            <div className="grid grid-cols-3 gap-2">
              {['SVG', 'PNG', 'EPS'].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    format === fmt
                      ? 'bg-purple-600/40 text-purple-200 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      : 'bg-[#13152c] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Generate & Download Button */}
      <button
        onClick={handleDownload}
        className="w-full py-3.5 px-6 neon-btn-primary text-white text-sm font-extrabold rounded-2xl flex items-center justify-center space-x-2 tracking-wide cursor-pointer transition-transform active:scale-98"
      >
        <Download className="w-4 h-4 text-white" />
        <span>Generate & Download</span>
      </button>

    </div>
  );
}
