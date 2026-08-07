import React, { useState } from 'react';
import { 
  User, 
  AtSign, 
  Briefcase, 
  MapPin, 
  Mail, 
  Phone, 
  FileText, 
  BadgeCheck, 
  Image, 
  Sparkles,
  Upload,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ProfileTab({ profile = {}, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const p = profile || {};
  const handleChange = (field, value) => {
    onChange({
      ...p,
      [field]: value
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 96;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          handleChange('avatar', compressed);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          Personal Bio & Information
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Customize your display name, headshot, headline bio, contact details, and status.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
        <label className="block text-xs font-medium text-slate-300">Profile Picture / Avatar</label>
        <div className="flex items-center space-x-4">
          <div className="relative group w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-indigo-500/30 flex-shrink-0">
            {p.avatar ? (
              <img 
                src={p.avatar} 
                alt="Avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={p.avatar || ''}
              onChange={(e) => handleChange('avatar', e.target.value)}
              placeholder="Paste Image URL..."
              className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
            />
            <div className="flex items-center space-x-2">
              <label className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer border border-slate-700 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Local File</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload}
                  className="hidden" 
                />
              </label>
              <span className="text-[10px] text-slate-500">PNG, JPG or WebP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={p.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Sidharth Kumar"
              className="w-full pl-9 pr-3 py-2 glass-input rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Username / Handle */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Username / Handle</label>
          <div className="relative">
            <AtSign className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={p.username || ''}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="e.g. sidharth_dev"
              className="w-full pl-9 pr-3 py-2 glass-input rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Professional Title */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1">Headline Title / Profession</label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={p.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Full Stack Developer & UI/UX Designer"
              className="w-full pl-9 pr-3 py-2 glass-input rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Short Bio */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1">Short Bio</label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <textarea
              rows={3}
              value={p.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Write a brief intro about yourself..."
              className="w-full pl-9 pr-3 py-2 glass-input rounded-xl text-sm resize-none"
            />
          </div>
        </div>

        {/* Status Text / Announcement */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1">Status Banner / Availability</label>
          <div className="relative">
            <Sparkles className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={p.statusText || ''}
              onChange={(e) => handleChange('statusText', e.target.value)}
              placeholder="e.g. 🚀 Open for Full-Time Roles & Freelance"
              className="w-full pl-9 pr-3 py-2 glass-input rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Email Address (for Contact vCard)</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="email"
              value={p.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="sidharth@example.com"
              className="w-full pl-9 pr-3 py-2 glass-input rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (for Contact vCard)</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={p.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-9 pr-3 py-2 glass-input rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Location / City</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={p.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Bangalore, India"
              className="w-full pl-9 pr-3 py-2 glass-input rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Account Security Password */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Account Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-indigo-400 absolute left-3 top-2.5" />
            <input
              type={showPassword ? "text" : "password"}
              value={p.adminPin || ''}
              onChange={(e) => handleChange('adminPin', e.target.value)}
              placeholder="Account password..."
              className="w-full pl-9 pr-10 py-2 glass-input rounded-xl text-sm font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Verified Badge Toggle */}
        <div className="md:col-span-2 flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <BadgeCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium text-slate-200">Show Verified Blue Checkmark</span>
          </div>
          <button
            type="button"
            onClick={() => handleChange('verified', !p.verified)}
            className={`w-10 h-6 rounded-full p-1 transition-colors ${
              p.verified ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              p.verified ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </button>
        </div>

      </div>
    </div>
  );
}
