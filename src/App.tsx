import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { MobileNavigation } from './components/MobileNavigation';
import { CommandPalette } from './components/CommandPalette';
import { NotificationsModal } from './components/NotificationsModal';
import { getMockDatabase } from './mockData';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { Onboarding } from './pages/Onboarding';

// User Pages
import { Home } from './pages/Home';
import { TalkNow } from './pages/TalkNow';
import { ChatRoom } from './pages/ChatRoom';
import { Community } from './pages/Community';
import { TherapistDirectory } from './pages/TherapistDirectory';
import { TherapistProfile } from './pages/TherapistProfile';
import { GetHelpNow } from './pages/GetHelpNow';
import { Resources } from './pages/Resources';
import { Profile } from './pages/Profile';
import { Habits } from './pages/Habits';
import { ApplyTherapist } from './pages/ApplyTherapist';
import { UntangleThoughts } from './pages/UntangleThoughts';
import { SomaticGrounding } from './pages/SomaticGrounding';
import { SoundSanctuary } from './pages/SoundSanctuary';
import { HopeBoard } from './pages/HopeBoard';

// Admin Pages
import { AdminLayout } from './admin/Layout';
import { Dashboard } from './admin/Dashboard';
import { SuperAdmin } from './admin/SuperAdmin';
import { Therapists } from './admin/Therapists';
import { Users } from './admin/Users';
import { Communities } from './admin/Communities';
import { Moderation } from './admin/Moderation';
import { Analytics } from './admin/Analytics';
import { Settings } from './admin/Settings';
import type { NotificationItem, UserProfile } from './types';

function AppContent() {
  const db = getMockDatabase();
  const [profile, setProfile] = useState<UserProfile>(db.getUserProfile());

  // Global modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Session-based auth gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem('haven_session_auth') === 'true'
  );

  useEffect(() => {
    // Initial sync
    const user = db.getUserProfile();
    setProfile(user);

    const applyPreferences = (u: typeof user) => {
      // 1. Palette
      const palette = u.palette || 'haven';
      document.documentElement.dataset.palette = palette;

      // 2. Theme (Light/Dark/System)
      const theme = u.theme || 'light';
      let resolved = theme;
      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.dataset.theme = resolved;
    };

    applyPreferences(user);

    // Periodic sync
    const interval = setInterval(() => {
      const current = db.getUserProfile();
      setProfile(current);
      applyPreferences(current);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Global ⌘K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAuthenticated = (role?: 'user' | 'therapist' | 'admin') => {
    setIsAuthenticated(true);
    sessionStorage.setItem('haven_session_auth', 'true');
    if (role === 'admin') {
      window.location.hash = '#/admin';
    } else if (role === 'therapist') {
      window.location.hash = '#/admin/clinical';
    } else {
      window.location.hash = '#/';
    }
  };

  const handleGuestEnter = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('haven_session_auth', 'true');
    window.location.hash = '#/';
  };

  const handleOnboardingComplete = (updated: UserProfile) => {
    setIsAuthenticated(true);
    sessionStorage.setItem('haven_session_auth', 'true');
    setProfile(updated);
  };

  const handleMarkAllNotificationsRead = () => {
    const currentNotifs = profile.notifications || [];
    const updated = currentNotifs.map(n => ({ ...n, read: true }));
    const updatedProfile = { ...profile, notifications: updated };
    db.setUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    const currentNotifs = profile.notifications || [];
    const updated = currentNotifs.map(n => n.id === item.id ? { ...n, read: true } : n);
    const updatedProfile = { ...profile, notifications: updated };
    db.setUserProfile(updatedProfile);
    setProfile(updatedProfile);
    setNotificationsOpen(false);
    if (item.actionLink) {
      window.location.hash = `#${item.actionLink}`;
    }
  };

  const unreadCount = (profile.notifications || []).filter(n => !n.read).length;

  // If not authenticated, allow Landing, Login, Onboarding, and Apply pages
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/landing" element={<LandingPage onEnterGuest={handleGuestEnter} />} />
        <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
        <Route path="/login" element={<LoginPage onAuthenticated={handleAuthenticated} />} />
        <Route path="/apply-therapist" element={<ApplyTherapist />} />
        <Route path="/urgent-support" element={<GetHelpNow />} />
        <Route path="*" element={<LandingPage onEnterGuest={handleGuestEnter} />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg-app">
      {/* Navigation */}
      <Navbar 
        userAvatar={profile.avatar} 
        userName={profile.name}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadNotificationsCount={unreadCount}
        privacyMode={profile.privacyMode}
      />

      {/* Primary Page Content Wrapper */}
      <div className="flex-1 pb-16 md:pb-0">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<LandingPage onEnterGuest={handleGuestEnter} />} />
          <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
          <Route path="/login" element={<LoginPage onAuthenticated={handleAuthenticated} />} />
          <Route path="/talk-now" element={<TalkNow />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
          <Route path="/community" element={<Community />} />
          <Route path="/therapists" element={<TherapistDirectory />} />
          <Route path="/therapist/:id" element={<TherapistProfile />} />
          <Route path="/apply-therapist" element={<ApplyTherapist />} />
          <Route path="/urgent-support" element={<GetHelpNow />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/untangle" element={<UntangleThoughts />} />
          <Route path="/grounding" element={<SomaticGrounding />} />
          <Route path="/soundscape" element={<SoundSanctuary />} />
          <Route path="/hope-board" element={<HopeBoard />} />

          {/* Admin & Governance Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<SuperAdmin />} />
            <Route path="clinical" element={<Dashboard />} />
            <Route path="applications" element={<SuperAdmin />} />
            <Route path="therapists" element={<Therapists />} />
            <Route path="users" element={<Users />} />
            <Route path="communities" element={<Communities />} />
            <Route path="moderation" element={<Moderation />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Bottom Nav for Mobile */}
      <MobileNavigation userAvatar={profile.avatar} />

      {/* Global Command Palette (⌘ K) */}
      <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Editorial Notifications Inbox */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={profile.notifications || []}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onItemClick={handleNotificationClick}
      />
    </div>
  );
}

export default function RootApp() {
  return (
    <HashRouter>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </HashRouter>
  );
}
