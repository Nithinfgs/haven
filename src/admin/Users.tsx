import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Ban, 
  ShieldCheck, 
  Check, 
  CheckSquare, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  PhoneCall, 
  MessageSquare, 
  Video, 
  FileText, 
  Plus, 
  Clock, 
  Smile
} from 'lucide-react';
import { getMockDatabase } from '../mockData';
import { Modal } from '../components/Modal';
import type { Habit, DiaryEntry, CommunicationLog, PatientNote } from '../types';

interface AdminUser {
  id: string;
  name: string;
  avatar: string;
  status: 'Active' | 'Restricted' | 'Offline';
  communitiesCount: number;
  lastActive: string;
  school?: string;
  grade?: string;
  ageRange?: string;
}

export const Users: React.FC = () => {
  const db = getMockDatabase();
  const [users, setUsers] = useState<AdminUser[]>([
    { id: 'u1', name: 'Sam', avatar: 'S', status: 'Active', communitiesCount: 2, lastActive: 'Just now', school: 'Oak Creek High School', grade: '11th Grade', ageRange: '15–17' },
    { id: 'u2', name: 'TrollUser9', avatar: 'T', status: 'Restricted', communitiesCount: 1, lastActive: '15 min ago', school: 'Lincoln High', grade: '10th Grade', ageRange: '14–16' },
    { id: 'u3', name: 'anxious_teen', avatar: 'A', status: 'Active', communitiesCount: 1, lastActive: '1 hour ago', school: 'Westfield Academy', grade: '12th Grade', ageRange: '16–18' },
    { id: 'u4', name: 'gamer_girl', avatar: 'G', status: 'Offline', communitiesCount: 2, lastActive: '2 days ago', school: 'East River High', grade: '11th Grade', ageRange: '15–17' },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Patient detail modal states
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalTab, setModalTab] = useState<'habits' | 'diary' | 'communications' | 'notes'>('habits');
  const [sharedHabits, setSharedHabits] = useState<Habit[]>([]);
  const [sharedDiary, setSharedDiary] = useState<DiaryEntry[]>([]);
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<PatientNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');

  const loadPatientData = (user: AdminUser) => {
    if (user.name === 'Sam') {
      const profile = db.getUserProfile();
      setSharedHabits((profile.habits || []).filter(h => h.shareWithTherapist));
      setSharedDiary((profile.diaryEntries || []).filter(d => d.shareWithTherapist));
      setCommunicationLogs(profile.communicationLogs || []);
      setClinicalNotes(profile.clinicalNotes || []);
    } else {
      // High-fidelity clinical data for other mock patients
      const dummyHabits: { [key: string]: Habit[] } = {
        'anxious_teen': [
          { id: 'd1', name: 'Mindful Meditation', category: 'Mindfulness', description: 'Meditate for 10 minutes before school.', isCompletedToday: true, history: { '2026-08-21': true, '2026-08-20': true, '2026-08-19': true }, shareWithTherapist: true },
          { id: 'd2', name: 'Sleep 8 Hours', category: 'Sleep', description: 'Maintain consistent sleep pattern.', isCompletedToday: false, history: { '2026-08-20': true, '2026-08-19': false }, shareWithTherapist: true },
          { id: 'd2b', name: 'Daily Walk', category: 'Exercise', description: '20-minute neighborhood stroll.', isCompletedToday: true, history: { '2026-08-21': true, '2026-08-20': true }, shareWithTherapist: true }
        ],
        'gamer_girl': [
          { id: 'd3', name: 'Outdoor Walk', category: 'Exercise', description: 'Get fresh air and movement.', isCompletedToday: true, history: { '2026-08-21': true, '2026-08-20': true }, shareWithTherapist: true },
          { id: 'd4', name: 'Screen Break at 10 PM', category: 'Sleep', description: 'Turn off PC and read.', isCompletedToday: false, history: { '2026-08-20': false }, shareWithTherapist: true }
        ],
      };
      const dummyDiary: { [key: string]: DiaryEntry[] } = {
        'anxious_teen': [
          { id: 'de1', date: '2026-08-21', mood: 'Anxious', moodEmoji: '', text: 'Exam anxiety is peaking today. Used the box breathing tool to stay centered.', shareWithTherapist: true },
          { id: 'de2', date: '2026-08-20', mood: 'Okay', moodEmoji: '', text: 'Talked with mom about school expectations. It helped a little bit.', shareWithTherapist: true },
        ],
        'gamer_girl': [
          { id: 'de3', date: '2026-08-20', mood: 'Happy', moodEmoji: '', text: 'Won the regional match with my team! Felt celebrated and energized.', shareWithTherapist: true },
        ],
      };
      const dummyComms: { [key: string]: CommunicationLog[] } = {
        'anxious_teen': [
          { id: 'c1', type: 'video_session', title: 'Therapy Check-in Call', senderOrWith: 'Dr. Maya Patel', summary: 'Discussion of exam anxiety and coping mechanisms.', timestamp: 'Aug 19, 4:00 PM', status: 'Completed', duration: '50 mins' },
          { id: 'c2', type: 'message', title: 'Peer Support Message', senderOrWith: 'Taylor (Peer Mod)', summary: 'Checked in after high stress comments in School Pressure room.', timestamp: 'Aug 20, 11:30 AM', status: 'Delivered' },
          { id: 'c3', type: 'crisis_call', title: '988 Crisis Line Call', senderOrWith: '988 Crisis Counselor', summary: 'Immediate panic de-escalation protocol conducted.', timestamp: 'Aug 15, 9:20 PM', status: 'Completed', duration: '22 mins' }
        ],
        'gamer_girl': [
          { id: 'c4', type: 'message', title: 'Therapist SMS Reminder', senderOrWith: 'Haven Automated Care', summary: 'Daily evening screen curfew reminder.', timestamp: 'Yesterday, 9:55 PM', status: 'Delivered' }
        ]
      };
      const dummyNotes: { [key: string]: PatientNote[] } = {
        'anxious_teen': [
          { id: 'n1', therapistName: 'Dr. Maya Patel', date: 'Aug 19, 2026', content: 'Patient continues to struggle with catastrophic thinking around exam grades. Introduced progressive muscle relaxation.' }
        ]
      };

      setSharedHabits(dummyHabits[user.name] || []);
      setSharedDiary(dummyDiary[user.name] || []);
      setCommunicationLogs(dummyComms[user.name] || []);
      setClinicalNotes(dummyNotes[user.name] || []);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      loadPatientData(selectedUser);
    }
  }, [selectedUser]);

  const handleAddClinicalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !selectedUser) return;

    const newNote: PatientNote = {
      id: `note_${Date.now()}`,
      therapistName: 'Dr. Maya Patel',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content: newNoteContent.trim()
    };

    if (selectedUser.name === 'Sam') {
      const profile = db.getUserProfile();
      const updatedNotes = [newNote, ...(profile.clinicalNotes || [])];
      db.setUserProfile({ ...profile, clinicalNotes: updatedNotes });
      setClinicalNotes(updatedNotes);
    } else {
      setClinicalNotes([newNote, ...clinicalNotes]);
    }

    setNewNoteContent('');
    setToastMessage('Clinical note saved to patient record.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRestrict = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Restricted' ? 'Active' : 'Restricted';
    const verb = nextStatus === 'Restricted' ? 'restricted' : 'restored';
    
    if (!window.confirm(`Are you sure you want to change this patient's status to ${nextStatus}?`)) return;

    setUsers(users.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)));
    setToastMessage(`Patient account has been ${verb}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemove = (userId: string, userName: string) => {
    if (!window.confirm(`CRITICAL ACTION: Permanently remove account for "${userName}"?`)) return;

    setUsers(users.filter((u) => u.id !== userId));
    if (selectedUser?.id === userId) setSelectedUser(null);
    setToastMessage(`Account for ${userName} removed.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-xs w-full px-4">
          <div className="bg-text-primary text-white rounded-[10px] p-4 shadow-lg flex items-center space-x-2 text-xs font-semibold">
            <Check size={16} className="text-accent-teal" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Patient Monitoring & Accounts</h2>
          <p className="text-text-secondary text-xs mt-0.5">
            Monitor client progress, inspect completed tasks & habits, review received calls/messages, and manage clinical care plans.
          </p>
        </div>
      </div>

      {/* Patient Table Panel */}
      <div className="bg-surface-main border border-border-primary rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-sec text-text-secondary font-bold border-b border-border-primary uppercase tracking-wider">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">School & Grade</th>
                <th className="px-6 py-4">Communities</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/40">
              {users.map((u) => (
                <tr 
                  key={u.id} 
                  className="hover:bg-surface-sec/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(u)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-9 h-9 rounded-[10px] bg-brand-light text-brand-primary flex items-center justify-center font-extrabold shrink-0 border border-brand-primary/15">
                        {u.avatar}
                      </div>
                      <div>
                        <span className="font-extrabold text-text-primary text-sm block">{u.name}</span>
                        <span className="text-[10px] text-text-muted font-semibold">Age: {u.ageRange || '15–17'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        u.status === 'Active'
                          ? 'bg-accent-teal-light text-accent-teal-hover border-accent-teal-light'
                          : u.status === 'Restricted'
                            ? 'bg-accent-rose-light text-[#A94455] border-accent-rose-light'
                            : 'bg-surface-sec text-text-secondary border-surface-sec'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-text-secondary">
                    {u.school || 'Oak Creek High'} • {u.grade || '11th'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-text-secondary">
                    {u.communitiesCount} {u.communitiesCount === 1 ? 'room' : 'rooms'}
                  </td>
                  <td className="px-6 py-4 text-text-muted font-medium">{u.lastActive}</td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1.5 rounded-[8px] bg-brand-light text-brand-primary border border-brand-primary/20 text-xs font-bold hover:bg-brand-primary hover:text-white transition-all cursor-pointer inline-flex items-center space-x-1"
                      >
                        <CheckSquare size={12} />
                        <span>Monitor Patient</span>
                      </button>

                      <button
                        onClick={() => handleRestrict(u.id, u.status)}
                        className={`p-1.5 rounded-[8px] border transition-colors cursor-pointer ${
                          u.status === 'Restricted'
                            ? 'text-accent-teal hover:bg-accent-teal-light border-accent-teal/10'
                            : 'text-text-secondary hover:text-accent-rose hover:bg-accent-rose-light border-border-primary'
                        }`}
                        title={u.status === 'Restricted' ? 'Lift restriction' : 'Restrict access'}
                      >
                        {u.status === 'Restricted' ? <ShieldCheck size={14} /> : <Ban size={14} />}
                      </button>

                      <button
                        onClick={() => handleRemove(u.id, u.name)}
                        className="text-text-secondary hover:text-accent-rose hover:bg-accent-rose-light p-1.5 rounded-[8px] border border-border-primary transition-colors cursor-pointer"
                        title="Delete user account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Patient Care & Monitoring Modal */}
      <Modal
        isOpen={selectedUser !== null}
        onClose={() => { setSelectedUser(null); setModalTab('habits'); }}
        title={`${selectedUser?.name || ''}'s Clinical Profile & Progress`}
      >
        {selectedUser && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Patient Header Summary */}
            <div className="p-4 bg-surface-sec/50 border border-border-primary rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center font-extrabold text-lg shadow-xs">
                  {selectedUser.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-text-primary text-base">{selectedUser.name}</h4>
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-accent-teal-light text-accent-teal">
                      {selectedUser.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary font-semibold mt-0.5">
                    {selectedUser.school} • Grade {selectedUser.grade} • Age {selectedUser.ageRange}
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-border-primary sm:pl-4">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Last Active</span>
                <span className="text-xs font-bold text-text-primary">{selectedUser.lastActive}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1.5 bg-surface-sec border border-border-primary rounded-[12px] p-1 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setModalTab('habits')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  modalTab === 'habits'
                    ? 'bg-surface-main shadow-xs text-brand-primary border border-border-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <CheckSquare size={13} />
                <span>Habits & Tasks</span>
              </button>

              <button
                onClick={() => setModalTab('diary')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  modalTab === 'diary'
                    ? 'bg-surface-main shadow-xs text-brand-primary border border-border-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <BookOpen size={13} />
                <span>Emotion Diary</span>
              </button>

              <button
                onClick={() => setModalTab('communications')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  modalTab === 'communications'
                    ? 'bg-surface-main shadow-xs text-brand-primary border border-border-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <PhoneCall size={13} />
                <span>Calls & Messages ({communicationLogs.length})</span>
              </button>

              <button
                onClick={() => setModalTab('notes')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  modalTab === 'notes'
                    ? 'bg-surface-main shadow-xs text-brand-primary border border-border-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <FileText size={13} />
                <span>Clinical Notes</span>
              </button>
            </div>

            {/* ══════════ TAB 1: HABITS & TASKS ══════════ */}
            {modalTab === 'habits' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-text-secondary font-semibold">
                    Review patient task completion and adherence streaks. Only therapist-authorized routines are shown.
                  </p>
                  <span className="text-[10px] font-bold text-brand-primary bg-brand-light px-2.5 py-0.5 rounded-full">
                    {sharedHabits.filter(h => h.isCompletedToday).length} of {sharedHabits.length} Done Today
                  </span>
                </div>

                {sharedHabits.length === 0 ? (
                  <div className="text-center py-10 bg-surface-sec/30 border border-border-primary rounded-xl">
                    <CheckSquare size={28} className="text-text-muted mx-auto mb-2" />
                    <h5 className="font-extrabold text-text-primary text-xs">No shared habits</h5>
                    <p className="text-text-secondary text-[10px] mt-0.5">Patient has not authorized habit tracking data for sharing.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sharedHabits.map((habit) => {
                      const completedDays = Object.keys(habit.history).filter(d => habit.history[d] === true).length;
                      return (
                        <div 
                          key={habit.id} 
                          className="p-4 bg-surface-main border border-border-primary rounded-xl space-y-3 flex flex-col justify-between shadow-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="bg-brand-light text-brand-primary text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[8px] border border-brand-primary/10">
                                {habit.category}
                              </span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                habit.isCompletedToday
                                  ? 'bg-accent-teal-light text-accent-teal border border-accent-teal/20'
                                  : 'bg-surface-sec text-text-muted border border-border-primary'
                              }`}>
                                {habit.isCompletedToday ? 'Done Today' : 'Pending'}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-text-primary text-xs mt-2">{habit.name}</h4>
                            <p className="text-[9.5px] text-text-secondary leading-relaxed mt-1 font-semibold">{habit.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-primary/50 text-[9px] text-text-secondary font-bold">
                            <span className="flex items-center space-x-1">
                              <TrendingUp size={11} className="text-brand-primary" />
                              <span>Streak: {completedDays} days </span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar size={11} className="text-brand-primary" />
                              <span>Shared with You</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ══════════ TAB 2: EMOTION DIARY ══════════ */}
            {modalTab === 'diary' && (
              <div className="space-y-4">
                <p className="text-[10px] text-text-secondary font-semibold">
                  Personal reflections and daily emotion ratings shared by the patient.
                </p>

                {sharedDiary.length === 0 ? (
                  <div className="text-center py-10 bg-surface-sec/30 border border-border-primary rounded-xl">
                    <Smile size={28} className="text-text-muted mx-auto mb-2" />
                    <h5 className="font-extrabold text-text-primary text-xs">No diary entries shared</h5>
                    <p className="text-text-secondary text-[10px] mt-0.5">Patient has not authorized any journal entries for clinical sharing.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sharedDiary.map(entry => (
                      <div key={entry.id} className="p-4 bg-surface-main border border-border-primary rounded-xl space-y-2.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center font-bold text-xs shrink-0 border border-brand-primary/15">
                              <BookOpen size={14} />
                            </div>
                            <div>
                              <span className="font-extrabold text-text-primary text-xs block">{entry.mood}</span>
                              <p className="text-[9px] text-text-muted font-semibold">{entry.date}</p>
                            </div>
                          </div>
                          <span className="text-[8.5px] font-bold text-accent-teal bg-accent-teal-light px-2 py-0.5 rounded-full border border-accent-teal/15">
                            Authorized
                          </span>
                        </div>
                        <p className="text-[10.5px] text-text-secondary font-semibold leading-relaxed border-t border-border-primary/40 pt-2.5 whitespace-pre-wrap">
                          {entry.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════ TAB 3: CALLS & MESSAGES ══════════ */}
            {modalTab === 'communications' && (
              <div className="space-y-4">
                <p className="text-[10px] text-text-secondary font-semibold">
                  Log of therapy video check-ins, crisis lifeline calls, and peer support volunteer communications.
                </p>

                {communicationLogs.length === 0 ? (
                  <div className="text-center py-10 bg-surface-sec/30 border border-border-primary rounded-xl">
                    <PhoneCall size={28} className="text-text-muted mx-auto mb-2" />
                    <h5 className="font-extrabold text-text-primary text-xs">No calls or messages logged</h5>
                    <p className="text-text-secondary text-[10px] mt-0.5">Communication events will appear here automatically.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {communicationLogs.map((log) => {
                      let Icon = MessageSquare;
                      let badgeColor = 'bg-brand-light text-brand-primary border-brand-primary/10';
                      if (log.type === 'video_session') {
                        Icon = Video;
                        badgeColor = 'bg-accent-teal-light text-accent-teal border-accent-teal/15';
                      } else if (log.type === 'crisis_call' || log.type === 'call') {
                        Icon = PhoneCall;
                        badgeColor = 'bg-accent-rose-light text-accent-rose border-accent-rose/15';
                      }

                      return (
                        <div 
                          key={log.id} 
                          className="p-4 bg-surface-main border border-border-primary rounded-xl flex items-start justify-between gap-4 shadow-xs"
                        >
                          <div className="flex items-start space-x-3.5">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${badgeColor}`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h5 className="font-extrabold text-text-primary text-xs">{log.title}</h5>
                                <span className="text-[9px] font-bold text-text-muted">• {log.senderOrWith}</span>
                              </div>
                              <p className="text-[10px] text-text-secondary font-semibold mt-1 leading-relaxed">
                                {log.summary}
                              </p>
                              {log.duration && (
                                <span className="inline-flex items-center space-x-1 text-[9px] font-bold text-text-muted mt-1.5">
                                  <Clock size={10} />
                                  <span>Duration: {log.duration}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[9px] font-bold text-text-muted block">{log.timestamp}</span>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider border ${
                              log.status === 'Completed' ? 'bg-accent-teal-light text-accent-teal border-accent-teal/20' :
                              log.status === 'Delivered' ? 'bg-brand-light text-brand-primary border-brand-primary/20' :
                              'bg-surface-sec text-text-muted border-border-primary'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ══════════ TAB 4: CLINICAL NOTES ══════════ */}
            {modalTab === 'notes' && (
              <div className="space-y-4">
                {/* Add new note form */}
                <form onSubmit={handleAddClinicalNote} className="p-4 bg-surface-sec/40 border border-border-primary rounded-xl space-y-3">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">
                    Add Confidential Clinical Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter observation, care plan adjustment, or progress notes for this patient..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="w-full bg-surface-main border border-border-primary text-text-primary px-3 py-2 rounded-[10px] text-xs font-semibold focus:outline-none focus:border-brand-primary resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteContent.trim()}
                      className="px-4 py-2 bg-brand-primary hover:bg-brand-hover disabled:opacity-50 text-white text-xs font-bold rounded-[8px] cursor-pointer inline-flex items-center space-x-1.5 shadow-xs"
                    >
                      <Plus size={13} />
                      <span>Save Clinical Note</span>
                    </button>
                  </div>
                </form>

                {/* Existing notes list */}
                <div className="space-y-3">
                  {clinicalNotes.length === 0 ? (
                    <p className="text-center py-6 text-text-muted text-xs italic">No clinical notes recorded yet.</p>
                  ) : (
                    clinicalNotes.map(note => (
                      <div key={note.id} className="p-4 bg-surface-main border border-border-primary rounded-xl space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between text-[10px] font-bold text-text-muted border-b border-border-primary/40 pb-1.5">
                          <span>Recorded by {note.therapistName}</span>
                          <span>{note.date}</span>
                        </div>
                        <p className="text-xs text-text-secondary font-medium leading-relaxed pt-1 whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border-primary flex justify-end">
              <button
                onClick={() => { setSelectedUser(null); setModalTab('habits'); }}
                className="h-10 px-5 bg-surface-sec hover:bg-surface-main text-text-primary font-bold rounded-[10px] text-xs cursor-pointer border border-border-primary"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};
