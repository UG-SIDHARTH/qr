import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Bell, 
  Link, 
  Settings, 
  LogOut, 
  Sparkles,
  QrCode
} from 'lucide-react';

export default function SidebarNav({ onSelectView, onRequestUnlock, isUnlocked }) {
  const [activeItem, setActiveItem] = useState('home');

  const SIDEBAR_ITEMS = [
    { id: 'home', label: 'Home', icon: Home, action: () => onSelectView('editor') },
    { id: 'users', label: 'Community & Directory', icon: Users, action: () => onSelectView('bulk') },
    { id: 'notifications', label: 'Notifications', icon: Bell, action: () => {} },
    { id: 'links', label: 'Links & QR Studio', icon: Link, action: () => onSelectView('editor') },
    { id: 'settings', label: 'Settings', icon: Settings, action: () => onRequestUnlock() },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between items-center w-16 xl:w-20 bg-[#070815]/95 border-r border-slate-800/80 py-6 min-h-[calc(100vh-4rem)] flex-shrink-0 z-40 select-none">
      
      {/* Top Icon Group */}
      <div className="flex flex-col items-center space-y-5">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                item.action();
              }}
              title={item.label}
              className={`relative group p-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-br from-purple-600/30 via-indigo-600/30 to-cyan-500/20 text-purple-300 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-l-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Exit / Logout Icon */}
      <div className="flex flex-col items-center">
        <button
          onClick={onRequestUnlock}
          title={isUnlocked ? "Account Active" : "Log In / Sign Up"}
          className="p-3 rounded-2xl text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform text-slate-400" />
        </button>
      </div>

    </aside>
  );
}
