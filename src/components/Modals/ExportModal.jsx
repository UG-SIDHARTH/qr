import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, FileJson, AlertCircle } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, profileData, onImport }) {
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const currentJson = JSON.stringify(profileData, null, 2);

  const handleDownloadJSON = () => {
    const blob = new Blob([currentJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profileData.profile.username || 'profile'}_backup.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImportSubmit = () => {
    try {
      setError('');
      setSuccess('');
      if (!jsonText.trim()) {
        setError('Please paste JSON data first.');
        return;
      }
      const parsed = JSON.parse(jsonText);
      if (!parsed.profile || !parsed.socials) {
        setError('Invalid JSON structure. Must include profile and socials fields.');
        return;
      }
      onImport(parsed);
      setSuccess('Profile data imported successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1200);
    } catch (e) {
      setError('Invalid JSON format: ' + e.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <FileJson className="w-5 h-5 text-indigo-400" />
            Export & Import Profile Data
          </h3>
          <p className="text-xs text-slate-400">
            Save a backup JSON file or restore your saved profile customizations.
          </p>
        </div>

        {/* Export Section */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-slate-200">Export Backup</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadJSON}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON File</span>
            </button>

            <button
              onClick={handleCopyJSON}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center space-x-1.5 border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Raw JSON"}</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-200">Import Profile JSON</label>
            <label className="text-xs font-medium text-indigo-400 hover:underline cursor-pointer flex items-center gap-1">
              <Upload className="w-3 h-3" />
              <span>Upload .json File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            rows={4}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder="Paste JSON profile data here..."
            className="w-full p-3 glass-input rounded-xl text-xs font-mono resize-none"
          />

          {error && (
            <div className="p-2.5 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            onClick={handleImportSubmit}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-xl flex items-center justify-center space-x-1.5 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Apply Imported Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
}
