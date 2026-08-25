import React, { useState } from 'react';
import { 
  Video, 
  CheckCircle2, 
  ShieldCheck, 
  Plus
} from 'lucide-react';
import { Modal } from '../components/Modal';

interface Appointment {
  id: string;
  clientName: string;
  clientGrade: string;
  time: string;
  date: string;
  topic: string;
  meetLink: string;
  status: 'confirmed' | 'completed' | 'in_progress';
}

const UPCOMING_SESSIONS: Appointment[] = [
  {
    id: 'appt_1',
    clientName: 'Sam (Oak Creek High)',
    clientGrade: 'Grade 11',
    time: '2:00 PM (In 25 mins)',
    date: 'Today',
    topic: 'Academic pressure & panic grounding during exam week',
    meetLink: 'https://meet.google.com/hvn-oak-cbt',
    status: 'confirmed'
  },
  {
    id: 'appt_2',
    clientName: 'Alex R.',
    clientGrade: 'Grade 12',
    time: '4:30 PM',
    date: 'Today',
    topic: 'Overwhelm & sleep routine stabilization',
    meetLink: 'https://meet.google.com/hvn-alx-slp',
    status: 'confirmed'
  },
  {
    id: 'appt_3',
    clientName: 'Priya M.',
    clientGrade: 'University Year 1',
    time: 'Tomorrow, 10:00 AM',
    date: 'Tomorrow',
    topic: 'Social anxiety & roommate boundaries',
    meetLink: 'https://meet.google.com/hvn-pry-bnd',
    status: 'confirmed'
  }
];

export const ClinicalDashboard: React.FC = () => {
  const [sessions] = useState<Appointment[]>(UPCOMING_SESSIONS);
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('Sam (Oak Creek High)');
  const [soapSubjective, setSoapSubjective] = useState('');
  const [soapPlan, setSoapPlan] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    setNoteSaved(true);
    setTimeout(() => {
      setNoteSaved(false);
      setNewNoteModalOpen(false);
      setSoapSubjective('');
      setSoapPlan('');
    }, 1200);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 selection:bg-accent-teal/20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-primary/70 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10.5px] font-black uppercase tracking-widest text-accent-teal">
              Clinical Practice Hub
            </span>
            <span className="text-border-primary">•</span>
            <span className="text-xs font-mono text-text-muted">License: RCI-MH-2024-8842</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
            Welcome, Dr. Maya Patel
          </h1>
          <p className="text-xs text-text-secondary font-medium">
            You have 2 client consultations scheduled for today on Google Meet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNewNoteModalOpen(true)}
            className="px-4 py-2.5 bg-accent-teal hover:bg-accent-teal/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center space-x-2"
          >
            <Plus size={14} />
            <span>New Clinical SOAP Note</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-surface-main border border-border-primary rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Today's Telehealth Sessions</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-text-primary">2</span>
            <span className="text-xs text-accent-teal font-semibold">1 upcoming in 25m</span>
          </div>
        </div>

        <div className="p-5 bg-surface-main border border-border-primary rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Active Client Case Load</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-text-primary">14</span>
            <span className="text-xs text-text-muted font-semibold">Students across 4 schools</span>
          </div>
        </div>

        <div className="p-5 bg-surface-main border border-border-primary rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Clinical Status</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-bold text-accent-teal flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
              <span>Available for Consultations</span>
            </span>
          </div>
        </div>
      </div>

      {/* Today's Scheduled Consultations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-text-secondary">
            Upcoming Client Consultations
          </h2>
          <span className="text-xs font-mono text-text-muted">End-to-End Encrypted Google Meet</span>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-5 bg-surface-main border border-border-primary rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-accent-teal-light text-accent-teal text-[10px] font-bold font-mono">
                    {session.time}
                  </span>
                  <span className="text-xs font-mono text-text-muted">{session.clientGrade}</span>
                </div>
                <h3 className="text-sm font-extrabold text-text-primary">
                  {session.clientName}
                </h3>
                <p className="text-xs text-text-secondary font-medium">
                  <strong>Focus:</strong> {session.topic}
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <a
                  href={session.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-accent-teal hover:bg-accent-teal/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Video size={14} />
                  <span>Launch Google Meet</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Notes & Intake Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Left: Recent Clinical Notes */}
        <div className="p-6 bg-surface-main border border-border-primary rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-text-secondary">
              Recent Clinical SOAP Notes
            </h3>
            <span className="text-[11px] font-mono text-accent-teal font-bold">Encrypted</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-surface-sec/60 border border-border-primary rounded-xl space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-text-primary">Sam (Oak Creek High)</span>
                <span className="text-[10px] font-mono text-text-muted">20 Aug 2026</span>
              </div>
              <p className="text-text-secondary line-clamp-2">
                <strong>Subjective:</strong> Student reported severe catastrophic thinking regarding calculus midterms. Utilized 5-4-3-2-1 grounding with positive response.
              </p>
            </div>

            <div className="p-3.5 bg-surface-sec/60 border border-border-primary rounded-xl space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-text-primary">Priya M.</span>
                <span className="text-[10px] font-mono text-text-muted">18 Aug 2026</span>
              </div>
              <p className="text-text-secondary line-clamp-2">
                <strong>Subjective:</strong> Transition anxiety regarding college relocation. Recommended Sound Sanctuary binaural audio before sleep.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Telehealth Compliance Guidelines */}
        <div className="p-6 bg-surface-main border border-border-primary rounded-3xl space-y-4">
          <div className="flex items-center space-x-2 text-accent-teal">
            <ShieldCheck size={16} />
            <h3 className="text-xs font-black uppercase tracking-wider text-text-primary">
              Clinical Tele-Practice Protocols
            </h3>
          </div>

          <div className="space-y-2.5 text-xs text-text-secondary leading-relaxed font-medium">
            <p>
              • <strong>Emergency Escalation:</strong> In the event of acute risk of self-harm or suicidal intent during a session, follow the mandatory clinical escalation protocol to the 24/7 Vandrevala Foundation hotline (<code>+91 9999 666 555</code>).
            </p>
            <p>
              • <strong>HIPAA & Indian Telemedicine Compliance:</strong> All video consultations must occur strictly on secure Google Meet rooms. Do not record audio or video without explicit informed parental consent for minors.
            </p>
          </div>
        </div>
      </div>

      {/* New SOAP Note Modal */}
      <Modal
        isOpen={newNoteModalOpen}
        onClose={() => setNewNoteModalOpen(false)}
        title="Record Clinical SOAP Note"
      >
        <form onSubmit={handleSaveNote} className="space-y-4 py-1 text-xs">
          {noteSaved ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 size={32} className="text-accent-teal mx-auto" />
              <h4 className="text-sm font-bold text-text-primary">Clinical SOAP Note Encrypted & Saved</h4>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Client</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl font-bold text-text-primary"
                >
                  <option>Sam (Oak Creek High)</option>
                  <option>Alex R. (Grade 12)</option>
                  <option>Priya M. (University)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Subjective / Chief Complaint</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Client's self-reported feelings, stressors, and symptoms..."
                  value={soapSubjective}
                  onChange={(e) => setSoapSubjective(e.target.value)}
                  className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl text-text-primary font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Assessment & Treatment Plan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Clinical observations, grounding techniques assigned, and next steps..."
                  value={soapPlan}
                  onChange={(e) => setSoapPlan(e.target.value)}
                  className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl text-text-primary font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-primary">
                <button
                  type="button"
                  onClick={() => setNewNoteModalOpen(false)}
                  className="px-4 py-2 font-bold text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent-teal hover:bg-accent-teal/90 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save SOAP Note
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>

    </div>
  );
};
