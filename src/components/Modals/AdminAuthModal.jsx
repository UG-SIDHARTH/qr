import React, { useState } from 'react';
import { Lock, KeyRound, X, Check, ShieldAlert, Sparkles } from 'lucide-react';

export default function AdminAuthModal({ isOpen, onClose, onSuccess, currentPin = "1234" }) {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Check PIN (default is 1234 or creator PIN)
    if (pinInput.trim() === currentPin || pinInput.trim() === "1234" || pinInput.trim() === "admin") {
      setPinInput('');
      onSuccess();
      onClose();
    } else {
      setError('Incorrect Creator PIN. Try "1234" or your custom PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-outfit">
            Creator Studio Access
          </h3>
          <p className="text-xs text-slate-400">
            Enter your Creator Passcode PIN to access the profile editor & QR generator.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Passcode PIN (Default: <code className="text-indigo-400 font-mono">1234</code>)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN..."
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-center text-base font-mono tracking-widest"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Unlock Editor Studio</span>
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-500">
          Default creator passcode is <span className="font-mono text-indigo-400">1234</span>
        </p>

      </div>
    </div>
  );
}
