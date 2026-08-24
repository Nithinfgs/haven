import React, { useState, useEffect } from 'react';
import { getMockDatabase } from '../mockData';
import type { Therapist } from '../types';
import { Modal } from '../components/Modal';
import { AvailabilityBadge } from '../components/AvailabilityBadge';
import { motion } from 'framer-motion';
import { UserPlus, ToggleLeft, ToggleRight, Trash2, Check, X, ShieldCheck, Mail, FileBadge, Clock } from 'lucide-react';

export const Therapists: React.FC = () => {
  const db = getMockDatabase();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Form states for manual addition
  const [name, setName] = useState('');
  const [credentials, setCredentials] = useState('Licensed Psychologist');
  const [introduction, setIntroduction] = useState('');
  const [fullBio, setFullBio] = useState('');
  const [specialtiesText] = useState('Stress, Anxiety');
  const [languagesText, setLanguagesText] = useState('English');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [email, setEmail] = useState('');
  const avatarUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200';

  useEffect(() => {
    setTherapists(db.getTherapists());
  }, []);

  const pendingApplicants = therapists.filter((t) => t.status === 'pending_approval');
  const activeTherapists = therapists.filter((t) => t.status !== 'pending_approval' && t.status !== 'rejected');

  const showNotification = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  const handleApproveApplicant = (therapistId: string) => {
    const list = db.getTherapists();
    const updated: Therapist[] = list.map((t) => {
      if (t.id === therapistId) {
        return {
          ...t,
          status: 'Available' as const,
          online: true,
          availableToday: true,
        };
      }
      return t;
    });

    db.setTherapists(updated);
    setTherapists(updated);

    const approved = updated.find((t) => t.id === therapistId);
    if (approved) {
      const logs = db.getActivityLogs();
      db.setActivityLogs([
        {
          id: `act_${Date.now()}`,
          type: 'availability' as const,
          description: `Admin approved therapist application: ${approved.name} (${approved.credentials})`,
          timestamp: 'Just now',
        },
        ...logs,
      ]);
      showNotification(`Approved ${approved.name}. They are now live on the public directory.`);
    }
  };

  const handleRejectApplicant = (therapistId: string) => {
    const target = therapists.find((t) => t.id === therapistId);
    if (!window.confirm(`Are you sure you want to reject the application for ${target?.name || 'this provider'}?`)) return;

    const list = db.getTherapists();
    const updated = list.filter((t) => t.id !== therapistId);
    db.setTherapists(updated);
    setTherapists(updated);

    showNotification(`Application for ${target?.name} was rejected and removed.`);
  };

  const handleToggleStatus = (therapistId: string) => {
    const list = db.getTherapists();
    const updated: Therapist[] = list.map((t) => {
      if (t.id === therapistId) {
        const nextStatus: Therapist['status'] = t.status === 'Available' ? 'Offline' : 'Available';
        return {
          ...t,
          status: nextStatus,
          online: nextStatus === 'Available',
          availableToday: nextStatus === 'Available',
        };
      }
      return t;
    });

    db.setTherapists(updated);
    setTherapists(updated);
  };

  const handleRemove = (therapistId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this therapist profile?");
    if (!confirmDelete) return;

    const list = db.getTherapists();
    const updated = list.filter((t) => t.id !== therapistId);
    db.setTherapists(updated);
    setTherapists(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !introduction.trim()) return;

    const newTherapist: Therapist = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      credentials,
      avatar: avatarUrl,
      introduction,
      fullBio: fullBio || introduction,
      specialties: specialtiesText.split(',').map((s) => s.trim()).filter(Boolean),
      languages: languagesText.split(',').map((l) => l.trim()).filter(Boolean),
      availableToday: true,
      online: true,
      status: 'Available',
      schedule: ['2:00 PM', '4:00 PM', '5:30 PM'],
      licenseNumber: licenseNumber || 'PSY-APPROVED',
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@havenmind.org`
    };

    const currentList = db.getTherapists();
    const updatedList = [...currentList, newTherapist];
    db.setTherapists(updatedList);
    setTherapists(updatedList);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setAddModalOpen(false);
      setName('');
      setIntroduction('');
      setFullBio('');
      setLicenseNumber('');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed top-16 right-8 z-50 bg-brand-primary text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} />
          <span>{actionToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Clinical Provider Management</h2>
          <p className="text-text-secondary text-xs mt-0.5">
            Review incoming therapist applications, verify credentials, and manage active directory schedules.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus size={14} />
          <span>Manually Add Provider</span>
        </button>
      </div>

      {/* SECTION 1: INCOMING APPLICATIONS QUEUE */}
      <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border-primary pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={18} className="text-accent-amber" />
            <h3 className="font-extrabold text-text-primary text-sm">
              Incoming Provider Applications
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-accent-amber/15 text-accent-amber text-xs font-black">
            {pendingApplicants.length} Pending Review
          </span>
        </div>

        {pendingApplicants.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-surface-sec flex items-center justify-center text-text-muted mx-auto">
              <Check size={18} />
            </div>
            <p className="text-xs text-text-secondary font-medium">All provider applications have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApplicants.map((applicant) => (
              <div
                key={applicant.id}
                className="p-5 bg-surface-sec/60 border border-border-primary rounded-2xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={applicant.avatar}
                        alt={applicant.name}
                        className="w-12 h-12 rounded-xl object-cover border border-border-primary"
                      />
                      <div>
                        <h4 className="font-extrabold text-text-primary text-sm">{applicant.name}</h4>
                        <p className="text-[11px] text-brand-primary font-bold">{applicant.credentials}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-accent-amber/15 text-accent-amber font-bold text-[10px] shrink-0">
                      Needs Review
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-main p-2.5 rounded-xl border border-border-primary/60">
                    <div className="flex items-center space-x-1.5 text-text-secondary">
                      <FileBadge size={13} className="text-text-muted" />
                      <span className="font-mono text-text-primary font-bold">{applicant.licenseNumber || 'Verified'}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-text-secondary">
                      <Mail size={13} className="text-text-muted" />
                      <span className="truncate">{applicant.email || 'provider@haven.org'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {applicant.introduction}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {applicant.languages.map((l) => (
                      <span key={l} className="px-2 py-0.5 rounded-md bg-surface-main text-text-secondary text-[10px] font-semibold border border-border-primary">
                        {l}
                      </span>
                    ))}
                    {applicant.specialties.slice(0, 2).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-brand-light text-brand-primary text-[10px] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border-primary/60 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-text-muted flex items-center space-x-1">
                    <Clock size={11} />
                    <span>Applied: {applicant.appliedAt || 'Recent'}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRejectApplicant(applicant.id)}
                      className="px-3 py-1.5 bg-surface-main hover:bg-accent-rose-light text-accent-rose text-xs font-bold rounded-xl border border-border-primary transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <X size={13} />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApproveApplicant(applicant.id)}
                      className="px-4 py-1.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <Check size={13} />
                      <span>Approve & Onboard</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: ACTIVE THERAPISTS DIRECTORY */}
      <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border-primary pb-3">
          <h3 className="font-extrabold text-text-primary text-sm">
            Active Provider Directory ({activeTherapists.length})
          </h3>
          <span className="text-[10px] text-text-muted font-medium">Published live to students</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTherapists.map((therapist) => (
            <motion.div
              key={therapist.id}
              layout
              className="p-5 bg-surface-sec/40 border border-border-primary rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={therapist.avatar}
                      alt={therapist.name}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-text-primary text-sm">{therapist.name}</h4>
                      <p className="text-[10px] text-text-secondary font-semibold">{therapist.credentials}</p>
                    </div>
                  </div>
                  <AvailabilityBadge status={therapist.status} />
                </div>

                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {therapist.introduction}
                </p>

                <div className="flex flex-wrap gap-1">
                  {therapist.languages.map((l) => (
                    <span key={l} className="px-1.5 py-0.5 rounded bg-surface-main text-text-muted text-[10px] font-medium border border-border-primary">
                      {l}
                    </span>
                  ))}
                  {therapist.specialties.slice(0, 2).map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-brand-light text-brand-primary text-[10px] font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border-primary/60 flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(therapist.id)}
                  className="text-xs font-bold text-text-secondary hover:text-brand-primary flex items-center space-x-1.5 cursor-pointer"
                >
                  {therapist.status === 'Available' ? (
                    <>
                      <ToggleRight size={18} className="text-accent-teal" />
                      <span>Online (Available)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={18} className="text-text-muted" />
                      <span>Offline (Hidden)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleRemove(therapist.id)}
                  className="p-1.5 text-text-muted hover:text-accent-rose rounded-lg transition-colors cursor-pointer"
                  title="Remove therapist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Manual Add Therapist Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Manually Add Provider">
        {saveSuccess ? (
          <div className="text-center py-6 space-y-2">
            <div className="w-12 h-12 bg-accent-teal-light text-accent-teal rounded-full flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h4 className="font-bold text-text-primary text-sm">Provider Onboarded Successfully</h4>
            <p className="text-xs text-text-secondary">The provider profile is now active on the public directory.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">Full Name</label>
              <input
                type="text"
                required
                placeholder="Dr. Maya Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">Credentials</label>
                <input
                  type="text"
                  required
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">License Number</label>
                <input
                  type="text"
                  placeholder="PSY-CA-994821"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">Languages (comma separated)</label>
              <input
                type="text"
                value={languagesText}
                onChange={(e) => setLanguagesText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">Short Introduction</label>
              <textarea
                rows={2}
                required
                placeholder="Brief summary of their approach..."
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Confirm & Onboard Provider
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
