import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

export const GetHelpNow: React.FC = () => {
  const navigate = useNavigate();
  const [hotlineModalOpen, setHotlineModalOpen] = useState(false);

  const hotlines = [
    {
      name: '988 Suicide & Crisis Lifeline',
      description: 'Free, confidential support available 24/7 for anyone in distress.',
      number: '988',
      link: 'tel:988',
    },
    {
      name: 'Crisis Text Line',
      description: 'Text with a crisis counselor 24/7.',
      number: 'Text HOME to 741741',
      link: 'sms:741741&body=HOME',
    },
    {
      name: 'The Trevor Project (LGBTQ+)',
      description: 'Specialized 24/7 support for LGBTQ+ youth.',
      number: '1-866-488-7386',
      link: 'tel:1-866-488-7386',
    },
    {
      name: 'YouthLine',
      description: 'Peer-to-peer teen crisis helpline. Talk teen-to-teen.',
      number: '1-877-968-8454',
      link: 'tel:1-877-968-8454',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="max-w-4xl mx-auto px-6 py-12 md:py-16"
    >
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-accent-rose-light text-accent-rose border border-accent-rose/10 mb-4">
          <ShieldAlert size={24} />
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight mb-3">
          Need support right now?
        </h2>
        <p className="text-text-secondary text-xs leading-relaxed">
          We want to make sure you are safe and supported. Choose the immediate option that feels right.
        </p>
      </div>

      {/* Grid of Emergency CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1 */}
        <div className="bg-surface-main border border-border-primary rounded-2xl p-6 flex flex-col justify-between hover:border-brand-primary/45 transition-colors">
          <div>
            <h4 className="font-bold text-text-primary text-sm mb-2">Talk to someone</h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-6">
              Connect immediately with a community volunteer or join peer chat conversations.
            </p>
          </div>
          <button
            onClick={() => navigate('/talk-now')}
            className="inline-flex items-center justify-center space-x-1.5 w-full h-11 bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold rounded-[10px] transition-colors"
          >
            <span>Start now</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-main border border-border-primary rounded-2xl p-6 flex flex-col justify-between hover:border-brand-primary/45 transition-colors">
          <div>
            <h4 className="font-bold text-text-primary text-sm mb-2">Contact a professional</h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-6">
              Browse licensed psychologists and therapists currently online or available today.
            </p>
          </div>
          <button
            onClick={() => navigate('/therapists')}
            className="inline-flex items-center justify-center space-x-1.5 w-full h-11 bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold rounded-[10px] transition-colors"
          >
            <span>See who's available</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-accent-rose-light/40 border border-accent-rose/10 rounded-2xl p-6 flex flex-col justify-between hover:border-accent-rose/45 transition-colors">
          <div>
            <h4 className="font-bold text-text-primary text-sm mb-2">Find urgent support</h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-6">
              Access emergency lines, text support options, and specialized teen crisis counselors.
            </p>
          </div>
          <button
            onClick={() => setHotlineModalOpen(true)}
            className="inline-flex items-center justify-center space-x-1.5 w-full h-11 bg-accent-rose hover:bg-accent-rose/90 text-white text-xs font-semibold rounded-[10px] transition-colors"
          >
            <span>View support options</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Safety Notice Warning banner */}
      <div className="max-w-2xl mx-auto bg-surface-main border border-border-primary rounded-2xl p-6 text-center">
        <p className="text-[11px] text-text-secondary leading-relaxed">
          <strong className="text-text-primary font-bold block mb-1">Safety & Scope Notice</strong>
          Haven is a peer support and therapist scheduling platform. It is not an emergency crisis intervention tool. If you are in immediate danger or experiencing a medical emergency, please contact local emergency services or go to the nearest emergency room.
        </p>
      </div>

      {/* Hotlines Modal list */}
      <Modal isOpen={hotlineModalOpen} onClose={() => setHotlineModalOpen(false)} title="Urgent Support Contacts">
        <div className="space-y-4">
          {hotlines.map((hotline) => (
            <div
              key={hotline.name}
              className="p-4 border border-border-primary rounded-xl bg-surface-sec/30"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-bold text-text-primary text-xs mb-1">{hotline.name}</h5>
                  <p className="text-text-secondary text-[10px] leading-relaxed mb-2.5">
                    {hotline.description}
                  </p>
                  <span className="inline-flex items-center text-[10px] font-bold text-brand-primary bg-brand-light px-2.5 py-1 rounded-[10px] border border-brand-primary/10">
                    {hotline.number}
                  </span>
                </div>
                <a
                  href={hotline.link}
                  className="bg-surface-main border border-border-primary p-2.5 rounded-[10px] text-text-secondary hover:text-brand-primary hover:bg-brand-light transition-all shrink-0"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </motion.div>
  );
};
