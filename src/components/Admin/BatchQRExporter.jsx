import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Sparkles } from 'lucide-react';

function SingleMemberQRCard({ member }) {
  const canvasRef = useRef(null);
  const { profile, qrConfig } = member;
  const profileUrl = profile?.username 
    ? `${window.location.origin}${window.location.pathname}#${profile.username}`
    : `${window.location.origin}${window.location.pathname}#user=${member.id}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(
      canvasRef.current,
      profileUrl,
      {
        width: 140,
        margin: 1,
        color: {
          dark: qrConfig.fgColor || '#a855f7',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      },
      (err) => {
        if (err) console.error("Batch Canvas Error:", err);
      }
    );
  }, [member, profileUrl]);

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-between text-center shadow-lg hover:border-indigo-500/50 transition-all">
      <div className="flex items-center space-x-2 mb-2">
        <img 
          src={profile.avatar} 
          alt={profile.name}
          className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400";
          }}
        />
        <div className="text-left min-w-0">
          <h4 className="text-xs font-bold text-white truncate max-w-[120px]">{profile.name}</h4>
          <span className="text-[10px] text-indigo-400 font-mono block">{member.employeeId}</span>
        </div>
      </div>

      <div className="p-2 bg-white rounded-xl shadow border border-slate-700">
        <canvas ref={canvasRef} />
      </div>

      <p className="mt-2 text-[10px] text-slate-400 truncate max-w-[140px]">
        {profile.title}
      </p>

      <span className="mt-1 px-2 py-0.5 text-[9px] font-semibold bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20">
        {member.department || 'General'}
      </span>
    </div>
  );
}

export default function BatchQRExporter({ selectedMembers, onClose }) {
  if (!selectedMembers || selectedMembers.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Batch QR Code Cards & Badges ({selectedMembers.length} Members)
            </h3>
            <p className="text-xs text-slate-400">
              Printable multi-card layout for badges, ID cards, or bulk PNG exporting.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs rounded-xl flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Badge Sheet</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Members Grid */}
        <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {selectedMembers.map((member) => (
            <SingleMemberQRCard key={member.id} member={member} />
          ))}
        </div>

        <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800">
          Showing {selectedMembers.length} member QR cards ready for scanning or printing.
        </div>

      </div>
    </div>
  );
}
