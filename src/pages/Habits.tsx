import React, { useState, useEffect } from 'react';
import { getMockDatabase } from '../mockData';
import type { Habit, DiaryEntry } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, Trash2, Eye, EyeOff, TrendingUp, Calendar, BookOpen, Smile, Sparkles, Heart, Cloud, Moon, Zap, MessageSquare } from 'lucide-react';

const MOOD_OPTIONS = [
  { label: 'Energized', icon: Zap },
  { label: 'Calm',      icon: Sparkles },
  { label: 'Balanced',  icon: Smile },
  { label: 'Anxious',   icon: Cloud },
  { label: 'Low Mood',  icon: Heart },
  { label: 'Overwhelmed', icon: MessageSquare },
  { label: 'Restless',  icon: Moon },
];

export const Habits: React.FC = () => {
  const db = getMockDatabase();
  const [profile, setProfile] = useState(db.getUserProfile());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);

  // Tab state: 'habits' | 'diary'
  const [activeTab, setActiveTab] = useState<'habits' | 'diary'>('habits');

  // Habit form
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Exercise');
  const [formDescription, setFormDescription] = useState('');

  // Diary form
  const [diaryFormOpen, setDiaryFormOpen] = useState(false);
  const [diaryMood, setDiaryMood] = useState(MOOD_OPTIONS[2]);
  const [diaryText, setDiaryText] = useState('');
  const [diaryShare, setDiaryShare] = useState(false);

  useEffect(() => {
    const user = db.getUserProfile();
    setProfile(user);
    setHabits(user.habits || []);
    setDiary(user.diaryEntries || []);
  }, []);

  /* ─── Persist helpers ─────────────────────────────────────── */
  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    const p = { ...profile, habits: updated };
    db.setUserProfile(p);
    setProfile(p);
  };

  const saveDiary = (updated: DiaryEntry[]) => {
    setDiary(updated);
    const p = { ...profile, diaryEntries: updated };
    db.setUserProfile(p);
    setProfile(p);
  };

  /* ─── Date helper ─────────────────────────────────────────── */
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  /* ─── Habit actions ───────────────────────────────────────── */
  const handleToggleComplete = (id: string) => {
    const today = getTodayStr();
    saveHabits(habits.map(h => {
      if (h.id !== id) return h;
      const next = !h.isCompletedToday;
      const hist = { ...h.history };
      if (next) hist[today] = true; else delete hist[today];
      return { ...h, isCompletedToday: next, history: hist };
    }));
  };

  const handleToggleHabitShare = (id: string) =>
    saveHabits(habits.map(h => h.id === id ? { ...h, shareWithTherapist: !h.shareWithTherapist } : h));

  const handleDeleteHabit = (id: string) => {
    if (!window.confirm('Delete this habit?')) return;
    saveHabits(habits.filter(h => h.id !== id));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim()) return;
    saveHabits([...habits, {
      id: `habit_${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      isCompletedToday: false,
      history: {},
      shareWithTherapist: true,
    }]);
    setFormName(''); setFormDescription(''); setHabitFormOpen(false);
  };

  /* ─── Diary actions ───────────────────────────────────────── */
  const handleAddDiaryEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryText.trim()) return;
    const entry: DiaryEntry = {
      id: `diary_${Date.now()}`,
      date: getTodayStr(),
      mood: diaryMood.label,
      text: diaryText.trim(),
      shareWithTherapist: diaryShare,
    };
    saveDiary([entry, ...diary]);
    setDiaryText(''); setDiaryShare(false); setDiaryFormOpen(false);
  };

  const handleToggleDiaryShare = (id: string) =>
    saveDiary(diary.map(d => d.id === id ? { ...d, shareWithTherapist: !d.shareWithTherapist } : d));

  const handleDeleteDiary = (id: string) => {
    if (!window.confirm('Delete this entry?')) return;
    saveDiary(diary.filter(d => d.id !== id));
  };

  /* ─── Stats helpers ───────────────────────────────────────── */

  /**
   * Returns a YYYY-MM-DD string offset by `daysOffset` from today.
   * daysOffset = 0 → today, -1 → yesterday, etc.
   */
  const getDateStr = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  /**
   * 12-hour grace period:
   *   Before noon → the new day is within 12 hrs of midnight,
   *   so yesterday's completion still "counts" as the tail of
   *   the previous day for streak purposes.  This threshold will
   *   be driven by the backend once connected (e.g. user timezone
   *   + configurable reset hour).
   */
  const withinGracePeriod = () => new Date().getHours() < 12;

  /**
   * Counts genuine consecutive completed days.
   * - If today is already checked off, start counting from today.
   * - If today is not checked off but we're within the 12-hour
   *   grace window, start counting from yesterday (streak not yet broken).
   * - Otherwise the streak is 0 unless today is marked.
   *
   * TODO(backend): replace Date.now() snapshot with server-side
   *   timestamp so the grace-period is consistent across timezones
   *   and devices.
   */
  const streak = (h: Habit): number => {
    const today = getDateStr(0);
    let count = 0;
    let cursor = new Date();

    if (h.history[today]) {
      // Today already done — walk backwards including today
    } else if (withinGracePeriod()) {
      // Grace period: don't break streak yet, but today doesn't count
      cursor.setDate(cursor.getDate() - 1);
    } else {
      // Past grace period and today not done → streak broken
      return 0;
    }

    // Walk backwards counting consecutive completed days
    while (true) {
      const yyyy = cursor.getFullYear();
      const mm   = String(cursor.getMonth() + 1).padStart(2, '0');
      const dd   = String(cursor.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      if (h.history[dateStr]) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    return count;
  };

  /** 7-day completion rate (last 7 days). */
  const rate = (h: Habit): number => {
    let completed = 0;
    for (let i = 0; i < 7; i++) {
      const d = getDateStr(-i);
      if (h.history[d]) completed++;
    }
    return Math.round((completed / 7) * 100);
  };

  /* ─── Render ──────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-8"
    >
      {/* Page Header */}
      <div className="pb-6 border-b border-border-primary space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-primary bg-brand-light px-2.5 py-0.5 rounded-full">
            Gentle Wellbeing & Micro-Actions
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">Daily Wellbeing & Habits</h2>
        <p className="text-text-secondary text-xs">
          Build sustainable patterns without guilt. If you missed a day, you simply took a restful day off for yourself.
        </p>
      </div>

      {/* Gentle Philosophy Comfort Banner */}
      <div className="p-4 bg-brand-light/40 border border-brand-primary/15 rounded-2xl flex items-center justify-between text-xs text-text-secondary font-semibold">
        <div className="flex items-center space-x-2">
          <span className="text-base"></span>
          <span><strong>Mindful momentum:</strong> Consistency over perfection. Taking a break is part of healthy progress.</span>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center bg-surface-sec border border-border-primary rounded-[12px] p-1 w-fit gap-1">
        <button
          onClick={() => setActiveTab('habits')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'habits'
              ? 'bg-surface-main shadow-xs text-text-primary border border-border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <CheckSquare size={14} />
          <span>Small Habits & Actions</span>
        </button>
        <button
          onClick={() => setActiveTab('diary')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'diary'
              ? 'bg-surface-main shadow-xs text-text-primary border border-border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <BookOpen size={14} />
          <span>Emotion Diary</span>
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ═══════════════ HABITS TAB ═══════════════ */}
        {activeTab === 'habits' && (
          <motion.div
            key="habits"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="space-y-6"
          >
            {/* Contextual Small Action Suggestions for when overwhelmed */}
            <div className="p-5 bg-surface-main border border-border-primary rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-primary">
                  Feeling overwhelmed right now? Try one small action:
                </span>
                <span className="text-[10px] text-text-muted font-bold">1–5 min steps</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {[
                  { name: '5-Min Desk Reset', desc: 'Clear just your keyboard area' },
                  { name: 'Step Outside', desc: '3 mins of daylight & fresh air' },
                  { name: 'Message a Friend', desc: '1 low-stakes check-in text' },
                  { name: '3 Box Breaths', desc: '4s in, 4s hold, 4s out, 4s hold' }
                ].map((act, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      saveHabits([...habits, {
                        id: `habit_micro_${Date.now()}`,
                        name: act.name,
                        category: 'Mindfulness',
                        description: act.desc,
                        isCompletedToday: true,
                        history: { [getTodayStr()]: true },
                        shareWithTherapist: true
                      }]);
                    }}
                    className="p-3 bg-surface-sec hover:bg-brand-light/50 border border-border-primary hover:border-brand-primary/30 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <h5 className="font-extrabold text-xs text-text-primary group-hover:text-brand-primary transition-colors">
                      + {act.name}
                    </h5>
                    <p className="text-[9.5px] text-text-secondary font-semibold mt-0.5 line-clamp-1">{act.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {/* Add Habit Button row */}
            <div className="flex justify-end">
              <button
                onClick={() => setHabitFormOpen(true)}
                className="inline-flex items-center space-x-1.5 h-10 px-4 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] shadow-xs cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Habit</span>
              </button>
            </div>

            {/* Inline form */}
            {habitFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs overflow-hidden"
              >
                <form onSubmit={handleAddHabit} className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-border-primary/50">
                    <h4 className="font-extrabold text-text-primary text-sm">New Habit</h4>
                    <button type="button" onClick={() => setHabitFormOpen(false)} className="text-[10px] font-bold text-text-muted hover:text-text-secondary cursor-pointer">Cancel</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Habit Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Read a book, Meditate"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        className="w-full bg-surface-sec border border-border-primary text-text-primary px-3 py-2.5 rounded-[10px] text-xs font-semibold focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Category</label>
                      <select
                        value={formCategory}
                        onChange={e => setFormCategory(e.target.value)}
                        className="w-full bg-surface-sec border border-border-primary text-text-primary px-3 py-2.5 rounded-[10px] text-xs font-bold focus:outline-none focus:border-brand-primary cursor-pointer"
                      >
                        <option>Exercise</option>
                        <option>Sleep</option>
                        <option>Journal</option>
                        <option>Mindfulness</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Description</label>
                    <textarea
                      placeholder="Describe the routine..."
                      rows={2}
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      className="w-full bg-surface-sec border border-border-primary text-text-primary px-3 py-2.5 rounded-[10px] text-xs font-semibold focus:outline-none focus:border-brand-primary resize-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-1">
                    <button type="button" onClick={() => setHabitFormOpen(false)} className="h-10 px-4 bg-surface-main hover:bg-surface-sec text-text-primary border border-border-primary text-xs font-bold rounded-[10px] cursor-pointer">Cancel</button>
                    <button type="submit" className="h-10 px-6 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] cursor-pointer">Create Habit</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Habits Grid */}
            {habits.length === 0 ? (
              <div className="text-center py-14 bg-surface-main border border-border-primary rounded-2xl">
                <CheckSquare size={30} className="text-text-muted mx-auto mb-3" />
                <p className="font-extrabold text-text-primary text-sm">No habits yet</p>
                <p className="text-text-secondary text-xs mt-1">Add your first daily routine above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {habits.map(habit => (
                  <motion.div
                    key={habit.id}
                    layout
                    className="bg-surface-main border border-border-primary rounded-2xl p-5 shadow-xs flex flex-col space-y-4 hover:shadow-md transition-all"
                  >
                    {/* Header: category badge + name + delete */}
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="bg-brand-light text-brand-primary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[10px] border border-brand-primary/10 inline-block mb-1.5">
                          {habit.category}
                        </span>
                        <h4 className={`font-extrabold text-sm leading-tight ${habit.isCompletedToday ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                          {habit.name}
                        </h4>
                        <p className="text-[10px] text-text-secondary font-semibold mt-1 leading-relaxed">{habit.description}</p>
                      </div>
                      <button onClick={() => handleDeleteHabit(habit.id)} className="text-text-muted hover:text-accent-rose p-1 rounded cursor-pointer shrink-0 mt-0.5">
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-text-secondary font-semibold pt-2 border-t border-border-primary/40">
                      <span className="flex items-center space-x-1.5">
                        <TrendingUp size={11} className="text-brand-primary" />
                        <span>
                          {streak(habit) > 0
                            ? <span className="text-brand-primary font-extrabold">{streak(habit)} mindful days </span>
                            : <span className="text-text-muted">Rest day / take your time</span>}
                        </span>
                      </span>
                      <span className="flex items-center space-x-1.5"><Calendar size={11} className="text-brand-primary" /><span>Weekly rhythm: {rate(habit)}%</span></span>
                    </div>

                    {/* ── Mark as Done / Undo button ── */}
                    <button
                      onClick={() => handleToggleComplete(habit.id)}
                      className={`w-full h-10 rounded-[10px] text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer border ${
                        habit.isCompletedToday
                          ? 'bg-accent-teal-light border-accent-teal/20 text-accent-teal hover:bg-accent-rose-light hover:border-accent-rose/20 hover:text-accent-rose'
                          : 'bg-brand-light border-brand-primary/15 text-brand-primary hover:bg-brand-primary hover:text-white'
                      }`}
                    >
                      {habit.isCompletedToday ? (
                        <>
                          <svg width="13" height="11" viewBox="0 0 10 8" fill="none" className="shrink-0">
                            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Done today — tap to undo</span>
                        </>
                      ) : (
                        <>
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
                            <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M4 6.5L6 8.5L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Mark as Done</span>
                        </>
                      )}
                    </button>

                    {/* Therapist sharing toggle */}
                    <div className="pt-3 border-t border-border-primary/40 flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider inline-flex items-center space-x-1">
                        {habit.shareWithTherapist
                          ? <><Eye size={11} className="text-accent-teal" /><span className="text-accent-teal">Shared with therapist</span></>
                          : <><EyeOff size={11} className="text-text-muted" /><span className="text-text-muted">Private only</span></>}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={habit.shareWithTherapist} onChange={() => handleToggleHabitShare(habit.id)} className="sr-only peer" />
                        <div className="w-8 h-4.5 bg-surface-sec rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-border-primary after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent-teal" />
                      </label>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════ DIARY TAB ═══════════════ */}
        {activeTab === 'diary' && (
          <motion.div
            key="diary"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="space-y-6"
          >
            {/* Add Entry Button / or inline form */}
            {!diaryFormOpen ? (
              <div className="flex justify-end">
                <button
                  onClick={() => setDiaryFormOpen(true)}
                  className="inline-flex items-center space-x-1.5 h-10 px-4 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] shadow-xs cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Log Today's Emotions</span>
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs overflow-hidden"
              >
                <form onSubmit={handleAddDiaryEntry} className="space-y-5">
                  <div className="flex justify-between items-center pb-2 border-b border-border-primary/50">
                    <h4 className="font-extrabold text-text-primary text-sm">How are you feeling today?</h4>
                    <button type="button" onClick={() => setDiaryFormOpen(false)} className="text-[10px] font-bold text-text-muted hover:text-text-secondary cursor-pointer">Cancel</button>
                  </div>

                  {/* Mood Picker */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Mood</label>
                    <div className="flex flex-wrap gap-2">
                      {MOOD_OPTIONS.map(m => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.label}
                            type="button"
                            onClick={() => setDiaryMood(m)}
                            className={`flex items-center space-x-1.5 px-3 py-2 rounded-[10px] border text-xs font-bold transition-all cursor-pointer ${
                              diaryMood.label === m.label
                                ? 'bg-brand-light border-brand-primary text-brand-primary shadow-xs'
                                : 'bg-surface-sec border-border-primary text-text-secondary hover:border-brand-primary/40 hover:text-text-primary'
                            }`}
                          >
                            <Icon size={14} className="shrink-0" />
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Journal text */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">What's on your mind?</label>
                    <textarea
                      placeholder="Write freely — this is your safe space to vent, reflect, or celebrate..."
                      rows={5}
                      value={diaryText}
                      onChange={e => setDiaryText(e.target.value)}
                      className="w-full bg-surface-sec border border-border-primary text-text-primary px-3 py-2.5 rounded-[10px] text-xs font-semibold focus:outline-none focus:border-brand-primary resize-none"
                    />
                  </div>

                  {/* Share toggle */}
                  <div className="flex items-center justify-between p-3 bg-surface-sec/60 border border-border-primary rounded-[10px]">
                    <div>
                      <p className="text-xs font-bold text-text-primary">Share with my therapist</p>
                      <p className="text-[9px] text-text-secondary mt-0.5">Only your assigned therapist will see this entry.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                      <input type="checkbox" checked={diaryShare} onChange={() => setDiaryShare(!diaryShare)} className="sr-only peer" />
                      <div className="w-8 h-4.5 bg-surface-main border border-border-primary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-border-primary after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent-teal peer-checked:border-accent-teal" />
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-1">
                    <button type="button" onClick={() => setDiaryFormOpen(false)} className="h-10 px-4 bg-surface-main hover:bg-surface-sec text-text-primary border border-border-primary text-xs font-bold rounded-[10px] cursor-pointer">Cancel</button>
                    <button type="submit" className="h-10 px-6 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] cursor-pointer">Save Entry</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Past Entries */}
            {diary.length === 0 ? (
              <div className="text-center py-14 bg-surface-main border border-border-primary rounded-2xl">
                <Smile size={30} className="text-text-muted mx-auto mb-3" />
                <p className="font-extrabold text-text-primary text-sm">No diary entries yet</p>
                <p className="text-text-secondary text-xs mt-1">Log your first emotion entry above to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {diary.map(entry => (
                  <motion.div
                    key={entry.id}
                    layout
                    className="bg-surface-main border border-border-primary rounded-2xl p-5 shadow-xs hover:shadow-md transition-all"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center font-bold text-xs shrink-0 border border-brand-primary/15">
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <span className="font-extrabold text-text-primary text-sm">{entry.mood}</span>
                          <p className="text-[10px] text-text-muted font-semibold mt-0.5">{entry.date}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteDiary(entry.id)} className="text-text-muted hover:text-accent-rose p-1 rounded cursor-pointer shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Entry text */}
                    <p className="mt-3 text-xs text-text-secondary font-semibold leading-relaxed border-t border-border-primary/40 pt-3">
                      {entry.text}
                    </p>

                    {/* Therapist sharing toggle */}
                    <div className="mt-3 pt-3 border-t border-border-primary/40 flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider inline-flex items-center space-x-1">
                        {entry.shareWithTherapist
                          ? <><Eye size={11} className="text-accent-teal" /><span className="text-accent-teal">Shared with therapist</span></>
                          : <><EyeOff size={11} className="text-text-muted" /><span className="text-text-muted">Private only</span></>}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={entry.shareWithTherapist} onChange={() => handleToggleDiaryShare(entry.id)} className="sr-only peer" />
                        <div className="w-8 h-4.5 bg-surface-sec rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-border-primary after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent-teal" />
                      </label>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
