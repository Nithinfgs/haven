import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMockDatabase } from '../mockData';
import type { Therapist } from '../types';
import { AvailabilityBadge } from '../components/AvailabilityBadge';
import { Modal } from '../components/Modal';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, ArrowLeft, Check, Globe, Video, Calendar, MessageSquare } from 'lucide-react';
import { createGoogleCalendarUrl } from '../utils/calendar';
import { HavenBackend } from '../lib/supabase';

export const TherapistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const db = getMockDatabase();

  const [therapist, setTherapist] = useState<Therapist | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeMeetLink, setActiveMeetLink] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const found = db.getTherapists().find((t) => t.id === id);
    setTherapist(found);

    if (found) {
      // Check if already in saved list
      const profile = db.getUserProfile();
      setIsSaved(profile.savedTherapists.includes(found.id));
    }
  }, [id]);

  const toggleSave = () => {
    if (!therapist) return;
    const profile = db.getUserProfile();
    let updatedSaved;

    if (isSaved) {
      updatedSaved = profile.savedTherapists.filter((item) => item !== therapist.id);
    } else {
      updatedSaved = [...profile.savedTherapists, therapist.id];
    }

    db.setUserProfile({ ...profile, savedTherapists: updatedSaved });
    setIsSaved(!isSaved);
  };

  const handleBooking = () => {
    if (!therapist || !selectedTime) return;

    const generatedMeet = `https://meet.google.com/hvn-${therapist.id.slice(0, 4)}-${selectedTime.replace(/[^0-9]/g, '').slice(0, 3) || 'room'}`;
    setActiveMeetLink(generatedMeet);

    // Save to user profile
    const profile = db.getUserProfile();
    db.setUserProfile({
      ...profile,
      upcomingSessions: [
        ...profile.upcomingSessions,
        {
          therapistId: therapist.id,
          therapistName: therapist.name,
          date: 'Today',
          time: selectedTime,
          meetingLink: generatedMeet,
        },
      ],
    });

    // Cloud Sync to Supabase
    HavenBackend.createAppointment({
      therapist_id: therapist.id,
      therapist_name: therapist.name,
      user_name: profile.name || 'Sam',
      date: 'Today',
      time: selectedTime,
      meeting_link: generatedMeet,
    });

    // Update therapist slots
    const therapists = db.getTherapists();
    const updatedList = therapists.map((t) => {
      if (t.id === therapist.id) {
        return {
          ...t,
          schedule: t.schedule.filter((x) => x !== selectedTime),
          status: 'In session' as const,
        };
      }
      return t;
    });
    db.setTherapists(updatedList);
    setTherapist(updatedList.find((t) => t.id === therapist.id));

    // Update live admin activity feed
    const logs = db.getActivityLogs();
    const newLog = {
      id: `act_${Date.now()}`,
      type: 'session' as const,
      description: `New session booked with ${therapist.name} for ${selectedTime} (Google Meet)`,
      timestamp: 'Just now',
    };
    db.setActivityLogs([newLog, ...logs]);

    setBookingSuccess(true);
  };

  if (!therapist) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <span className="text-3xl mb-2"></span>
        <h4 className="text-lg font-bold text-text-primary">Profile not found</h4>
        <p className="text-text-secondary text-sm mb-6">This therapist's profile may not be active.</p>
        <Link to="/therapists" className="text-brand-primary font-bold hover:underline">
          Back to directory
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="max-w-4xl mx-auto px-6 py-12 md:py-16"
    >
      {/* Back button */}
      <Link
        to="/therapists"
        className="inline-flex items-center space-x-1.5 text-[10px] font-bold tracking-wider uppercase text-text-secondary hover:text-text-primary mb-8 transition-colors"
      >
        <ArrowLeft size={12} />
        <span>Directory</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Core Info */}
        <div className="lg:col-span-1 text-center lg:text-left">
          <div className="relative inline-block lg:block">
            <img
              src={therapist.avatar}
              alt={therapist.name}
              className="w-32 h-32 lg:w-full lg:h-64 rounded-2xl object-cover border border-border-primary shadow-xs mb-4 mx-auto"
            />
            <button
              onClick={toggleSave}
              className={`absolute top-3 right-3 p-2.5 rounded-[10px] border transition-all ${
                isSaved
                  ? 'bg-accent-rose-light border-accent-rose/10 text-accent-rose'
                  : 'bg-white/80 backdrop-blur-xs border-border-primary text-text-secondary hover:text-accent-rose'
              }`}
              title={isSaved ? 'Saved to Profile' : 'Save Therapist'}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-text-primary leading-tight">{therapist.name}</h3>
              <AvailabilityBadge status={therapist.status} />
            </div>
            <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wider mb-6">
              {therapist.credentials}
            </p>

            {/* Languages */}
            <div className="flex items-center justify-center lg:justify-start space-x-2 text-xs text-text-secondary mb-6 bg-surface-main border border-border-primary p-3.5 rounded-xl">
              <Globe size={15} className="text-text-muted" />
              <span className="font-bold">Speaks:</span>
              <span>{therapist.languages.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Deep description & calendar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Intro Box */}
          <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs">
            <h4 className="font-extrabold text-text-primary text-sm mb-3">About Me</h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-6 italic bg-surface-sec/30 p-4 rounded-xl border border-border-primary/50">
              "{therapist.introduction}"
            </p>
            {therapist.whyConnect && (
              <div className="bg-brand-light/45 border border-brand-primary/10 rounded-xl p-4 mb-6 text-xs">
                <span className="font-extrabold text-brand-primary block mb-1 uppercase tracking-wider text-[10px]">
                  Why you might connect:
                </span>
                <p className="text-text-secondary leading-relaxed">
                  {therapist.whyConnect}
                </p>
              </div>
            )}
            <p className="text-text-secondary text-xs leading-relaxed whitespace-pre-line">
              {therapist.fullBio}
            </p>
          </div>

          {/* Specialties */}
          <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs">
            <h4 className="font-extrabold text-text-primary text-sm mb-3">Areas of Support</h4>
            <div className="flex flex-wrap gap-2">
              {therapist.specialties.map((spec) => (
                <span
                  key={spec}
                  className="bg-brand-light text-brand-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-[10px] border border-brand-primary/10"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Approach Philosophy */}
          <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs">
            <h4 className="font-bold text-text-primary text-sm mb-2 flex items-center space-x-1.5">
              <ShieldCheck size={18} className="text-accent-teal" />
              <span>Philosophy & Approach</span>
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              I believe in client-centered support. By focusing on collaborative strengths and applying standard Cognitive Behavioral methods, we work together to build practical coping tools.
            </p>
          </div>

          {/* Availability / Schedule */}
          {therapist.status !== 'Offline' && (
            <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs">
              <h4 className="font-extrabold text-text-primary text-sm mb-4">Availability Today</h4>
              {therapist.schedule.length === 0 ? (
                <p className="text-xs text-text-secondary italic">No appointments left today.</p>
              ) : (
                <div>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 mb-6">
                    {therapist.schedule.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setBookingOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-[10px] border border-border-primary text-xs font-bold text-text-secondary text-center hover:bg-brand-light hover:text-brand-primary hover:border-brand-primary/30 transition-colors bg-surface-sec/30 cursor-pointer"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-muted">
                    Select a time slot above to schedule a call session.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Embedded Booking Modal */}
      <Modal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} title="Confirm Session">
        <div>
          {bookingSuccess ? (
            <div className="text-center py-5 space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent-teal-light border border-accent-teal-light flex items-center justify-center text-accent-teal mx-auto">
                <Check size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-text-primary text-base">Appointment Confirmed</h4>
                <p className="text-text-secondary text-xs mt-1">
                  Your session with {therapist.name} is set for {selectedTime} today.
                </p>
              </div>

              {/* Action Buttons: Calendar, Message, Meet */}
              <div className="space-y-2 pt-2">
                <a
                  href={createGoogleCalendarUrl(
                    `Haven Therapy Session with ${therapist.name}`,
                    `Confidential virtual consultation with ${therapist.name} (${therapist.credentials}).`,
                    activeMeetLink,
                    selectedTime || '2:00 PM'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                >
                  <Calendar size={14} className="text-brand-primary" />
                  <span>Add to Google Calendar (with Meet Link)</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/chat/therapist-${therapist.id}`}
                    className="h-10 bg-surface-sec hover:bg-brand-light text-text-primary hover:text-brand-primary border border-border-primary rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>Message Therapist</span>
                  </Link>

                  <a
                    href={activeMeetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Video size={13} />
                    <span>Join Google Meet</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                You are requesting a virtual session with **{therapist.name}** today at **{selectedTime}**. 
                Press confirm below to complete booking.
              </p>
              <button
                onClick={handleBooking}
                className="w-full h-11 bg-brand-primary hover:bg-brand-hover text-white rounded-[10px] text-xs font-bold shadow-xs transition-colors"
              >
                Confirm Appointment
              </button>
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};
