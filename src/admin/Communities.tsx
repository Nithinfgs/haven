import React, { useState, useEffect } from 'react';
import { getMockDatabase } from '../mockData';
import type { Room } from '../types';
import { Modal } from '../components/Modal';
import { motion } from 'framer-motion';
import { Plus, Check, Shield, Power } from 'lucide-react';

export const Communities: React.FC = () => {
  const db = getMockDatabase();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'stress' | 'school' | 'friendships' | 'family' | 'general'>('general');
  const [moderatorName, setModeratorName] = useState('Sarah Jenkins');

  useEffect(() => {
    setRooms(db.getRooms());
  }, []);

  const handleToggleRoomStatus = (roomId: string) => {
    const list = db.getRooms();
    const updated = list.map((r) => {
      if (r.id === roomId) {
        return {
          ...r,
          status: r.status === 'Active' ? 'Archived' as const : 'Active' as const,
        };
      }
      return r;
    });

    db.setRooms(updated);
    setRooms(updated);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const newRoom: Room = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description,
      category,
      activeMembers: 1,
      talkingNow: 0,
      moderatorName,
      moderatorAvailable: true,
      status: 'Active',
    };

    const currentRooms = db.getRooms();
    const updatedRooms = [...currentRooms, newRoom];
    db.setRooms(updatedRooms);
    setRooms(updatedRooms);

    // Update log
    const logs = db.getActivityLogs();
    const newLog = {
      id: `act_${Date.now()}`,
      type: 'join' as const,
      description: `New discussion room "${name}" created and assigned to ${moderatorName}`,
      timestamp: 'Just now',
    };
    db.setActivityLogs([newLog, ...logs]);

    // Update stats
    const stats = db.getStats();
    db.setStats({
      ...stats,
      communityRoomsActive: stats.communityRoomsActive + 1
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setCreateModalOpen(false);
      setSaveSuccess(false);
      setName('');
      setDescription('');
      setCategory('general');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Discussion Rooms</h2>
          <p className="text-text-secondary text-xs mt-0.5">Configure public categories, moderator assignments, and live rooms.</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center space-x-1.5 h-10 px-4 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] active:bg-brand-pressed transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} />
          <span>Create room</span>
        </button>
      </div>

      {/* Grid of rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-extrabold text-text-primary text-sm leading-snug">{room.name}</h4>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    room.status === 'Active'
                      ? 'bg-accent-teal-light text-accent-teal border-accent-teal-light'
                      : 'bg-surface-sec text-text-secondary border-border-primary'
                  }`}
                >
                  {room.status}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-normal mb-6">{room.description}</p>
            </div>

            <div className="pt-4 border-t border-border-primary/50 space-y-4">
              {/* Info stats */}
              <div className="flex items-center justify-between text-[11px] text-text-secondary font-semibold">
                <span>Active count: {room.activeMembers}</span>
                <span className="flex items-center space-x-1.5 text-text-muted">
                  <Shield size={12} className="text-text-muted" />
                  <span>Mod: {room.moderatorName.split(' ')[0]}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleRoomStatus(room.id)}
                  className={`flex-1 inline-flex items-center justify-center space-x-1.5 h-9 text-xs font-bold border transition-colors rounded-[10px] cursor-pointer ${
                    room.status === 'Active'
                      ? 'bg-accent-rose-light text-accent-rose border-accent-rose/10 hover:bg-accent-rose-light'
                      : 'bg-accent-teal-light text-accent-teal border-accent-teal/10 hover:bg-accent-teal-light'
                  }`}
                >
                  <Power size={12} />
                  <span>{room.status === 'Active' ? 'Archive Room' : 'Activate Room'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Discussion Channel">
        {saveSuccess ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-accent-teal-light border border-accent-teal-light flex items-center justify-center text-accent-teal mx-auto mb-4">
              <Check size={20} />
            </div>
            <h4 className="font-bold text-text-primary text-base mb-1">Room Created</h4>
            <p className="text-text-secondary text-xs">
              The new room has been listed in the community dashboard directory.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreateRoom} className="space-y-4 text-xs font-semibold text-text-secondary">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Room Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Exam Stress Support"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-sec border border-border-primary py-2.5 px-3 rounded-[10px] focus:outline-none focus:border-brand-primary font-medium text-text-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Topic / Description</label>
              <textarea
                rows={2}
                required
                placeholder="Write a welcoming description of what people discuss in this room..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface-sec border border-border-primary py-2.5 px-3 rounded-[10px] focus:outline-none focus:border-brand-primary font-medium text-text-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-surface-sec border border-border-primary py-2.5 px-3 rounded-[10px] focus:outline-none focus:border-brand-primary font-bold text-text-primary"
                >
                  <option value="general">General</option>
                  <option value="school">School</option>
                  <option value="stress">Stress</option>
                  <option value="friendships">Friendships</option>
                  <option value="family">Family</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Assign Moderator</label>
                <select
                  value={moderatorName}
                  onChange={(e) => setModeratorName(e.target.value)}
                  className="w-full bg-surface-sec border border-border-primary py-2.5 px-3 rounded-[10px] focus:outline-none focus:border-brand-primary font-bold text-text-primary"
                >
                  <option value="Sarah Jenkins">Sarah Jenkins</option>
                  <option value="Dr. Maya Patel">Dr. Maya Patel</option>
                  <option value="Emma Zhao">Emma Zhao</option>
                  <option value="Alex (Volunteer)">Alex (Volunteer)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-brand-primary hover:bg-brand-hover text-white rounded-[10px] text-xs font-bold transition-all shadow-xs shadow-brand-primary/10 cursor-pointer"
            >
              Create Room
            </button>
          </form>
        )}
      </Modal>
    </motion.div>
  );
};
