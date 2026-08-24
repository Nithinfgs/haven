import React, { useState } from 'react';
import { Modal } from './Modal';
import { Mail, Send, CheckCircle2, Copy, Check } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  userEmail = '',
  userName = '',
}) => {
  const [category, setCategory] = useState<'Bug Report' | 'Feature Request' | 'Experience & Feedback' | 'Urgent Question'>('Bug Report');
  const [email, setEmail] = useState(userEmail);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const recipientEmail = 'nithinselvaraj9@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const emailSubject = `[Haven ${category}] ${subject.trim() || 'User Feedback / Report'}`;
    const emailBody = `HAVEN FEEDBACK & ISSUE REPORT
----------------------------------
Category: ${category}
Submitted By: ${userName || 'Haven User'}
User Contact Email: ${email || 'Not provided'}
Timestamp: ${new Date().toLocaleString()}

DETAILED ISSUE / FEEDBACK:
${description}

----------------------------------
Environment: ${navigator.userAgent}
URL: ${window.location.href}`;

    // Open mailto link
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');

    setSubmitted(true);
  };

  const handleCopyText = () => {
    const textToCopy = `To: ${recipientEmail}\nCategory: ${category}\nSubject: ${subject}\n\n${description}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleReset = () => {
    setSubmitted(false);
    setDescription('');
    setSubject('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="Give Feedback & Report an Issue">
      {submitted ? (
        <div className="text-center py-4 space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-accent-teal-light text-accent-teal flex items-center justify-center mx-auto border border-accent-teal/20">
            <CheckCircle2 size={30} />
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-base font-extrabold text-text-primary">
              Feedback Ready to Send
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your default email client has been prepared to send your message directly to Lead Developer <strong>nithinselvaraj9@gmail.com</strong>.
            </p>
          </div>

          <div className="p-3 bg-surface-sec rounded-xl border border-border-primary text-xs text-text-muted flex items-center justify-between">
            <span className="font-mono truncate">{recipientEmail}</span>
            <button
              onClick={handleCopyText}
              className="px-2.5 py-1 bg-surface-main hover:bg-surface-sec text-text-primary border border-border-primary rounded-lg font-bold text-[10.5px] cursor-pointer flex items-center space-x-1"
            >
              {copied ? <Check size={11} className="text-accent-teal" /> : <Copy size={11} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            Found a bug, have a feature suggestion, or need help? Your feedback goes directly to lead developer <strong>Nithin Selvaraj</strong>.
          </p>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Bug Report',
                'Feature Request',
                'Experience & Feedback',
                'Urgent Question',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-brand-light border-brand-primary text-brand-primary shadow-2xs'
                      : 'bg-surface-sec border-border-primary text-text-secondary hover:bg-surface-main'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Short Subject / Summary</label>
            <input
              type="text"
              placeholder="e.g. Issue booking a session / Idea for habit tracker"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-sec border border-border-primary rounded-xl text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
              Describe Your Issue or Suggestion *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Please provide details, what you were doing when it happened, or your idea for Haven..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-surface-sec border border-border-primary rounded-xl text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Your Email (for response)</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-surface-sec border border-border-primary rounded-xl text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border-primary">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!description.trim()}
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-hover disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Send size={13} />
              <span>Send to nithinselvaraj9@gmail.com</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
