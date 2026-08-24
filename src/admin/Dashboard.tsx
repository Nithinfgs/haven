import React, { useState, useEffect } from 'react';
import { getMockDatabase } from '../mockData';
import type { ActivityLog, Guide, Room, FlaggedItem } from '../types';
import { motion } from 'framer-motion';
import { 
  UsersRound, 
  MessageSquare, 
  ShieldAlert, 
  RefreshCcw, 
  CheckCircle2, 
  FileText, 
  Check, 
  ArrowRight, 
  Eye, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '../components/Modal';

export const Dashboard: React.FC = () => {
  const db = getMockDatabase();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pendingArticles, setPendingArticles] = useState<Guide[]>([]);
  const [pendingRooms, setPendingRooms] = useState<Room[]>([]);
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([]);
  const [pendingTherapistCount, setPendingTherapistCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewArticle, setPreviewArticle] = useState<Guide | null>(null);

  const loadData = () => {
    setLogs(db.getActivityLogs());
    setPendingArticles(db.getGuides().filter((g) => g.status === 'pending'));
    setPendingRooms(db.getRooms().filter((r) => r.status === 'pending'));
    setFlaggedItems(db.getFlaggedItems().filter((f) => f.status === 'pending'));
    setPendingTherapistCount(db.getTherapists().filter((t) => t.status === 'pending_approval').length);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData();
    setToastMessage('Dashboard refreshed.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  /* ── Article / Blog Approvals ── */
  const handleApproveArticle = (id: string) => {
    const list = db.getGuides();
    const updated = list.map((g) => (g.id === id ? { ...g, status: 'published' as const } : g));
    db.setGuides(updated);
    setPendingArticles(updated.filter((g) => g.status === 'pending'));
    setToastMessage('Blog article approved & published live to Resources.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRejectArticle = (id: string) => {
    if (!window.confirm('Reject and delete this submitted article?')) return;
    const list = db.getGuides();
    const updated = list.filter((g) => g.id !== id);
    db.setGuides(updated);
    setPendingArticles(updated.filter((g) => g.status === 'pending'));
    setToastMessage('Article submission rejected.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* ── Room Requests Approvals ── */
  const handleApproveRoom = (id: string) => {
    const list = db.getRooms();
    const updated = list.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Active' as const,
          moderatorName: 'Dr. Maya Patel',
          moderatorAvailable: true,
        };
      }
      return r;
    });
    db.setRooms(updated);
    setPendingRooms(updated.filter((r) => r.status === 'pending'));
    setToastMessage('Room approved and opened for peer discussions.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRejectRoom = (id: string) => {
    if (!window.confirm('Reject this community room request?')) return;
    const list = db.getRooms();
    const updated = list.filter((r) => r.id !== id);
    db.setRooms(updated);
    setPendingRooms(updated.filter((r) => r.status === 'pending'));
    setToastMessage('Room request rejected.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const userProfile = db.getUserProfile();
  const completedHabitsToday = (userProfile.habits || []).filter(h => h.isCompletedToday).length;
  const totalHabits = (userProfile.habits || []).length;

  const statCards = [
    {
      title: 'Pending Blogs to Approve',
      value: pendingArticles.length,
      change: pendingArticles.length === 0 ? 'Queue cleared' : 'Awaiting clinical review',
      icon: FileText,
      color: 'text-brand-primary bg-brand-light border-brand-primary/10',
    },
    {
      title: 'Room Moderation Requests',
      value: pendingRooms.length,
      change: pendingRooms.length === 0 ? 'All rooms active' : 'Awaiting volunteer assignment',
      icon: MessageSquare,
      color: 'text-accent-teal bg-accent-teal-light border-accent-teal/10',
    },
    {
      title: 'Safety Reports Flagged',
      value: flaggedItems.length,
      change: flaggedItems.length === 0 ? 'No urgent reports' : 'Requires triage',
      icon: ShieldAlert,
      color: 'text-accent-rose bg-accent-rose-light border-accent-rose/10',
    },
    {
      title: 'Active Patients Monitored',
      value: '4',
      change: '1 patient logged high stress',
      icon: UsersRound,
      color: 'text-[#A86E1F] bg-accent-amber-light border-accent-amber/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full px-4">
          <div className="bg-text-primary text-white rounded-[10px] p-4 shadow-lg flex items-center space-x-2 text-xs font-semibold">
            <Check size={16} className="text-accent-teal shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-light text-brand-primary text-[10px] font-bold uppercase tracking-wider mb-2 border border-brand-primary/15">
            <Sparkles size={12} />
            <span>Clinical Therapist Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Therapist Dashboard</h2>
          <p className="text-text-secondary text-xs mt-0.5">
            Monitor patients, review shared habit & diary logs, and approve community room & blog submissions.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-text-secondary hover:text-text-primary bg-surface-main border border-border-primary px-3.5 py-2 rounded-[10px] shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCcw size={12} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Provider Applications Alert Banner */}
      {pendingTherapistCount > 0 && (
        <div className="p-5 bg-accent-amber-light/80 border border-accent-amber/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-surface-main text-accent-amber flex items-center justify-center font-bold border border-accent-amber/20 shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-extrabold text-text-primary text-sm">
                {pendingTherapistCount} Provider Application{pendingTherapistCount > 1 ? 's' : ''} Awaiting Administrative Review
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Licensed counselors and adolescent therapists have submitted credentials to join Haven.
              </p>
            </div>
          </div>
          <Link
            to="/admin/therapists"
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shrink-0 transition-all shadow-xs cursor-pointer inline-flex items-center justify-center space-x-1.5"
          >
            <span>Review & Onboard</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-surface-main border border-border-primary rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">
                  {card.title}
                </span>
                <span className={`p-2 rounded-[10px] border ${card.color}`}>
                  <Icon size={15} />
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-text-primary mb-1">{card.value}</h3>
              <p className="text-text-secondary text-[10px] font-semibold">{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* Main Review Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Section 1: Blog & Article Approvals */}
        <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-primary mb-4">
              <div className="flex items-center space-x-2">
                <FileText size={16} className="text-brand-primary" />
                <h4 className="font-extrabold text-text-primary text-sm">Submitted Blogs to Approve</h4>
              </div>
              <span className="text-[10px] font-bold text-brand-primary bg-brand-light px-2.5 py-0.5 rounded-full">
                {pendingArticles.length} pending
              </span>
            </div>

            {pendingArticles.length === 0 ? (
              <div className="py-10 text-center text-text-secondary">
                <CheckCircle2 size={28} className="text-accent-teal mx-auto mb-2 opacity-80" />
                <p className="text-xs font-bold text-text-primary">All blog submissions reviewed</p>
                <p className="text-[10px] mt-0.5">New peer-authored articles will appear here for clinical verification.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {pendingArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 bg-surface-sec/40 border border-border-primary rounded-xl flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-light text-brand-primary px-2 py-0.5 rounded-[8px]">
                          {art.category}
                        </span>
                        <span className="text-[10px] text-text-muted font-semibold">By {art.author || 'Anonymous'}</span>
                      </div>
                      <h5 className="font-extrabold text-text-primary text-xs mt-1.5">{art.title}</h5>
                      <p className="text-[10px] text-text-secondary line-clamp-2 mt-1 font-semibold">{art.summary}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border-primary/40">
                      <button
                        onClick={() => setPreviewArticle(art)}
                        className="text-[10px] font-bold text-brand-primary hover:underline inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Read Preview</span>
                      </button>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRejectArticle(art.id)}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-[8px] border border-border-primary text-text-secondary hover:text-accent-rose hover:bg-accent-rose-light cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveArticle(art.id)}
                          className="px-3 py-1 text-[10px] font-bold rounded-[8px] bg-brand-primary hover:bg-brand-hover text-white cursor-pointer inline-flex items-center space-x-1"
                        >
                          <Check size={11} />
                          <span>Approve & Publish</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/admin/moderation"
            className="text-[11px] font-bold text-brand-primary hover:underline inline-flex items-center space-x-1 self-end pt-2"
          >
            <span>Go to Moderation Center</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Section 2: Room Requests to Join for Moderation */}
        <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-primary mb-4">
              <div className="flex items-center space-x-2">
                <MessageSquare size={16} className="text-accent-teal" />
                <h4 className="font-extrabold text-text-primary text-sm">Room Requests for Moderation</h4>
              </div>
              <span className="text-[10px] font-bold text-accent-teal bg-accent-teal-light px-2.5 py-0.5 rounded-full">
                {pendingRooms.length} pending
              </span>
            </div>

            {pendingRooms.length === 0 ? (
              <div className="py-10 text-center text-text-secondary">
                <CheckCircle2 size={28} className="text-accent-teal mx-auto mb-2 opacity-80" />
                <p className="text-xs font-bold text-text-primary">No pending room requests</p>
                <p className="text-[10px] mt-0.5">When users propose new community rooms, review & assign moderators here.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {pendingRooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 bg-surface-sec/40 border border-border-primary rounded-xl flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-accent-teal-light text-accent-teal px-2 py-0.5 rounded-[8px]">
                          Category: {room.category}
                        </span>
                        <span className="text-[9px] font-bold text-text-muted uppercase">Pending Mod</span>
                      </div>
                      <h5 className="font-extrabold text-text-primary text-xs mt-1.5">{room.name}</h5>
                      <p className="text-[10px] text-text-secondary line-clamp-2 mt-1 font-semibold">{room.description}</p>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border-primary/40">
                      <button
                        onClick={() => handleRejectRoom(room.id)}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-[8px] border border-border-primary text-text-secondary hover:text-accent-rose hover:bg-accent-rose-light cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveRoom(room.id)}
                        className="px-3 py-1 text-[10px] font-bold rounded-[8px] bg-accent-teal hover:bg-accent-teal-hover text-white cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Check size={11} />
                        <span>Approve & Open Room</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/admin/communities"
            className="text-[11px] font-bold text-brand-primary hover:underline inline-flex items-center space-x-1 self-end pt-2"
          >
            <span>Manage All Communities</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Section 3: Patient Monitoring Snapshot & Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Patient Monitoring Highlight */}
        <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-primary">
            <div className="flex items-center space-x-2">
              <UsersRound size={16} className="text-brand-primary" />
              <h4 className="font-extrabold text-text-primary text-sm">Patient Care Snapshot</h4>
            </div>
            <Link to="/admin/users" className="text-[10px] font-bold text-brand-primary hover:underline">
              View All
            </Link>
          </div>

          {/* Sam snapshot */}
          <div className="p-4 bg-brand-light/50 border border-brand-primary/15 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-[8px] bg-brand-primary text-white flex items-center justify-center font-extrabold text-xs">
                  S
                </div>
                <div>
                  <h5 className="font-extrabold text-text-primary text-xs">Sam (Oak Creek High)</h5>
                  <p className="text-[9px] text-text-muted font-semibold">Active Patient</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-accent-teal bg-accent-teal-light px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-1.5 text-[10px] text-text-secondary font-semibold">
              <div className="flex items-center justify-between">
                <span>Habits & Tasks:</span>
                <span className="font-bold text-brand-primary">{completedHabitsToday}/{totalHabits} Done Today</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Latest Emotion Log:</span>
                <span className="font-bold text-text-primary">Anxious (Midterms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Session / Call:</span>
                <span className="font-bold text-text-primary">Yesterday (Video)</span>
              </div>
            </div>

            <Link
              to="/admin/users"
              className="w-full h-9 bg-surface-main hover:bg-surface-sec border border-border-primary text-text-primary rounded-[8px] text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Review Habits, Calls & Notes</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Quick secondary alert */}
          <div className="p-3 bg-surface-sec/50 border border-border-primary rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-accent-rose animate-pulse"></span>
              <span className="text-[10px] font-bold text-text-secondary">anxious_teen: Shared new diary entry</span>
            </div>
            <Link to="/admin/users" className="text-[9px] font-bold text-brand-primary hover:underline">
              Inspect
            </Link>
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-primary">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
              </span>
              <h4 className="font-extrabold text-text-primary text-sm">Live System & Patient Activity</h4>
            </div>
            <span className="text-[10px] text-text-muted font-bold">Auto-syncing</span>
          </div>

          {logs.length === 0 ? (
            <p className="text-text-secondary text-xs py-6 text-center italic">No logs recorded.</p>
          ) : (
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {logs.map((log) => {
                let dotBg = 'bg-text-muted';
                if (log.type === 'session') dotBg = 'bg-brand-primary';
                if (log.type === 'join') dotBg = 'bg-accent-teal';
                if (log.type === 'moderator') dotBg = 'bg-accent-rose';

                return (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-3 bg-surface-sec/30 border border-border-primary/50 rounded-xl hover:bg-surface-sec transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${dotBg}`}></span>
                      <p className="text-xs text-text-secondary leading-normal font-semibold">
                        {log.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-text-muted shrink-0 font-medium ml-4">
                      {log.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Article Detail Preview Modal */}
      <Modal
        isOpen={previewArticle !== null}
        onClose={() => setPreviewArticle(null)}
        title="Clinical Article Review"
      >
        {previewArticle && (
          <div className="space-y-5 max-w-xl mx-auto">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-light text-brand-primary px-2.5 py-0.5 rounded-[8px]">
                {previewArticle.category}
              </span>
              <h3 className="text-base font-extrabold text-text-primary mt-2">{previewArticle.title}</h3>
              <p className="text-[10px] text-text-muted font-semibold mt-0.5">Author: {previewArticle.author || 'Anonymous'} • Read Time: {previewArticle.readTime}</p>
            </div>

            <div className="p-4 bg-surface-sec/50 border border-border-primary rounded-xl text-xs text-text-secondary leading-relaxed font-medium max-h-[300px] overflow-y-auto whitespace-pre-wrap">
              {previewArticle.content}
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-border-primary">
              <button
                onClick={() => setPreviewArticle(null)}
                className="h-10 px-4 bg-surface-sec hover:bg-surface-main border border-border-primary text-text-primary text-xs font-bold rounded-[10px] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApproveArticle(previewArticle.id);
                  setPreviewArticle(null);
                }}
                className="h-10 px-6 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] cursor-pointer inline-flex items-center space-x-1.5 shadow-xs"
              >
                <Check size={14} />
                <span>Approve & Publish Live</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};
