import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCheck, 
  Moon, 
  Sparkles, 
  MessageSquareHeart, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onItemClick: (item: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onItemClick,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'personal' | 'community' | 'appointment' | 'system'>('all');

  if (!isOpen) return null;

  const filtered = activeCategory === 'all'
    ? notifications
    : notifications.filter(n => n.category === activeCategory);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal': return Sparkles;
      case 'community': return MessageSquareHeart;
      case 'appointment': return Calendar;
      default: return ShieldCheck;
    }
  };

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
          className="relative w-full max-w-lg bg-surface-main border border-border-primary rounded-3xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary/70">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-widest text-text-primary">
                Notifications & Memory
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-primary text-[10px] font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] font-bold text-text-secondary hover:text-brand-primary cursor-pointer inline-flex items-center space-x-1"
                >
                  <CheckCheck size={13} />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quiet Hours Banner */}
          <div className="px-6 py-2.5 bg-surface-sec/60 border-b border-border-primary/40 flex items-center justify-between text-[10.5px] text-text-secondary">
            <div className="flex items-center space-x-2">
              <Moon size={12} className="text-brand-primary" />
              <span>Quiet hours enabled (9:00 PM – 8:00 AM)</span>
            </div>
            <Link to="/profile" onClick={onClose} className="font-bold text-brand-primary hover:underline">
              Settings
            </Link>
          </div>

          {/* Category Tabs */}
          <div className="flex px-6 pt-3 pb-1 gap-1 text-[10.5px] font-bold overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'personal', label: 'Personal' },
              { id: 'community', label: 'Community' },
              { id: 'appointment', label: 'Appointments' },
              { id: 'system', label: 'System' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-brand-primary text-white shadow-2xs'
                    : 'text-text-secondary hover:bg-surface-sec'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto p-4 space-y-2.5 divide-y divide-border-primary/30 scrollbar-none flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-xs font-bold text-text-secondary">No notifications in this category</p>
                <p className="text-[11px] text-text-muted">Your sanctuary is quiet and up to date.</p>
              </div>
            ) : (
              filtered.map((item) => {
                const Icon = getCategoryIcon(item.category);
                return (
                  <div
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className={`pt-3 first:pt-0 p-3 rounded-2xl transition-all cursor-pointer flex items-start justify-between space-x-3 ${
                      !item.read ? 'bg-brand-light/30 border border-brand-primary/15' : 'hover:bg-surface-sec/40'
                    }`}
                  >
                    <div className="flex items-start space-x-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        !item.read ? 'bg-brand-primary text-white' : 'bg-surface-sec text-text-muted'
                      }`}>
                        <Icon size={14} />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-text-primary truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-mono text-text-muted">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary font-medium leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    {item.actionLink && (
                      <ArrowRight size={13} className="text-text-muted shrink-0 mt-1" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-surface-sec/40 border-t border-border-primary/60 text-[10px] text-text-muted text-center font-medium">
            Notifications are delivered with low stimulation and zero audio alarms.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
