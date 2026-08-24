import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Bookmark, 
  MoreVertical, 
  Copy, 
  Trash2, 
  CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMockDatabase } from '../mockData';

interface Distortion {
  id: string;
  name: string;
  description: string;
  example: string;
}

interface SavedReframe {
  id: string;
  original: string;
  reframed: string;
  date: string;
  distortions: string[];
}

const DISTORTIONS: Distortion[] = [
  {
    id: 'catastrophizing',
    name: 'Catastrophizing',
    description: 'Assuming the absolute worst-case scenario is guaranteed.',
    example: '"If I mess up this test, my entire future is ruined."'
  },
  {
    id: 'all-or-nothing',
    name: 'All-or-Nothing Thinking',
    description: 'Viewing performance in black-or-white extremes with zero middle ground.',
    example: '"If I am not completely perfect, I am a total failure."'
  },
  {
    id: 'mind-reading',
    name: 'Mind Reading',
    description: 'Assuming you know others are judging you with zero verbal evidence.',
    example: '"They looked at me for a second, they must think I am strange."'
  },
  {
    id: 'fortune-telling',
    name: 'Fortune Telling',
    description: 'Predicting negative outcomes as if they are already factual certainty.',
    example: '"I just know I will freeze up during the presentation tomorrow."'
  },
  {
    id: 'emotional-reasoning',
    name: 'Emotional Reasoning',
    description: 'Believing that because you feel anxious, the situation must be dangerous.',
    example: '"I feel terrified, so something terrible is bound to happen."'
  },
  {
    id: 'overgeneralization',
    name: 'Overgeneralization',
    description: 'Treating a single setback as an eternal, unchangeable pattern.',
    example: '"I couldn’t answer that question; I always fail at everything."'
  }
];

const STEP_TITLES = [
  { step: 1, label: '01 — Notice', subtitle: 'Acknowledge the heavy thought' },
  { step: 2, label: '02 — Identify Trap', subtitle: 'Spot the distortion filter' },
  { step: 3, label: '03 — Reality Check', subtitle: 'Test against factual evidence' },
  { step: 4, label: '04 — Reframe', subtitle: 'Construct a balanced reality' }
];

export const UntangleThoughts: React.FC = () => {
  const db = getMockDatabase();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(() => {
    // Draft recovery
    const draft = localStorage.getItem('haven_untangle_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.step) return parsed.step;
      } catch {}
    }
    return 1;
  });

  const [negativeThought, setNegativeThought] = useState(() => {
    const draft = localStorage.getItem('haven_untangle_draft');
    return draft ? JSON.parse(draft).negativeThought || '' : '';
  });

  const [selectedDistortions, setSelectedDistortions] = useState<string[]>(() => {
    const draft = localStorage.getItem('haven_untangle_draft');
    return draft ? JSON.parse(draft).selectedDistortions || [] : [];
  });

  const [evidenceAgainst, setEvidenceAgainst] = useState(() => {
    const draft = localStorage.getItem('haven_untangle_draft');
    return draft ? JSON.parse(draft).evidenceAgainst || '' : '';
  });

  const [friendPerspective, setFriendPerspective] = useState(() => {
    const draft = localStorage.getItem('haven_untangle_draft');
    return draft ? JSON.parse(draft).friendPerspective || '' : '';
  });

  const [reframedThought, setReframedThought] = useState(() => {
    const draft = localStorage.getItem('haven_untangle_draft');
    return draft ? JSON.parse(draft).reframedThought || '' : '';
  });

  // Saving state machine
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [autosaveText, setAutosaveText] = useState('Saved automatically · On this device');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Saved reframes
  const [savedReflections, setSavedReflections] = useState<SavedReframe[]>(() => {
    try {
      const stored = localStorage.getItem('haven_cbt_reframes');
      return stored ? JSON.parse(stored) : [
        {
          id: 'reframe_1',
          original: 'I am completely behind and will fail this semester.',
          reframed: 'I have 3 challenging assignments, but I have finished difficult semesters before by taking one chapter at a time.',
          date: 'Yesterday, 21:30',
          distortions: ['catastrophizing', 'all-or-nothing']
        }
      ];
    } catch {
      return [];
    }
  });

  // Autosave draft to local storage
  useEffect(() => {
    const draftObj = {
      step,
      negativeThought,
      selectedDistortions,
      evidenceAgainst,
      friendPerspective,
      reframedThought,
      updatedAt: Date.now()
    };
    localStorage.setItem('haven_untangle_draft', JSON.stringify(draftObj));
    setAutosaveText('Draft saved locally');
  }, [step, negativeThought, selectedDistortions, evidenceAgainst, friendPerspective, reframedThought]);

  const toggleDistortion = (id: string) => {
    setSelectedDistortions((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSaveReframe = () => {
    if (!reframedThought.trim()) return;
    setSaveStatus('saving');

    setTimeout(() => {
      const newEntry: SavedReframe = {
        id: `reframe_${Date.now()}`,
        original: negativeThought.trim(),
        reframed: reframedThought.trim(),
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        distortions: selectedDistortions
      };

      const updated = [newEntry, ...savedReflections];
      setSavedReflections(updated);
      localStorage.setItem('haven_cbt_reframes', JSON.stringify(updated));
      localStorage.removeItem('haven_untangle_draft');

      // Also append to User timeline memory
      const profile = db.getUserProfile();
      const newTimelineItem = {
        id: `tl_${Date.now()}`,
        date: 'TODAY',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Reframed a difficult thought',
        description: `Constructed balanced reframe: "${newEntry.reframed.slice(0, 60)}..."`,
        type: 'cbt' as const
      };
      db.setUserProfile({
        ...profile,
        timeline: [newTimelineItem, ...(profile.timeline || [])]
      });

      setSaveStatus('saved');
    }, 900);
  };

  const handleStartFresh = () => {
    localStorage.removeItem('haven_untangle_draft');
    setNegativeThought('');
    setSelectedDistortions([]);
    setEvidenceAgainst('');
    setFriendPerspective('');
    setReframedThought('');
    setSaveStatus('idle');
    setStep(1);
  };

  const handleDeleteReframe = (id: string) => {
    const updated = savedReflections.filter(r => r.id !== id);
    setSavedReflections(updated);
    localStorage.setItem('haven_cbt_reframes', JSON.stringify(updated));
    setMenuOpenId(null);
  };

  const handleCopyReframe = (text: string) => {
    navigator.clipboard.writeText(text);
    setMenuOpenId(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 space-y-12 selection:bg-brand-primary/10">
      
      {/* ── 1. BREADCRUMBS & METADATA MASTHEAD ── */}
      <header className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border-primary/60 pb-4 gap-2 text-xs font-semibold text-text-muted">
        <div className="flex items-center space-x-2">
          <Link to="/" className="hover:text-text-primary transition-colors">Sanctuary</Link>
          <span>/</span>
          <span className="text-text-primary font-bold">Untangle My Mind</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span>Usually takes 2–4 min</span>
          <span>•</span>
          <span className="text-accent-teal font-bold">100% Offline</span>
        </div>
      </header>

      {/* ── 2. HERO TITLE ── */}
      <section className="space-y-2 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
          Untangle My Mind
        </h1>
        <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-medium">
          A private, step-by-step space to examine one distressing thought at a time and construct an objective, grounded reframe.
        </p>
      </section>

      {/* ── 3. MULTI-STEP PROGRESS STEPPER ── */}
      <section className="space-y-2">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          {STEP_TITLES.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => {
                if (s.step < step || (s.step === 2 && negativeThought) || (s.step === 3 && selectedDistortions.length > 0)) {
                  setStep(s.step as any);
                }
              }}
              className={`pb-2 border-b-2 transition-all text-left cursor-pointer ${
                step === s.step
                  ? 'border-brand-primary text-brand-primary font-extrabold'
                  : step > s.step
                  ? 'border-accent-teal text-accent-teal'
                  : 'border-border-primary/60 text-text-muted opacity-60'
              }`}
            >
              <span className="block text-[11px] font-mono">{s.label}</span>
              <span className="text-[9.5px] font-normal text-text-secondary hidden sm:block truncate">{s.subtitle}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between text-[10.5px] font-mono text-text-muted pt-1">
          <span>Step {step} of 4 • {STEP_TITLES[step - 1].subtitle}</span>
          <span className="text-accent-teal">{autosaveText}</span>
        </div>
      </section>

      {/* ── 4. STEP FORMS & INTERACTIONS ── */}
      <main className="min-h-[280px]">
        <AnimatePresence mode="wait">
          
          {/* ================= STEP 1: NOTICE ================= */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">
                  What automatic thought is repeating in your mind right now?
                </label>
                <p className="text-[11.5px] text-text-secondary">
                  Write it out raw and unfiltered. No judgment.
                </p>
              </div>

              <div className="relative">
                <textarea
                  rows={4}
                  maxLength={500}
                  placeholder="e.g. 'I am going to fail my finals and disappoint everyone who believes in me.'"
                  value={negativeThought}
                  onChange={(e) => setNegativeThought(e.target.value)}
                  className="w-full p-4 bg-surface-sec border border-border-primary rounded-2xl text-xs md:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary leading-relaxed font-medium transition-colors"
                />
                <div className="flex justify-between items-center px-1 pt-1 text-[10.5px] font-mono text-text-muted">
                  <span>Press Shift + Enter for new line</span>
                  <span>{negativeThought.length} / 500</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!negativeThought.trim()}
                  onClick={() => setStep(2)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-2 ${
                    negativeThought.trim()
                      ? 'bg-brand-primary hover:bg-brand-hover text-white cursor-pointer shadow-xs'
                      : 'bg-surface-sec text-text-muted border border-border-primary cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>Examine Distortion</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 2: IDENTIFY TRAP ================= */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              <div className="p-3.5 bg-surface-sec/60 border border-border-primary rounded-2xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-text-muted uppercase">Your Initial Thought</span>
                <p className="text-xs font-semibold text-text-primary italic">"{negativeThought}"</p>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold text-text-primary block">
                  Which cognitive filter might be distorting this thought?
                </label>
                <p className="text-[11.5px] text-text-secondary">
                  Select one or more cognitive traps that match your thought pattern.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {DISTORTIONS.map((d) => {
                  const isSelected = selectedDistortions.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDistortion(d.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-brand-light/50 border-brand-primary text-brand-primary shadow-2xs'
                          : 'bg-surface-main border-border-primary hover:bg-surface-sec text-text-primary'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold">{d.name}</h4>
                          {isSelected && <Check size={13} className="text-brand-primary" />}
                        </div>
                        <p className="text-[10.5px] text-text-secondary font-medium mt-0.5 leading-snug">
                          {d.description}
                        </p>
                      </div>
                      <span className="text-[9.5px] text-text-muted italic block pt-1">
                        {d.example}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer inline-flex items-center space-x-1"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={selectedDistortions.length === 0}
                  onClick={() => setStep(3)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-2 ${
                    selectedDistortions.length > 0
                      ? 'bg-brand-primary hover:bg-brand-hover text-white cursor-pointer shadow-xs'
                      : 'bg-surface-sec text-text-muted border border-border-primary cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>Test Evidence</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 3: REALITY CHECK ================= */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary block">
                  1. What is one piece of concrete, objective evidence that disproves this thought?
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 'I passed my last midterms when I studied, and my professor said my draft was solid.'"
                  value={evidenceAgainst}
                  onChange={(e) => setEvidenceAgainst(e.target.value)}
                  className="w-full p-3 bg-surface-sec border border-border-primary rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary block">
                  2. If a close friend came to you with this exact worry, what compassionate truth would you tell them?
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 'I would tell them that one tough semester doesn't define their worth, and we can study together.'"
                  value={friendPerspective}
                  onChange={(e) => setFriendPerspective(e.target.value)}
                  className="w-full p-3 bg-surface-sec border border-border-primary rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer inline-flex items-center space-x-1"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center space-x-2"
                >
                  <span>Build Reframe</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 4: REFRAME ================= */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-6"
            >
              {saveStatus === 'saved' ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-teal-light text-accent-teal flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-text-primary">Thought Reframed & Saved</h3>
                    <p className="text-xs text-text-secondary max-w-sm mx-auto">
                      Your balanced perspective has been safely stored in your local memory.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleStartFresh}
                      className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Untangle Another Thought
                    </button>
                    <Link
                      to="/"
                      className="px-5 py-2.5 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary rounded-xl text-xs font-bold transition-all"
                    >
                      Return to Sanctuary
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-surface-sec/50 border border-border-primary rounded-2xl space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-text-muted uppercase">Initial Thought:</span>
                      <p className="font-semibold text-text-primary italic mt-0.5">"{negativeThought}"</p>
                    </div>
                    {evidenceAgainst && (
                      <div>
                        <span className="text-[10px] font-mono font-bold text-accent-teal uppercase">Evidence Against:</span>
                        <p className="text-text-secondary mt-0.5">{evidenceAgainst}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-primary block">
                      Write your balanced, grounded reframe:
                    </label>
                    <p className="text-[11px] text-text-secondary">
                      Combine the facts and your self-compassion into a realistic statement.
                    </p>
                    <textarea
                      rows={3}
                      placeholder="e.g. 'While this semester is heavy, I am capable of completing it step by step. My grades do not determine my whole future.'"
                      value={reframedThought}
                      onChange={(e) => setReframedThought(e.target.value)}
                      className="w-full p-3.5 bg-surface-sec border border-border-primary rounded-xl text-xs md:text-sm text-text-primary font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer inline-flex items-center space-x-1"
                    >
                      <ArrowLeft size={13} />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      disabled={!reframedThought.trim() || saveStatus === 'saving'}
                      onClick={handleSaveReframe}
                      className={`px-7 py-3 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center space-x-2 ${
                        saveStatus === 'saving'
                          ? 'bg-surface-sec text-text-muted border border-border-primary cursor-wait'
                          : reframedThought.trim()
                          ? 'bg-brand-primary hover:bg-brand-hover text-white cursor-pointer'
                          : 'bg-surface-sec text-text-muted border border-border-primary cursor-not-allowed opacity-50'
                      }`}
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                          <span>Saving locally...</span>
                        </>
                      ) : (
                        <>
                          <Bookmark size={13} />
                          <span>Save Reframe Privately</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ── 5. SAVED REFLECTIONS & CONTEXT MENUS ── */}
      <section className="space-y-4 pt-6 border-t border-border-primary/60">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-text-muted">
          <span>Saved Reframes ({savedReflections.length})</span>
          <span>Encrypted On-Device</span>
        </div>

        {savedReflections.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-1.5 border border-dashed border-border-primary/70 rounded-2xl">
            <h4 className="text-xs font-bold text-text-primary">No saved reflections yet</h4>
            <p className="text-[11px] text-text-muted max-w-xs mx-auto">
              When you complete a thought untangling exercise, your balanced reframes will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-primary/60 border-y border-border-primary/60">
            {savedReflections.map((item) => (
              <div key={item.id} className="py-4 px-2 flex items-start justify-between gap-4 group">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-text-muted">
                    <span>{item.date}</span>
                    {item.distortions && item.distortions.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-brand-primary uppercase">{item.distortions.join(', ')}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs font-bold text-text-primary leading-relaxed">
                    "{item.reframed}"
                  </p>
                  <p className="text-[11px] text-text-muted line-clamp-1 italic">
                    Original: "{item.original}"
                  </p>
                </div>

                {/* Context Menu Dropdown */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-sec transition-colors cursor-pointer"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {menuOpenId === item.id && (
                    <div className="absolute right-0 mt-1 w-36 bg-surface-main border border-border-primary rounded-xl shadow-lg p-1 z-20 space-y-0.5 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => handleCopyReframe(item.reframed)}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-surface-sec flex items-center space-x-2 text-text-secondary hover:text-text-primary cursor-pointer"
                      >
                        <Copy size={12} />
                        <span>Copy text</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteReframe(item.id)}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-accent-rose-light/20 flex items-center space-x-2 text-accent-rose cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
