import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TherapistCard } from '../components/TherapistCard';
import { Modal } from '../components/Modal';
import { getMockDatabase } from '../mockData';
import type { Therapist } from '../types';
import { 
  Check, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Video, 
  RotateCcw
} from 'lucide-react';
import { createGoogleCalendarUrl } from '../utils/calendar';
import { HavenBackend } from '../lib/supabase';

// Survey questions and option → specialty tag mapping
const SURVEY_QUESTIONS = [
  {
    id: 'q1',
    question: "What's been weighing on you most lately?",
    options: [
      { label: 'School stress & academic exams',  tags: ['Stress', 'School pressure', 'Academic load'] },
      { label: 'Friendships & social connections', tags: ['Relationships', 'Loneliness'] },
      { label: 'Family & household dynamics',      tags: ['Family life', 'Relationships'] },
      { label: 'My mood & inner emotional state', tags: ['Mood support', 'Loneliness'] },
    ],
  },
  {
    id: 'q2',
    question: "How would you describe your anxiety level right now?",
    options: [
      { label: 'Pretty calm overall',             tags: [] },
      { label: 'A bit worried sometimes',          tags: ['Anxiety'] },
      { label: 'Anxious most of the time',         tags: ['Anxiety', 'Stress'] },
      { label: 'Overwhelmed and shutting down',    tags: ['Stress', 'Mood support'] },
    ],
  },
  {
    id: 'q3',
    question: "What kind of support sounds most helpful?",
    options: [
      { label: 'Practical coping strategies & tools', tags: ['Stress', 'Habits', 'Academic load'] },
      { label: 'Someone to just listen & validate',   tags: ['Loneliness', 'Mood support'] },
      { label: 'Help navigating identity & growth',   tags: ['Identity', 'Self-esteem'] },
      { label: 'Building confidence & small habits',  tags: ['Self-esteem', 'Habits'] },
    ],
  },
  {
    id: 'q4',
    question: "How do you prefer sessions to feel?",
    options: [
      { label: 'Structured with tools & exercises',  tags: ['Academic load', 'Habits', 'Stress'] },
      { label: 'Open conversation, go at my pace',    tags: ['Mood support', 'Loneliness'] },
      { label: 'Creative & exploratory exploration',  tags: ['Identity', 'Self-esteem'] },
      { label: 'Direct & focused, no fluff',          tags: ['Stress', 'Anxiety'] },
    ],
  },
];

export const TherapistDirectory: React.FC = () => {
  const db = getMockDatabase();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'confirming' | 'confirmed'>('idle');

  // Survey state
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyStep, setSurveyStep] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>([]);
  const [matchedTherapist, setMatchedTherapist] = useState<Therapist | null>(null);

  // Simple filters
  const [availableOnly, setAvailableOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [activeMeetLink, setActiveMeetLink] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setTherapists(db.getTherapists());
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const specialties = ['All', 'Stress', 'Anxiety', 'School pressure', 'Friendships', 'Self-confidence', 'Family conflicts'];
  const languagesList = ['All', 'English', 'Tamil', 'Hindi', 'Urdu', 'Kannada', 'Telugu'];

  const filteredTherapists = therapists.filter((t) => {
    if (t.status === 'pending_approval' || t.status === 'rejected') return false;
    if (availableOnly && !t.availableToday) return false;
    if (onlineOnly && !t.online) return false;
    if (selectedSpecialty !== 'All') {
      const match = t.specialties.some(
        (s) => s.toLowerCase() === selectedSpecialty.toLowerCase()
      );
      if (!match) return false;
    }
    if (selectedLanguage !== 'All') {
      const match = (t.languages || []).some(
        (l) => l.toLowerCase() === selectedLanguage.toLowerCase()
      );
      if (!match) return false;
    }
    return true;
  });

  const handleOpenBooking = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setSelectedTime(null);
    setBookingStatus('idle');
  };

  const handleConfirmBooking = async (time: string) => {
    if (!selectedTherapist) return;
    setSelectedTime(time);
    setBookingStatus('confirming');

    const generatedMeetLink = `https://meet.google.com/hvn-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
    setActiveMeetLink(generatedMeetLink);

    // Save session in mock DB
    const profile = db.getUserProfile();
    const newSession = {
      id: `sess_${Date.now()}`,
      therapistId: selectedTherapist.id,
      therapistName: selectedTherapist.name,
      date: 'Today',
      time,
      meetLink: generatedMeetLink,
      status: 'confirmed' as const,
    };

    const updatedProfile = {
      ...profile,
      upcomingSessions: [...(profile.upcomingSessions || []), newSession],
      timeline: [
        {
          id: `tl_${Date.now()}`,
          date: 'TODAY',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Booked consultation with ${selectedTherapist.name}`,
          description: `Confirmed session at ${time} via Google Meet.`,
          type: 'checkin' as const
        },
        ...(profile.timeline || [])
      ]
    };
    db.setUserProfile(updatedProfile);

    // Supabase background sync
    try {
      await HavenBackend.createAppointment({
        therapist_id: selectedTherapist.id,
        therapist_name: selectedTherapist.name,
        user_name: profile.name || 'Sam',
        date: 'Today',
        time,
        meeting_link: generatedMeetLink
      });
    } catch {}

    setTimeout(() => {
      setBookingStatus('confirmed');
    }, 750);
  };

  const handleSurveyOptionSelect = (optionIndex: number) => {
    const nextAnswers = [...surveyAnswers, optionIndex];
    setSurveyAnswers(nextAnswers);

    if (surveyStep < SURVEY_QUESTIONS.length - 1) {
      setSurveyStep(surveyStep + 1);
    } else {
      // Calculate best therapist match
      const chosenTags: string[] = [];
      nextAnswers.forEach((ansIdx, qIdx) => {
        const q = SURVEY_QUESTIONS[qIdx];
        if (q && q.options[ansIdx]) {
          chosenTags.push(...q.options[ansIdx].tags);
        }
      });

      const approvedTherapists = therapists.filter(
        (t) => t.status !== 'pending_approval' && t.status !== 'rejected'
      );

      let bestScore = -1;
      let bestTherapist = approvedTherapists[0] || null;

      approvedTherapists.forEach((therapist) => {
        let score = 0;
        therapist.specialties.forEach((spec) => {
          if (chosenTags.includes(spec)) score += 2;
        });
        if (therapist.availableToday) score += 1;
        if (therapist.online) score += 1;
        if (score > bestScore) {
          bestScore = score;
          bestTherapist = therapist;
        }
      });

      setMatchedTherapist(bestTherapist);
      setSurveyStep(SURVEY_QUESTIONS.length);
    }
  };

  const resetSurvey = () => {
    setSurveyStep(0);
    setSurveyAnswers([]);
    setMatchedTherapist(null);
  };

  const clearFilters = () => {
    setAvailableOnly(false);
    setOnlineOnly(false);
    setSelectedSpecialty('All');
    setSelectedLanguage('All');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-12 selection:bg-brand-primary/10">
      
      {/* ── 1. QUIET EDITORIAL MASTHEAD ── */}
      <header className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border-primary/60 pb-4 gap-2 text-xs font-semibold text-text-muted tracking-tight">
        <span className="text-[11px] font-black uppercase tracking-widest text-text-secondary">
          LICENSED PRACTITIONERS
        </span>
        <div className="flex items-center space-x-3 font-mono text-[11px]">
          <span>Telehealth Practice Guidelines 2020</span>
          <span>•</span>
          <span className="text-accent-teal font-bold">End-to-End Encrypted</span>
        </div>
      </header>

      {/* ── 2. EDITORIAL HERO & MATCHING TOOL ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
            Confidential 1-on-1 Consultations
          </h1>
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-medium">
            Connect with certified adolescent therapists and listeners. All sessions are 100% confidential and conducted over private Google Meet links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              resetSurvey();
              setSurveyOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-5 py-3 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Match Me With a Therapist</span>
          </button>

          <Link
            to="/apply-therapist"
            className="inline-flex items-center space-x-1.5 px-4 py-3 bg-surface-sec hover:bg-surface-main border border-border-primary text-text-secondary hover:text-text-primary rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <span>Provider Application</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── 3. FILTER TOOLBAR ── */}
      <div className="bg-surface-main border border-border-primary rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center space-x-2 text-xs font-bold text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-4 h-4 rounded text-brand-primary"
            />
            <span>Available Today</span>
          </label>

          <label className="flex items-center space-x-2 text-xs font-bold text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlineOnly}
              onChange={(e) => setOnlineOnly(e.target.checked)}
              className="w-4 h-4 rounded text-brand-primary"
            />
            <span>Online Now</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-text-muted uppercase">Specialty:</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-surface-sec border border-border-primary text-xs font-bold text-text-primary py-1.5 px-3 rounded-xl focus:outline-none focus:border-brand-primary cursor-pointer"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-text-muted uppercase">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-surface-sec border border-border-primary text-xs font-bold text-text-primary py-1.5 px-3 rounded-xl focus:outline-none focus:border-brand-primary cursor-pointer"
            >
              {languagesList.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── 4. DIRECTORY GRID & SKELETON LOADERS ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 bg-surface-main border border-border-primary rounded-3xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-surface-sec rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-surface-sec rounded w-3/4" />
                  <div className="h-2.5 bg-surface-sec rounded w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-surface-sec rounded-xl" />
              <div className="h-8 bg-surface-sec rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredTherapists.length === 0 ? (
        <div className="text-center py-16 px-4 space-y-3 border border-dashed border-border-primary/80 rounded-3xl">
          <h4 className="text-sm font-bold text-text-primary">No practitioners match your current filters</h4>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Try turning off specific filters or selecting another language or specialty area.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2.5 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1.5"
            >
              <RotateCcw size={13} />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapists.map((therapist) => (
            <TherapistCard
              key={therapist.id}
              therapist={therapist}
              onRequestSession={handleOpenBooking}
            />
          ))}
        </div>
      )}

      {/* ── BOOKING MODAL WITH REALISTIC STATE SEQUENCE ── */}
      <Modal
        isOpen={selectedTherapist !== null}
        onClose={() => setSelectedTherapist(null)}
        title="Schedule a consultation"
      >
        {selectedTherapist && (
          <div className="py-2 space-y-4">
            {bookingStatus === 'confirmed' ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-teal-light text-accent-teal flex items-center justify-center mx-auto">
                  <Check size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-text-primary text-base">Session Confirmed</h4>
                  <p className="text-text-secondary text-xs">
                    Your appointment with {selectedTherapist.name} is booked for {selectedTime}.
                  </p>
                </div>

                <div className="p-3.5 bg-surface-sec/60 border border-border-primary rounded-2xl text-xs space-y-1 text-left">
                  <div className="flex items-center space-x-1.5 text-accent-teal font-bold">
                    <Video size={13} />
                    <span>Encrypted Google Meet Room</span>
                  </div>
                  <code className="text-[11px] text-text-primary block break-all">{activeMeetLink}</code>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <a
                    href={createGoogleCalendarUrl(
                      `Haven Therapy Session with ${selectedTherapist.name}`,
                      `Confidential session with ${selectedTherapist.name}. Google Meet link: ${activeMeetLink}`,
                      'Google Meet',
                      selectedTime || '2:00 PM'
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center space-x-1.5"
                  >
                    <Calendar size={13} />
                    <span>Add to Google Calendar</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedTherapist(null)}
                    className="px-4 py-2.5 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary rounded-xl text-xs font-bold transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-surface-sec/50 border border-border-primary rounded-2xl">
                  <span className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold text-xs">
                    {selectedTherapist.avatar}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">{selectedTherapist.name}</h4>
                    <p className="text-[10.5px] text-text-secondary">{selectedTherapist.credentials} • {selectedTherapist.licenseNumber || 'Verified Licensed'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10.5px] font-bold text-text-secondary uppercase tracking-wider block">
                    Available Consultation Slots (50 min)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(selectedTherapist.schedule && selectedTherapist.schedule.length > 0 ? selectedTherapist.schedule : ['2:00 PM', '3:30 PM', '5:00 PM']).map((slot: string) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                          selectedTime === slot
                            ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                            : 'bg-surface-sec border-border-primary text-text-primary hover:bg-surface-main'
                        }`}
                      >
                        <span>{slot}</span>
                        {selectedTime === slot && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border-primary">
                  <button
                    type="button"
                    onClick={() => setSelectedTherapist(null)}
                    className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!selectedTime || bookingStatus === 'confirming'}
                    onClick={() => selectedTime && handleConfirmBooking(selectedTime)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center space-x-2 ${
                      bookingStatus === 'confirming'
                        ? 'bg-surface-sec text-text-muted border border-border-primary cursor-wait'
                        : selectedTime
                        ? 'bg-brand-primary hover:bg-brand-hover text-white cursor-pointer'
                        : 'bg-surface-sec text-text-muted border border-border-primary cursor-not-allowed opacity-50'
                    }`}
                  >
                    {bookingStatus === 'confirming' ? (
                      <>
                        <span className="w-3 h-3 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                        <span>Confirming Meet link...</span>
                      </>
                    ) : (
                      <span>Confirm Appointment</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── THERAPIST MATCHING SURVEY MODAL ── */}
      <Modal
        isOpen={surveyOpen}
        onClose={() => setSurveyOpen(false)}
        title="Find Your Match"
      >
        <div className="space-y-4 py-1">
          {surveyStep < SURVEY_QUESTIONS.length ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10.5px] font-mono text-text-muted">
                <span>Question {surveyStep + 1} of {SURVEY_QUESTIONS.length}</span>
                <span>Confidential</span>
              </div>

              <h4 className="text-sm font-extrabold text-text-primary">
                {SURVEY_QUESTIONS[surveyStep].question}
              </h4>

              <div className="space-y-2">
                {SURVEY_QUESTIONS[surveyStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSurveyOptionSelect(idx)}
                    className="w-full p-3.5 rounded-xl bg-surface-sec hover:bg-brand-light/40 border border-border-primary hover:border-brand-primary/40 text-left text-xs font-bold text-text-primary transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight size={13} className="text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            matchedTherapist && (
              <div className="space-y-4 py-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center mx-auto">
                  <Sparkles size={20} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-brand-primary uppercase">Recommended Match</span>
                  <h4 className="text-base font-extrabold text-text-primary">{matchedTherapist.name}</h4>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto">{matchedTherapist.introduction || matchedTherapist.fullBio}</p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSurveyOpen(false);
                      handleOpenBooking(matchedTherapist);
                    }}
                    className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Schedule Session
                  </button>
                  <button
                    type="button"
                    onClick={() => setSurveyOpen(false)}
                    className="px-4 py-2.5 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Browse All
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </Modal>

    </div>
  );
};
