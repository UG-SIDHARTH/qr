import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProfileTab from './components/Editor/ProfileTab';
import SocialsTab from './components/Editor/SocialsTab';
import PortfolioTab from './components/Editor/PortfolioTab';
import ThemeTab from './components/Editor/ThemeTab';
import QRCodeTab from './components/Editor/QRCodeTab';
import PhoneMockup from './components/Preview/PhoneMockup';
import BioPage from './components/Preview/BioPage';
import QRModal from './components/Modals/QRModal';
import ExportModal from './components/Modals/ExportModal';
import AdminAuthModal from './components/Modals/AdminAuthModal';
import { DEFAULT_PROFILE, EMPTY_PROFILE } from './data/defaultProfile';
import { 
  User, 
  Share2, 
  FolderGit2, 
  Palette, 
  QrCode, 
  Smartphone, 
  Eye,
  Lock,
  Unlock,
  Sliders,
  Trash2
} from 'lucide-react';

const STORAGE_KEY = 'qr_linktree_profile_data_v1';

export default function App() {
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved profile data:", e);
      }
    }
    return DEFAULT_PROFILE;
  });

  const getInitialViewMode = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#editor' || hash === '#studio' || hash === '#admin') {
      return 'editor';
    }
    return 'preview';
  };

  const [activeTab, setActiveTab] = useState('profile');
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync hash with view mode & handle hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#editor' || hash === '#studio' || hash === '#admin') {
        if (!isUnlocked) {
          setIsAuthModalOpen(true);
        } else {
          setViewMode('editor');
        }
      } else {
        setViewMode('preview');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isUnlocked]);

  const handleRequestEditorAccess = () => {
    if (isUnlocked) {
      setViewMode('editor');
      window.history.replaceState(null, '', '#editor');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleSetViewMode = (mode) => {
    if (mode === 'editor' && !isUnlocked) {
      setIsAuthModalOpen(true);
    } else {
      setViewMode(mode);
      window.history.replaceState(null, '', mode === 'preview' ? '#bio' : '#editor');
    }
  };

  const handleAuthSuccess = () => {
    setIsUnlocked(true);
    setViewMode('editor');
    window.history.replaceState(null, '', '#editor');
  };

  // Auto-save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
  }, [profileData]);

  // Handlers
  const handleUpdateProfile = (newProfile) => {
    setProfileData(prev => ({ ...prev, profile: newProfile }));
  };

  const handleUpdateSocials = (newSocials) => {
    setProfileData(prev => ({ ...prev, socials: newSocials }));
  };

  const handleUpdatePortfolio = (newPortfolio) => {
    setProfileData(prev => ({ ...prev, portfolio: newPortfolio }));
  };

  const handleUpdateTheme = (newTheme) => {
    setProfileData(prev => ({ ...prev, theme: newTheme }));
  };

  const handleUpdateQR = (newQR) => {
    setProfileData(prev => ({ ...prev, qrConfig: newQR }));
  };

  // Wipe / Delete everything and start completely blank
  const handleClearAllData = () => {
    if (window.confirm("⚠️ Are you sure you want to DELETE ALL DATA?\nThis will erase all profile details, social links, portfolio cards, and custom themes.")) {
      localStorage.removeItem(STORAGE_KEY);
      setProfileData(EMPTY_PROFILE);
    }
  };

  const handleResetSample = () => {
    if (window.confirm("Reset back to initial sample demo data?")) {
      setProfileData(DEFAULT_PROFILE);
    }
  };

  const handleImport = (importedData) => {
    setProfileData(importedData);
  };

  const TABS = [
    { id: 'profile', label: 'Bio & Details', icon: User },
    { id: 'socials', label: 'Social Links', icon: Share2, count: profileData.socials.length },
    { id: 'portfolio', label: 'Portfolio Cards', icon: FolderGit2, count: profileData.portfolio?.length },
    { id: 'theme', label: 'Theme Studio', icon: Palette },
    { id: 'qr', label: 'QR Generator', icon: QrCode },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        viewMode={viewMode}
        setViewMode={handleSetViewMode}
        onOpenExport={() => setIsExportModalOpen(true)}
        onReset={handleClearAllData}
        onQuickQR={() => setIsQRModalOpen(true)}
        profile={profileData.profile}
        isUnlocked={isUnlocked}
        onRequestUnlock={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Layout */}
      {viewMode === 'preview' ? (
        // Standalone Full-screen Public Linktree View
        <main className="flex-1 w-full flex flex-col items-center justify-center relative">
          
          {/* Creator Studio Return Button (Only shown if unlocked) */}
          {isUnlocked && (
            <div className="fixed bottom-6 right-6 z-40">
              <button
                onClick={() => handleSetViewMode('editor')}
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-white font-medium text-xs rounded-full border border-slate-700 shadow-2xl backdrop-blur-xl flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95"
              >
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Return to Studio Editor</span>
              </button>
            </div>
          )}

          <BioPage 
            profileData={profileData} 
            onOpenQR={() => setIsQRModalOpen(true)} 
            isFullView={true} 
          />
        </main>
      ) : (
        // Studio & Editor Mode (Split Pane)
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Editor Dashboard */}
          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-6">
            
            {/* Header controls for clearing data */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Clear All Data Button */}
              <button
                onClick={handleClearAllData}
                className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-medium flex items-center space-x-1 transition-all flex-shrink-0"
                title="Wipe & Delete All Data"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Delete All</span>
              </button>
            </div>

            {/* Active Tab Panel */}
            <div className="min-h-[480px]">
              {activeTab === 'profile' && (
                <ProfileTab 
                  profile={profileData.profile} 
                  onChange={handleUpdateProfile} 
                />
              )}

              {activeTab === 'socials' && (
                <SocialsTab 
                  socials={profileData.socials} 
                  onChange={handleUpdateSocials} 
                />
              )}

              {activeTab === 'portfolio' && (
                <PortfolioTab 
                  portfolio={profileData.portfolio || []} 
                  onChange={handleUpdatePortfolio} 
                />
              )}

              {activeTab === 'theme' && (
                <ThemeTab 
                  theme={profileData.theme} 
                  onChange={handleUpdateTheme} 
                />
              )}

              {activeTab === 'qr' && (
                <QRCodeTab 
                  qrConfig={profileData.qrConfig} 
                  onChange={handleUpdateQR} 
                  profile={profileData.profile}
                  socials={profileData.socials}
                />
              )}
            </div>

          </div>

          {/* Right Column: Live Mobile Preview */}
          <div className="lg:col-span-5 sticky top-20 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                Live Mobile Simulator
              </span>
              <button
                onClick={() => handleSetViewMode('preview')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Full Page View</span>
              </button>
            </div>

            <PhoneMockup 
              profileData={profileData} 
              onOpenQR={() => setIsQRModalOpen(true)} 
            />
          </div>

        </main>
      )}

      {/* Modals */}
      <AdminAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
        currentPin={profileData.profile?.adminPin || "1234"}
      />

      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        profileData={profileData} 
      />

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        profileData={profileData} 
        onImport={handleImport} 
      />

    </div>
  );
}
