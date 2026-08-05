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
import { DEFAULT_PROFILE } from './data/defaultProfile';
import { 
  User, 
  Share2, 
  FolderGit2, 
  Palette, 
  QrCode, 
  Smartphone, 
  Eye 
} from 'lucide-react';

const STORAGE_KEY = 'qr_linktree_profile_data_v1';

export default function App() {
  // Load initial state from LocalStorage or fall back to default
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

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'socials' | 'portfolio' | 'theme' | 'qr'
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'preview'
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Auto-save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
  }, [profileData]);

  // Handler for Profile updates
  const handleUpdateProfile = (newProfile) => {
    setProfileData(prev => ({ ...prev, profile: newProfile }));
  };

  // Handler for Socials updates
  const handleUpdateSocials = (newSocials) => {
    setProfileData(prev => ({ ...prev, socials: newSocials }));
  };

  // Handler for Portfolio updates
  const handleUpdatePortfolio = (newPortfolio) => {
    setProfileData(prev => ({ ...prev, portfolio: newPortfolio }));
  };

  // Handler for Theme updates
  const handleUpdateTheme = (newTheme) => {
    setProfileData(prev => ({ ...prev, theme: newTheme }));
  };

  // Handler for QR Config updates
  const handleUpdateQR = (newQR) => {
    setProfileData(prev => ({ ...prev, qrConfig: newQR }));
  };

  // Reset to default sample profile
  const handleReset = () => {
    if (window.confirm("Reset profile data back to original sample state?")) {
      setProfileData(DEFAULT_PROFILE);
    }
  };

  // Import JSON handler
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
        setViewMode={setViewMode}
        onOpenExport={() => setIsExportModalOpen(true)}
        onReset={handleReset}
        onQuickQR={() => setIsQRModalOpen(true)}
        profile={profileData.profile}
      />

      {/* Main View Layout */}
      {viewMode === 'preview' ? (
        // Standalone Full-screen Public View Mode
        <main className="flex-1 w-full flex flex-col items-center justify-center">
          <BioPage 
            profileData={profileData} 
            onOpenQR={() => setIsQRModalOpen(true)} 
            isFullView={true} 
          />
        </main>
      ) : (
        // Studio & Editor Mode (Split Pane: Editor Dashboard on Left, Mobile Preview on Right)
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Editor Dashboard */}
          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-6">
            
            {/* Tab Navigation Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
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
                onClick={() => setViewMode('preview')}
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
