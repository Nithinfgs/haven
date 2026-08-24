import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMockDatabase } from '../mockData';
import type { UserProfile, DailyCheckIn, TimelineEntry } from '../types';
import { 
  ArrowRight, 
  Check, 
  Wind, 
  PauseCircle, 
  Users, 
  Zap, 
  Clock,
  Headphones,
  HeartPulse
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { useLanguage } from '../context/LanguageContext';

const HAVEN_MOMENT_OPTIONS = [
  {
    index: '01',
    id: 'overwhelmed',
    icon: Wind,
    title: 'Racing thoughts',
    summary: 'A two-minute reset for when everything is moving too fast.',
    actionTitle: '2-Minute Physiological Sigh',
    actionDesc: 'Take two deep breaths in through your nose (one full breath, followed immediately by a sharp second inhale), then release with a long, slow sigh out through your mouth. Repeat 4 times.',
    duration: 2,
    suggestedSpaceId: 'circle-stress',
    suggestedSpaceName: 'Circle: De-stress & Nervous System',
    comfortQuote: 'You don’t have to figure out the whole week right now. Just this breath.'
  },
  {
    index: '02',
    id: 'frozen',
    icon: PauseCircle,
    title: 'Frozen or stuck',
    summary: 'Start with one small action to restore gentle momentum.',
    actionTitle: 'The 5-Minute Desk Reset',
    actionDesc: 'Don’t worry about finishing the assignment. Set a 5-minute timer and only clear the physical space right in front of you or write one single messy bullet point.',
    duration: 5,
    suggestedSpaceId: 'motivation-space',
    suggestedSpaceName: 'Motivation & gentle focus',
    comfortQuote: 'Action creates motivation, not the other way around. One tiny step counts.'
  },
  {
    index: '03',
    id: 'lonely',
    icon: Users,
    title: 'Feeling disconnected',
    summary: 'A quieter way to gently anchor and reconnect with others.',
    actionTitle: 'Low-Pressure Presence',
    actionDesc: 'Step into a quiet listening room or read a reassuring note on the Hope Board. You do not need to explain yourself or perform.',
    duration: 3,
    suggestedSpaceId: 'lonely-space',
    suggestedSpaceName: 'I’m feeling lonely',
    comfortQuote: 'You are worthy of connection even on the days you feel in your shell.'
  },
  {
    index: '04',
    id: 'sensory',
    icon: Zap,
    title: 'Too much at once',
    summary: 'Reduce sensory noise and reset the autonomic nervous system.',
    actionTitle: 'Cold Water & Sensory Grounding',
    actionDesc: 'Drink one slow glass of cool water. Look away from your screen and name 3 things in your room that are completely still, and 2 things in motion.',
    duration: 3,
    suggestedSpaceId: 'general-venting',
    suggestedSpaceName: 'General anonymous venting',
    comfortQuote: 'Your nervous system is doing its best to protect you. Give it a gentle moment to settle.'
  }
];

export const Home: React.FC = () => {
  const db = getMockDatabase();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<UserProfile>(db.getUserProfile());

  // Haven Moment States
  const [havenModalOpen, setHavenModalOpen] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<typeof HAVEN_MOMENT_OPTIONS[0]>(HAVEN_MOMENT_OPTIONS[0]);
  const [momentStep, setMomentStep] = useState<'action' | 'timer' | 'complete'>('action');
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  // Daily Check-In States
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [stress, setStress] = useState<'low' | 'moderate' | 'high' | 'overwhelmed'>('moderate');
  const [energy, setEnergy] = useState<'drained' | 'moderate' | 'energized'>('moderate');
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<DailyCheckIn | null>(null);
  const [isSavingCheckIn, setIsSavingCheckIn] = useState(false);

  // Draft session memory
  const [cbtDraft, setCbtDraft] = useState<{ step: number; negativeThought: string } | null>(null);

  // Formatted date string
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  useEffect(() => {
    const u = db.getUserProfile();
    setProfile(u);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCheck = (u.checkIns || []).find(c => c.date === todayStr);
    if (todayCheck) {
      setTodayCheckedIn(true);
      setLastCheckIn(todayCheck);
      setStress(todayCheck.stress);
      setEnergy(todayCheck.energy);
    } else if (u.checkIns && u.checkIns.length > 0) {
      setLastCheckIn(u.checkIns[0]);
    }

    // Check for draft session
    const storedDraft = localStorage.getItem('haven_untangle_draft');
    if (storedDraft) {
      try {
        const parsed = JSON.parse(storedDraft);
        if (parsed.negativeThought && parsed.negativeThought.trim().length > 0) {
          setCbtDraft(parsed);
        }
      } catch {}
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      setMomentStep('complete');
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const openDoorway = (doorway: typeof HAVEN_MOMENT_OPTIONS[0]) => {
    setSelectedFeeling(doorway);
    setTimerSeconds(doorway.duration * 60);
    setTimerActive(false);
    setMomentStep('action');
    setHavenModalOpen(true);
  };

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCheckIn(true);

    setTimeout(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newCheckIn: DailyCheckIn = {
        id: `chk_${Date.now()}`,
        date: todayStr,
        stress,
        energy,
        sleep: 'fair',
        connection: 'neutral',
        timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const newTimelineEntry: TimelineEntry = {
        id: `tl_${Date.now()}`,
        date: 'TODAY',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Daily check-in recorded',
        description: `Stress: ${stress.charAt(0).toUpperCase() + stress.slice(1)} • Energy: ${energy.charAt(0).toUpperCase() + energy.slice(1)}.`,
        type: 'checkin'
      };

      const currentCheckIns = profile.checkIns || [];
      const updatedCheckIns = [newCheckIn, ...currentCheckIns.filter(c => c.date !== todayStr)];
      const currentTimeline = profile.timeline || [];
      const updatedTimeline = [newTimelineEntry, ...currentTimeline];

      const updatedProfile = { 
        ...profile, 
        checkIns: updatedCheckIns,
        timeline: updatedTimeline
      };
      
      db.setUserProfile(updatedProfile);
      setProfile(updatedProfile);
      setTodayCheckedIn(true);
      setLastCheckIn(newCheckIn);
      setIsSavingCheckIn(false);
      setCheckInOpen(false);
    }, 700);
  };

  const allRooms = db.getRooms();
  const keyRooms = allRooms.slice(0, 3);
  const completedHabitsCount = (profile.habits || []).filter(h => h.isCompletedToday).length;
  const totalHabitsCount = (profile.habits || []).length || 4;
  const recentTimeline = profile.timeline || [];

  // Dynamic context conditions
  const isDifficultCheckIn = lastCheckIn && (lastCheckIn.stress === 'high' || lastCheckIn.stress === 'overwhelmed');
  const isFirstTimeUser = !profile.checkIns || profile.checkIns.length === 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 space-y-16 selection:bg-brand-primary/10">
      
      {/* ── 1. QUIET EDITORIAL MASTHEAD ── */}
      <header className="flex items-baseline justify-between border-b border-border-primary/60 pb-4 text-xs font-semibold text-text-muted tracking-tight">
        <span className="text-[11px] font-black uppercase tracking-widest text-text-secondary">
          HAVEN
        </span>
        <div className="flex items-center space-x-3 font-mono text-[11px]">
          <span>{todayFormatted}</span>
          <span className="text-border-primary">•</span>
          <span className="text-accent-teal font-bold">{profile.privacyMode === 'cloud_sync' ? 'Cloud-Sync Active' : 'Local Storage Active'}</span>
        </div>
      </header>

      {/* ── 2. DYNAMIC CONTEXT-AWARE HERO ── */}
      <section className="space-y-3 pt-2 text-center max-w-xl mx-auto">
        {isDifficultCheckIn ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <span className="px-3 py-1 rounded-full bg-accent-rose-light text-accent-rose text-[10.5px] font-extrabold uppercase tracking-wider inline-block">
              Pace Slowed • High Stress Registered
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
              You don’t have to work through<br />everything all at once.
            </h1>
            <p className="text-xs md:text-sm text-text-secondary font-medium pt-1">
              Your autonomic nervous system is on alert. Choose one quiet reset below to gently settle before returning to your day.
            </p>
          </motion.div>
        ) : isFirstTimeUser ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
              A quiet place<br />to begin again.
            </h1>
            <p className="text-xs md:text-sm text-text-secondary font-medium pt-1">
              Welcome to your private sanctuary, {profile.name || 'Friend'}. What’s taking up the most space in your mind right now?
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
              A quiet place<br />to begin again.
            </h1>
            <p className="text-xs md:text-sm text-text-secondary font-medium pt-1">
              Welcome back, {profile.name}. {todayCheckedIn ? 'You recorded your check-in today.' : 'You haven’t checked in yet today.'}
            </p>
          </motion.div>
        )}
      </section>

      {/* ── 3. SESSION CONTINUITY ("CONTINUE WHERE YOU LEFT OFF") ── */}
      {cbtDraft && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-brand-light/40 border border-brand-primary/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-brand-primary block">
              Continue Where You Left Off
            </span>
            <h4 className="text-xs font-bold text-text-primary">
              Untangle My Mind • You stopped after identifying: "{cbtDraft.negativeThought.slice(0, 45)}..."
            </h4>
            <p className="text-[11px] text-text-secondary font-medium">Your draft was preserved automatically on this device.</p>
          </div>
          <Link
            to="/untangle"
            className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-2xs transition-all inline-flex items-center space-x-1.5 shrink-0 self-start sm:self-center"
          >
            <span>Resume Reframe</span>
            <ArrowRight size={13} />
          </Link>
        </motion.div>
      )}

      {/* ── 4. TODAY’S BELIEVABLE DATA DENSITY ── */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-text-muted">
          <span>Today’s Record</span>
          <span>Status</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2">
          {/* Item 1: Daily Check-In */}
          <button
            type="button"
            onClick={() => setCheckInOpen(true)}
            className="p-4 rounded-2xl bg-surface-main border border-border-primary hover:border-brand-primary/40 text-left transition-all cursor-pointer shadow-2xs space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-[10.5px] text-text-muted font-bold">
              <span>Daily Pulse</span>
              {todayCheckedIn ? <Check size={13} className="text-accent-teal" /> : <span className="text-accent-amber font-mono">1 min</span>}
            </div>
            <h4 className="text-xs font-bold text-text-primary">
              {todayCheckedIn ? `Stress: ${stress} • Energy: ${energy}` : 'Not yet recorded today'}
            </h4>
            <span className="text-[10px] text-brand-primary font-semibold block group-hover:underline">
              {todayCheckedIn ? 'Edit check-in →' : 'Record pulse →'}
            </span>
          </button>

          {/* Item 2: Haven Moments */}
          <div className="p-4 rounded-2xl bg-surface-main border border-border-primary text-left shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-[10.5px] text-text-muted font-bold">
              <span>Haven Moments</span>
              <span className="font-mono text-brand-primary">4 available</span>
            </div>
            <h4 className="text-xs font-bold text-text-primary">
              Sigh, Reset, Ground, Noise
            </h4>
            <span className="text-[10px] text-text-muted font-semibold block">
              2 to 5 min self-paced resets
            </span>
          </div>

          {/* Item 3: Habit Routine */}
          <Link
            to="/habits"
            className="p-4 rounded-2xl bg-surface-main border border-border-primary hover:border-brand-primary/40 text-left transition-all cursor-pointer shadow-2xs space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-[10.5px] text-text-muted font-bold">
              <span>Daily Habits</span>
              <span className="font-mono text-brand-primary">{completedHabitsCount} of {totalHabitsCount}</span>
            </div>
            <h4 className="text-xs font-bold text-text-primary">
              {completedHabitsCount === totalHabitsCount ? 'All routines completed' : 'Mindfulness & Sleep active'}
            </h4>
            <span className="text-[10px] text-brand-primary font-semibold block group-hover:underline">
              View habit tracker →
            </span>
          </Link>
        </div>
      </section>

      {/* ── 5. THE 4 DOORWAYS (UNBOXED EDITORIAL DOORS) ── */}
      <section className="space-y-0 divide-y divide-border-primary/70 border-y border-border-primary/70">
        {HAVEN_MOMENT_OPTIONS.map((doorway) => (
          <button
            key={doorway.id}
            type="button"
            onClick={() => openDoorway(doorway)}
            className="w-full py-5 px-2 text-left group transition-all flex items-center justify-between cursor-pointer hover:bg-surface-sec/30"
          >
            <div className="flex items-baseline space-x-6 pr-4">
              <span className="font-mono text-xs font-bold text-text-muted group-hover:text-brand-primary transition-colors shrink-0">
                {doorway.index}
              </span>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-extrabold text-text-primary group-hover:text-brand-primary transition-colors">
                    {doorway.title}
                  </h3>
                  <span className="text-[10px] font-mono text-text-muted opacity-70">
                    {doorway.duration}m
                  </span>
                </div>
                <p className="text-xs text-text-secondary font-medium leading-relaxed">
                  {doorway.summary}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all pl-2">
              <ArrowRight size={15} />
            </div>
          </button>
        ))}
      </section>

      {/* ── 6. RECENTLY USED QUIET SECTION ── */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-text-muted">
          <span>Recently Used</span>
          <span>Quick Access</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <Link
            to="/grounding"
            className="p-3.5 bg-surface-sec/50 hover:bg-surface-sec border border-border-primary rounded-xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-2.5">
              <HeartPulse size={14} className="text-accent-rose" />
              <div>
                <span className="text-xs font-bold text-text-primary block">Grounding Pacer</span>
                <span className="text-[10px] font-mono text-text-muted">Today</span>
              </div>
            </div>
            <ArrowRight size={12} className="text-text-muted group-hover:text-text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/soundscape"
            className="p-3.5 bg-surface-sec/50 hover:bg-surface-sec border border-border-primary rounded-xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-2.5">
              <Headphones size={14} className="text-accent-teal" />
              <div>
                <span className="text-xs font-bold text-text-primary block">Sound Sanctuary</span>
                <span className="text-[10px] font-mono text-text-muted">Yesterday</span>
              </div>
            </div>
            <ArrowRight size={12} className="text-text-muted group-hover:text-text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/chat/circle-stress"
            className="p-3.5 bg-surface-sec/50 hover:bg-surface-sec border border-border-primary rounded-xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-2.5">
              <Users size={14} className="text-brand-primary" />
              <div>
                <span className="text-xs font-bold text-text-primary block">Exam Stress Circle</span>
                <span className="text-[10px] font-mono text-text-muted">3 days ago</span>
              </div>
            </div>
            <ArrowRight size={12} className="text-text-muted group-hover:text-text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </section>

      {/* ── 7. YOUR RECENT PATH & QUIET PERSONAL TIMELINE ── */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-text-muted">
          <span>Your Recent Path</span>
          <span>Timeline Memory</span>
        </div>

        <div className="divide-y divide-border-primary/60 border-y border-border-primary/60">
          {recentTimeline.slice(0, 4).map((entry) => (
            <div key={entry.id} className="py-3.5 px-2 flex items-start justify-between space-x-4">
              <div className="flex items-baseline space-x-4 min-w-0">
                <span className="font-mono text-[10.5px] font-bold text-text-muted shrink-0 w-16">
                  {entry.date}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-text-primary truncate">
                    {entry.title}
                  </h4>
                  <p className="text-[11px] text-text-secondary font-medium mt-0.5 leading-snug">
                    {entry.description}
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] text-text-muted shrink-0">
                {entry.time}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. SANCTUARY INTERACTIVE TOOLKIT ── */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-text-muted">
          <span>Quiet Practice</span>
          <span>Self-Paced</span>
        </div>

        <div className="divide-y divide-border-primary/70 border-y border-border-primary/70">
          
          {/* Tool 1: Untangle Thoughts */}
          <Link
            to="/untangle"
            className="py-4 px-2 flex items-center justify-between group hover:bg-surface-sec/30 transition-all cursor-pointer"
          >
            <div className="flex items-baseline space-x-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 self-center" />
              <div>
                <h4 className="text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                  Untangle My Mind
                </h4>
                <p className="text-[11px] text-text-secondary font-medium mt-0.5">
                  Spot automatic cognitive traps & reframe stressful thoughts using CBT.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-text-muted group-hover:text-brand-primary transition-colors shrink-0 pl-2">
              Enter →
            </span>
          </Link>

          {/* Tool 2: Somatic Grounding */}
          <Link
            to="/grounding"
            className="py-4 px-2 flex items-center justify-between group hover:bg-surface-sec/30 transition-all cursor-pointer"
          >
            <div className="flex items-baseline space-x-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-rose shrink-0 self-center" />
              <div>
                <h4 className="text-xs font-bold text-text-primary group-hover:text-accent-rose transition-colors">
                  Panic SOS & Somatic Grounding
                </h4>
                <p className="text-[11px] text-text-secondary font-medium mt-0.5">
                  5-4-3-2-1 sensory anchor and animated 4-4-4-4 Box Breathing pacer.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-text-muted group-hover:text-accent-rose transition-colors shrink-0 pl-2">
              Enter →
            </span>
          </Link>

          {/* Tool 3: Sound Sanctuary */}
          <Link
            to="/soundscape"
            className="py-4 px-2 flex items-center justify-between group hover:bg-surface-sec/30 transition-all cursor-pointer"
          >
            <div className="flex items-baseline space-x-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-teal shrink-0 self-center" />
              <div>
                <h4 className="text-xs font-bold text-text-primary group-hover:text-accent-teal transition-colors">
                  Sound Sanctuary
                </h4>
                <p className="text-[11px] text-text-secondary font-medium mt-0.5">
                  Mix ambient rain, 432Hz focus waves & ocean swells with sleep timer.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-text-muted group-hover:text-accent-teal transition-colors shrink-0 pl-2">
              Enter →
            </span>
          </Link>

          {/* Tool 4: Hope Board */}
          <Link
            to="/hope-board"
            className="py-4 px-2 flex items-center justify-between group hover:bg-surface-sec/30 transition-all cursor-pointer"
          >
            <div className="flex items-baseline space-x-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-amber shrink-0 self-center" />
              <div>
                <h4 className="text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                  Leaves of Hope
                </h4>
                <p className="text-[11px] text-text-secondary font-medium mt-0.5">
                  Anonymous encouragement notes and quiet presence from peers.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-text-muted group-hover:text-brand-primary transition-colors shrink-0 pl-2">
              Enter →
            </span>
          </Link>

        </div>
      </section>

      {/* ── 9. QUIET CONNECTION — PEER ROOMS & 1-ON-1 TELEHEALTH ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border-primary/60">
        {/* Left: Peer Listening Circles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-text-muted">
              Listening Circles
            </span>
            <Link to="/community" className="text-xs font-bold text-brand-primary hover:underline">
              All circles →
            </Link>
          </div>

          <div className="space-y-2">
            {keyRooms.map((room) => (
              <Link
                key={room.id}
                to={`/chat/${room.id}`}
                className="block py-2.5 px-2 hover:bg-surface-sec/40 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                    {t(room.id, room.name)}
                  </h5>
                  <span className="text-[10px] font-mono text-text-muted">
                    {room.activeMembers} online
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary font-medium line-clamp-1 mt-0.5">
                  {t(`${room.id}-desc`, room.description)}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Private Telehealth & Licensed Providers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-text-muted">
              1-on-1 Consultation
            </span>
            <Link to="/therapists" className="text-xs font-bold text-brand-primary hover:underline">
              Directory →
            </Link>
          </div>

          <div className="p-4 bg-surface-sec/30 border border-border-primary/70 rounded-2xl space-y-3">
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Connect in a confidential session with a licensed counselor or trained listener via encrypted Google Meet.
            </p>
            <div className="flex items-center justify-between pt-1">
              <Link
                to="/talk-now"
                className="text-xs font-extrabold text-brand-primary hover:underline inline-flex items-center space-x-1"
              >
                <span>Connect Privately</span>
                <ArrowRight size={12} />
              </Link>
              <span className="text-[10px] font-mono text-text-muted">
                Avg wait: &lt; 2 mins
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. DISCREET CRISIS FOOTNOTE ── */}
      <footer className="text-center pt-8 pb-4 border-t border-border-primary/40">
        <Link
          to="/urgent-support"
          className="text-xs font-semibold text-text-muted hover:text-accent-rose transition-colors inline-flex items-center space-x-1"
        >
          <span>In acute distress or crisis? Access 24/7 free clinical helplines →</span>
        </Link>
      </footer>

      {/* ── HAVEN MOMENT RESET MODAL ── */}
      <Modal
        isOpen={havenModalOpen}
        onClose={() => {
          setHavenModalOpen(false);
          setTimerActive(false);
        }}
        title="Haven Reset"
      >
        <div className="space-y-6 py-1">
          {momentStep === 'action' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                  {selectedFeeling.duration}-Minute Reset
                </span>
                <h4 className="text-base font-extrabold text-text-primary">
                  {selectedFeeling.actionTitle}
                </h4>
              </div>

              <div className="p-4 bg-surface-sec/60 rounded-2xl border border-border-primary text-xs leading-relaxed text-text-secondary font-medium">
                {selectedFeeling.actionDesc}
              </div>

              <div className="p-4 rounded-2xl bg-surface-main border border-border-primary italic text-xs text-text-secondary text-center">
                "{selectedFeeling.comfortQuote}"
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTimerActive(true);
                    setMomentStep('timer');
                  }}
                  className="flex-1 h-11 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Clock size={14} />
                  <span>Begin {selectedFeeling.duration}-Minute Timer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMomentStep('complete')}
                  className="px-4 h-11 bg-surface-sec hover:bg-surface-main text-text-secondary text-xs font-bold rounded-xl border border-border-primary transition-colors cursor-pointer"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {momentStep === 'timer' && (
            <div className="py-6 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-brand-light border border-brand-primary/20 flex flex-col items-center justify-center mx-auto text-brand-primary">
                <span className="text-2xl font-black font-mono">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider">Remaining</span>
              </div>

              <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                Take this quiet moment just for you. Close your eyes or simply pause.
              </p>

              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setTimerActive(!timerActive)}
                  className="px-4 py-2 bg-surface-sec hover:bg-surface-main text-text-primary text-xs font-bold rounded-xl border border-border-primary transition-colors cursor-pointer"
                >
                  {timerActive ? 'Pause' : 'Resume'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerActive(false);
                    setMomentStep('complete');
                  }}
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Finish Early
                </button>
              </div>
            </div>
          )}

          {momentStep === 'complete' && (
            <div className="text-center py-4 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-accent-teal-light text-accent-teal flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-text-primary">
                  Moment Complete
                </h4>
                <p className="text-xs text-text-secondary max-w-xs mx-auto">
                  You took a conscious pause for yourself today. That matters.
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setHavenModalOpen(false)}
                  className="px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Return to Sanctuary
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ── DAILY CHECK-IN MODAL ── */}
      <Modal
        isOpen={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        title="Confidential Daily Check-In"
      >
        <form onSubmit={handleSaveCheckIn} className="space-y-6 py-1">
          {/* Stress Level */}
          <div className="space-y-2">
            <span className="text-[10.5px] font-bold text-text-secondary uppercase tracking-wider block">
              Current Stress Level
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'low', label: 'Calm' },
                { id: 'moderate', label: 'Manageable' },
                { id: 'high', label: 'Elevated' },
                { id: 'overwhelmed', label: 'High' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStress(s.id as any)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    stress === s.id
                      ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                      : 'bg-surface-sec border-border-primary text-text-secondary hover:bg-surface-main'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-2">
            <span className="text-[10.5px] font-bold text-text-secondary uppercase tracking-wider block">
              Energy Today
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'drained', label: 'Low / Tired' },
                { id: 'moderate', label: 'Steady' },
                { id: 'energized', label: 'Energetic' },
              ].map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEnergy(e.id as any)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    energy === e.id
                      ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                      : 'bg-surface-sec border-border-primary text-text-secondary hover:bg-surface-main'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border-primary">
            <button
              type="button"
              onClick={() => setCheckInOpen(false)}
              className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingCheckIn}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center space-x-2 ${
                isSavingCheckIn
                  ? 'bg-surface-sec text-text-muted border border-border-primary cursor-wait'
                  : 'bg-brand-primary hover:bg-brand-hover text-white cursor-pointer'
              }`}
            >
              {isSavingCheckIn ? (
                <>
                  <span className="w-3 h-3 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Check-In</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
