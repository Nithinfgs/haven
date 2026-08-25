import React, { useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';

export const AvailabilitySettings: React.FC = () => {
  const [instantChat, setInstantChat] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const [weeklySlots, setWeeklySlots] = useState([
    { day: 'Monday', times: ['2:00 PM', '4:30 PM'] },
    { day: 'Wednesday', times: ['10:00 AM', '3:00 PM', '5:00 PM'] },
    { day: 'Friday', times: ['1:00 PM', '3:30 PM'] },
    { day: 'Saturday', times: ['11:00 AM', '2:00 PM'] },
  ]);

  const [newTime, setNewTime] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime.trim()) return;

    setWeeklySlots(weeklySlots.map(slot => {
      if (slot.day === selectedDay && !slot.times.includes(newTime.trim())) {
        return { ...slot, times: [...slot.times, newTime.trim()] };
      }
      return slot;
    }));

    setNewTime('');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleRemoveSlot = (day: string, timeToRemove: string) => {
    setWeeklySlots(weeklySlots.map(slot => {
      if (slot.day === day) {
        return { ...slot, times: slot.times.filter(t => t !== timeToRemove) };
      }
      return slot;
    }));
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 selection:bg-accent-teal/20">
      
      {/* Toast */}
      {savedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-main border border-accent-teal text-text-primary px-4 py-2.5 rounded-2xl shadow-lg flex items-center space-x-2 text-xs font-bold">
          <CheckCircle2 size={15} className="text-accent-teal" />
          <span>Consultation schedule updated successfully</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border-primary/70 pb-6 space-y-1">
        <span className="text-[10.5px] font-black uppercase tracking-widest text-accent-teal">
          Schedule & Practice Hours
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
          Availability & Telehealth Slots
        </h1>
        <p className="text-xs text-text-secondary font-medium">
          Control when students can book Google Meet sessions and instant chat consultations with you.
        </p>
      </div>

      {/* Instant Availability Toggle Card */}
      <div className="p-6 bg-surface-main border border-border-primary rounded-3xl shadow-2xs flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-text-primary">Instant Chat / Drop-in Availability</h3>
          <p className="text-xs text-text-secondary font-medium max-w-lg leading-relaxed">
            When enabled, your badge appears as "Available Today" in the public directory and students can request drop-in text chats.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setInstantChat(!instantChat)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            instantChat 
              ? 'bg-accent-teal-light text-accent-teal border border-accent-teal/30'
              : 'bg-surface-sec text-text-muted border border-border-primary'
          }`}
        >
          {instantChat ? '● Active (Accepting)' : 'Paused'}
        </button>
      </div>

      {/* Add Slot Form */}
      <div className="p-6 bg-surface-main border border-border-primary rounded-3xl shadow-2xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-secondary">
          Add Telehealth Consultation Slot
        </h3>
        
        <form onSubmit={handleAddSlot} className="flex flex-col sm:flex-row items-end gap-3 text-xs">
          <div className="w-full sm:w-48 space-y-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase">Day of Week</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl font-bold text-text-primary"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:flex-1 space-y-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase">Time Slot (e.g. 2:00 PM)</label>
            <input
              type="text"
              required
              placeholder="e.g. 2:00 PM, 4:30 PM, 6:00 PM"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full p-2.5 bg-surface-sec border border-border-primary rounded-xl font-bold text-text-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-accent-teal hover:bg-accent-teal/90 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer inline-flex items-center justify-center space-x-1.5 shrink-0"
          >
            <Plus size={14} />
            <span>Add Slot</span>
          </button>
        </form>
      </div>

      {/* Current Weekly Schedule */}
      <div className="p-6 bg-surface-main border border-border-primary rounded-3xl shadow-2xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-secondary">
          Configured Weekly Schedule
        </h3>

        <div className="divide-y divide-border-primary/60">
          {weeklySlots.map((slot) => (
            <div key={slot.day} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-bold text-xs text-text-primary w-28 shrink-0">{slot.day}</span>
              
              <div className="flex flex-wrap gap-1.5 flex-1">
                {slot.times.length === 0 ? (
                  <span className="text-[11px] text-text-muted italic">No slots scheduled</span>
                ) : (
                  slot.times.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-surface-sec border border-border-primary rounded-lg text-xs font-mono font-semibold text-text-primary inline-flex items-center space-x-1.5"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(slot.day, t)}
                        className="text-text-muted hover:text-accent-rose cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
