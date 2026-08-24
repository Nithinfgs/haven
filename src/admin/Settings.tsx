import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, Check } from 'lucide-react';
import { FeedbackModal } from '../components/FeedbackModal';

export const Settings: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [autoMod, setAutoMod] = useState(true);
  const [sessionDuration, setSessionDuration] = useState('45 mins');
  const [supportHours, setSupportHours] = useState('09:00 AM - 09:00 PM');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-xs w-full px-4">
          <div className="bg-text-primary text-white rounded-[10px] p-4 shadow-lg flex items-center space-x-2 text-xs font-semibold">
            <Check size={16} className="text-accent-teal" />
            <span>Admin configurations saved</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center space-x-2.5">
        <div className="p-2 bg-brand-light text-brand-primary rounded-xl border border-brand-primary/10">
          <SettingsIcon size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">System Settings</h2>
          <p className="text-text-secondary text-xs mt-0.5">Customize chat timers, auto-moderation settings, and operational parameters.</p>
        </div>
      </div>

      <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6 text-xs font-semibold text-text-secondary">
          
          {/* Toggles */}
          <div className="space-y-4">
            <h4 className="font-bold text-text-primary text-sm border-b border-border-primary pb-2">Automation & Rules</h4>
            
            <label className="flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-text-primary block">Auto-Flag Offensive Terms</span>
                <span className="text-[10px] text-text-secondary font-medium">Use regex checks to flag inappropriate language.</span>
              </div>
              <input
                type="checkbox"
                checked={autoMod}
                onChange={(e) => setAutoMod(e.target.checked)}
                className="w-4 h-4 rounded text-brand-primary border-border-primary focus:ring-brand-primary"
              />
            </label>
          </div>

          {/* Slots Configuration */}
          <div className="space-y-4">
            <h4 className="font-bold text-text-primary text-sm border-b border-border-primary pb-2">Therapy Bookings</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Standard Session Length</label>
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="w-full bg-surface-sec border border-border-primary py-2.5 px-3 rounded-[10px] focus:outline-none focus:border-brand-primary font-bold text-text-primary"
                >
                  <option value="30 mins">30 minutes</option>
                  <option value="45 mins">45 minutes</option>
                  <option value="60 mins">60 minutes</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Support Availability Window</label>
                <input
                  type="text"
                  value={supportHours}
                  onChange={(e) => setSupportHours(e.target.value)}
                  className="w-full bg-surface-sec border border-border-primary py-2.5 px-3 rounded-[10px] focus:outline-none focus:border-brand-primary font-medium text-text-primary"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center space-x-1.5 h-11 px-5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] shadow-xs shadow-brand-primary/10 transition-colors cursor-pointer"
          >
            <Save size={14} />
            <span>Save configurations</span>
          </button>
        </form>
      </div>

      {/* Developer Feedback & Issue Reporting */}
      <div className="bg-brand-light/30 border border-brand-primary/20 rounded-2xl p-6 shadow-xs max-w-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-text-primary text-sm">Direct Developer Feedback & Task Box</h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Report administrative bugs, suggest provider tools, or message lead developer <strong>nithinselvaraj9@gmail.com</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFeedbackModalOpen(true)}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
        >
          Send Report
        </button>
      </div>

      {/* Legal & Liability Governance Info Card */}
      <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs max-w-2xl space-y-3">
        <h4 className="font-bold text-text-primary text-sm border-b border-border-primary pb-2">Platform Legal Governance & Ownership</h4>
        <div className="text-xs text-text-secondary leading-relaxed space-y-1.5">
          <p><strong>Original Concept & Ideation:</strong> Arunachalam Premkumar (<code>navapremkumar09@gmail.com</code>)</p>
          <p><strong>Product Architecture, Engineering & UI/UX:</strong> Nithin Selvaraj (<code>nithinselvaraj9@gmail.com</code>)</p>
          <p><strong>Strict Liability Limitation:</strong> Use at user's own risk. Haven is a non-clinical self-awareness tool and does not provide emergency medical intervention or clinical diagnosis.</p>
          <p><strong>Licensing:</strong> Non-commercial educational deployment licensed under CC BY-NC-SA 4.0. Commercial telehealth integration requires written license authorization (<code>nithinselvaraj9@gmail.com</code>).</p>
        </div>
      </div>

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        userName="Administrator"
      />
    </motion.div>
  );
};
