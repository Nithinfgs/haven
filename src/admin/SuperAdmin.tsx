import React, { useState, useEffect } from 'react';
import { getMockDatabase } from '../mockData';
import type { Therapist } from '../types';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Mail, 
  Clock, 
  Search,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const SuperAdmin: React.FC = () => {
  const db = getMockDatabase();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Therapist | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    setTherapists(db.getTherapists());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const pendingApplicants = therapists.filter((t) => t.status === 'pending_approval');
  const approvedTherapists = therapists.filter((t) => t.status !== 'pending_approval' && t.status !== 'rejected');

  const filteredList = therapists.filter((t) => {
    if (filterTab === 'pending' && t.status !== 'pending_approval') return false;
    if (filterTab === 'approved' && (t.status === 'pending_approval' || t.status === 'rejected')) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.credentials.toLowerCase().includes(q) ||
        (t.licenseNumber && t.licenseNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleApprove = (id: string) => {
    const list = db.getTherapists();
    const updated = list.map((t) => {
      if (t.id === id) {
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
    if (selectedApplicant?.id === id) {
      setSelectedApplicant(null);
    }

    const target = updated.find((t) => t.id === id);
    const logs = db.getActivityLogs();
    db.setActivityLogs([
      {
        id: `act_${Date.now()}`,
        type: 'availability' as const,
        description: `Executive Admin APPROVED therapist license: ${target?.name} (${target?.credentials})`,
        timestamp: 'Just now',
      },
      ...logs,
    ]);

    showToast(`Approved ${target?.name}. Provider is now active on the public directory.`);
  };

  const handleReject = (id: string) => {
    const target = therapists.find((t) => t.id === id);
    if (!window.confirm(`Are you sure you want to reject the application for ${target?.name || 'this provider'}?`)) return;

    const list = db.getTherapists();
    const updated = list.filter((t) => t.id !== id);
    db.setTherapists(updated);
    setTherapists(updated);
    if (selectedApplicant?.id === id) {
      setSelectedApplicant(null);
    }

    showToast(`Rejected and removed application for ${target?.name}.`);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-brand-primary text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-primary pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-amber/15 text-accent-amber text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-accent-amber/20">
            <ShieldCheck size={12} />
            <span>Executive Governance Console</span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Therapist Application & License Management
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Audit clinical credentials, inspect digitally signed contracts, and approve or reject provider applicants.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-surface-sec text-text-primary border border-border-primary text-xs font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse"></span>
            <span>{pendingApplicants.length} Pending Review</span>
          </span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-main border border-border-primary rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            Pending Applications
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-accent-amber">{pendingApplicants.length}</span>
            <span className="text-xs text-text-muted font-medium">Awaiting decision</span>
          </div>
        </div>

        <div className="bg-surface-main border border-border-primary rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            Approved Active Providers
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-accent-teal">{approvedTherapists.length}</span>
            <span className="text-xs text-text-muted font-medium">Live on directory</span>
          </div>
        </div>

        <div className="bg-surface-main border border-border-primary rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            Total Monitored Students
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-brand-primary">148</span>
            <span className="text-xs text-text-muted font-medium">Registered accounts</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-main border border-border-primary p-3 rounded-2xl shadow-xs">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'pending'
                ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30'
                : 'text-text-secondary hover:bg-surface-sec'
            }`}
          >
            Pending Applications ({pendingApplicants.length})
          </button>
          <button
            onClick={() => setFilterTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'approved'
                ? 'bg-brand-light text-brand-primary border border-brand-primary/20'
                : 'text-text-secondary hover:bg-surface-sec'
            }`}
          >
            Approved Providers ({approvedTherapists.length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-surface-sec text-text-primary border border-border-primary'
                : 'text-text-secondary hover:bg-surface-sec'
            }`}
          >
            All ({therapists.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, license..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-surface-sec border border-border-primary rounded-xl text-text-primary focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center bg-surface-main border border-border-primary rounded-2xl">
            <CheckCircle2 size={32} className="text-accent-teal mx-auto mb-2 opacity-80" />
            <h4 className="font-bold text-text-primary text-sm">No applications found</h4>
            <p className="text-xs text-text-secondary mt-1">All provider requests under this filter have been processed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredList.map((applicant) => {
              const isPending = applicant.status === 'pending_approval';
              return (
                <div
                  key={applicant.id}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isPending
                      ? 'bg-surface-main border-accent-amber/40 shadow-xs ring-1 ring-accent-amber/10'
                      : 'bg-surface-main border-border-primary shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={applicant.avatar}
                          alt={applicant.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-border-primary"
                        />
                        <div>
                          <h3 className="font-extrabold text-text-primary text-sm">{applicant.name}</h3>
                          <p className="text-xs text-brand-primary font-bold">{applicant.credentials}</p>
                          <span className="text-[10px] text-text-muted font-semibold">
                            License: <span className="font-mono text-text-primary">{applicant.licenseNumber || 'Verified License'}</span>
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider shrink-0 ${
                        isPending
                          ? 'bg-accent-amber/15 text-accent-amber border border-accent-amber/25'
                          : 'bg-accent-teal-light text-accent-teal border border-accent-teal-light'
                      }`}>
                        {isPending ? 'Needs Review' : 'Approved'}
                      </span>
                    </div>

                    {/* Metadata Pill Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-sec/70 p-3 rounded-xl border border-border-primary/60">
                      <div className="flex items-center space-x-1.5 text-text-secondary truncate">
                        <Mail size={12} className="text-text-muted shrink-0" />
                        <span className="truncate">{applicant.email || `${applicant.id}@haven.org`}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-text-secondary">
                        <Clock size={12} className="text-text-muted shrink-0" />
                        <span>Applied: {applicant.appliedAt || 'Recent'}</span>
                      </div>
                    </div>

                    {/* Bio & Modalities */}
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {applicant.fullBio || applicant.introduction}
                    </p>

                    {/* Contract Details / Info */}
                    {applicant.whyConnect && (
                      <div className="p-2.5 bg-brand-light/30 border border-brand-primary/15 rounded-xl text-[10.5px] text-text-secondary">
                        <span className="font-bold text-brand-primary block mb-0.5">Application Contract Details:</span>
                        <span className="leading-normal">{applicant.whyConnect}</span>
                      </div>
                    )}

                    {/* Languages & Specialties */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {applicant.languages.map((lang) => (
                        <span key={lang} className="px-2 py-0.5 rounded-md bg-surface-sec text-text-secondary text-[10px] font-semibold border border-border-primary">
                          {lang}
                        </span>
                      ))}
                      {applicant.specialties.map((spec) => (
                        <span key={spec} className="px-2 py-0.5 rounded-md bg-brand-light text-brand-primary text-[10px] font-bold">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 border-t border-border-primary/60 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedApplicant(applicant)}
                      className="px-3 py-1.5 bg-surface-sec hover:bg-surface-main text-text-primary text-xs font-bold rounded-xl border border-border-primary transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <Eye size={13} />
                      <span>Inspect Dossier</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReject(applicant.id)}
                        className="px-3.5 py-1.5 bg-surface-main hover:bg-accent-rose-light text-accent-rose text-xs font-bold rounded-xl border border-border-primary transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <X size={13} />
                        <span>{isPending ? 'Reject' : 'Revoke'}</span>
                      </button>

                      {isPending && (
                        <button
                          onClick={() => handleApprove(applicant.id)}
                          className="px-4 py-1.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1"
                        >
                          <Check size={13} />
                          <span>Approve & Onboard</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Applicant Dossier Inspection Modal */}
      {selectedApplicant && (
        <Modal
          isOpen={Boolean(selectedApplicant)}
          onClose={() => setSelectedApplicant(null)}
          title={`Clinical Application: ${selectedApplicant.name}`}
        >
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex items-center space-x-4 p-4 bg-surface-sec rounded-2xl border border-border-primary">
              <img
                src={selectedApplicant.avatar}
                alt={selectedApplicant.name}
                className="w-16 h-16 rounded-2xl object-cover"
              />
              <div>
                <h3 className="text-base font-extrabold text-text-primary">{selectedApplicant.name}</h3>
                <p className="text-xs font-bold text-brand-primary">{selectedApplicant.credentials}</p>
                <p className="text-xs text-text-muted mt-0.5">License: <span className="font-mono text-text-primary font-bold">{selectedApplicant.licenseNumber || 'Verified'}</span></p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider">Full Resume & Clinical Modalities</h4>
              <p className="text-xs text-text-secondary leading-relaxed bg-surface-sec/40 p-4 rounded-xl border border-border-primary">
                {selectedApplicant.fullBio || selectedApplicant.introduction}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider">Scheduled Working Hours & Telehealth Slots</h4>
              <div className="flex flex-wrap gap-2">
                {selectedApplicant.schedule.map((slot) => (
                  <span key={slot} className="px-3 py-1 bg-surface-sec text-text-primary font-mono text-xs rounded-xl border border-border-primary">
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            {selectedApplicant.whyConnect && (
              <div className="p-4 bg-brand-light/30 border border-brand-primary/20 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-brand-primary block">Contract Audit & Sign-Off:</span>
                <p className="text-xs text-text-secondary font-serif italic">
                  {selectedApplicant.whyConnect}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-3 border-t border-border-primary">
              <button
                onClick={() => handleReject(selectedApplicant.id)}
                className="px-4 py-2 bg-surface-sec hover:bg-accent-rose-light text-accent-rose text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Reject Application
              </button>
              {selectedApplicant.status === 'pending_approval' && (
                <button
                  onClick={() => handleApprove(selectedApplicant.id)}
                  className="px-6 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Check size={14} />
                  <span>Approve & Grant Provider Access</span>
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
