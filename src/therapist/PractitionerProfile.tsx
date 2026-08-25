import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PractitionerProfile: React.FC = () => {
  const [savedToast, setSavedToast] = useState(false);
  const [bio, setBio] = useState('Specializing in adolescent CBT, academic overwhelm, and emotional somatic grounding. Over 8 years of clinical experience with high school and university students.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 selection:bg-accent-teal/20">
      
      {savedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-main border border-accent-teal text-text-primary px-4 py-2.5 rounded-2xl shadow-lg flex items-center space-x-2 text-xs font-bold">
          <CheckCircle2 size={15} className="text-accent-teal" />
          <span>Practitioner profile updated successfully</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border-primary/70 pb-6 space-y-1">
        <span className="text-[10.5px] font-black uppercase tracking-widest text-accent-teal">
          Clinical Credentials & Profile
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
          Dr. Maya Patel, Ph.D.
        </h1>
        <p className="text-xs text-text-secondary font-medium">
          Manage your public directory profile, license verifications, and clinical specialties.
        </p>
      </div>

      {/* Verified Badge Header */}
      <div className="p-6 bg-surface-main border border-border-primary rounded-3xl shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-teal text-white flex items-center justify-center font-black text-lg shadow-xs">
            MP
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-text-primary">Dr. Maya Patel</h2>
              <span className="px-2 py-0.5 bg-accent-teal-light text-accent-teal rounded-md text-[10px] font-bold font-mono inline-flex items-center space-x-1">
                <ShieldCheck size={11} />
                <span>Verified Provider</span>
              </span>
            </div>
            <p className="text-xs text-text-secondary">Licensed Clinical Psychologist • RCI #RCI-MH-2024-8842</p>
          </div>
        </div>
      </div>

      {/* Edit Bio Form */}
      <form onSubmit={handleSave} className="p-6 bg-surface-main border border-border-primary rounded-3xl shadow-2xs space-y-4 text-xs">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-secondary">
          Public Clinical Bio & Frameworks
        </h3>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-secondary uppercase">Clinical Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 bg-surface-sec border border-border-primary rounded-xl font-medium text-text-primary focus:outline-none focus:border-accent-teal leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase">Languages Spoken</label>
            <input
              type="text"
              readOnly
              value="English, Hindi, Tamil"
              className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl font-bold text-text-primary cursor-not-allowed opacity-80"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase">Primary Modalities</label>
            <input
              type="text"
              readOnly
              value="CBT, Somatic Grounding, DBT"
              className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl font-bold text-text-primary cursor-not-allowed opacity-80"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-accent-teal hover:bg-accent-teal/90 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Save Profile Updates
          </button>
        </div>
      </form>

    </div>
  );
};
