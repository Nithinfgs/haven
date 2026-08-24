import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, UsersRound, HeartHandshake, Loader2, ArrowRight, Video } from 'lucide-react';

export const TalkNow: React.FC = () => {
  const navigate = useNavigate();
  const [flowState, setFlowState] = useState<'options' | 'searching_group' | 'searching_one' | 'matched_group' | 'matched_one'>('options');
  const [searchStepText, setSearchStepText] = useState('Finding a welcoming space for you...');

  const triggerGroupSearch = () => {
    setFlowState('searching_group');
    setSearchStepText('Looking at active peer conversation spaces...');
    
    setTimeout(() => {
      setSearchStepText('Connecting with peers in a moderated room...');
    }, 1500);

    setTimeout(() => {
      setFlowState('matched_group');
    }, 3000);
  };

  const triggerOneSearch = () => {
    setFlowState('searching_one');
    setSearchStepText('Checking online support volunteers...');

    setTimeout(() => {
      setSearchStepText('Matching you with an available listener...');
    }, 1500);

    setTimeout(() => {
      setFlowState('matched_one');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <AnimatePresence mode="wait">
        {flowState === 'options' && (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight mb-3">
                Who would you like to connect with?
              </h2>
              <p className="text-text-secondary text-xs max-w-sm mx-auto leading-relaxed">
                Choose the connection path that matches your current comfort level.
              </p>
            </div>

            {/* Focused 3-card connection formats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Someone to listen */}
              <div className="bg-surface-main border border-border-primary rounded-2xl p-6 flex flex-col justify-between hover:border-brand-primary/45 transition-colors">
                <div>
                  <div className="inline-flex items-center justify-center p-3 rounded-[10px] bg-brand-light text-brand-primary mb-5 border border-brand-primary/10">
                    <MessageSquare size={20} />
                  </div>
                  <h4 className="font-extrabold text-text-primary text-sm mb-2">Someone to listen</h4>
                  <p className="text-text-secondary text-xs leading-relaxed mb-6">
                    Start a supportive, private 1-on-1 text conversation with an available volunteer.
                  </p>
                </div>
                <button
                  onClick={triggerOneSearch}
                  className="inline-flex items-center justify-center space-x-1.5 w-full h-11 bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold rounded-[10px] active:bg-brand-pressed transition-colors shadow-xs cursor-pointer"
                >
                  <span>Find a listener</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Option 2: A peer who understands */}
              <div className="bg-surface-main border border-border-primary rounded-2xl p-6 flex flex-col justify-between hover:border-accent-teal/45 transition-colors">
                <div>
                  <div className="inline-flex items-center justify-center p-3 rounded-[10px] bg-accent-teal-light text-accent-teal mb-5 border border-accent-teal/10">
                    <UsersRound size={20} />
                  </div>
                  <h4 className="font-extrabold text-text-primary text-sm mb-2">A peer who understands</h4>
                  <p className="text-text-secondary text-xs leading-relaxed mb-6">
                    Join a secure, moderated peer chat room to talk through common situations together.
                  </p>
                </div>
                <button
                  onClick={triggerGroupSearch}
                  className="inline-flex items-center justify-center space-x-1.5 w-full h-11 bg-accent-teal hover:bg-accent-teal-hover text-white text-xs font-semibold rounded-[10px] transition-colors cursor-pointer"
                >
                  <span>Join peer spaces</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Option 3: A trained professional */}
              <div className="bg-surface-main border border-border-primary rounded-2xl p-6 flex flex-col justify-between hover:border-brand-primary/45 transition-colors">
                <div>
                  <div className="inline-flex items-center justify-center p-3 rounded-[10px] bg-brand-light text-brand-primary mb-5 border border-brand-primary/10">
                    <HeartHandshake size={20} />
                  </div>
                  <h4 className="font-extrabold text-text-primary text-sm mb-2">A trained professional</h4>
                  <p className="text-text-secondary text-xs leading-relaxed mb-6">
                    Browse our directory of verified licensed therapists and schedule a consultation slot.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/therapists')}
                  className="inline-flex items-center justify-center space-x-1.5 w-full h-11 bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold rounded-[10px] active:bg-brand-pressed transition-colors shadow-xs cursor-pointer"
                >
                  <span>See therapists</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Searching matching indicators */}
        {(flowState === 'searching_group' || flowState === 'searching_one') && (
          <motion.div
            key="searching"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="flex flex-col items-center justify-center text-center p-12 bg-surface-main border border-border-primary rounded-2xl min-h-[350px] shadow-xs max-w-lg mx-auto"
          >
            <div className="relative mb-6">
              <span className="absolute inset-0 rounded-full bg-brand-light animate-ping opacity-45 scale-150"></span>
              <div className="bg-brand-light border border-brand-primary/10 rounded-full p-4 text-brand-primary relative">
                <Loader2 size={24} className="animate-spin text-brand-primary" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-text-primary mb-1">Searching...</h4>
            <p className="text-text-secondary text-xs">{searchStepText}</p>
            
            {/* Visual Dot Matching Animation */}
            <div className="flex items-center justify-center space-x-1.5 mt-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce delay-150"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce delay-200"></span>
            </div>

            <button
              onClick={() => setFlowState('options')}
              className="mt-8 text-xs font-bold text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
            >
              Cancel search
            </button>
          </motion.div>
        )}

        {/* Matched outcomes */}
        {flowState === 'matched_group' && (
          <motion.div
            key="matched_group"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-surface-main border border-border-primary rounded-2xl p-8 max-w-md mx-auto text-center shadow-xs"
          >
            <div className="w-12 h-12 bg-brand-light text-brand-primary rounded-[10px] flex items-center justify-center mx-auto mb-6 border border-brand-primary/10">
              <UsersRound size={20} />
            </div>
            <h3 className="font-extrabold text-text-primary text-lg mb-2">Space found</h3>
            <p className="text-text-secondary text-xs mb-6 leading-relaxed">
              We matched you with a discussion room where peers are sharing thoughts right now.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/chat/school-pressure')}
                className="inline-flex items-center justify-center space-x-1.5 w-full h-11 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] active:bg-brand-pressed transition-colors shadow-xs cursor-pointer"
              >
                <span>Enter chat room</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setFlowState('options')}
                className="w-full text-xs font-bold text-text-muted hover:text-text-secondary py-2 transition-colors cursor-pointer"
              >
                Back to options
              </button>
            </div>
          </motion.div>
        )}

        {flowState === 'matched_one' && (
          <motion.div
            key="matched_one"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-surface-main border border-border-primary rounded-2xl p-8 max-w-md mx-auto text-center shadow-xs"
          >
            <div className="w-12 h-12 bg-brand-light text-brand-primary rounded-[10px] flex items-center justify-center mx-auto mb-6 border border-brand-primary/10">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-extrabold text-text-primary text-lg mb-2">Support Listener Connected</h3>
            <p className="text-text-secondary text-xs mb-6 leading-relaxed">
              A trained peer listener is online and ready for a private session. Choose your preferred format:
            </p>
            <div className="space-y-3">
              {/* Text Chat Option */}
              <button
                onClick={() => navigate('/chat/just-talk')}
                className="inline-flex items-center justify-center space-x-2 w-full h-11 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] active:bg-brand-pressed transition-colors shadow-xs cursor-pointer"
              >
                <MessageSquare size={16} />
                <span>Start Text Conversation</span>
              </button>

              {/* Google Meet Video Option */}
              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 w-full h-11 bg-surface-sec hover:bg-brand-light hover:text-brand-primary text-text-primary border border-border-primary text-xs font-bold rounded-[10px] transition-colors shadow-xs cursor-pointer"
              >
                <Video size={16} className="text-brand-primary" />
                <span>Launch Google Meet Video Call</span>
              </a>

              <button
                onClick={() => setFlowState('options')}
                className="w-full text-xs font-bold text-text-muted hover:text-text-secondary py-2 transition-colors cursor-pointer"
              >
                Back to options
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
