import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Bell, 
  HeartHandshake, 
  MessageSquare, 
  UsersRound, 
  BookOpen, 
  CheckSquare, 
  LogOut, 
  Globe, 
  Settings, 
  ChevronDown, 
  WifiOff 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HavenLogo } from './HavenLogo';

interface NavbarProps {
  userAvatar?: string;
  userName?: string;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  privacyMode?: 'local_only' | 'cloud_sync';
}

export const Navbar: React.FC<NavbarProps> = ({ 
  userAvatar = 'S', 
  userName = 'Sam',
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  privacyMode = 'local_only'
}) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { language, setLanguage, t, languages } = useLanguage();
  
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const accountRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAdmin) return null;

  const links = [
    { to: '/', label: t('home', 'Home'), icon: HeartHandshake },
    { to: '/talk-now', label: t('connect', 'Connect'), icon: MessageSquare },
    { to: '/community', label: t('community', 'Community'), icon: UsersRound },
    { to: '/resources', label: t('resources', 'Resources'), icon: BookOpen },
    { to: '/habits', label: t('wellbeing', 'Wellbeing'), icon: CheckSquare },
  ];

  return (
    <nav className="bg-surface-main/95 backdrop-blur-md border-b border-border-primary sticky top-0 z-40 hidden md:block select-none transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Search Trigger */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <HavenLogo size={28} showText={true} />
          </Link>

          {/* Search Trigger with Shortcut Hint */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl bg-surface-sec hover:bg-surface-sec/80 border border-border-primary text-xs text-text-muted hover:text-text-primary transition-all cursor-pointer shadow-2xs group"
            title="Search Haven (⌘K)"
          >
            <span className="text-[11.5px] font-medium group-hover:text-text-primary">Search Haven</span>
            <kbd className="px-1.5 py-0.5 text-[9.5px] font-mono font-bold bg-surface-main border border-border-primary rounded text-text-muted group-hover:border-brand-primary/40 transition-colors">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Center Links with Smooth Animated Pill */}
        <div className="flex items-center space-x-1 relative">
          {links.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-xs font-semibold tracking-wide transition-colors duration-150 rounded-xl ${
                  isActive
                    ? 'text-brand-primary font-bold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-sec/60'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-brand-light/50 border border-brand-primary/20 rounded-xl -z-0 shadow-2xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Status, Notifications, Language & Account */}
        <div className="flex items-center space-x-3">
          
          {/* Data Sovereignty & Offline Live Status */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface-sec border border-border-primary text-[10.5px] font-mono text-text-secondary">
            {!isOnline ? (
              <>
                <WifiOff size={11} className="text-accent-amber" />
                <span>Offline · Local Storage</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-teal" />
                <span>{privacyMode === 'local_only' ? 'Local-Only' : 'Cloud-Sync'}</span>
              </>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-surface-sec hover:bg-surface-main border border-border-primary text-xs font-bold text-text-secondary hover:text-text-primary transition-all cursor-pointer"
              title="Change Language"
            >
              <Globe size={13} className="text-brand-primary" />
              <span>{languages.find(l => l.code === language)?.nativeName || 'English'}</span>
            </button>

            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  className="absolute right-0 mt-2 w-36 bg-surface-main border border-border-primary rounded-2xl shadow-lg p-1.5 z-50 space-y-0.5"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                        language === lang.code
                          ? 'bg-brand-light text-brand-primary'
                          : 'text-text-secondary hover:bg-surface-sec hover:text-text-primary'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[9px] text-text-muted font-normal">{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications Bell with Unread Indicator */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative text-text-secondary hover:text-text-primary p-2 rounded-xl hover:bg-surface-sec transition-colors cursor-pointer"
            title="Notifications & Reflections"
          >
            <Bell size={17} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-primary ring-2 ring-surface-main" />
            )}
          </button>

          {/* Help Button */}
          <Link
            to="/urgent-support"
            className="flex items-center space-x-1.5 border border-accent-rose hover:bg-accent-rose-light/20 text-accent-rose px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          >
            <Shield size={13} className="stroke-[2.5px]" />
            <span>{t('helpNow', 'Help')}</span>
          </Link>

          {/* Account Dropdown Menu */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center space-x-2 border border-border-primary pl-2 pr-3 py-1.5 rounded-xl bg-surface-main hover:border-border-strong transition-all cursor-pointer"
            >
              <span className="w-5 h-5 rounded-full bg-brand-light text-brand-primary flex items-center justify-center text-[10px] font-black leading-none">
                {userAvatar}
              </span>
              <span className="text-xs font-semibold text-text-primary">{userName}</span>
              <ChevronDown size={12} className="text-text-muted" />
            </button>

            <AnimatePresence>
              {accountDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  className="absolute right-0 mt-2 w-56 bg-surface-main border border-border-primary rounded-2xl shadow-xl p-2 z-50 space-y-1 text-xs"
                >
                  <div className="px-3 py-2 border-b border-border-primary/60">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Signed in as</span>
                    <p className="font-bold text-text-primary truncate">{userName}</p>
                    <span className="text-[10px] text-accent-teal font-mono font-medium block mt-0.5">
                      {privacyMode === 'local_only' ? '● Local-Only Mode' : '● Cloud Sync'}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-sec transition-colors"
                  >
                    <Settings size={14} />
                    <span>Settings & Preferences</span>
                  </Link>

                  <Link
                    to="/admin"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-brand-primary hover:bg-brand-light/40 transition-colors"
                  >
                    <Shield size={14} />
                    <span>Executive Admin Portal</span>
                  </Link>

                  <div className="pt-1 border-t border-border-primary/60">
                    <button
                      onClick={() => {
                        sessionStorage.removeItem('haven_session_auth');
                        localStorage.removeItem('haven_auth');
                        localStorage.removeItem('haven_role');
                        window.location.hash = '#/landing';
                        window.location.reload();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-accent-rose hover:bg-accent-rose-light/20 transition-colors cursor-pointer text-left"
                    >
                      <LogOut size={14} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </nav>
  );
};
