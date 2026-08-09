import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, QrCode, UserPlus } from 'lucide-react';
import { downloadVCard, generateVCard } from '../../utils/vcard';
import { getProfileUrl, getShortProfileUrl } from '../../utils/url';

export default function QRModal({ isOpen, onClose, profileData }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = React.useState(false);
  const { profile, socials, qrConfig } = profileData;

  const encodedData = (qrConfig?.mode === 'vcard') 
    ? (generateVCard(profile, socials) || getShortProfileUrl(profileData))
    : getShortProfileUrl(profileData);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    try {
      QRCode.toCanvas(
        canvasRef.current,
        encodedData || `${window.location.origin}#profile`,
        {
          width: 180,
          margin: 2,
          color: {
            dark: qrConfig?.fgColor || '#a855f7',
            light: qrConfig?.bgColor || '#090d16',
          },
          errorCorrectionLevel: qrConfig?.errorCorrectionLevel || 'M',
        },
        (err) => {
          if (err) {
            console.error("QR Modal Render Warning:", err);
            QRCode.toCanvas(
              canvasRef.current,
              encodedData || `${window.location.origin}#profile`,
              { width: 180, margin: 2, errorCorrectionLevel: 'L' }
            ).catch(() => {});
          }
        }
      );
    } catch (e) {
      console.error("QR Modal exception:", e);
    }
  }, [isOpen, qrConfig, encodedData]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const image = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${profile.username || 'linktree'}_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-[310px] bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3.5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Title */}
        <div className="text-center space-y-0.5 pt-1">
          <div className="w-8 h-8 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-1">
            <QrCode className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white font-outfit">
            Scan QR Code
          </h3>
          <p className="text-[11px] text-slate-400">
            {qrConfig.mode === 'vcard' ? 'Scan to add contact' : 'Scan to open bio page'}
          </p>
        </div>

        {/* Canvas Render Box */}
        <div 
          className="p-3 rounded-xl flex flex-col items-center justify-center border shadow-inner"
          style={{ 
            backgroundColor: qrConfig.bgColor || '#090d16',
            borderColor: qrConfig.fgColor + '30'
          }}
        >
          <div className="relative p-1.5 bg-white/5 rounded-lg border border-white/10">
            <canvas ref={canvasRef} className="rounded-md" />
            {qrConfig.includeLogo && (
              <div 
                className="absolute inset-0 m-auto w-7 h-7 rounded-lg bg-slate-950 border-2 flex items-center justify-center text-[10px] shadow-xl"
                style={{ borderColor: qrConfig.fgColor || '#a855f7' }}
              >
                {qrConfig.logoText || '⚡'}
              </div>
            )}
          </div>

          {qrConfig.frameText && (
            <p className="mt-2 text-[10px] font-bold text-indigo-400 tracking-wider uppercase text-center">
              {qrConfig.frameText}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            onClick={handleDownload}
            className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg flex items-center justify-center space-x-1 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </button>

          <button
            onClick={handleCopy}
            className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center justify-center space-x-1 border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
