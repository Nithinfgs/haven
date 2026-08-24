import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, HardDrive, HeartPulse, Brain } from 'lucide-react';
import { HavenLogo } from '../components/HavenLogo';

interface LandingPageProps {
  onEnterGuest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterGuest }) => {

  return (
    <div className="min-h-screen bg-bg-app flex flex-col justify-between py-12 px-6 max-w-4xl mx-auto selection:bg-brand-primary/10">
      
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-border-primary/60 pb-5">
        <HavenLogo size={32} showText={true} />
        <div className="flex items-center space-x-3 text-xs font-bold">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Sign in
          </Link>
          <Link
            to="/onboarding"
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Begin setup
          </Link>
        </div>
      </header>

      {/* Main Editorial Hero */}
      <main className="py-16 md:py-24 space-y-12 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary">
            Quiet Digital Sanctuary
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
            A quiet place<br />to begin again.
          </h1>
          <p className="text-sm md:text-base text-text-secondary font-medium max-w-lg mx-auto leading-relaxed pt-2">
            An intentional space designed for adolescent emotional self-awareness, somatic panic grounding, CBT thought reframing, and confidential telehealth.
          </p>
        </motion.div>

        {/* Primary Action Choices */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link
            to="/onboarding"
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Create Your Sanctuary</span>
            <ArrowRight size={14} />
          </Link>

          <button
            type="button"
            onClick={onEnterGuest}
            className="w-full sm:w-auto px-8 py-3.5 bg-surface-main hover:bg-surface-sec text-text-primary text-xs font-bold rounded-2xl border border-border-primary shadow-2xs transition-all cursor-pointer"
          >
            Explore Anonymously
          </button>
        </motion.div>

        {/* Quiet Principles Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left border-t border-border-primary/60">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-brand-primary text-xs font-extrabold">
              <HardDrive size={15} />
              <span>Local-First Privacy</span>
            </div>
            <p className="text-[11.5px] text-text-secondary leading-relaxed font-medium">
              Keep reflections physically on your device. Zero unconsented cloud tracking or data sharing.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-accent-rose text-xs font-extrabold">
              <HeartPulse size={15} />
              <span>Somatic Panic SOS</span>
            </div>
            <p className="text-[11.5px] text-text-secondary leading-relaxed font-medium">
              5-4-3-2-1 sensory grounding and animated Box Breathing pacers for acute stress.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-accent-teal text-xs font-extrabold">
              <Brain size={15} />
              <span>Evidence-Based CBT</span>
            </div>
            <p className="text-[11.5px] text-text-secondary leading-relaxed font-medium">
              Spot cognitive distortion traps, test evidence, and generate empowering balanced reframes.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted border-t border-border-primary/60 pt-5 gap-3">
        <span>© 2026 Haven Platform • Non-clinical self-awareness tool</span>
        <div className="flex items-center space-x-4 font-bold text-text-secondary">
          <Link to="/urgent-support" className="hover:text-accent-rose transition-colors">Crisis Hotlines</Link>
          <Link to="/login" className="hover:text-brand-primary transition-colors">Therapist & Admin Portal</Link>
        </div>
      </footer>

    </div>
  );
};
