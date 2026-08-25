import React, { useState } from 'react';
import { Video, CheckCircle2 } from 'lucide-react';

interface SessionItem {
  id: string;
  clientName: string;
  ageGrade: string;
  date: string;
  time: string;
  duration: string;
  meetLink: string;
  notes: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const INITIAL_SESSIONS: SessionItem[] = [
  {
    id: 's_1',
    clientName: 'Sam (Oak Creek High)',
    ageGrade: '16 y/o • Grade 11',
    date: 'Today, 25 Aug 2026',
    time: '2:00 PM – 2:50 PM',
    duration: '50 mins',
    meetLink: 'https://meet.google.com/hvn-oak-cbt',
    notes: 'Exam panic & cognitive catastrophizing.',
    status: 'upcoming'
  },
  {
    id: 's_2',
    clientName: 'Alex R.',
    ageGrade: '17 y/o • Grade 12',
    date: 'Today, 25 Aug 2026',
    time: '4:30 PM – 5:20 PM',
    duration: '50 mins',
    meetLink: 'https://meet.google.com/hvn-alx-slp',
    notes: 'Sleep hygiene & somatic breathwork follow-up.',
    status: 'upcoming'
  },
  {
    id: 's_3',
    clientName: 'Priya M.',
    ageGrade: '18 y/o • University Year 1',
    date: 'Tomorrow, 26 Aug 2026',
    time: '10:00 AM – 10:50 AM',
    duration: '50 mins',
    meetLink: 'https://meet.google.com/hvn-pry-bnd',
    notes: 'Social transition & roommate boundaries.',
    status: 'upcoming'
  },
  {
    id: 's_4',
    clientName: 'Jordan K.',
    ageGrade: '15 y/o • Grade 10',
    date: '22 Aug 2026',
    time: '3:00 PM – 3:50 PM',
    duration: '50 mins',
    meetLink: 'https://meet.google.com/hvn-jrd-past',
    notes: 'Completed: Reviewed thought diary reframes.',
    status: 'completed'
  }
];

export const SessionsManager: React.FC = () => {
  const [sessions] = useState<SessionItem[]>(INITIAL_SESSIONS);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');

  const filtered = filter === 'all' 
    ? sessions 
    : sessions.filter(s => s.status === filter);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 selection:bg-accent-teal/20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-primary/70 pb-6">
        <div>
          <span className="text-[10.5px] font-black uppercase tracking-widest text-accent-teal">
            Telehealth Tele-Practice
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight mt-1">
            Client Telehealth Sessions
          </h1>
          <p className="text-xs text-text-secondary font-medium">
            Manage your Google Meet video appointments and consultation logs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-surface-sec border border-border-primary rounded-xl p-1 text-xs font-bold gap-1">
          {['upcoming', 'completed', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                filter === tab ? 'bg-surface-main text-accent-teal shadow-2xs' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Session Cards */}
      <div className="space-y-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="p-5 bg-surface-main border border-border-primary rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center space-x-3 text-xs">
                <span className="font-mono font-bold text-accent-teal">{s.date} • {s.time}</span>
                <span className="text-text-muted">•</span>
                <span className="text-text-muted font-mono">{s.ageGrade}</span>
              </div>
              <h3 className="text-base font-extrabold text-text-primary">
                {s.clientName}
              </h3>
              <p className="text-xs text-text-secondary font-medium">
                {s.notes}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {s.status === 'upcoming' ? (
                <a
                  href={s.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-accent-teal hover:bg-accent-teal/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Video size={14} />
                  <span>Join Google Meet</span>
                </a>
              ) : (
                <span className="px-3 py-1.5 bg-surface-sec text-text-muted rounded-xl text-xs font-bold inline-flex items-center space-x-1">
                  <CheckCircle2 size={13} className="text-accent-teal" />
                  <span>Session Completed</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
