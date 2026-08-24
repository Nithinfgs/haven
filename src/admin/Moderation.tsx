import React, { useState, useEffect } from 'react';
import { getMockDatabase } from '../mockData';
import type { FlaggedItem, Guide, Room } from '../types';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle2, ShieldOff, Check, FileText, MessageSquare } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Moderation: React.FC = () => {
  const db = getMockDatabase();
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([]);
  const [pendingArticles, setPendingArticles] = useState<Guide[]>([]);
  const [pendingRooms, setPendingRooms] = useState<Room[]>([]);
  
  const [activeTab, setActiveTab] = useState<'messages' | 'articles' | 'rooms'>('messages');
  const [previewArticle, setPreviewArticle] = useState<Guide | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setFlaggedItems(db.getFlaggedItems());
    setPendingArticles(db.getGuides().filter((g) => g.status === 'pending'));
    setPendingRooms(db.getRooms().filter((r) => r.status === 'pending'));
  }, []);

  const handleDismiss = (id: string) => {
    const list = db.getFlaggedItems();
    const updated = list.filter((item) => item.id !== id);
    db.setFlaggedItems(updated);
    setFlaggedItems(updated);
    
    setToastMessage('Report dismissed successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveMessage = (id: string, messagePreview: string) => {
    const confirmAction = window.confirm(`Are you sure you want to permanently delete the message: "${messagePreview}"?`);
    if (!confirmAction) return;

    const list = db.getFlaggedItems();
    const updated = list.filter((item) => item.id !== id);
    db.setFlaggedItems(updated);
    setFlaggedItems(updated);

    // Update stats
    const stats = db.getStats();
    db.setStats({
      ...stats,
      usersNeedingSupport: Math.max(0, stats.usersNeedingSupport - 1)
    });

    setToastMessage('Message removed from chat room.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRestrictUser = (id: string, senderName: string) => {
    const confirmAction = window.confirm(`Are you sure you want to suspend user account "${senderName}" from the platform?`);
    if (!confirmAction) return;

    const list = db.getFlaggedItems();
    const updated = list.filter((item) => item.id !== id);
    db.setFlaggedItems(updated);
    setFlaggedItems(updated);

    setToastMessage(`User ${senderName} has been restricted.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApproveArticle = (id: string) => {
    const list = db.getGuides();
    const updated = list.map((g) => {
      if (g.id === id) {
        return { ...g, status: 'published' as const };
      }
      return g;
    });
    db.setGuides(updated);
    setPendingArticles(updated.filter((g) => g.status === 'pending'));
    
    setToastMessage('Article approved and published to Resources.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRejectArticle = (id: string) => {
    const confirmAction = window.confirm('Are you sure you want to reject and permanently delete this article submission?');
    if (!confirmAction) return;

    const list = db.getGuides();
    const updated = list.filter((g) => g.id !== id);
    db.setGuides(updated);
    setPendingArticles(updated.filter((g) => g.status === 'pending'));
    
    setToastMessage('Article submission rejected.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApproveRoom = (id: string) => {
    const list = db.getRooms();
    const updated = list.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Active' as const,
          moderatorName: 'System Assigned',
          moderatorAvailable: true
        };
      }
      return r;
    });
    db.setRooms(updated);
    setPendingRooms(updated.filter((r) => r.status === 'pending'));

    setToastMessage('Room request approved and opened.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRejectRoom = (id: string) => {
    const confirmAction = window.confirm('Are you sure you want to reject and permanently delete this room suggestion?');
    if (!confirmAction) return;

    const list = db.getRooms();
    const updated = list.filter((r) => r.id !== id);
    db.setRooms(updated);
    setPendingRooms(updated.filter((r) => r.status === 'pending'));

    setToastMessage('Room request rejected.');
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
      <div>
        <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Moderation Queue</h2>
        <p className="text-text-secondary text-xs mt-0.5">Audit reported chat messages, verify article suggestions, and review room requests.</p>
      </div>

      {/* Selector Tabs */}
      <div className="flex space-x-2 border-b border-border-primary pb-3">
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'bg-surface-main text-text-secondary border border-border-primary hover:bg-surface-sec'
          }`}
        >
          Reported Messages ({flaggedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'articles'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'bg-surface-main text-text-secondary border border-border-primary hover:bg-surface-sec'
          }`}
        >
          Submitted Articles ({pendingArticles.length})
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'rooms'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'bg-surface-main text-text-secondary border border-border-primary hover:bg-surface-sec'
          }`}
        >
          Room Requests ({pendingRooms.length})
        </button>
      </div>

      {/* Tab 1: Reported Messages */}
      {activeTab === 'messages' && (
        <div className="bg-surface-main border border-border-primary rounded-2xl overflow-hidden shadow-xs">
          {flaggedItems.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-12 h-12 bg-accent-teal-light rounded-full flex items-center justify-center text-accent-teal mx-auto mb-4 border border-accent-teal/10">
                <CheckCircle2 size={20} />
              </div>
              <h4 className="font-extrabold text-text-primary text-base mb-1">Queue is clear</h4>
              <p className="text-text-secondary text-xs">No flagged messages or active reports need attention.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-sec text-text-secondary font-bold border-b border-border-primary uppercase tracking-wider">
                    <th className="px-6 py-4">Sender & Room</th>
                    <th className="px-6 py-4">Report Details</th>
                    <th className="px-6 py-4">Flagged message</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary/40">
                  {flaggedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-sec/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-text-primary text-sm leading-none">{item.senderName}</div>
                          <div className="text-text-secondary text-[10px] font-semibold mt-1.5 uppercase tracking-wide">
                            Room: {item.roomName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="bg-accent-rose-light text-[#A94455] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-accent-rose/10">
                            {item.reason}
                          </span>
                          <div className="text-text-secondary text-[10px] mt-1.5 font-semibold">{item.timestamp}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-secondary max-w-xs leading-normal">
                        "{item.messageContent}"
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2.5">
                          <button
                            onClick={() => handleDismiss(item.id)}
                            className="p-1.5 rounded-[10px] border border-border-primary text-text-secondary hover:text-accent-teal hover:bg-accent-teal-light transition-colors cursor-pointer"
                            title="Dismiss report"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          
                          <button
                            onClick={() => handleRemoveMessage(item.id, item.messageContent)}
                            className="p-1.5 rounded-[10px] border border-border-primary text-text-secondary hover:text-accent-rose hover:bg-accent-rose-light transition-colors cursor-pointer"
                            title="Remove message"
                          >
                            <Trash2 size={14} />
                          </button>

                          <button
                            onClick={() => handleRestrictUser(item.id, item.senderName)}
                            className="p-1.5 rounded-[10px] border border-border-primary text-text-secondary hover:text-accent-rose hover:bg-accent-rose-light transition-colors cursor-pointer"
                            title="Suspend/Restrict user"
                          >
                            <ShieldOff size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Submitted Articles */}
      {activeTab === 'articles' && (
        <div className="bg-surface-main border border-border-primary rounded-2xl overflow-hidden shadow-xs">
          {pendingArticles.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-12 h-12 bg-accent-teal-light rounded-full flex items-center justify-center text-accent-teal mx-auto mb-4 border border-accent-teal/10 animate-pulse-soft">
                <FileText size={20} />
              </div>
              <h4 className="font-extrabold text-text-primary text-base mb-1">All clear</h4>
              <p className="text-text-secondary text-xs">No pending user articles need therapist verification.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-sec text-text-secondary font-bold border-b border-border-primary uppercase tracking-wider">
                    <th className="px-6 py-4">Title & Author</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Summary</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary/40">
                  {pendingArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-surface-sec/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-text-primary text-sm block leading-tight">{article.title}</span>
                        <span className="text-[10px] text-text-muted mt-1 block font-semibold">
                          By {article.authorName} &bull; {article.readTime}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-brand-light text-brand-primary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[10px] border border-brand-primary/10">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-secondary max-w-xs truncate leading-normal">
                        {article.summary}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setPreviewArticle(article)}
                            className="h-8 px-3 bg-surface-main hover:bg-surface-sec border border-border-primary text-text-primary text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => handleApproveArticle(article.id)}
                            className="h-8 px-3 bg-brand-primary hover:bg-brand-hover text-white text-[10px] font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectArticle(article.id)}
                            className="h-8 px-3 bg-accent-rose-light hover:bg-[#F2DFE0] border border-accent-rose/15 text-accent-rose text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Room Requests */}
      {activeTab === 'rooms' && (
        <div className="bg-surface-main border border-border-primary rounded-2xl overflow-hidden shadow-xs">
          {pendingRooms.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-12 h-12 bg-accent-teal-light rounded-full flex items-center justify-center text-accent-teal mx-auto mb-4 border border-accent-teal/10">
                <MessageSquare size={20} />
              </div>
              <h4 className="font-extrabold text-text-primary text-base mb-1">No requests</h4>
              <p className="text-text-secondary text-xs">No pending community room requests need review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-sec text-text-secondary font-bold border-b border-border-primary uppercase tracking-wider">
                    <th className="px-6 py-4">Room Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary/40">
                  {pendingRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-surface-sec/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-text-primary text-sm block leading-tight">{room.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-brand-light text-brand-primary text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[10px] border border-brand-primary/10 inline-block">
                          {room.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-secondary max-w-sm leading-normal">
                        {room.description}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApproveRoom(room.id)}
                            className="h-8 px-3 bg-brand-primary hover:bg-brand-hover text-white text-[10px] font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                          >
                            Approve & Open
                          </button>
                          <button
                            onClick={() => handleRejectRoom(room.id)}
                            className="h-8 px-3 bg-accent-rose-light hover:bg-[#F2DFE0] border border-accent-rose/15 text-accent-rose text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Submitted Article preview modal */}
      <Modal isOpen={previewArticle !== null} onClose={() => setPreviewArticle(null)} title={previewArticle?.title || ''}>
        {previewArticle && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center space-x-3 mb-2 text-xs">
              <span className="bg-brand-light text-brand-primary font-bold px-2 py-0.5 rounded-[10px] border border-brand-primary/10">
                {previewArticle.category}
              </span>
              <span className="text-text-secondary font-semibold">
                By {previewArticle.authorName} &bull; {previewArticle.readTime}
              </span>
            </div>
            
            <div className="prose prose-slate max-w-none text-text-secondary text-xs leading-relaxed whitespace-pre-line border-t border-border-primary pt-4 font-normal">
              {previewArticle.content}
            </div>

            <div className="mt-8 pt-4 border-t border-border-primary flex justify-end space-x-2">
              <button
                onClick={() => {
                  handleApproveArticle(previewArticle.id);
                  setPreviewArticle(null);
                }}
                className="h-10 px-5 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-[10px] text-xs transition-colors cursor-pointer"
              >
                Approve & Publish
              </button>
              <button
                onClick={() => setPreviewArticle(null)}
                className="h-10 px-5 bg-surface-sec hover:bg-border-primary text-text-primary font-bold rounded-[10px] text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};
