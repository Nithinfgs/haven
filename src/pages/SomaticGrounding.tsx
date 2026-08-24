import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Check, Sparkles, Wind, Eye, Hand, Volume2, Flower, Coffee, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const SENSORY_STEPS = [
  {
    count: 5,
    icon: Eye,
    title: 'Look for 5 Things You Can See',
    prompt: 'Look around your current room or screen. Notice 5 distinct visual objects (e.g. a plant, a shadow, a pattern, a pen, light reflections).',
    placeholder: 'Type or mentally name 5 visual items...',
    color: 'text-accent-teal',
    bg: 'bg-accent-teal-light',
  },
  {
    count: 4,
    icon: Hand,
    title: 'Notice 4 Things You Can Physically Touch',
    prompt: 'Feel the physical sensations right now: the fabric of your shirt, the texture of your desk, the cool air on your skin, or your feet grounded on the floor.',
    placeholder: 'Notice 4 tactile feelings...',
    color: 'text-brand-primary',
    bg: 'bg-brand-light',
  },
  {
    count: 3,
    icon: Volume2,
    title: 'Listen for 3 Sounds Around You',
    prompt: 'Close your eyes for 5 seconds. Tune in to 3 distant or subtle sounds: a distant car, clock ticking, a fan humming, or your own breath.',
    placeholder: 'Identify 3 sounds...',
    color: 'text-accent-amber',
    bg: 'bg-accent-amber/15',
  },
  {
    count: 2,
    icon: Flower,
    title: 'Detect 2 Scents You Can Smell',
    prompt: 'Take a gentle breath. Can you smell fresh air, coffee, paper, soap, or simply the neutral scent of the room?',
    placeholder: 'Identify 2 scents...',
    color: 'text-accent-rose',
    bg: 'bg-accent-rose-light',
  },
  {
    count: 1,
    icon: Coffee,
    title: 'Acknowledge 1 Thing You Can Taste',
    prompt: 'Notice any lingering taste in your mouth—toothpaste, tea, water—or simply focus on the physical rest of your tongue.',
    placeholder: 'Notice 1 taste or sensation...',
    color: 'text-accent-teal',
    bg: 'bg-accent-teal-light',
  },
];

export const SomaticGrounding: React.FC = () => {
  const [mode, setMode] = useState<'sensory' | 'box_breathing'>('sensory');
  
  // Sensory state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sensoryCompleted, setSensoryCompleted] = useState(false);

  // Box Breathing state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isBreathingActive && mode === 'box_breathing') {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              if (current === 'Inhale') return 'Hold';
              if (current === 'Hold') return 'Exhale';
              if (current === 'Exhale') return 'Rest';
              setCyclesCompleted((c) => c + 1);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, mode]);

  const handleNextSensory = () => {
    if (currentStepIndex < SENSORY_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setSensoryCompleted(true);
    }
  };

  const handleResetSensory = () => {
    setCurrentStepIndex(0);
    setSensoryCompleted(false);
  };

  const currentStep = SENSORY_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Navigation & Title */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Sanctuary</span>
        </Link>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-rose-light text-accent-rose border border-accent-rose/20 text-[10.5px] font-extrabold uppercase tracking-wider">
          <HeartPulse size={13} />
          <span>Somatic Nervous System Reset</span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex p-1 bg-surface-sec border border-border-primary rounded-2xl text-xs font-bold gap-1 shadow-2xs">
        <button
          type="button"
          onClick={() => { setMode('sensory'); setIsBreathingActive(false); }}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            mode === 'sensory'
              ? 'bg-surface-main text-brand-primary shadow-xs border border-border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Sparkles size={14} />
          <span>5-4-3-2-1 Sensory Grounding</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('box_breathing')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            mode === 'box_breathing'
              ? 'bg-surface-main text-brand-primary shadow-xs border border-border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Wind size={14} />
          <span>Box Breathing Pacer (4-4-4-4)</span>
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-surface-main border border-border-primary rounded-3xl p-6 md:p-10 shadow-xs min-h-[420px] flex flex-col justify-between">
        
        {/* ================= MODE 1: SENSORY 5-4-3-2-1 ================= */}
        {mode === 'sensory' && (
          <AnimatePresence mode="wait">
            {!sensoryCompleted ? (
              <motion.div
                key={currentStep.count}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6 my-auto"
              >
                {/* Step Indicator */}
                <div className="flex items-center space-x-3">
                  <div className={`w-14 h-14 rounded-2xl ${currentStep.bg} ${currentStep.color} flex items-center justify-center font-black text-2xl border border-current/10 shadow-2xs`}>
                    {currentStep.count}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-text-primary tracking-tight">
                      {currentStep.title}
                    </h2>
                    <span className="text-[11px] font-bold text-text-muted">
                      Step {5 - currentStep.count + 1} of 5 • Anchoring your nervous system
                    </span>
                  </div>
                </div>

                {/* Prompt Box */}
                <div className="p-5 bg-surface-sec/70 rounded-2xl border border-border-primary space-y-2">
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">
                    {currentStep.prompt}
                  </p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder={currentStep.placeholder}
                    className="w-full px-4 py-3 bg-surface-sec border border-border-primary rounded-xl text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
                  />
                  <span className="text-[10px] text-text-muted block">
                    Tip: Take a slow breath between each item. You can write them down or just observe them quietly.
                  </span>
                </div>

                {/* Action button */}
                <div className="flex items-center justify-between pt-4 border-t border-border-primary">
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                    className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary disabled:opacity-20 cursor-pointer"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextSensory}
                    className="px-7 py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <span>{currentStepIndex === SENSORY_STEPS.length - 1 ? 'Complete Grounding' : 'Next Sensation'}</span>
                    <StepIcon size={14} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center my-auto py-4"
              >
                <div className="w-16 h-16 rounded-3xl bg-accent-teal-light text-accent-teal flex items-center justify-center mx-auto border border-accent-teal/20">
                  <Check size={32} />
                </div>

                <div className="space-y-1.5 max-w-md mx-auto">
                  <h2 className="text-2xl font-black text-text-primary tracking-tight">
                    You Are Here. You Are Safe.
                  </h2>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    By bringing your sensory awareness to the present room, you gave your autonomic nervous system a signal that the acute panic is passing.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetSensory}
                    className="px-5 py-2.5 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>Repeat Grounding</span>
                  </button>
                  <button
                    onClick={() => { setMode('box_breathing'); setIsBreathingActive(true); }}
                    className="px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
                  >
                    <Wind size={13} />
                    <span>Switch to Box Breathing</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ================= MODE 2: BOX BREATHING ================= */}
        {mode === 'box_breathing' && (
          <div className="flex flex-col items-center justify-center space-y-8 my-auto py-4 text-center">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-text-primary tracking-tight">
                4-4-4-4 Box Breathing
              </h2>
              <p className="text-xs text-text-secondary max-w-md mx-auto">
                Used by elite athletes and psychologists to slow elevated heart rates and activate the parasympathetic calm response.
              </p>
            </div>

            {/* Animated Expanding Breathing Circle */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <motion.div
                animate={{
                  scale: breathPhase === 'Inhale' || breathPhase === 'Hold' ? 1.25 : 0.85,
                  opacity: breathPhase === 'Hold' || breathPhase === 'Rest' ? 0.8 : 0.4,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-brand-light border border-brand-primary/30"
              />

              {/* Inner core circle */}
              <div className="relative z-10 w-36 h-36 rounded-full bg-surface-main border-2 border-brand-primary flex flex-col items-center justify-center shadow-md">
                <span className="text-xs font-extrabold text-brand-primary uppercase tracking-wider">
                  {breathPhase}
                </span>
                <span className="text-3xl font-black text-text-primary font-mono mt-0.5">
                  {breathSeconds}s
                </span>
              </div>
            </div>

            {/* Metrics & Control */}
            <div className="space-y-4">
              <div className="text-[11px] font-bold text-text-secondary bg-surface-sec px-4 py-1.5 rounded-full border border-border-primary inline-block">
                Cycles Completed: <span className="text-brand-primary font-black">{cyclesCompleted}</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-2"
                >
                  {isBreathingActive ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isBreathingActive ? 'Pause Breathing' : 'Start Pacer'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsBreathingActive(false);
                    setBreathPhase('Inhale');
                    setBreathSeconds(4);
                    setCyclesCompleted(0);
                  }}
                  className="px-4 py-3 bg-surface-sec hover:bg-surface-main text-text-secondary border border-border-primary text-xs font-bold rounded-xl transition-all cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
