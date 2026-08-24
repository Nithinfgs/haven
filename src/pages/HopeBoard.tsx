import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Send, Flame, ShieldCheck, Plus, MessageSquareHeart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HopeNote {
  id: string;
  content: string;
  author: string;
  tag: string;
  timestamp: string;
  reactions: {
    hearYou: number;
    strength: number;
    gotThis: number;
  };
  userReactions: { [key: string]: boolean };
}

const INITIAL_NOTES: HopeNote[] = [
  {
    id: 'note_1',
    content: 'To whoever is studying late tonight: your effort is real, but your worth is not defined by a letter grade. Don\'t forget to drink some water.',
    author: 'Fellow High Schooler',
    tag: 'Academic Stress',
    timestamp: '2 hours ago',
    reactions: { hearYou: 24, strength: 38, gotThis: 19 },
    userReactions: {},
  },
  {
    id: 'note_2',
    content: 'It’s completely okay if all you did today was breathe and keep going. That is already enough.',
    author: 'Anonymous Student',
    tag: 'Gentle Reminder',
    timestamp: '4 hours ago',
    reactions: { hearYou: 42, strength: 56, gotThis: 31 },
    userReactions: {},
  },
  {
    id: 'note_3',
    content: 'Social anxiety made me feel invisible for months. Finding this quiet circle made me realize I’m not the only one fighting silent battles. Sending love to everyone here.',
    author: 'Quiet Soul',
    tag: 'Social Anxiety',
    timestamp: 'Yesterday',
    reactions: { hearYou: 67, strength: 49, gotThis: 28 },
    userReactions: {},
  },
  {
    id: 'note_4',
    content: 'You don\'t have to figure out the next 10 years today. Just focus on taking the next gentle step.',
    author: 'Oak Creek Senior',
    tag: 'Future Worry',
    timestamp: '2 days ago',
    reactions: { hearYou: 35, strength: 41, gotThis: 22 },
    userReactions: {},
  },
];

export const HopeBoard: React.FC = () => {
  const [notes, setNotes] = useState<HopeNote[]>(() => {
    try {
      const stored = localStorage.getItem('haven_hope_notes');
      return stored ? JSON.parse(stored) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Encouragement');
  const [authorAlias, setAuthorAlias] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    localStorage.setItem('haven_hope_notes', JSON.stringify(notes));
  }, [notes]);

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newNote: HopeNote = {
      id: `note_${Date.now()}`,
      content: newNoteContent.trim(),
      author: authorAlias.trim() || 'Anonymous Friend',
      tag: selectedTag,
      timestamp: 'Just now',
      reactions: { hearYou: 1, strength: 1, gotThis: 0 },
      userReactions: {},
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setAuthorAlias('');
    setIsComposing(false);
  };

  const handleReact = (noteId: string, type: 'hearYou' | 'strength' | 'gotThis') => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id !== noteId) return note;
        const alreadyReacted = note.userReactions?.[type];
        return {
          ...note,
          reactions: {
            ...note.reactions,
            [type]: alreadyReacted ? note.reactions[type] - 1 : note.reactions[type] + 1,
          },
          userReactions: {
            ...note.userReactions,
            [type]: !alreadyReacted,
          },
        };
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Sanctuary</span>
        </Link>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-light text-brand-primary border border-brand-primary/20 text-[10.5px] font-extrabold uppercase tracking-wider">
          <MessageSquareHeart size={13} />
          <span>Anonymous Hope Board</span>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-surface-main border border-border-primary rounded-3xl p-6 md:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
            Leaves of Hope & Encouragement
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            A safe, anonymous wall of kindness left by students for students. No comments or judgment—only supportive presence and strength.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsComposing(!isComposing)}
          className="px-5 py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Leave an Anonymous Note</span>
        </button>
      </div>

      {/* Composing Modal / Slide-down */}
      <AnimatePresence>
        {isComposing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handlePostNote} className="bg-surface-main border border-brand-primary/40 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border-primary pb-3">
                <span className="text-xs font-black text-text-primary">Plant a Seed of Hope</span>
                <span className="text-[10.5px] text-text-muted flex items-center space-x-1">
                  <ShieldCheck size={13} className="text-accent-teal" />
                  <span>100% Anonymous & Kind-Only</span>
                </span>
              </div>

              <div className="space-y-1">
                <textarea
                  rows={3}
                  required
                  placeholder="Write an encouraging reminder, a piece of comfort, or something you wish someone told you today..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-surface-sec border border-border-primary text-text-primary text-xs font-medium focus:outline-none focus:border-brand-primary leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Tag / Category</label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-sec border border-border-primary text-xs font-bold text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="Encouragement">Encouragement</option>
                    <option value="Academic Stress">Academic Stress</option>
                    <option value="Gentle Reminder">Gentle Reminder</option>
                    <option value="Social Anxiety">Social Anxiety</option>
                    <option value="Late Night Thoughts">Late Night Thoughts</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Anonymous Alias (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Fellow Night Owl, Friendly Stranger"
                    value={authorAlias}
                    onChange={(e) => setAuthorAlias(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-sec border border-border-primary text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newNoteContent.trim()}
                  className="px-6 py-2.5 bg-brand-primary hover:bg-brand-hover disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Send size={13} />
                  <span>Pin to Hope Board</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Notes Masonry / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-6 rounded-3xl bg-surface-main border border-border-primary shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-primary font-bold">
                  {note.tag}
                </span>
                <span className="text-text-muted font-medium">{note.timestamp}</span>
              </div>

              <p className="text-xs text-text-primary font-medium leading-relaxed">
                "{note.content}"
              </p>

              <span className="text-[11px] text-text-secondary font-bold block pt-1">
                — {note.author}
              </span>
            </div>

            {/* Reactions Bar */}
            <div className="pt-3 border-t border-border-primary/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleReact(note.id, 'hearYou')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  note.userReactions?.hearYou
                    ? 'bg-accent-rose-light text-accent-rose border border-accent-rose/30 shadow-2xs'
                    : 'bg-surface-sec hover:bg-surface-main text-text-secondary border border-border-primary'
                }`}
                title="I hear you"
              >
                <Heart size={13} className={note.userReactions?.hearYou ? 'fill-current' : ''} />
                <span>{note.reactions.hearYou}</span>
              </button>

              <button
                type="button"
                onClick={() => handleReact(note.id, 'strength')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  note.userReactions?.strength
                    ? 'bg-brand-light text-brand-primary border border-brand-primary/30 shadow-2xs'
                    : 'bg-surface-sec hover:bg-surface-main text-text-secondary border border-border-primary'
                }`}
                title="Sending strength"
              >
                <Sparkles size={13} />
                <span>{note.reactions.strength}</span>
              </button>

              <button
                type="button"
                onClick={() => handleReact(note.id, 'gotThis')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  note.userReactions?.gotThis
                    ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30 shadow-2xs'
                    : 'bg-surface-sec hover:bg-surface-main text-text-secondary border border-border-primary'
                }`}
                title="You've got this"
              >
                <Flame size={13} className={note.userReactions?.gotThis ? 'fill-current' : ''} />
                <span>{note.reactions.gotThis}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
