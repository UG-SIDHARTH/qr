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

const STORAGE_KEY = 'qr_linktree_profile_data_v7';
const MEMBERS_STORAGE_KEY = 'qr_linktree_members_list_v7';

// Helper to resolve route and member from URL hash
const resolveHashUrl = (hash, members = [], activeProfile = null) => {
  if (!hash) return { view: 'preview' };

  const cleanHash = decodeURIComponent(hash.replace(/^#/, '')).split('?')[0].trim();
  if (!cleanHash) return { view: 'preview' };

  // 2. Check system routes
  if (cleanHash === 'bulk' || cleanHash === 'admin' || cleanHash === 'members') {
    return { view: 'bulk' };
  }
  if (cleanHash === 'editor' || cleanHash === 'studio') {
    return { view: 'editor' };
  }

  // 3. Check active single profile match
  if (activeProfile?.profile) {
    const p = activeProfile.profile;
    if (
      (p.username && p.username.toLowerCase() === cleanHash.toLowerCase()) ||
      (p.name && p.name.toLowerCase().replace(/\s+/g, '_') === cleanHash.toLowerCase())
    ) {
      return { view: 'preview', member: activeProfile };
    }
  }

  // 4. Check user= ID lookup
  if (cleanHash.startsWith('user=')) {
    const userId = cleanHash.replace('user=', '').trim();
    const found = members.find(m => String(m.id) === userId || String(m.id) === `user_${userId}`);
    if (found) return { view: 'preview', member: found };
  }

  // 5. Search directory members
  const foundMember = members.find(m => 
    m.profile?.username?.toLowerCase() === cleanHash.toLowerCase() ||
    m.profile?.name?.toLowerCase().replace(/\s+/g, '_') === cleanHash.toLowerCase() ||
    String(m.id).toLowerCase() === cleanHash.toLowerCase()
  );
  if (foundMember) return { view: 'preview', member: foundMember };

  // 6. Mobile fallback for custom profile hash (e.g. #ug)
  if (activeProfile && (activeProfile.profile?.name || activeProfile.profile?.username)) {
    return { view: 'preview', member: activeProfile };
  }

  // 7. Generic mobile fallback card (NEVER show homepage on mobile hashtag scans!)
  return { 
    view: 'preview', 
    member: {
      id: cleanHash,
      profile: {
        name: cleanHash.replace(/_/g, ' '),
        username: cleanHash,
        title: '',
        avatar: '',
        bio: '',
        verified: false,
        statusText: ''
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
  // Members directory list loaded from localStorage or empty array
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

  // Save changes to localStorage & auto-sync user profiles to Super Admin directory
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    } catch (e) {}

    const name = profileData.profile?.name?.trim();
    const username = profileData.profile?.username?.trim().toLowerCase().replace(/^#/, '');

    if (name || username) {
      setMembersList(prev => {
        const id = profileData.id || username || name.toLowerCase().replace(/\s+/g, '_') || 'user_custom';

        const existingIdx = prev.findIndex(m => 
          String(m.id) === String(id) ||
          (username && m.profile?.username?.toLowerCase() === username) ||
          (name && m.profile?.name?.toLowerCase() === name.toLowerCase())
        );

        const updatedProfileRecord = {
          ...profileData,
          id: id,
          employeeId: profileData.employeeId || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
          department: profileData.department || 'User Created',
          profile: {
            ...profileData.profile,
            name: name || username || 'User Profile',
            username: username || name?.toLowerCase().replace(/\s+/g, '_') || id,
          }
        };

        let newMembers;
        if (existingIdx >= 0) {
          newMembers = [...prev];
          newMembers[existingIdx] = updatedProfileRecord;
        } else {
          newMembers = [updatedProfileRecord, ...prev];
        }

        try {
          localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(newMembers));
        } catch (e) {}

        return newMembers;
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

  const handleAuthSuccess = (role = 'admin', userMember = null) => {
    setAuthRole(role);
    setIsUnlocked(true);
    if (userMember) {
      setProfileData(userMember);
    }
    const targetMode = role === 'superadmin' ? 'bulk' : 'editor';
    setViewMode(targetMode);
    window.history.replaceState(null, '', `#${targetMode}`);
  };

  const handleRegisterUser = (newUser) => {
    setMembersList(prev => [newUser, ...prev]);
    setProfileData(newUser);
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
        onQuickQR={() => setIsQRModalOpen(true)}
        onPublish={handlePublishProfile}
        profile={profileData.profile}
        isUnlocked={isUnlocked}
        onRequestUnlock={() => setIsAuthModalOpen(true)}
        memberCount={membersList.length}
      />

      {/* Main View Layout */}
      {viewMode === 'preview' ? (
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
            />
          )}
        </main>
      ) : (
        // Studio & Editor Mode (Split Pane)
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Editor Dashboard */}
          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-6">
            
            {/* Header controls for tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0 py-0.5">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
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
              <div className="flex items-center justify-end space-x-2 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
                <button
                  onClick={handlePublishProfile}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border border-emerald-400/30 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Finish & Publish</span>
                </button>
              </div>
            </div>

            {/* Active Tab Panel */}
            <div className="min-h-[480px]">
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

          {/* Right Live Phone Simulator */}
          <div className="hidden lg:flex flex-col items-center lg:col-span-5 w-full">
            <div className="sticky top-20 w-full flex flex-col items-center">
              <div className="w-full max-w-[370px] mb-2 flex items-center justify-between px-2">
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

    </div>
  );
}
