import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Check, Copy, ExternalLink, Sparkles, QrCode, Download } from 'lucide-react';
import { getProfileUrl } from '../../utils/url';

export default function PublishSuccessModal({ isOpen, onClose, profileData, onViewLive }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const { profile, qrConfig = {} } = profileData || {};

  const profileUrl = getProfileUrl(profileData);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      profileUrl,
      {
        width: 180,
        margin: 2,
        color: {
          dark: qrConfig.fgColor || '#a855f7',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      },
      (err) => {
        if (err) console.error("Publish QR Error:", err);
      }
    );
  }, [isOpen, profileUrl, qrConfig]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const image = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${profile?.username || 'linktree'}_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Badge */}
        <div className="space-y-2 pt-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-0.5 shadow-xl shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-bold font-outfit text-white pt-1">
            Your Linktree is Published & Live!
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Congratulations! Your digital bio card and custom QR code are generated and ready to share.
          </p>
        </div>

        {/* QR Code & URL Box */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center space-y-3 shadow-inner">
          <div className="p-2 bg-white rounded-xl shadow-lg">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          <div className="w-full space-y-1">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
              Your Public Linktree URL
            </span>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between font-mono text-xs text-slate-200">
              <span className="truncate max-w-[260px]">{profileUrl}</span>
              <button
                onClick={handleCopyLink}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all ml-2 flex-shrink-0"
                title="Copy Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => {
              onClose();
              if (onViewLive) onViewLive();
            }}
            className="py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-1.5 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Live Profile</span>
          </button>

          <button
            onClick={handleDownloadQR}
            className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download QR</span>
          </button>
        </div>

      </div>
    </div>
  );
}
