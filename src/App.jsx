import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SidebarNav from './components/SidebarNav';
import DigitalBioCardBuilder from './components/Editor/DigitalBioCardBuilder';
import DashboardQRCard from './components/Editor/DashboardQRCard';
import ProfileTab from './components/Editor/ProfileTab';
import SocialsTab from './components/Editor/SocialsTab';
import PortfolioTab from './components/Editor/PortfolioTab';
import ThemeTab from './components/Editor/ThemeTab';
import QRCodeTab from './components/Editor/QRCodeTab';
import PhoneMockup from './components/Preview/PhoneMockup';
import BioPage from './components/Preview/BioPage';
import WelcomeLanding from './components/Preview/WelcomeLanding';
import QRModal from './components/Modals/QRModal';
import ExportModal from './components/Modals/ExportModal';
import AdminAuthModal from './components/Modals/AdminAuthModal';
import PublishSuccessModal from './components/Modals/PublishSuccessModal';
import BulkAdminDashboard from './components/Admin/BulkAdminDashboard';
import { EMPTY_PROFILE } from './data/defaultProfile';
import { getProfileHash, getProfileUrl } from './utils/url';
import { 
  User, 
  Share2, 
  FolderGit2, 
  Palette, 
  QrCode, 
  Smartphone, 
  Eye,
  Sliders,
  Users,
  Building2,
  Trash2,
  Sparkles
} from 'lucide-react';

const STORAGE_KEY = 'qr_linktree_profile_data_v7';
const MEMBERS_STORAGE_KEY = 'qr_linktree_members_list_v7';

// Helper to resolve route and member from URL hash
const resolveHashUrl = (hash, members = [], activeProfile = null) => {
  if (!hash) return { view: 'welcome' };

  const cleanHash = decodeURIComponent(hash.replace(/^#/, '')).split('?')[0].trim();
  if (!cleanHash || cleanHash === 'welcome' || cleanHash === 'home' || cleanHash === 'landing') {
    return { view: 'welcome' };
  }

  if (cleanHash === 'bulk' || cleanHash === 'admin' || cleanHash === 'members') {
    return { view: 'bulk' };
  }
  if (cleanHash === 'editor' || cleanHash === 'studio') {
    return { view: 'editor' };
  }

  if (cleanHash === 'preview' || cleanHash === 'card') {
    return { view: 'preview', member: activeProfile };
  }

  if (activeProfile?.profile) {
    const p = activeProfile.profile;
    if (
      (p.username && p.username.toLowerCase() === cleanHash.toLowerCase()) ||
      (p.name && p.name.toLowerCase().replace(/\s+/g, '_') === cleanHash.toLowerCase())
    ) {
      return { view: 'preview', member: activeProfile };
    }
  }

  if (cleanHash.startsWith('user=')) {
    const userId = cleanHash.replace('user=', '').trim();
    const found = members.find(m => String(m.id) === userId || String(m.id) === `user_${userId}`);
    if (found) return { view: 'preview', member: found };
  }

  const foundMember = members.find(m => 
    m.profile?.username?.toLowerCase() === cleanHash.toLowerCase() ||
    m.profile?.name?.toLowerCase().replace(/\s+/g, '_') === cleanHash.toLowerCase() ||
    String(m.id).toLowerCase() === cleanHash.toLowerCase()
  );
  if (foundMember) return { view: 'preview', member: foundMember };

  return { view: 'welcome' };
};

export default function App() {
  const [membersList, setMembersList] = useState(() => {
    try {
      const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [profileData, setProfileData] = useState(() => {
    let savedProfile = EMPTY_PROFILE;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) savedProfile = JSON.parse(saved);
    } catch (e) {}

    const initialMembers = (() => {
      try {
        const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
      return [];
    })();

    const state = resolveHashUrl(typeof window !== 'undefined' ? window.location.hash : '', initialMembers, savedProfile);
    if (state.member) return state.member;

    return savedProfile;
  });

  const checkHashUrl = () => resolveHashUrl(window.location.hash, membersList, profileData);

  const initialUrlState = checkHashUrl();
  const [viewMode, setViewMode] = useState(initialUrlState.view || 'welcome');
  const [activeTab, setActiveTab] = useState('profile');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authRole, setAuthRole] = useState('none');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const state = checkHashUrl();
      if (state.member) {
        setProfileData(state.member);
        setViewMode(state.view);
      } else {
        setViewMode(state.view || 'welcome');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [membersList, isUnlocked]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    } catch (e) {}
  }, [profileData]);

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

  const handleSetViewMode = (mode) => {
    if (mode === 'bulk' && !isUnlocked) {
      setIsAuthModalOpen(true);
    } else {
      setViewMode(mode);
      window.history.replaceState(null, '', `#${mode}`);
    }
  };

  const handleAuthSuccess = (role = 'admin', userMember = null) => {
    setAuthRole(role);
    setIsUnlocked(true);
    if (userMember) setProfileData(userMember);
    const targetMode = role === 'superadmin' ? 'bulk' : 'editor';
    setViewMode(targetMode);
    window.history.replaceState(null, '', `#${targetMode}`);
  };

  const handleRegisterUser = (newUser) => {
    setMembersList(prev => [newUser, ...prev]);
    setProfileData(newUser);
  };

  const handlePublishProfile = () => {
    const cleanName = profileData.profile?.name?.trim() || 'User';
    const cleanUser = (profileData.profile?.username || cleanName)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/^#/, '');

    const publishedRecord = {
      ...profileData,
      id: profileData.id || cleanUser,
      profile: {
        ...profileData.profile,
        name: cleanName,
        username: cleanUser,
      }
    };

    setProfileData(publishedRecord);
    window.history.replaceState(null, '', `#${cleanUser}`);
    setIsPublishModalOpen(true);
  };

  const TABS = [
    { id: 'profile', label: 'Bio & Details', icon: User },
    { id: 'socials', label: 'Social Links', icon: Share2, count: profileData.socials?.length || 0 },
    { id: 'portfolio', label: 'Portfolio Cards', icon: FolderGit2, count: profileData.portfolio?.length || 0 },
    { id: 'theme', label: 'Theme Studio', icon: Palette },
    { id: 'qr', label: 'QR Generator', icon: QrCode },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark flex flex-col font-sans selection:bg-purple-500 selection:text-white text-slate-100">
      
      {/* Navigation Header */}
      <Header
        viewMode={viewMode}
        setViewMode={handleSetViewMode}
        onOpenExport={() => setIsExportModalOpen(true)}
        onQuickQR={() => setIsQRModalOpen(true)}
        onPublish={handlePublishProfile}
        profile={profileData.profile}
        isUnlocked={isUnlocked}
        onRequestUnlock={() => setIsAuthModalOpen(true)}
        memberCount={membersList.length}
      />

      <div className="flex-1 flex w-full">
        
        {/* Left Vertical Icon Sidebar */}
        <SidebarNav 
          onSelectView={handleSetViewMode}
          onRequestUnlock={() => setIsAuthModalOpen(true)}
          isUnlocked={isUnlocked}
        />

        {/* Main View Layout */}
        {viewMode === 'welcome' ? (
          // Antigravity Welcome Landing Page
          <main className="flex-1 w-full flex flex-col items-center justify-center relative">
            <WelcomeLanding
              onCreateLinktree={() => handleSetViewMode('editor')}
              onOpenQR={() => setIsQRModalOpen(true)}
            />
          </main>
        ) : viewMode === 'preview' ? (
          // Public Bio Card View
          <main className="flex-1 w-full flex flex-col items-center justify-center relative">
            <BioPage 
              profileData={profileData} 
              onOpenQR={() => setIsQRModalOpen(true)} 
              isFullView={true} 
            />
          </main>
        ) : viewMode === 'bulk' ? (
          // Super Admin Roster View
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            <BulkAdminDashboard
              membersList={membersList}
              onSelectMemberToEdit={(member) => {
                setProfileData(member);
                setViewMode('editor');
              }}
              onViewMemberProfile={(member) => {
                setProfileData(member);
                setViewMode('preview');
              }}
              onDeleteMember={(id) => {
                setMembersList(prev => prev.filter(m => m.id !== id));
              }}
            />
          </main>
        ) : (
          // Studio Editor Dashboard View

          // Main Dashboard Editor Mode (Exact 2-Card Layout from Reference Screenshot)
          <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            
            {/* Top 2-Card Grid (Screenshot Style: Left Card "Digital Bio Card Builder", Right Card "High-Res QR Code Generator") */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              
              {/* Left Card: Digital Bio Card Builder */}
              <DigitalBioCardBuilder
                profileData={profileData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenLivePreview={() => setViewMode('preview')}
                onOpenQR={() => setIsQRModalOpen(true)}
              />

              {/* Right Card: High-Res QR Code Generator */}
              <DashboardQRCard
                profileData={profileData}
                onUpdateQR={handleUpdateQR}
              />

            </div>

            {/* Bottom Detailed Editor Panel */}
            <div className="w-full bg-[#0c0d20]/95 border border-slate-800/90 rounded-[28px] p-5 sm:p-7 backdrop-blur-2xl shadow-2xl space-y-6">
              
              {/* Tab Header Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar flex-1 py-0.5">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400/40'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-[#13152c]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
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

                {/* Publish Action Button */}
                <button
                  onClick={handlePublishProfile}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 whitespace-nowrap self-end sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Publish Profile</span>
                </button>
              </div>

              {/* Tab Form Content */}
              <div className="min-h-[360px] pt-2">
                {activeTab === 'profile' && (
                  <ProfileTab 
                    profile={profileData?.profile || {}} 
                    onChange={handleUpdateProfile} 
                  />
                )}

                {activeTab === 'socials' && (
                  <SocialsTab 
                    socials={profileData?.socials || []} 
                    onChange={handleUpdateSocials} 
                  />
                )}

                {activeTab === 'portfolio' && (
                  <PortfolioTab 
                    portfolio={profileData?.portfolio || []} 
                    onChange={handleUpdatePortfolio} 
                  />
                )}

                {activeTab === 'theme' && (
                  <ThemeTab 
                    theme={profileData?.theme || {}} 
                    onChange={handleUpdateTheme} 
                  />
                )}

                {activeTab === 'qr' && (
                  <QRCodeTab 
                    qrConfig={profileData?.qrConfig || {}} 
                    profile={profileData?.profile || {}}
                    socials={profileData?.socials || []}
                    onChange={handleUpdateQR} 
                  />
                )}
              </div>

            </div>

          </main>
        )}

      </div>

      {/* Modals */}
      <AdminAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
        membersList={membersList}
        onRegisterUser={handleRegisterUser}
        currentPin={profileData.profile?.adminPin || import.meta.env.VITE_ADMIN_PASSCODE || "123456"}
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
        onImport={setProfileData} 
      />

      <PublishSuccessModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        profileData={profileData}
        onViewLive={() => setViewMode('preview')}
      />

      {/* Global Copyright Footer */}
      <footer className="w-full py-4 border-t border-slate-800/80 bg-[#070815]/95 text-center text-xs text-slate-400 font-medium z-40">
        <span>© {new Date().getFullYear()} <strong className="text-purple-300 font-bold">UG_SIDHARTH</strong>. OpenSource Linktree Studio.</span>
      </footer>

    </div>
  );
}

