import React, { useState, useEffect } from 'react';
import { getMockDatabase } from '../mockData';
import type { UserProfile } from '../types';
import { 
  Trash2, 
  Check, 
  FileText, 
  Download, 
  MessageSquarePlus,
  Moon,
  CheckCircle2
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { FeedbackModal } from '../components/FeedbackModal';
import { LANGUAGES, type SupportedLanguage } from '../i18n';
import { useLanguage } from '../context/LanguageContext';

export const Profile: React.FC = () => {
  const db = getMockDatabase();
  const { language: currentLang, setLanguage: setGlobalLanguage } = useLanguage();
  const [profile, setProfile] = useState<UserProfile>(db.getUserProfile());

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'account' | 'space' | 'privacy' | 'notifications'>('account');

  // Local editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedEmail, setEditedEmail] = useState(profile.email || 'sam.student@haven.internal');
  const [editedAgeRange, setEditedAgeRange] = useState(profile.ageRange);
  const [editedSchool, setEditedSchool] = useState(profile.school || '');
  const [editedGrade, setEditedGrade] = useState(profile.grade || '');
  const [editedBio, setEditedBio] = useState(profile.bio || '');

  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Settings saved successfully');

  // Privacy toggles
  const [localOnlyMode, setLocalOnlyMode] = useState<boolean>(() => {
    return localStorage.getItem('haven_local_only') === 'true' || profile.privacyMode === 'local_only';
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(profile.reducedMotion || false);
  const [quietHours, setQuietHours] = useState<boolean>(profile.quietHours !== false);

  // Modals
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'disclaimer' | 'copyright'>('terms');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  useEffect(() => {
    const user = db.getUserProfile();
    setProfile(user);
    setEditedName(user.name);
    setEditedAgeRange(user.ageRange);
    setEditedSchool(user.school || '');
    setEditedGrade(user.grade || '');
    setEditedBio(user.bio || '');
    setReducedMotion(user.reducedMotion || false);
    setQuietHours(user.quietHours !== false);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3500);
  };

  const handleSaveProfile = () => {
    const updated: UserProfile = {
      ...profile,
      name: editedName.trim() || profile.name,
      email: editedEmail.trim(),
      ageRange: editedAgeRange,
      school: editedSchool.trim(),
      grade: editedGrade,
      bio: editedBio.trim(),
      avatar: (editedName.trim() || profile.name).charAt(0).toUpperCase(),
    };
    db.setUserProfile(updated);
    setProfile(updated);
    setIsEditing(false);
    triggerToast('Personal details updated');
  };

  const toggleLocalOnly = (enabled: boolean) => {
    setLocalOnlyMode(enabled);
    localStorage.setItem('haven_local_only', String(enabled));
    const updated: UserProfile = {
      ...profile,
      privacyMode: enabled ? 'local_only' : 'cloud_sync'
    };
    db.setUserProfile(updated);
    setProfile(updated);
    triggerToast(
      enabled 
        ? 'Local-Only Mode active. Cloud synchronization paused.' 
        : 'Cloud Synchronization enabled.'
    );
  };

  const toggleMotion = (enabled: boolean) => {
    setReducedMotion(enabled);
    const updated: UserProfile = { ...profile, reducedMotion: enabled };
    db.setUserProfile(updated);
    setProfile(updated);
    triggerToast(`Reduced motion ${enabled ? 'enabled' : 'disabled'}`);
  };

  const toggleQuiet = (enabled: boolean) => {
    setQuietHours(enabled);
    const updated: UserProfile = { ...profile, quietHours: enabled };
    db.setUserProfile(updated);
    setProfile(updated);
    triggerToast(`Quiet hours (9PM–8AM) ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    const updated: UserProfile = { ...profile, theme };
    db.setUserProfile(updated);
    setProfile(updated);

    let resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = resolved;
    triggerToast(`Theme set to ${theme}`);
  };

  const handlePaletteChange = (palette: 'haven' | 'ocean' | 'forest' | 'lavender' | 'sunset' | 'monochrome') => {
    const updated: UserProfile = { ...profile, palette };
    db.setUserProfile(updated);
    setProfile(updated);
    document.documentElement.dataset.palette = palette;
    triggerToast(`Atmosphere set to ${palette.charAt(0).toUpperCase() + palette.slice(1)}`);
  };

  const handleLanguageChange = (code: SupportedLanguage) => {
    setGlobalLanguage(code);
    const updated: UserProfile = { ...profile, language: code };
    db.setUserProfile(updated);
    setProfile(updated);
    triggerToast(`Language updated`);
  };

  const handleExportData = () => {
    const fullData = {
      profile: db.getUserProfile(),
      appointments: profile.upcomingSessions,
      habits: profile.habits || [],
      checkIns: profile.checkIns || [],
      timeline: profile.timeline || [],
      diaryEntries: profile.diaryEntries || [],
      exportDate: new Date().toISOString(),
      privacyNotice: 'This is your complete, confidential on-device health record from Haven.'
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haven_confidential_record_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Confidential health record exported');
  };

  const handlePurgeAllData = () => {
    if (window.confirm('Are you sure you want to purge all local data? This will clear your check-in, habit streak, and session history on this device.')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.hash = '#/landing';
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12 selection:bg-brand-primary/10">
      
      {/* Toast Notification */}
      {showSaveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4">
          <div className="bg-surface-main border border-brand-primary text-text-primary text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg flex items-center space-x-2">
            <CheckCircle2 size={15} className="text-accent-teal" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ── 1. QUIET EDITORIAL MASTHEAD ── */}
      <header className="flex items-baseline justify-between border-b border-border-primary/60 pb-4 text-xs font-semibold text-text-muted tracking-tight">
        <span className="text-[11px] font-black uppercase tracking-widest text-text-secondary">
          SETTINGS & ACCOUNT
        </span>
        <span className="font-mono text-[11px]">
          {localOnlyMode ? 'Local-Only Mode' : 'Cloud-Sync Active'}
        </span>
      </header>

      {/* ── 2. EDITORIAL HERO ── */}
      <section className="space-y-2 max-w-xl">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Your Space, Security & Pace
        </h1>
        <p className="text-xs text-text-secondary leading-relaxed">
          Manage your personal details, data sovereignty, visual atmosphere, and quiet hours.
        </p>
      </section>

      {/* ── 3. MATURE SETTINGS SUB-TABS ── */}
      <div className="flex border-b border-border-primary/70 gap-6 text-xs font-bold">
        {[
          { id: 'account', label: 'Account & Identity' },
          { id: 'space', label: 'Haven Space & Atmosphere' },
          { id: 'privacy', label: 'Privacy & Data Sovereignty' },
          { id: 'notifications', label: 'Notifications & Quiet Hours' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === tab.id
                ? 'border-brand-primary text-brand-primary font-black'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="space-y-10">
        
        {/* ================= TAB 1: ACCOUNT & IDENTITY ================= */}
        {activeTab === 'account' && (
          <div className="space-y-8 divide-y divide-border-primary/60">
            {/* Profile Info */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Personal Details</h3>
                  <p className="text-xs text-text-secondary">Used for peer spaces and therapist appointments.</p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Edit Info
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-1.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="p-4 rounded-2xl bg-surface-main border border-border-primary space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Name / Alias</span>
                    <p className="text-xs font-bold text-text-primary">{profile.name}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-main border border-border-primary space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Age Range</span>
                    <p className="text-xs font-bold text-text-primary">{profile.ageRange || '15–17'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-main border border-border-primary space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">School / Grade</span>
                    <p className="text-xs font-bold text-text-primary">{profile.school ? `${profile.school} • ${profile.grade}` : 'Not specified'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-main border border-border-primary space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Personal Bio</span>
                    <p className="text-xs text-text-secondary line-clamp-2">{profile.bio || 'Taking things one day at a time.'}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Name / Alias</label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-sec border border-border-primary rounded-xl text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Email Address</label>
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-sec border border-border-primary rounded-xl text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">School Name</label>
                    <input
                      type="text"
                      value={editedSchool}
                      onChange={(e) => setEditedSchool(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-sec border border-border-primary rounded-xl text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Personal Bio</label>
                    <input
                      type="text"
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-sec border border-border-primary rounded-xl text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Connected Accounts & Security */}
            <div className="space-y-3 pt-6">
              <h3 className="text-sm font-bold text-text-primary">Connected Accounts & Credentials</h3>
              <div className="flex items-center justify-between p-4 bg-surface-sec/40 border border-border-primary rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Google Single Sign-On</h4>
                  <p className="text-[11px] text-text-secondary font-medium">Linked for Google Calendar and Google Meet sessions.</p>
                </div>
                <span className="px-2.5 py-1 bg-surface-main text-accent-teal border border-border-primary text-[10px] font-bold rounded-lg">
                  Connected
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: HAVEN SPACE & ATMOSPHERE ================= */}
        {activeTab === 'space' && (
          <div className="space-y-8 divide-y divide-border-primary/60">
            {/* Color Atmospheres */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-text-primary">Color Atmospheres</h3>
              <p className="text-xs text-text-secondary">Low-stimulation, scientifically balanced palettes.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {[
                  { id: 'haven', name: 'Haven', desc: 'Soft Indigo & Slate', swatch: '#4656A8' },
                  { id: 'ocean', name: 'Ocean', desc: 'Faint Oceanic Mist', swatch: '#3478A6' },
                  { id: 'forest', name: 'Forest', desc: 'Muted Sage & Pine', swatch: '#4D7460' },
                  { id: 'lavender', name: 'Lavender', desc: 'Soft Dusky Lilac', swatch: '#7663A8' },
                  { id: 'sunset', name: 'Sunset', desc: 'Muted Warm Clay', swatch: '#A65E4B' },
                  { id: 'monochrome', name: 'Monochrome', desc: 'Clean Charcoal', swatch: '#3E4148' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePaletteChange(p.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      (profile.palette || 'haven') === p.id
                        ? 'bg-brand-light border-brand-primary shadow-2xs'
                        : 'bg-surface-main border-border-primary hover:bg-surface-sec'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-text-primary block">{p.name}</span>
                      <span className="text-[10px] text-text-secondary">{p.desc}</span>
                    </div>
                    <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: p.swatch }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Theme & Reduced Motion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="p-4 bg-surface-sec/40 border border-border-primary rounded-2xl space-y-2">
                <span className="text-[10.5px] font-bold text-text-secondary uppercase">Theme Mode</span>
                <div className="flex gap-1">
                  {['light', 'system', 'dark'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleThemeChange(t as any)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        profile.theme === t ? 'bg-brand-primary text-white shadow-2xs' : 'bg-surface-main text-text-secondary border border-border-primary'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-surface-sec/40 border border-border-primary rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Reduced Motion</h4>
                  <p className="text-[10.5px] text-text-secondary">Lower visual stimulation across animations.</p>
                </div>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => toggleMotion(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary"
                />
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-3 pt-6">
              <h3 className="text-sm font-bold text-text-primary">Interface Language</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      (currentLang || profile.language || 'en') === lang.code
                        ? 'bg-brand-light border-brand-primary text-brand-primary shadow-2xs'
                        : 'bg-surface-main border-border-primary text-text-secondary hover:bg-surface-sec'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-xs text-text-primary block">{lang.nativeName}</span>
                      <span className="text-[9.5px] text-text-muted">{lang.name}</span>
                    </div>
                    {(currentLang || profile.language || 'en') === lang.code && (
                      <Check size={14} className="text-brand-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PRIVACY & DATA SOVEREIGNTY ================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-8 divide-y divide-border-primary/60">
            {/* Local-Only Mode Toggle with Explicit Consequences */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Local-Only Mode</h3>
                  <p className="text-xs text-text-secondary">Control whether your reflections leave this physical device.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleLocalOnly(!localOnlyMode)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    localOnlyMode 
                      ? 'bg-accent-teal-light text-accent-teal border border-accent-teal/30'
                      : 'bg-surface-sec text-text-secondary border border-border-primary'
                  }`}
                >
                  {localOnlyMode ? 'Active (Local-Only)' : 'Inactive (Cloud-Sync)'}
                </button>
              </div>

              {/* Consequential State Banner */}
              <div className="p-4 rounded-2xl bg-surface-sec/60 border border-border-primary text-xs leading-relaxed text-text-secondary space-y-1.5">
                <span className="font-bold text-text-primary block">
                  {localOnlyMode ? 'Cloud synchronisation paused.' : 'Cloud synchronisation active.'}
                </span>
                <p>
                  {localOnlyMode 
                    ? 'New CBT reflections, journal entries, and check-ins will remain physically stored on this device. Existing cloud data will not be deleted.'
                    : 'Your reflections are encrypted and safely backed up to your account across all logged-in devices.'}
                </p>
              </div>
            </div>

            {/* Export & Data Purge */}
            <div className="space-y-4 pt-6">
              <h3 className="text-sm font-bold text-text-primary">Data Management & Export</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="p-4 bg-surface-main hover:bg-surface-sec text-text-primary border border-border-primary rounded-2xl text-left transition-all cursor-pointer space-y-1 shadow-2xs"
                >
                  <div className="flex items-center space-x-2 text-brand-primary">
                    <Download size={15} />
                    <span className="text-xs font-bold">Export My Data (.JSON)</span>
                  </div>
                  <p className="text-[11px] text-text-secondary font-medium">Download your complete confidential health and CBT history.</p>
                </button>

                <button
                  type="button"
                  onClick={handlePurgeAllData}
                  className="p-4 bg-surface-main hover:bg-accent-rose-light/20 text-accent-rose border border-border-primary rounded-2xl text-left transition-all cursor-pointer space-y-1 shadow-2xs"
                >
                  <div className="flex items-center space-x-2">
                    <Trash2 size={15} />
                    <span className="text-xs font-bold">Purge Local Storage</span>
                  </div>
                  <p className="text-[11px] text-text-secondary font-medium">Erase all cached reflections and session state on this browser.</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: NOTIFICATIONS & QUIET HOURS ================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 pt-2">
            <h3 className="text-sm font-bold text-text-primary">Notification Schedule</h3>
            
            <div className="p-4 bg-surface-sec/40 border border-border-primary rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 text-brand-primary">
                  <Moon size={15} />
                  <h4 className="text-xs font-bold text-text-primary">Overnight Quiet Hours</h4>
                </div>
                <p className="text-[11px] text-text-secondary">Silence all non-urgent notifications between 9:00 PM and 8:00 AM.</p>
              </div>
              <input
                type="checkbox"
                checked={quietHours}
                onChange={(e) => toggleQuiet(e.target.checked)}
                className="w-4 h-4 rounded text-brand-primary"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10.5px] font-bold text-text-secondary uppercase">Notification Categories</span>
              {[
                { title: 'Personal Reflection Prompts', desc: 'Gentle evening reminders to record your pulse.' },
                { title: 'Hope Board & Community Presence', desc: 'Alerts when peers support your anonymous message.' },
                { title: 'Telehealth Consultations', desc: 'Appointment reminders 1 hour before Google Meet sessions.' },
                { title: 'Security & Sovereignty Updates', desc: 'Data export confirmations and key rotation notices.' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-surface-main border border-border-primary rounded-xl flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">{item.title}</h5>
                    <p className="text-[10.5px] text-text-secondary">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-primary" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── 4. DEVELOPER FEEDBACK & GOVERNANCE ROW ── */}
      <section className="pt-10 border-t border-border-primary/70 space-y-4">
        {/* Developer Feedback Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-brand-light/30 border border-brand-primary/20 rounded-3xl">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-brand-primary">
              <MessageSquarePlus size={16} />
              <span className="text-xs font-extrabold text-text-primary uppercase tracking-wider">
                Direct Developer Task Box & Feedback
              </span>
            </div>
            <p className="text-xs text-text-secondary font-medium">
              Report bugs, suggest features, or message lead developer <strong>nithinselvaraj9@gmail.com</strong>.
            </p>
          </div>
          <button
            onClick={() => setFeedbackModalOpen(true)}
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-2 shrink-0 shadow-xs"
          >
            <MessageSquarePlus size={14} />
            <span>Give Feedback</span>
          </button>
        </div>

        {/* Legal & Policy Modal Trigger */}
        <div className="flex items-center justify-between p-4 bg-surface-sec/30 border border-border-primary rounded-2xl text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-text-primary">Legal Terms & Liability Governance</span>
            <p className="text-[11px] text-text-secondary">Indian Contract Act 1872 • Copyright Act 1957 Section 19 • Use At Own Risk</p>
          </div>
          <button
            onClick={() => setLegalModalOpen(true)}
            className="px-3.5 py-1.5 bg-surface-main hover:bg-surface-sec text-text-primary border border-border-primary rounded-xl font-bold text-xs cursor-pointer inline-flex items-center space-x-1.5"
          >
            <FileText size={13} />
            <span>View Policy</span>
          </button>
        </div>
      </section>

      {/* ── LEGAL TERMS MODAL ── */}
      <Modal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        title="Haven Legal & Governance Framework"
      >
        <div className="space-y-4 py-2 text-xs text-text-secondary leading-relaxed">
          <div className="flex border-b border-border-primary gap-4 pb-2 font-bold text-[11px]">
            <button
              onClick={() => setLegalTab('terms')}
              className={`pb-1 cursor-pointer ${legalTab === 'terms' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-muted'}`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setLegalTab('disclaimer')}
              className={`pb-1 cursor-pointer ${legalTab === 'disclaimer' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-muted'}`}
            >
              Medical Disclaimer
            </button>
            <button
              onClick={() => setLegalTab('copyright')}
              className={`pb-1 cursor-pointer ${legalTab === 'copyright' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-muted'}`}
            >
              IP & Attribution
            </button>
          </div>

          {legalTab === 'terms' && (
            <div className="space-y-2">
              <p>Haven is an educational and peer support web sanctuary. By using this service, you acknowledge that Haven does not constitute emergency clinical intervention.</p>
              <p>All user reflections stored in Local-Only Mode reside solely on your physical client device.</p>
            </div>
          )}

          {legalTab === 'disclaimer' && (
            <div className="space-y-2">
              <p><strong>Strict Medical Disclaimer:</strong> If you are experiencing acute suicidal ideation, self-harm impulses, or severe psychological emergencies, immediately call <strong>988</strong> (US/Canada), <strong>112</strong> (India/EU), or the <strong>Vandrevala Foundation Helpline</strong> at <code>+91 9999 666 555</code>.</p>
            </div>
          )}

          {legalTab === 'copyright' && (
            <div className="space-y-2">
              <p><strong>Sole Founder, Product Architect & Lead Engineer:</strong> Nithin Selvaraj (100% Sole Ownership)</p>
              <p><strong>Effective Date:</strong> August 25, 2026</p>
              <p>All concepts, system architecture, source code, brand assets, and derivative products of Haven are exclusively and solely owned by Nithin Selvaraj under the Indian Copyright Act, 1957 (Section 19) and global intellectual property laws.</p>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-border-primary">
            <button
              onClick={() => setLegalModalOpen(false)}
              className="px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* ── FEEDBACK MODAL ── */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        userName={profile.name}
        userEmail={profile.email}
      />

    </div>
  );
};
