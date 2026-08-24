import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Brain, 
  HeartPulse, 
  Volume2, 
  MessageSquareHeart, 
  UsersRound, 
  Calendar, 
  CheckSquare, 
  ShieldCheck, 
  Download, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { getMockDatabase } from '../mockData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Tools' | 'Spaces' | 'Practitioners' | 'Resources' | 'Actions';
  title: string;
  description: string;
  icon: any;
  action: () => void;
  keywords?: string[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const db = getMockDatabase();

  const therapists = db.getTherapists();
  const rooms = db.getRooms();

  const baseCommands: CommandItem[] = [
    // Tools
    {
      id: 'tool_untangle',
      category: 'Tools',
      title: 'Untangle My Mind (CBT)',
      description: 'Spot thinking traps and reframe anxious thoughts.',
      icon: Brain,
      action: () => { navigate('/untangle'); onClose(); },
      keywords: ['cbt', 'cognitive', 'distortion', 'thoughts', 'reframing', 'anxiety']
    },
    {
      id: 'tool_grounding',
      category: 'Tools',
      title: 'Panic SOS & Somatic Grounding',
      description: '5-4-3-2-1 sensory anchor and 4-4-4-4 Box Breathing.',
      icon: HeartPulse,
      action: () => { navigate('/grounding'); onClose(); },
      keywords: ['panic', 'breathing', 'grounding', '54321', 'box breathing', 'sos', 'calm']
    },
    {
      id: 'tool_soundscape',
      category: 'Tools',
      title: 'Sound Sanctuary',
      description: 'Ambient rain, 432Hz focus frequencies & ocean waves.',
      icon: Volume2,
      action: () => { navigate('/soundscape'); onClose(); },
      keywords: ['audio', 'sound', 'music', 'rain', 'binaural', '432hz', 'sleep', 'noise']
    },
    {
      id: 'tool_hope',
      category: 'Tools',
      title: 'Leaves of Hope Board',
      description: 'Anonymous peer encouragement and supportive messages.',
      icon: MessageSquareHeart,
      action: () => { navigate('/hope-board'); onClose(); },
      keywords: ['hope', 'notes', 'encouragement', 'anonymous', 'kindness']
    },
    // Core Actions
    {
      id: 'act_checkin',
      category: 'Actions',
      title: 'Record Daily Check-In',
      description: 'Log your current stress, energy, and physical state.',
      icon: CheckSquare,
      action: () => { navigate('/'); onClose(); },
      keywords: ['checkin', 'mood', 'stress', 'energy', 'log', 'today']
    },
    {
      id: 'act_habits',
      category: 'Actions',
      title: 'Wellbeing Routines & Habits',
      description: 'Track sleep, water, mindful pauses, and daily streaks.',
      icon: Sparkles,
      action: () => { navigate('/habits'); onClose(); },
      keywords: ['habits', 'routine', 'streaks', 'sleep', 'water']
    },
    {
      id: 'act_export',
      category: 'Actions',
      title: 'Export On-Device Health Record',
      description: 'Download your full confidential data as a JSON file.',
      icon: Download,
      action: () => { navigate('/profile'); onClose(); },
      keywords: ['export', 'data', 'privacy', 'download', 'backup', 'json']
    },
    {
      id: 'act_privacy',
      category: 'Actions',
      title: 'Privacy & Local-Only Mode',
      description: 'Review data sovereignty settings and cloud sync.',
      icon: ShieldCheck,
      action: () => { navigate('/profile'); onClose(); },
      keywords: ['privacy', 'local', 'offline', 'security', 'settings']
    }
  ];

  // Dynamic items from database
  const therapistCommands: CommandItem[] = therapists.slice(0, 4).map(t => ({
    id: `therapist_${t.id}`,
    category: 'Practitioners',
    title: `${t.name} (${t.credentials})`,
    description: `Specialties: ${t.specialties.join(', ')} • Languages: ${t.languages.join(', ')}`,
    icon: Calendar,
    action: () => { navigate(`/therapist/${t.id}`); onClose(); },
    keywords: [t.name.toLowerCase(), ...t.specialties.map(s => s.toLowerCase()), ...t.languages.map(l => l.toLowerCase()), 'therapist', 'counselor']
  }));

  const roomCommands: CommandItem[] = rooms.slice(0, 4).map(r => ({
    id: `room_${r.id}`,
    category: 'Spaces',
    title: r.name,
    description: r.description,
    icon: UsersRound,
    action: () => { navigate(`/chat/${r.id}`); onClose(); },
    keywords: [r.name.toLowerCase(), r.category, 'circle', 'peer', 'chat']
  }));

  const allCommands = [...baseCommands, ...therapistCommands, ...roomCommands];

  const filteredCommands = query.trim() === ''
    ? allCommands.slice(0, 8)
    : allCommands.filter(c => {
        const q = query.toLowerCase();
        const inTitle = c.title.toLowerCase().includes(q);
        const inDesc = c.description.toLowerCase().includes(q);
        const inCat = c.category.toLowerCase().includes(q);
        const inKeywords = c.keywords?.some(k => k.includes(q));
        return inTitle || inDesc || inCat || inKeywords;
      });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-xl bg-surface-main border border-border-primary rounded-3xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
        >
          {/* Search Input */}
          <div className="flex items-center px-5 py-4 border-b border-border-primary/70">
            <Search size={16} className="text-text-muted shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              placeholder="Search tools, practitioners, circles, or type an action..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-xs md:text-sm font-semibold text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <div className="flex items-center space-x-1.5 shrink-0 pl-2">
              <kbd className="px-2 py-1 text-[9.5px] font-mono font-bold text-text-muted bg-surface-sec border border-border-primary rounded-md">
                ESC
              </kbd>
            </div>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto p-2 divide-y divide-border-primary/40 scrollbar-none flex-1">
            {filteredCommands.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-xs font-bold text-text-secondary">No results found for "{query}"</p>
                <p className="text-[11px] text-text-muted">Try searching for 'grounding', 'cbt', 'sleep', or 'Tamil'.</p>
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-light/60 text-brand-primary'
                        : 'hover:bg-surface-sec/50 text-text-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-brand-primary text-white shadow-2xs' : 'bg-surface-sec text-text-muted'
                      }`}>
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold truncate leading-tight">
                            {cmd.title}
                          </h4>
                          <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-surface-sec text-text-muted">
                            {cmd.category}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-text-secondary truncate mt-0.5 font-medium">
                          {cmd.description}
                        </p>
                      </div>
                    </div>

                    <ArrowRight size={13} className={`shrink-0 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-5 py-2.5 bg-surface-sec/50 border-t border-border-primary/60 flex items-center justify-between text-[10px] text-text-muted font-medium">
            <div className="flex items-center space-x-3">
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
              <span>ESC Dismiss</span>
            </div>
            <span className="font-mono">Haven Command Center</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
