import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  HardDrive, 
  Cloud
} from 'lucide-react';
import { getMockDatabase } from '../mockData';
import { HavenLogo } from '../components/HavenLogo';
import { LANGUAGES } from '../i18n';
import type { UserProfile } from '../types';

const GOAL_OPTIONS = [
  { id: 'stress', title: 'Managing stress & academic load', desc: 'Practical grounding tools for high-pressure days.' },
  { id: 'overwhelm', title: 'Feeling less overwhelmed', desc: 'Short 2-minute physiological resets when life moves too fast.' },
  { id: 'routines', title: 'Building gentle routines & habits', desc: 'Steady sleep, hydration, and reflective consistency.' },
  { id: 'thoughts', title: 'Understanding and reframing thoughts', desc: 'Spotting cognitive distortion patterns using CBT.' },
  { id: 'connecting', title: 'Connecting quietly with peers', desc: 'Judgment-free listening rooms and anonymous hope sharing.' },
  { id: 'telehealth', title: 'Finding professional support', desc: 'Licensed therapist consultations and Google Meet telehealth.' }
];

const PALETTES = [
  { id: 'haven', name: 'Haven', desc: 'Soft Indigo & Slate', swatch: '#4656A8' },
  { id: 'ocean', name: 'Ocean', desc: 'Faint Oceanic Mist', swatch: '#3478A6' },
  { id: 'forest', name: 'Forest', desc: 'Muted Sage & Pine', swatch: '#4D7460' },
  { id: 'lavender', name: 'Lavender', desc: 'Soft Dusky Lilac', swatch: '#7663A8' },
  { id: 'sunset', name: 'Sunset', desc: 'Muted Warm Clay', swatch: '#A65E4B' },
  { id: 'monochrome', name: 'Monochrome', desc: 'Clean Charcoal', swatch: '#3E4148' }
];

interface OnboardingProps {
  onComplete: (updatedProfile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const db = getMockDatabase();
  const navigate = useNavigate();
  const currentProfile = db.getUserProfile();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [name, setName] = useState(currentProfile.name || '');
  const [language, setLanguage] = useState(currentProfile.language || 'en');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(currentProfile.primaryGoals || ['Managing stress']);
  const [privacyMode, setPrivacyMode] = useState<'local_only' | 'cloud_sync'>('local_only');
  const [palette, setPalette] = useState<'haven' | 'ocean' | 'forest' | 'lavender' | 'sunset' | 'monochrome'>('haven');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [quietHours, setQuietHours] = useState(true);

  const toggleGoal = (id: string) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter(g => g !== id));
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  const handleFinish = () => {
    const updated: UserProfile = {
      ...currentProfile,
      name: name.trim() || 'Friend',
      avatar: (name.trim() || 'F').charAt(0).toUpperCase(),
      language: language as any,
      primaryGoals: selectedGoals,
      privacyMode,
      palette,
      theme,
      reducedMotion,
      quietHours,
      onboarded: true,
      timeline: [
        {
          id: `tl_init_${Date.now()}`,
          date: 'TODAY',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Entered Haven Sanctuary',
          description: `Configured personal space with ${privacyMode === 'local_only' ? 'Local-Only Mode' : 'Cloud Sync'}.`,
          type: 'checkin'
        }
      ]
    };

    db.setUserProfile(updated);
    localStorage.setItem('haven_onboarded', 'true');
    localStorage.setItem('haven_local_only', String(privacyMode === 'local_only'));
    document.documentElement.dataset.theme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    onComplete(updated);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col justify-between py-10 px-6 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-primary/60 pb-4">
        <HavenLogo size={26} showText={true} />
        <div className="flex items-center space-x-2 text-xs font-mono text-text-muted">
          <span>Step {step} of 4</span>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="py-8 my-auto">
        <AnimatePresence mode="wait">
          {/* ================= STEP 1: YOUR SPACE ================= */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[10.5px] font-black uppercase tracking-widest text-brand-primary">
                  Step 01 — Your Space
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
                  Welcome to Haven. What should we call you?
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Haven is a private sanctuary. You can use your real name, an alias, or initials.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                    Your Name or Anonymous Alias
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sam, Alex, Quiet Soul"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-sec border border-border-primary rounded-2xl text-sm font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                    Preferred Language
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLanguage(lang.code as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          language === lang.code
                            ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                            : 'bg-surface-sec border-border-primary text-text-secondary hover:bg-surface-main'
                        }`}
                      >
                        <span className="font-bold text-xs block">{lang.nativeName}</span>
                        <span className="text-[10px] opacity-75">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 2: WHAT BRINGS YOU HERE ================= */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[10.5px] font-black uppercase tracking-widest text-brand-primary">
                  Step 02 — Intentions
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
                  What would you like Haven to help with?
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Select what matters right now. This shapes your daily recommendations and quiet doorways.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {GOAL_OPTIONS.map((g) => {
                  const isSelected = selectedGoals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGoal(g.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-light/50 border-brand-primary/60 text-brand-primary shadow-2xs'
                          : 'bg-surface-main border-border-primary hover:bg-surface-sec/50 text-text-primary'
                      }`}
                    >
                      <div className="space-y-0.5 pr-3">
                        <h4 className="text-xs font-bold leading-tight">{g.title}</h4>
                        <p className="text-[11px] text-text-secondary font-medium">{g.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-border-primary'
                      }`}>
                        {isSelected && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ================= STEP 3: PRIVACY PREFERENCE ================= */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[10.5px] font-black uppercase tracking-widest text-brand-primary">
                  Step 03 — Data Sovereignty
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
                  Choose how private you want Haven to be.
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your emotional reflections are deeply personal. You have complete control over where they live.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPrivacyMode('local_only')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                    privacyMode === 'local_only'
                      ? 'bg-brand-light/40 border-brand-primary shadow-xs'
                      : 'bg-surface-main border-border-primary hover:bg-surface-sec'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 text-brand-primary">
                    <HardDrive size={18} />
                    <h4 className="text-sm font-extrabold text-text-primary">Keep my reflections strictly on this device</h4>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">
                    Zero cloud synchronization. Your journal entries, CBT reframes, and daily logs remain physically encrypted in your local browser storage.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-accent-teal uppercase tracking-wider">
                    Maximum Privacy • Zero-Trace
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrivacyMode('cloud_sync')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                    privacyMode === 'cloud_sync'
                      ? 'bg-brand-light/40 border-brand-primary shadow-xs'
                      : 'bg-surface-main border-border-primary hover:bg-surface-sec'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 text-brand-primary">
                    <Cloud size={18} />
                    <h4 className="text-sm font-extrabold text-text-primary">Sync securely across devices</h4>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">
                    Encrypted cloud backup allowing you to access your habit streaks and therapist bookings seamlessly across phone and computer.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                    Multi-Device Continuity
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 4: YOUR HAVEN ATMOSPHERE ================= */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[10.5px] font-black uppercase tracking-widest text-brand-primary">
                  Step 04 — Atmosphere & Pace
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
                  Craft your low-stimulation sanctuary.
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Tailor the visual atmosphere and noise level for your comfort.
                </p>
              </div>

              {/* Palette Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                  Color Atmosphere
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PALETTES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPalette(p.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        palette === p.id
                          ? 'bg-brand-light border-brand-primary shadow-2xs'
                          : 'bg-surface-sec border-border-primary hover:bg-surface-main'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-text-primary block">{p.name}</span>
                        <span className="text-[9.5px] text-text-secondary">{p.desc}</span>
                      </div>
                      <span className="w-3 h-3 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: p.swatch }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme & Motion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-surface-sec rounded-xl border border-border-primary space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary uppercase block">Theme Mode</span>
                  <div className="flex gap-1">
                    {['light', 'system', 'dark'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTheme(t as any)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                          theme === t ? 'bg-brand-primary text-white' : 'bg-surface-main text-text-secondary'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-surface-sec rounded-xl border border-border-primary flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">Reduced Motion</span>
                    <span className="text-[10px] text-text-secondary">Low-stimulation animations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-primary"
                  />
                </div>

                <div className="p-3 bg-surface-sec rounded-xl border border-border-primary flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">Quiet Hours (9PM - 8AM)</span>
                    <span className="text-[10px] text-text-secondary">Silence notifications overnight</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={quietHours}
                    onChange={(e) => setQuietHours(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-border-primary/60 pt-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev - 1) as any)}
            className="px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer inline-flex items-center space-x-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev + 1) as any)}
            className="px-7 py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="px-8 py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center space-x-2"
          >
            <span>Enter Your Sanctuary</span>
            <Check size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
