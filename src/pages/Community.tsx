import React, { useState, useEffect } from 'react';
import { CommunityCard } from '../components/CommunityCard';
import { getMockDatabase } from '../mockData';
import type { Room } from '../types';
import { motion } from 'framer-motion';
import { EmptyState } from '../components/EmptyState';
import { Search, MessageSquare, Plus, CheckCircle2, ArrowRight, ShieldAlert, Lock, UserPlus, Users, Zap, Compass } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useNavigate } from 'react-router-dom';

export const Community: React.FC = () => {
  const db = getMockDatabase();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'school' | 'stress' | 'friendships' | 'family' | 'general' | 'other'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Unified FAB Action Menu and Forms states
  const [composerOpen, setComposerOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<'menu' | 'request_public' | 'create_private' | 'private_created_success' | 'join_private'>('menu');

  // Input states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'school' | 'stress' | 'friendships' | 'family' | 'general' | 'other'>('stress');
  const [formDescription, setFormDescription] = useState('');
  
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Success references
  const [createdInviteCode, setCreatedInviteCode] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState('');
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

  useEffect(() => {
    setRooms(db.getRooms());
  }, []);

  const loadRooms = () => {
    setRooms(db.getRooms());
  };

  // 1. Submit Request for Public Community
  const handleRequestPublicRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim()) {
      alert('Please fill out the Room Name and Description.');
      return;
    }

    const newRoom: Room = {
      id: `room_${Date.now()}`,
      name: formName.trim(),
      description: formDescription.trim(),
      category: formCategory,
      activeMembers: 0,
      talkingNow: 0,
      moderatorName: 'System Assigned',
      moderatorAvailable: false,
      status: 'pending'
    };

    const currentRooms = db.getRooms();
    db.setRooms([...currentRooms, newRoom]);
    loadRooms();

    // Reset fields
    setFormName('');
    setFormDescription('');
    setComposerOpen(false);

    // Toast Alert
    setShowSubmitSuccess(true);
    setTimeout(() => setShowSubmitSuccess(false), 5000);
  };

  // 2. Create Instant Private Friends Room
  const handleCreatePrivateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim()) {
      alert('Please fill out the Room Name and Description.');
      return;
    }

    // Generate random 4-letter alphanumeric suffix code
    const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const inviteCode = `HAVEN-${randCode}`;
    const newRoomId = `private_${Date.now()}`;

    const newRoom: Room = {
      id: newRoomId,
      name: formName.trim(),
      description: formDescription.trim(),
      category: 'other',
      activeMembers: 1,
      talkingNow: 0,
      moderatorName: 'Self-Moderated',
      moderatorAvailable: false,
      status: 'Active',
      isPrivate: true,
      inviteCode
    };

    // Save Room
    const currentRooms = db.getRooms();
    db.setRooms([...currentRooms, newRoom]);
    loadRooms();

    // Automatically join creator into the private room
    const userProfile = db.getUserProfile();
    if (!userProfile.joinedRooms.includes(newRoomId)) {
      const updatedProfile = {
        ...userProfile,
        joinedRooms: [...userProfile.joinedRooms, newRoomId]
      };
      db.setUserProfile(updatedProfile);
    }

    setCreatedInviteCode(inviteCode);
    setCreatedRoomId(newRoomId);
    
    // Clear inputs and advance modal stage
    setFormName('');
    setFormDescription('');
    setActiveAction('private_created_success');
  };

  // 3. Join Room with invite code
  const handleJoinPrivateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inviteCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setInviteError('Please enter a valid invite code.');
      return;
    }

    const currentRooms = db.getRooms();
    const matchedRoom = currentRooms.find(
      (r) => r.isPrivate === true && r.inviteCode === cleanCode
    );

    if (!matchedRoom) {
      setInviteError('We couldn\'t find a room with that invite code. Please check and try again.');
      return;
    }

    // Add room to user profile's joined rooms if not already there
    const userProfile = db.getUserProfile();
    let updatedProfile = { ...userProfile };
    if (!userProfile.joinedRooms.includes(matchedRoom.id)) {
      updatedProfile = {
        ...userProfile,
        joinedRooms: [...userProfile.joinedRooms, matchedRoom.id]
      };
      db.setUserProfile(updatedProfile);
    }

    // Increment room active member count
    const updatedRooms = currentRooms.map((r) => {
      if (r.id === matchedRoom.id) {
        return { ...r, activeMembers: r.activeMembers + 1 };
      }
      return r;
    });
    db.setRooms(updatedRooms);

    // Reset code inputs, close modals, navigate to room chat
    setInviteCodeInput('');
    setInviteError(null);
    setComposerOpen(false);
    navigate(`/chat/${matchedRoom.id}`);
  };

  const [viewType, setViewType] = useState<'all' | 'intent' | 'circle'>('all');

  const filters: { value: typeof activeFilter; label: string }[] = [
    { value: 'all', label: 'All Spaces' },
    { value: 'stress', label: 'Stress & Overwhelm' },
    { value: 'school', label: 'School & Studies' },
    { value: 'friendships', label: 'Loneliness & Social' },
    { value: 'family', label: 'Family Life' },
    { value: 'general', label: 'Venting & Grounding' },
    { value: 'other', label: 'Other' },
  ];

  const filteredRooms = rooms.filter((room) => {
    // Only display rooms in directory that are NOT private and are marked Active
    const matchesPublish = room.status === 'Active' && !room.isPrivate;
    const matchesView = viewType === 'all' || room.spaceType === viewType || (viewType === 'intent' && room.category === 'intent') || (viewType === 'circle' && room.category === 'circle');
    const matchesFilter = activeFilter === 'all' || room.category === activeFilter;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPublish && matchesView && matchesFilter && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="max-w-6xl mx-auto px-6 py-12 md:py-16"
    >
      {/* Success notification banner */}
      {showSubmitSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-accent-teal-light border border-accent-teal/15 text-accent-teal text-xs flex items-center space-x-3 shadow-xs max-w-xl mx-auto">
          <CheckCircle2 size={18} className="shrink-0 text-accent-teal" />
          <div>
            <span className="font-extrabold block mb-0.5">Room request submitted</span>
            <p className="font-semibold opacity-95">Our therapist moderators will review your community request. Once approved, the chat room will open for peer discussion.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-primary bg-brand-light px-3 py-1 rounded-full inline-block mb-3">
          Genuine Support Community
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight mb-3">
          Intentional spaces for real feelings
        </h2>
        <p className="text-text-secondary text-xs leading-relaxed">
          Not a generic social media feed. Choose an "In the Moment" space for what you're experiencing now, or join a Moderated Growth Circle for guided habits.
        </p>

        {/* Community Conduct & Zero-Tolerance Warning */}
        <div className="mt-4 p-3.5 bg-accent-rose-light/40 border border-accent-rose/25 rounded-2xl text-left flex items-start space-x-3 text-xs shadow-2xs">
          <ShieldAlert size={18} className="text-accent-rose shrink-0 mt-0.5" />
          <div className="text-text-secondary leading-snug">
            <span className="font-extrabold text-accent-rose block mb-0.5">
              Zero-Tolerance Policy for Common Chatrooms
            </span>
            <p className="text-[11px]">
              Offensive slurs, explicit language, harassment, or insulting behavior will result in <strong>immediate account suspension or permanent banning</strong>. Common chatrooms are safe peer spaces. <em>(Confidential expression in private therapist sessions is supported clinically, but public spaces must remain respectful.)</em>
            </p>
          </div>
        </div>

        {/* Space Category Tabs Toggle */}
        <div className="flex items-center justify-center bg-surface-sec border border-border-primary rounded-[12px] p-1 w-fit mx-auto mt-6 gap-1">
          <button
            onClick={() => setViewType('all')}
            className={`px-4 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
              viewType === 'all'
                ? 'bg-surface-main shadow-xs text-text-primary border border-border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All Spaces ({rooms.filter(r => !r.isPrivate && r.status === 'Active').length})
          </button>
          <button
            onClick={() => setViewType('intent')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
              viewType === 'intent'
                ? 'bg-surface-main shadow-xs text-brand-primary border border-border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Zap size={13} />
            <span>In the Moment Spaces</span>
          </button>
          <button
            onClick={() => setViewType('circle')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
              viewType === 'circle'
                ? 'bg-surface-main shadow-xs text-accent-teal border border-border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Compass size={13} />
            <span>Moderated Circles</span>
          </button>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border-primary">
        {/* Filter buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none shrink-0">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                activeFilter === f.value
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-surface-main border border-border-primary text-text-secondary hover:bg-surface-sec hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search discussion rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-main border border-border-primary pl-9 pr-4 py-2 rounded-[10px] text-xs text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
      </div>

      {/* Room Grid */}
      {filteredRooms.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={32} className="text-text-muted" />}
          title="No rooms found"
          description="Try clearing your search query or choosing another filter category."
          actionText="Clear filters"
          onAction={() => {
            setActiveFilter('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <CommunityCard key={room.id} room={room} />
          ))}
        </div>
      )}

      {/* Floating Action FAB Button */}
      <button
        onClick={() => {
          setActiveAction('menu');
          setComposerOpen(true);
        }}
        className="fixed bottom-8 right-8 z-40 bg-brand-primary hover:bg-brand-hover text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center cursor-pointer group hover:scale-105 active:scale-95 border border-brand-primary/20"
        title="Add or join room"
      >
        <Plus size={20} className="stroke-[2.5px]" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-200 ease-out text-xs font-bold whitespace-nowrap">
          Add or Join Room
        </span>
      </button>

      {/* Combined Action Modal */}
      <Modal 
        isOpen={composerOpen} 
        onClose={() => {
          setComposerOpen(false);
          setInviteError(null);
          setInviteCodeInput('');
        }} 
        title={
          activeAction === 'menu' ? 'Add or Join a Community Space' : 
          activeAction === 'request_public' ? 'Request New Public Room' :
          activeAction === 'create_private' ? 'Create Private Friends Room' :
          activeAction === 'private_created_success' ? 'Private Room Ready!' :
          'Join Private Room'
        }
      >
        {/* Menu View */}
        {activeAction === 'menu' && (
          <div className="space-y-4 max-w-xl mx-auto py-2">
            <p className="text-[10px] text-text-secondary font-semibold text-center mb-4">
              Select how you would like to connect in a peer discussion space.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Option 1: Request Public */}
              <button
                onClick={() => setActiveAction('request_public')}
                className="flex flex-col items-center justify-between text-center p-5 rounded-2xl border border-border-primary bg-surface-main hover:bg-surface-sec hover:border-brand-primary/30 transition-all cursor-pointer h-40"
              >
                <div className="w-10 h-10 rounded-full bg-brand-light border border-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-text-primary text-xs mb-1">Suggest Public Room</h4>
                  <p className="text-[9px] text-text-secondary leading-snug">Suggested room for anyone to join. Verified by therapists.</p>
                </div>
              </button>

              {/* Option 2: Create Private */}
              <button
                onClick={() => setActiveAction('create_private')}
                className="flex flex-col items-center justify-between text-center p-5 rounded-2xl border border-border-primary bg-surface-main hover:bg-surface-sec hover:border-brand-primary/30 transition-all cursor-pointer h-40"
              >
                <div className="w-10 h-10 rounded-full bg-accent-teal-light border border-accent-teal/10 flex items-center justify-center text-accent-teal">
                  <Lock size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-text-primary text-xs mb-1">Create Private Room</h4>
                  <p className="text-[9px] text-text-secondary leading-snug">Invite-only room for friends. Immediate setup, not public.</p>
                </div>
              </button>

              {/* Option 3: Join Private */}
              <button
                onClick={() => setActiveAction('join_private')}
                className="flex flex-col items-center justify-between text-center p-5 rounded-2xl border border-border-primary bg-surface-main hover:bg-surface-sec hover:border-brand-primary/30 transition-all cursor-pointer h-40"
              >
                <div className="w-10 h-10 rounded-full bg-accent-amber-light border border-accent-amber/10 flex items-center justify-center text-accent-amber">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-text-primary text-xs mb-1">Join with Code</h4>
                  <p className="text-[9px] text-text-secondary leading-snug">Enter a private invite code to access your friends' space.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Action 1: Suggest Public Room */}
        {activeAction === 'request_public' && (
          <form onSubmit={handleRequestPublicRoom} className="space-y-4 max-w-2xl mx-auto">
            <p className="text-[10px] text-text-secondary font-semibold">
              Suggest a new public peer conversation space. Our therapist team reviews requests to assign trained moderators.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Room Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grief Support or Art & Music Therapy"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-surface-sec border border-border-primary text-text-primary px-3 py-2.5 rounded-[10px] text-xs font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-surface-sec border border-border-primary text-text-primary px-3 py-2.5 rounded-[10px] text-xs font-bold focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  <option value="stress">Stress & Anxiety</option>
                  <option value="school">School & Pressure</option>
                  <option value="friendships">Friendships</option>
                  <option value="family">Family Life</option>
                  <option value="general">General Venting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Room Description</label>
              <textarea
                placeholder="What topics should peers talk about in this room? Be as specific as possible..."
                rows={4}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full bg-surface-sec border border-border-primary text-text-primary px-3 py-2.5 rounded-[10px] text-xs font-semibold focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveAction('menu')}
                className="h-10 px-4 bg-surface-main hover:bg-surface-sec text-text-primary border border-border-primary text-xs font-bold rounded-[10px] cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="h-10 px-6 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
              >
                <span>Submit Public Request</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* Action 2: Create Private Room */}
        {activeAction === 'create_private' && (
          <form onSubmit={handleCreatePrivateRoom} className="space-y-4 max-w-2xl mx-auto">
            <p className="text-[10px] text-text-secondary font-semibold">
              Create an instant chat room for you and your friends. It is not listed in the public directory and can only be joined via invite code.
            </p>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Room Name</label>
              <input
                type="text"
                placeholder="e.g. Sam's Study Circle"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-surface-sec border border-border-primary text-text-primary px-3 py-2.5 rounded-[10px] text-xs font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Room Description</label>
              <textarea
                placeholder="Describe what this room is for..."
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full bg-surface-sec border border-border-primary text-text-primary px-3 py-2.5 rounded-[10px] text-xs font-semibold focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveAction('menu')}
                className="h-10 px-4 bg-surface-main hover:bg-surface-sec text-text-primary border border-border-primary text-xs font-bold rounded-[10px] cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="h-10 px-6 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
              >
                <span>Generate Invite Code</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* Action 2b: Private Room Creation Success Display */}
        {activeAction === 'private_created_success' && (
          <div className="text-center py-4 space-y-5 max-w-md mx-auto">
            <div className="w-12 h-12 bg-accent-teal-light text-accent-teal rounded-full flex items-center justify-center mx-auto border border-accent-teal/10">
              <CheckCircle2 size={24} />
            </div>

            <div className="space-y-1.5">
              <h4 className="font-extrabold text-text-primary text-base">Your Private Room is Ready!</h4>
              <p className="text-[10px] text-text-secondary font-semibold leading-relaxed">
                We have generated a secure invite code. Copy and share it with friends to invite them to this room.
              </p>
            </div>

            <div className="p-4 bg-surface-sec/60 border border-border-primary rounded-2xl select-all">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Invite Code</span>
              <span className="text-2xl font-black text-brand-primary tracking-wider font-mono">{createdInviteCode}</span>
            </div>

            <button
              onClick={() => {
                setComposerOpen(false);
                navigate(`/chat/${createdRoomId}`);
              }}
              className="w-full h-11 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] shadow-xs cursor-pointer inline-flex items-center justify-center space-x-2"
            >
              <span>Enter Chat Room</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Action 3: Join Private Room with Code */}
        {activeAction === 'join_private' && (
          <form onSubmit={handleJoinPrivateRoom} className="space-y-4 max-w-md mx-auto py-2">
            <p className="text-[10px] text-text-secondary font-semibold">
              Enter the invite code shared by your friends to join their private conversation room.
            </p>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Invite Code</label>
              <input
                type="text"
                placeholder="e.g. HAVEN-X8A2"
                value={inviteCodeInput}
                onChange={(e) => {
                  setInviteCodeInput(e.target.value);
                  setInviteError(null);
                }}
                className="w-full bg-surface-sec border border-border-primary text-text-primary px-3 py-2.5 rounded-[10px] text-xs font-bold text-center tracking-wider font-mono focus:outline-none focus:border-brand-primary uppercase"
              />
              {inviteError && (
                <span className="text-[9.5px] font-bold text-accent-rose flex items-center space-x-1 mt-1">
                  <ShieldAlert size={12} className="shrink-0" />
                  <span>{inviteError}</span>
                </span>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveAction('menu');
                  setInviteError(null);
                  setInviteCodeInput('');
                }}
                className="h-10 px-4 bg-surface-main hover:bg-surface-sec text-text-primary border border-border-primary text-xs font-bold rounded-[10px] cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="h-10 px-6 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
              >
                <span>Join Room</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}
      </Modal>
    </motion.div>
  );
};
