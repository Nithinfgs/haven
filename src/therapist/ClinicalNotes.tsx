import React, { useState } from 'react';
import { Plus, Lock, Search } from 'lucide-react';
import { Modal } from '../components/Modal';

interface SoapNote {
  id: string;
  clientName: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const INITIAL_NOTES: SoapNote[] = [
  {
    id: 'note_1',
    clientName: 'Sam (Oak Creek High)',
    date: '20 Aug 2026',
    subjective: 'Client expresses extreme distress regarding upcoming calculus exams: "If I don\'t score an A, my parents will be deeply disappointed."',
    objective: 'Elevated psychomotor agitation during check-in. Heart rate paced down following 4-4-4-4 Box Breathing.',
    assessment: 'Cognitive distortion pattern: Catastrophizing and All-or-Nothing thinking. High academic pressure.',
    plan: 'Assigned 2 daily Thought Untangling reframes on Haven. Follow-up consultation on 25 Aug 2026.'
  },
  {
    id: 'note_2',
    clientName: 'Priya M.',
    date: '18 Aug 2026',
    subjective: 'Reports chronic sleep latency of >90 minutes and intrusive thoughts regarding university transition.',
    objective: 'Calm, cooperative demeanor. Engaged positively with Sound Sanctuary 432Hz ambient frequencies.',
    assessment: 'Adjustment anxiety with circadian rhythm disruption.',
    plan: 'Prescribed consistent 10:30 PM acoustic wind-down and weekly habit check-in.'
  }
];

export const ClinicalNotes: React.FC = () => {
  const [notes, setNotes] = useState<SoapNote[]>(INITIAL_NOTES);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [clientName, setClientName] = useState('');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: SoapNote = {
      id: `note_${Date.now()}`,
      clientName: clientName.trim() || 'Anonymous Client',
      date: 'Today, 25 Aug 2026',
      subjective,
      objective,
      assessment,
      plan
    };

    setNotes([newNote, ...notes]);
    setIsModalOpen(false);
    setClientName('');
    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
  };

  const filtered = notes.filter(n => 
    n.clientName.toLowerCase().includes(search.toLowerCase()) ||
    n.assessment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 selection:bg-accent-teal/20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-primary/70 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10.5px] font-black uppercase tracking-widest text-accent-teal">
              Clinical Documentation
            </span>
            <span className="text-border-primary">•</span>
            <span className="text-xs font-mono text-text-muted">HIPAA & Telemedicine Compliant</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight mt-1">
            Client SOAP Progress Notes
          </h1>
          <p className="text-xs text-text-secondary font-medium">
            Confidential Subjective, Objective, Assessment, and Plan documentation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-accent-teal hover:bg-accent-teal/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center space-x-2"
        >
          <Plus size={14} />
          <span>Write SOAP Note</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search notes by client or clinical assessment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface-sec border border-border-primary rounded-xl text-xs font-semibold text-text-primary focus:outline-none focus:border-accent-teal"
        />
      </div>

      {/* Notes Grid */}
      <div className="space-y-4">
        {filtered.map((note) => (
          <div
            key={note.id}
            className="p-6 bg-surface-main border border-border-primary rounded-3xl shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border-primary/60 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-text-primary">{note.clientName}</h3>
                <span className="text-[10px] font-mono text-text-muted">{note.date}</span>
              </div>
              <span className="px-2.5 py-1 bg-surface-sec border border-border-primary rounded-lg text-[10px] font-bold text-accent-teal inline-flex items-center space-x-1">
                <Lock size={11} />
                <span>Encrypted Note</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-surface-sec/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-accent-teal uppercase tracking-wider block">Subjective (S)</span>
                <p className="text-text-secondary leading-relaxed font-medium">{note.subjective}</p>
              </div>

              <div className="p-3.5 bg-surface-sec/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Objective (O)</span>
                <p className="text-text-secondary leading-relaxed font-medium">{note.objective}</p>
              </div>

              <div className="p-3.5 bg-surface-sec/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-accent-rose uppercase tracking-wider block">Assessment (A)</span>
                <p className="text-text-secondary leading-relaxed font-medium">{note.assessment}</p>
              </div>

              <div className="p-3.5 bg-surface-sec/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-accent-amber uppercase tracking-wider block">Plan (P)</span>
                <p className="text-text-secondary leading-relaxed font-medium">{note.plan}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Note Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Compose SOAP Progress Note"
      >
        <form onSubmit={handleAddNote} className="space-y-4 py-1 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-text-secondary uppercase text-[10px]">Client Name / ID</label>
            <input
              type="text"
              required
              placeholder="e.g. Sam (Oak Creek High)"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl font-bold text-text-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-text-secondary uppercase text-[10px]">Subjective (S)</label>
            <textarea
              rows={2}
              required
              placeholder="Chief complaints, emotional reports..."
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl text-text-primary font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-text-secondary uppercase text-[10px]">Objective (O)</label>
            <textarea
              rows={2}
              required
              placeholder="Clinical behavioral observations, vitals..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl text-text-primary font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-text-secondary uppercase text-[10px]">Assessment (A)</label>
            <textarea
              rows={2}
              required
              placeholder="Diagnostic impressions, cognitive distortions..."
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl text-text-primary font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-text-secondary uppercase text-[10px]">Plan (P)</label>
            <textarea
              rows={2}
              required
              placeholder="Treatment interventions, tools assigned, next date..."
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl text-text-primary font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border-primary">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
        </form>
      </Modal>

    </div>
  );
};
