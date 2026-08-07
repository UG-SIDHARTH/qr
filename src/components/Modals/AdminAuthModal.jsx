import React, { useState } from 'react';
import { Lock, KeyRound, X, Check, ShieldAlert, UserPlus, LogIn, User, Mail, Eye, EyeOff, Sparkles } from 'lucide-react';

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || "123456";
const SUPER_ADMIN_PASSCODE = import.meta.env.VITE_SUPER_ADMIN_PASSCODE || "31072007";

export default function AdminAuthModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  membersList = [],
  onRegisterUser,
  currentPin = ADMIN_PASSCODE 
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login Form State
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  
  // Register Form State
  const [regName, setRegName] = useState('');
  const [regLoginId, setRegLoginId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForms = () => {
    setLoginId('');
    setPassword('');
    setRegName('');
    setRegLoginId('');
    setRegPassword('');
    setRegConfirmPassword('');
    setError('');
    setSuccessMsg('');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedLogin = loginId.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedLogin && !trimmedPass) {
      setError('Please enter your login username/email and password.');
      return;
    }

    // 1. Super Admin check
    if (
      trimmedPass === SUPER_ADMIN_PASSCODE || 
      (trimmedLogin === 'superadmin' && (trimmedPass === SUPER_ADMIN_PASSCODE || !trimmedPass))
    ) {
      onSuccess('superadmin');
      handleClose();
      return;
    }

    // 2. Admin check
    if (
      trimmedPass === ADMIN_PASSCODE || 
      trimmedPass === currentPin || 
      (trimmedLogin === 'admin' && (trimmedPass === ADMIN_PASSCODE || !trimmedPass))
    ) {
      onSuccess('admin');
      handleClose();
      return;
    }

    // 2. Search registered users in membersList
    const foundUser = membersList.find(m => {
      const uName = m.profile?.username?.toLowerCase() || '';
      const uEmail = m.profile?.email?.toLowerCase() || '';
      const uId = String(m.id || '').toLowerCase();
      
      const matchesLogin = (trimmedLogin && (uName === trimmedLogin || uEmail === trimmedLogin || uId === trimmedLogin));
      const uPass = m.profile?.adminPin || '1234';
      
      return matchesLogin && (trimmedPass === uPass || trimmedPass === ADMIN_PASSCODE || trimmedPass === SUPER_ADMIN_PASSCODE);
    });

    if (foundUser) {
      onSuccess('admin', foundUser);
      handleClose();
      return;
    }

    // If login ID matched but password failed
    const userExists = membersList.some(m => {
      const uName = m.profile?.username?.toLowerCase() || '';
      const uEmail = m.profile?.email?.toLowerCase() || '';
      return trimmedLogin && (uName === trimmedLogin || uEmail === trimmedLogin);
    });

    if (userExists) {
      setError('Incorrect password. Please try again.');
    } else if (trimmedLogin || trimmedPass) {
      setError('Account not found or invalid credentials. Create an account to log in.');
    } else {
      setError('Invalid login details.');
    }
  };

  // Handle Create Account Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const name = regName.trim();
    const login = regLoginId.trim().toLowerCase().replace(/\s+/g, '_');
    const pass = regPassword.trim();
    const confirm = regConfirmPassword.trim();

    if (!name) {
      setError('Please enter your full name.');
      return;
    }
    if (!login) {
      setError('Please enter a username or email for login.');
      return;
    }
    if (!pass) {
      setError('Please enter a password.');
      return;
    }
    if (pass.length < 3) {
      setError('Password must be at least 3 characters long.');
      return;
    }
    if (pass !== confirm) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    // Check if username/login already taken
    const taken = membersList.some(m => 
      m.profile?.username?.toLowerCase() === login || 
      m.profile?.email?.toLowerCase() === login
    );

    if (taken) {
      setError(`Username or Login "${login}" is already registered. Please log in or pick another username.`);
      return;
    }

    // Create new account profile structure
    const newUserId = `user_${Date.now()}`;
    const newMember = {
      id: newUserId,
      employeeId: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'User Created',
      profile: {
        name: name,
        username: login,
        title: 'Digital Creator',
        avatar: '',
        bio: `Hello! I am ${name}. Welcome to my bio page!`,
        email: login.includes('@') ? login : `${login}@example.com`,
        phone: '',
        location: '',
        verified: false,
        statusText: '🚀 Active Creator',
        adminPin: pass, // Account Password
      },
      socials: [
        { id: '1', title: 'My Website', url: 'https://example.com', icon: 'Globe', color: '#4f46e5', enabled: true },
        { id: '2', title: 'GitHub Profile', url: 'https://github.com', icon: 'Github', color: '#181717', enabled: true }
      ],
      portfolio: [],
      theme: {
        id: 'midnight-glass',
        name: 'Midnight Glass',
        bgStyle: 'bg-[#090d16]',
        cardStyle: 'glass-card',
        accentColor: '#6366f1',
        buttonRadius: 'rounded-2xl',
        buttonGlow: true,
      }
    };

    if (onRegisterUser) {
      onRegisterUser(newMember);
    }

    setSuccessMsg('Account created successfully! Logging you in...');
    setTimeout(() => {
      onSuccess('admin', newMember);
      handleClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mode Header Tabs */}
        <div className="flex items-center justify-center space-x-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'login' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'register' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h3 className="text-xl font-extrabold text-white font-outfit">
            {mode === 'login' ? 'Welcome Back' : 'Create New Account'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'login' 
              ? 'Enter your login details & password to access your Creator Studio' 
              : 'Register your account with a login username and password'}
          </p>
        </div>

        {/* Error / Success Banners */}
        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form: LOG IN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Login (Username or Email)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. alex_dev or alex@example.com"
                  autoFocus
                  className="w-full pl-10 pr-3 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <span className="text-[10px] text-slate-500">Default PIN: 123456</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password..."
                  className="w-full pl-10 pr-10 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to Studio</span>
            </button>
          </form>
        )}

        {/* Form: CREATE ACCOUNT */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  autoFocus
                  className="w-full pl-10 pr-3 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Login Username / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={regLoginId}
                  onChange={(e) => setRegLoginId(e.target.value)}
                  placeholder="e.g. alex_johnson"
                  className="w-full pl-10 pr-3 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Choose a strong password..."
                  className="w-full pl-10 pr-10 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm..."
                  className="w-full pl-10 pr-3 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account & Log In</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
