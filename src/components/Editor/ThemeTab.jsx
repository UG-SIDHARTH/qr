import React from 'react';
import { Palette, Sparkles, Layout, Type, CircleDot } from 'lucide-react';
import { THEME_PRESETS } from '../../data/defaultProfile';

export default function ThemeTab({ theme = {}, onChange }) {
  const currentTheme = {
    id: 'midnight-glass',
    name: 'Midnight Glass',
    bgStyle: 'bg-preset-midnight',
    cardStyle: 'glass-card',
    accentColor: '#6366f1',
    buttonRadius: 'rounded-2xl',
    fontFamily: 'font-sans',
    buttonGlow: true,
    ...theme,
  };

  const handleSelectPreset = (preset) => {
    onChange({
      ...currentTheme,
      id: preset.id,
      name: preset.name,
      bgStyle: preset.bgStyle,
      cardStyle: preset.cardStyle,
      accentColor: preset.accentColor,
      buttonRadius: preset.buttonRadius,
    });
  };

  const handleUpdate = (field, value) => {
    onChange({
      ...currentTheme,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-pink-400" />
          Theme & Aesthetic Styling Studio
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Customize your page background, color palette, button shapes, and glassmorphism.
        </p>
      </div>

      {/* Theme Presets */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-300">Curated Theme Presets</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {THEME_PRESETS.map((preset) => {
            const isSelected = theme.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className={`w-full h-12 rounded-xl bg-gradient-to-br ${preset.previewColor} border border-white/10 mb-2 flex items-center justify-center`}>
                  <div
                    className="w-4 h-4 rounded-full shadow"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                </div>
                <span className="block text-xs font-semibold text-slate-200">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Button Style Customizer */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
          <Layout className="w-3.5 h-3.5 text-indigo-400" />
          Button & Card Corner Radius
        </h4>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Rounded', value: 'rounded-xl' },
            { label: 'Extra Rounded', value: 'rounded-2xl' },
            { label: 'Pill Shape', value: 'rounded-full' },
          ].map((radius) => (
            <button
              key={radius.value}
              onClick={() => handleUpdate('buttonRadius', radius.value)}
              className={`py-2 px-3 text-xs font-medium border transition-all ${
                currentTheme.buttonRadius === radius.value
                  ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
              } ${radius.value}`}
            >
              {radius.label}
            </button>
          ))}
        </div>

        {/* Custom Accent Color */}
        <div className="pt-2 border-t border-slate-800">
          <label className="block text-xs font-medium text-slate-300 mb-2">Custom Accent Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={currentTheme.accentColor || '#6366f1'}
              onChange={(e) => handleUpdate('accentColor', e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={currentTheme.accentColor || '#6366f1'}
              onChange={(e) => handleUpdate('accentColor', e.target.value)}
              className="flex-1 px-3 py-2 glass-input rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        {/* Button Glow Toggle */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-slate-200">Button Hover Glow Effect</span>
          </div>
          <button
            type="button"
            onClick={() => handleUpdate('buttonGlow', !currentTheme.buttonGlow)}
            className={`w-10 h-6 rounded-full p-1 transition-colors ${
              currentTheme.buttonGlow ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              currentTheme.buttonGlow ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </button>
        </div>

      </div>
    </div>
  );
}
