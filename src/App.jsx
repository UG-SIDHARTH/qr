import React, { useState, useEffect } from 'react';
import Header from './components/Header';
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

import { generate100Members } from './data/sample100Members';

const STORAGE_KEY = 'qr_linktree_profile_data_v7';
const MEMBERS_STORAGE_KEY = 'qr_linktree_members_list_v7';

// Helper to resolve route and member from URL hash
const resolveHashUrl = (hash, members = [], activeProfile = null) => {
  if (!hash) return { view: 'preview' };

  const cleanHash = decodeURIComponent(hash.replace(/^#/, '')).split('?')[0].trim();
  if (!cleanHash) return { view: 'preview' };

  // 1. Check system routes
  if (cleanHash === 'bulk' || cleanHash === 'admin' || cleanHash === 'members') {
    return { view: 'bulk' };
  }
  if (cleanHash === 'editor' || cleanHash === 'studio') {
    return { view: 'editor' };
  }

  // 2. Check active single profile match
  if (activeProfile?.profile) {
    const p = activeProfile.profile;
    if (
      (p.username && p.username.toLowerCase() === cleanHash.toLowerCase()) ||
      (p.name && p.name.toLowerCase().replace(/\s+/g, '_') === cleanHash.toLowerCase())
    ) {
      return { view: 'preview', member: activeProfile };
    }
  }

  // 3. Check user= ID lookup
  if (cleanHash.startsWith('user=')) {
    const userId = cleanHash.replace('user=', '').trim();
    const found = members.find(m => String(m.id) === userId || String(m.id) === `user_${userId}`);
    if (found) return { view: 'preview', member: found };
  }

  // 4. Search directory members
  const foundMember = members.find(m => 
    m.profile?.username?.toLowerCase() === cleanHash.toLowerCase() ||
    m.profile?.name?.toLowerCase().replace(/\s+/g, '_') === cleanHash.toLowerCase() ||
    String(m.id).toLowerCase() === cleanHash.toLowerCase()
  );
  if (foundMember) return { view: 'preview', member: foundMember };

  // 5. Fallback for custom single profile when hash exists
  if (activeProfile && (activeProfile.profile?.name || activeProfile.profile?.username)) {
    return { view: 'preview', member: activeProfile };
  }

  // 6. Generic card fallback if cleanHash is present (NEVER show homepage on hashtag scans!)
  return { 
    view: 'preview', 
    member: {
      id: cleanHash,
      profile: {
        name: cleanHash.replace(/_/g, ' '),
        username: cleanHash,
        title: 'Member Profile',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        bio: `Official Linktree bio card for @${cleanHash}.`,
        verified: true,
        statusText: '🚀 Active Member'
      },
      socials: [],
      portfolio: [],
      theme: {
        id: 'midnight-glass',
        name: 'Midnight Glass',
        bgStyle: 'bg-preset-midnight',
        accentColor: '#6366f1',
        buttonRadius: 'rounded-2xl',
        buttonGlow: true
      }
    }
  };
};

export default function App() {
  // Members directory list loaded from localStorage or default 100 members
  const [membersList, setMembersList] = useState(() => {
    try {
      const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return generate100Members();
  });

  // Current active profile data loaded from URL hash member, localStorage, or EMPTY_PROFILE
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
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      return generate100Members();
    })();

    const state = resolveHashUrl(typeof window !== 'undefined' ? window.location.hash : '', initialMembers, savedProfile);
    if (state.member) return state.member;

    return savedProfile;
  });

  const checkHashUrl = () => resolveHashUrl(window.location.hash, membersList, profileData);

  const initialUrlState = checkHashUrl();
  const [viewMode, setViewMode] = useState(initialUrlState.view || 'preview');
  const [activeTab, setActiveTab] = useState('profile');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authRole, setAuthRole] = useState('none');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Sync state with URL hash on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const state = checkHashUrl();
      if (state.member) {
        setProfileData(state.member);
        setViewMode('preview');
      } else if (state.view === 'bulk') {
        if (!isUnlocked) {
          setIsAuthModalOpen(true);
        } else {
          setViewMode('bulk');
        }
      } else if (state.view === 'editor') {
        setViewMode('editor');
      } else {
        setViewMode('preview');
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [membersList, isUnlocked]);

  // Save changes to localStorage & auto-sync user profiles to directory for Super Admin
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    } catch (e) {}

    if (profileData.profile?.name || profileData.profile?.username) {
      setMembersList(prev => {
        const username = profileData.profile.username?.trim().toLowerCase();
        const nameSlug = profileData.profile.name?.trim().toLowerCase().replace(/\s+/g, '_');
        const id = profileData.id || username || nameSlug || 'user_custom';

        const existingIdx = prev.findIndex(m => 
          String(m.id) === String(id) ||
          (username && m.profile?.username?.toLowerCase() === username) ||
          (nameSlug && m.profile?.name?.toLowerCase().replace(/\s+/g, '_') === nameSlug)
        );

        const updatedProfile = {
          ...profileData,
          id: id,
          employeeId: profileData.employeeId || 'USER-CUSTOM',
          department: profileData.department || 'User Created',
        };

        if (existingIdx >= 0) {
          const newMembers = [...prev];
          newMembers[existingIdx] = updatedProfile;
          return newMembers;
        } else {
          return [updatedProfile, ...prev];
        }
      });
    }
  }, [profileData]);

  useEffect(() => {
    try {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(membersList));
    } catch (e) {}
  }, [membersList]);

  // Handlers for profile updates
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

  const handleAuthSuccess = (role = 'admin') => {
    setAuthRole(role);
    setIsUnlocked(true);
    setViewMode('bulk');
    window.history.replaceState(null, '', '#bulk');
  };

  const handleClearAllData = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
    setProfileData(EMPTY_PROFILE);
    setMembersList([]);
  };

  const handleSelectMemberToEdit = (member) => {
    setProfileData(member);
    setViewMode('editor');
    window.history.replaceState(null, '', '#editor');
  };

  const handleViewMemberProfile = (member) => {
    setProfileData(member);
    setViewMode('preview');
    window.history.replaceState(null, '', `#user=${member.id}`);
  };

  const handlePublishProfile = () => {
    if (!profileData.profile?.name && !profileData.profile?.username) {
      alert("Please enter at least your Name or Username in your profile before publishing!");
      return;
    }

    const cleanName = profileData.profile?.name?.trim() || 'User';
    const cleanUser = (profileData.profile?.username || cleanName)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/^#/, '');

    const publishedRecord = {
      ...profileData,
      id: profileData.id || cleanUser,
      employeeId: profileData.employeeId || 'USER-CUSTOM',
      department: profileData.department || 'User Created',
      profile: {
        ...profileData.profile,
        name: cleanName,
        username: cleanUser,
      }
    };

    // Update active profile state
    setProfileData(publishedRecord);

    // Sync directly to Super Admin directory roster & localStorage
    setMembersList(prev => {
      const existingIdx = prev.findIndex(m => 
        String(m.id) === String(publishedRecord.id) ||
        (m.profile?.username?.toLowerCase() === cleanUser)
      );

      let newMembers;
      if (existingIdx >= 0) {
        newMembers = [...prev];
        newMembers[existingIdx] = publishedRecord;
      } else {
        newMembers = [publishedRecord, ...prev];
      }

      try {
        localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(newMembers));
      } catch (e) {}

      return newMembers;
    });

    // Set URL hash to #<username>
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
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        viewMode={viewMode}
        setViewMode={handleSetViewMode}
        onOpenExport={() => setIsExportModalOpen(true)}
        onReset={handleClearAllData}
        onQuickQR={() => setIsQRModalOpen(true)}
        onPublish={handlePublishProfile}
        profile={profileData.profile}
        isUnlocked={isUnlocked}
        onRequestUnlock={() => setIsAuthModalOpen(true)}
        memberCount={membersList.length}
      />

      {/* Mode Navigation Bar (Bulk Admin vs Editor vs Public View) */}
      {isUnlocked && (
        <div className="w-full bg-slate-900 border-b border-slate-800 py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSetViewMode('bulk')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === 'bulk'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-purple-300" />
                <span>Bulk Admin Directory ({membersList.length} Members)</span>
              </button>

              <button
                onClick={() => handleSetViewMode('editor')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === 'editor'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4 text-indigo-300" />
                <span>Single Profile Studio</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Editing: <strong className="text-white">{profileData.profile?.name || 'Clean Profile'}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Main View Layout */}
      {viewMode === 'bulk' && isUnlocked ? (
        // 100+ People Bulk Administrator Dashboard View
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          <BulkAdminDashboard
            members={membersList}
            authRole={authRole}
            onUpdateMembers={setMembersList}
            onSelectMemberToEdit={handleSelectMemberToEdit}
            onViewMemberProfile={handleViewMemberProfile}
          />
        </main>
      ) : viewMode === 'preview' ? (
        // Front Page Welcome Landing vs Public Linktree View
        <main className="flex-1 w-full flex flex-col items-center justify-center relative">
          {(profileData.profile?.name || profileData.profile?.username || profileData.socials?.length > 0) ? (
            <BioPage 
              profileData={profileData} 
              onOpenQR={() => setIsQRModalOpen(true)} 
              isFullView={true} 
            />
          ) : (
            <WelcomeLanding
              onCreateLinktree={() => handleSetViewMode('editor')}
              onOpenQR={() => setIsQRModalOpen(true)}
              onRequestUnlock={() => setIsAuthModalOpen(true)}
            />
          )}
        </main>
      ) : (
        // Studio & Editor Mode (Split Pane)
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Editor Dashboard */}
          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-6">
            
            {/* Header controls for tabs */}
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

              {/* Action Buttons: Publish & Delete */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={handlePublishProfile}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border border-emerald-400/30 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  <span>Finish & Publish</span>
                </button>

                <button
                  onClick={handleClearAllData}
                  className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-medium flex items-center space-x-1 transition-all"
                  title="Wipe & Delete All Data"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Delete All</span>
                </button>
              </div>
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
                  socials={profileData.socials || []} 
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
                />
              )}
            </div>

          </div>

          {/* Right Live Phone Simulator */}
          <div className="hidden lg:flex flex-col items-center">
            <div className="sticky top-24">
              <div className="text-center mb-3 flex items-center justify-between px-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  Live Mobile Simulator
                </span>
                <button
                  onClick={() => setViewMode('preview')}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Full Page View
                </button>
              </div>

              <PhoneMockup 
                profileData={profileData} 
                onOpenQR={() => setIsQRModalOpen(true)} 
              />
            </div>
          </div>

        </main>
      )}

      {/* Modals */}
      <AdminAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
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

    </div>
  );
}
