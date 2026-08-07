import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Palette, 
  Sparkles, 
  Type, 
  PhoneCall, 
  Globe, 
  UserCheck, 
  Copy, 
  Check,
  Share2
} from 'lucide-react';
import { generateVCard } from '../../utils/vcard';
import { getProfileUrl } from '../../utils/url';

export default function QRCodeTab({ qrConfig, onChange, profile, socials }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  const handleUpdate = (field, value) => {
    onChange({
      ...qrConfig,
      [field]: value,
    });
  };

  // Target content to encode based on mode
  const getEncodedContent = () => {
    if (qrConfig?.mode === 'vcard') {
      const vcard = generateVCard(profile, socials);
      if (vcard) return vcard;
    }
    const url = getProfileUrl({ profile, socials, qrConfig });
    return url || `${window.location.origin}${window.location.pathname}#profile`;
  };

  const encodedData = getEncodedContent();

  // Render QR Code onto Canvas whenever config changes
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      QRCode.toCanvas(
        canvasRef.current,
        encodedData || `${window.location.origin}#profile`,
        {
          width: 260,
          margin: 2,
          color: {
            dark: qrConfig?.fgColor || '#a855f7',
            light: qrConfig?.bgColor || '#090d16',
          },
          errorCorrectionLevel: qrConfig?.errorCorrectionLevel || 'M',
        },
        (err) => {
          if (err) {
            console.error("QR Code Render Warning:", err);
            // Fallback retry with basic error correction level
            QRCode.toCanvas(
              canvasRef.current,
              encodedData || `${window.location.origin}#profile`,
              { width: 260, margin: 2, errorCorrectionLevel: 'L' }
            ).catch(() => {});
          }
        }
      );
    } catch (e) {
      console.error("QR Canvas exception:", e);
    }
  }, [qrConfig, encodedData]);

  // Download PNG
  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const image = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${profile.username || 'linktree'}_qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download SVG
  const handleDownloadSVG = () => {
    QRCode.toString(
      encodedData,
      {
        type: 'svg',
        color: {
          dark: qrConfig.fgColor || '#a855f7',
          light: qrConfig.bgColor || '#090d16',
        },
        errorCorrectionLevel: qrConfig.errorCorrectionLevel || 'H',
      },
      (err, string) => {
        if (err) return;
        const blob = new Blob([string], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${profile.username || 'linktree'}_qrcode.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    );
  };

  const handleCopyQR = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob && navigator.clipboard) {
        navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <QrCode className="w-4 h-4 text-purple-400" />
          QR Code Generator & Frame Studio
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Customize colors, CTA frame, encoding mode (Linktree Web Page vs Mobile Contact vCard), and download in PNG/SVG.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Customization Controls */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Mode Selector */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-200">QR Encoding Target Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleUpdate('mode', 'url')}
                className={`p-3 rounded-xl border text-left flex items-start space-x-2.5 transition-all ${
                  qrConfig.mode === 'url'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-4 h-4 text-purple-400 mt-0.5" />
                <div>
                  <span className="block text-xs font-semibold">Linktree Bio Page</span>
                  <span className="text-[10px] opacity-75">Scans to open your clean Linktree page</span>
                </div>
              </button>

              <button
                onClick={() => handleUpdate('mode', 'vcard')}
                className={`p-3 rounded-xl border text-left flex items-start space-x-2.5 transition-all ${
                  qrConfig.mode === 'vcard'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4 text-purple-400 mt-0.5" />
                <div>
                  <span className="block text-xs font-semibold">vCard Phone Contact</span>
                  <span className="text-[10px] opacity-75">Scans to save name, phone & email</span>
                </div>
              </button>
            </div>
          </div>

          {/* Color Wheel Customizer */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-200">QR Color Wheel Palette</label>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-slate-400 mb-1.5">Foreground Color</span>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full p-0.5 bg-[conic-gradient(at_center,_red,_yellow,_lime,_cyan,_blue,_magenta,_red)] cursor-pointer shadow-md hover:scale-105 transition-transform flex items-center justify-center">
                      <input
                        type="color"
                        value={qrConfig.fgColor || '#a855f7'}
                        onChange={(e) => handleUpdate('fgColor', e.target.value)}
                        className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-10"
                      />
                      <div 
                        className="w-5 h-5 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: qrConfig.fgColor || '#a855f7' }}
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={qrConfig.fgColor || '#a855f7'}
                    onChange={(e) => handleUpdate('fgColor', e.target.value)}
                    className="w-full px-2.5 py-1.5 glass-input rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs text-slate-400 mb-1.5">Background Color</span>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full p-0.5 bg-[conic-gradient(at_center,_red,_yellow,_lime,_cyan,_blue,_magenta,_red)] cursor-pointer shadow-md hover:scale-105 transition-transform flex items-center justify-center">
                      <input
                        type="color"
                        value={qrConfig.bgColor || '#090d16'}
                        onChange={(e) => handleUpdate('bgColor', e.target.value)}
                        className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-10"
                      />
                      <div 
                        className="w-5 h-5 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: qrConfig.bgColor || '#090d16' }}
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={qrConfig.bgColor || '#090d16'}
                    onChange={(e) => handleUpdate('bgColor', e.target.value)}
                    className="w-full px-2.5 py-1.5 glass-input rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Frame Call to Action Text */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-200">Frame Call-To-Action (CTA)</label>
            <input
              type="text"
              value={qrConfig.frameText || ''}
              onChange={(e) => handleUpdate('frameText', e.target.value)}
              placeholder="e.g. SCAN TO CONNECT WITH ME"
              className="w-full px-3 py-2 glass-input rounded-xl text-xs uppercase font-medium tracking-wider"
            />
          </div>

          {/* Center Logo Option */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Center Icon Overlay</span>
              <button
                type="button"
                onClick={() => handleUpdate('includeLogo', !qrConfig.includeLogo)}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${
                  qrConfig.includeLogo ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  qrConfig.includeLogo ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {qrConfig.includeLogo && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  maxLength={2}
                  value={qrConfig.logoText || '⚡'}
                  onChange={(e) => handleUpdate('logoText', e.target.value)}
                  placeholder="Emoji or 1-2 chars..."
                  className="w-24 px-3 py-1.5 glass-input rounded-xl text-center text-sm"
                />
                <span className="text-[11px] text-slate-400">
                  Emoji or initials shown in center of QR
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Right: Live Canvas Preview & Export */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-4">
          
          {/* Framed QR Code Render Box */}
          <div 
            className="p-5 rounded-3xl flex flex-col items-center justify-center shadow-2xl border transition-all"
            style={{ 
              backgroundColor: qrConfig.bgColor || '#090d16',
              borderColor: qrConfig.fgColor + '40'
            }}
          >
            <div className="relative p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
              <canvas ref={canvasRef} className="rounded-xl" />
              
              {/* Center Logo Overlay */}
              {qrConfig.includeLogo && (
                <div 
                  className="absolute inset-0 m-auto w-10 h-10 rounded-xl bg-slate-950 border-2 flex items-center justify-center text-sm shadow-xl"
                  style={{ borderColor: qrConfig.fgColor }}
                >
                  {qrConfig.logoText || '⚡'}
                </div>
              )}
            </div>

            {/* Frame Text Banner */}
            {qrConfig.frameText && (
              <div className="mt-4 px-4 py-1.5 bg-indigo-600 text-white font-outfit text-xs font-bold rounded-xl tracking-wider uppercase text-center shadow-md">
                {qrConfig.frameText}
              </div>
            )}
          </div>

          {/* Export Action Buttons */}
          <div className="w-full space-y-2">
            <button
              onClick={handleDownloadPNG}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG Image</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadSVG}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center space-x-1.5 border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Vector SVG</span>
              </button>

              <button
                onClick={handleCopyQR}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center space-x-1.5 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Image"}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
