import React from 'react';
import BioPage from './BioPage';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function PhoneMockup({ profileData, onOpenQR }) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-center justify-center p-2 sm:p-6 w-full h-full">
      
      {/* Phone Shell */}
      <div className="relative w-full max-w-[380px] h-[720px] bg-slate-900 rounded-[48px] phone-frame border-4 border-slate-700 overflow-hidden flex flex-col shadow-2xl">
        
        {/* Phone Notch & Status Bar */}
        <div className="w-full bg-slate-950 px-7 pt-3 pb-2 flex items-center justify-between z-30 select-none border-b border-white/5">
          <span className="text-xs font-semibold text-slate-300 font-mono">
            {currentTime}
          </span>

          {/* Speaker Notch */}
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
            <div className="w-8 h-1 bg-slate-700 rounded-full" />
          </div>

          <div className="flex items-center space-x-1.5 text-slate-400">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <BioPage 
            profileData={profileData} 
            onOpenQR={onOpenQR} 
            isFullView={false} 
          />
        </div>

        {/* Home Indicator Bar */}
        <div className="w-full bg-slate-950 py-2 flex justify-center z-30 border-t border-white/5">
          <div className="w-32 h-1 bg-slate-700 rounded-full" />
        </div>

      </div>

    </div>
  );
}
