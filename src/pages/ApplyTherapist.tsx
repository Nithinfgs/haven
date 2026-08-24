import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMockDatabase } from '../mockData';
import type { Therapist } from '../types';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ArrowLeft, Send, FileText, User, Briefcase, Clock, FileCheck } from 'lucide-react';

export const ApplyTherapist: React.FC = () => {
  const navigate = useNavigate();
  const db = getMockDatabase();

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '32',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200',
    email: '',
    phone: '',
    credentials: 'Licensed Clinical Psychologist (PhD / PsyD)',
    licenseNumber: '',
    yearsExperience: '5-10 years',
    specialties: 'Adolescent Anxiety, Academic Burnout, Stress Relief, Self-Esteem',
    languages: 'English, Hindi, Tamil',
    introduction: '',
    fullBio: '',
    workingDays: 'Monday, Wednesday, Friday',
    workingHours: 'Morning (10:00 AM - 1:00 PM), Afternoon (2:00 PM - 5:00 PM)',
    schedule: '10:00 AM, 11:30 AM, 2:00 PM, 3:30 PM, 5:00 PM',
    // Contract & Terms
    agreedVoluntary: false,
    agreedConfidentiality: false,
    agreedReporting: false,
    digitalSignature: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.licenseNumber.trim() || !formData.digitalSignature.trim()) {
      alert('Please complete all required fields and type your legal digital signature.');
      return;
    }
    if (!formData.agreedVoluntary || !formData.agreedConfidentiality || !formData.agreedReporting) {
      alert('Please check and accept all legal agreements and provider contract terms.');
      return;
    }

    const newApplicant: Therapist = {
      id: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: formData.name,
      credentials: formData.credentials,
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200',
      introduction: formData.introduction || `Licensed practitioner specializing in adolescent mental health and emotional well-being.`,
      fullBio: formData.fullBio || formData.introduction,
      specialties: formData.specialties.split(',').map((s) => s.trim()).filter(Boolean),
      languages: formData.languages.split(',').map((l) => l.trim()).filter(Boolean),
      availableToday: false,
      online: false,
      status: 'pending_approval',
      schedule: formData.schedule.split(',').map((s) => s.trim()).filter(Boolean),
      licenseNumber: formData.licenseNumber,
      email: formData.email,
      appliedAt: 'Just now',
      whyConnect: `Age: ${formData.age} • Gender: ${formData.gender} • Hours: ${formData.workingHours} • Contract Signed: ${formData.digitalSignature}`
    };

    const currentTherapists = db.getTherapists();
    db.setTherapists([...currentTherapists, newApplicant]);

    // Log activity
    const logs = db.getActivityLogs();
    const newLog = {
      id: `act_${Date.now()}`,
      type: 'availability' as const,
      description: `New therapist contract submitted: ${formData.name} (${formData.credentials}) — Signed by: ${formData.digitalSignature}`,
      timestamp: 'Just now',
    };
    db.setActivityLogs([newLog, ...logs]);

    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Navigation link */}
      <div className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Login</span>
        </Link>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-main border border-border-primary rounded-3xl p-8 md:p-10 text-center space-y-6 shadow-xs"
        >
          <div className="w-16 h-16 rounded-full bg-accent-teal-light text-accent-teal flex items-center justify-center mx-auto border border-accent-teal-light">
            <CheckCircle2 size={34} />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-text-primary tracking-tight">Provider Application & Contract Submitted</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Thank you, **{formData.name}**. Your clinical qualifications, working hours, and digitally signed provider contract have been securely recorded.
            </p>
          </div>

          <div className="p-5 bg-surface-sec/60 border border-border-primary rounded-2xl max-w-lg mx-auto text-left space-y-2 text-xs text-text-secondary">
            <div className="flex justify-between">
              <span className="font-bold text-text-primary">License Number:</span>
              <span className="font-mono text-text-primary font-bold">{formData.licenseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-text-primary">Contract Digital Signature:</span>
              <span className="font-serif italic font-bold text-brand-primary">{formData.digitalSignature}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-text-primary">Status:</span>
              <span className="px-2 py-0.5 rounded-md bg-accent-amber/15 text-accent-amber font-bold text-[10px]">
                Pending Administrative & Clinical Verification
              </span>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Return to Login
            </button>
            <button
              onClick={() => navigate('/admin/therapists')}
              className="px-6 py-2.5 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              View in Admin Dashboard
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="bg-surface-main border border-border-primary rounded-3xl p-6 md:p-10 shadow-xs space-y-8">
          
          {/* Header Banner */}
          <div className="space-y-3 border-b border-border-primary pb-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-brand-light text-brand-primary text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck size={13} />
              <span>Official Provider Network Application & Contract</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
              Therapist Onboarding & Legal Contract Sign-Up
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
              Haven partners with credentialed mental health professionals to deliver confidential, compassionate telehealth and guidance to adolescents. Please submit your identity details, clinical resume, working hours, and sign the provider agreement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* SECTION 1: IDENTITY & PERSONAL DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-primary pb-2">
                <User size={15} className="text-brand-primary" />
                <span>1. Personal & Identity Details</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Full Legal Name & Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Maya Patel, PsyD"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Age *</label>
                  <input
                    type="number"
                    required
                    min={21}
                    max={99}
                    placeholder="35"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Gender Identity *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Official Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="maya.patel@havenmind.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Direct Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: QUALIFICATIONS & FULL CLINICAL RESUME */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-primary pb-2">
                <Briefcase size={15} className="text-brand-primary" />
                <span>2. Qualifications, State License & Full Resume</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Professional Degree / Credentials *</label>
                  <select
                    value={formData.credentials}
                    onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="Licensed Clinical Psychologist (PhD / PsyD)">Licensed Clinical Psychologist (PhD / PsyD)</option>
                    <option value="Licensed Clinical Social Worker (LCSW)">Licensed Clinical Social Worker (LCSW)</option>
                    <option value="Licensed Marriage & Family Therapist (LMFT)">Licensed Marriage & Family Therapist (LMFT)</option>
                    <option value="Licensed Professional Counselor (LPC / LPCC)">Licensed Professional Counselor (LPC / LPCC)</option>
                    <option value="Certified Adolescent Mental Health Specialist">Certified Adolescent Mental Health Specialist</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">State / Region License Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PSY-CA-892104"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Years of Clinical Experience *</label>
                  <select
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Languages Spoken fluently</label>
                  <input
                    type="text"
                    placeholder="English, Tamil, Hindi, Telugu, Urdu, Kannada"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Primary Areas of Experience & Specialties</label>
                  <input
                    type="text"
                    placeholder="Anxiety, Stress, School Pressure, Perfectionism, Trauma"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">Short Introduction (Shown on Directory)</label>
                <textarea
                  rows={2}
                  placeholder="A friendly, accessible overview of how you help young people navigate stress and emotional hurdles..."
                  value={formData.introduction}
                  onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">Full Resume, Experience & Clinical Modalities (CBT, DBT, Somatic)</label>
                <textarea
                  rows={4}
                  placeholder="Detail your clinical training, hospital or private practice experience, school counseling background, and therapeutic modalities..."
                  value={formData.fullBio}
                  onChange={(e) => setFormData({ ...formData, fullBio: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* SECTION 3: WORKING HOURS & APPOINTMENT SLOTS */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-primary pb-2">
                <Clock size={15} className="text-brand-primary" />
                <span>3. Working Hours & Available Session Slots</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Available Working Days</label>
                  <input
                    type="text"
                    placeholder="e.g. Monday, Wednesday, Friday"
                    value={formData.workingDays}
                    onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary block">Daily Time Slots (Comma-separated for Calendar)</label>
                  <input
                    type="text"
                    placeholder="10:00 AM, 11:30 AM, 2:00 PM, 3:30 PM, 5:00 PM"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-surface-sec border border-border-primary text-text-primary focus:outline-none focus:border-brand-primary font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: LEGAL CONTRACT & VOLUNTARY PROVIDER AGREEMENT */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-primary pb-2">
                <FileCheck size={15} className="text-brand-primary" />
                <span>4. Legal Terms, Voluntary Contract & Digital Signature</span>
              </div>

              <div className="p-5 bg-brand-light/30 border border-brand-primary/20 rounded-2xl space-y-3 text-xs text-text-secondary">
                <h4 className="font-bold text-text-primary text-sm flex items-center space-x-1.5">
                  <FileText size={15} className="text-brand-primary" />
                  <span>Haven Clinical Provider Contract & Ethical Standards</span>
                </h4>
                <p className="text-[11.5px] leading-relaxed">
                  By joining the Haven Provider Network, you acknowledge that participation is voluntary and governed by state telehealth regulations and ethical guidelines for adolescent counseling. All consultations are conduct-monitored, confidential, and held via encrypted Google Meet telehealth rooms.
                </p>
                <div className="space-y-2 pt-2 border-t border-border-primary/40">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreedVoluntary}
                      onChange={(e) => setFormData({ ...formData, agreedVoluntary: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-border-primary text-brand-primary focus:ring-brand-primary cursor-pointer shrink-0"
                    />
                    <span className="text-[11px] font-semibold text-text-primary select-none">
                      I understand and agree that this provider engagement is voluntary, governed by Haven's terms and my professional licensing body standards.
                    </span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreedConfidentiality}
                      onChange={(e) => setFormData({ ...formData, agreedConfidentiality: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-border-primary text-brand-primary focus:ring-brand-primary cursor-pointer shrink-0"
                    />
                    <span className="text-[11px] font-semibold text-text-primary select-none">
                      I agree to uphold strict adolescent confidentiality, HIPAA/telehealth compliance, and zero unconsented data sharing.
                    </span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreedReporting}
                      onChange={(e) => setFormData({ ...formData, agreedReporting: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-border-primary text-brand-primary focus:ring-brand-primary cursor-pointer shrink-0"
                    />
                    <span className="text-[11px] font-semibold text-text-primary select-none">
                      I understand my obligations as a mandated reporter in cases of acute self-harm or imminent danger to minors.
                    </span>
                  </label>
                </div>
              </div>

              {/* Digital Signature Box */}
              <div className="space-y-1.5 p-4 bg-surface-sec border border-border-primary rounded-2xl">
                <label className="text-xs font-bold text-text-primary block">
                  Digital Contract Signature (Type Full Legal Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Maya Ananya Patel"
                  value={formData.digitalSignature}
                  onChange={(e) => setFormData({ ...formData, digitalSignature: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-surface-main border border-border-primary text-brand-primary font-serif font-bold focus:outline-none focus:border-brand-primary"
                />
                <span className="text-[10px] text-text-muted block">
                  Typing your legal name constitutes an electronic signature with the same legal effect as a handwritten signature.
                </span>
              </div>
            </div>

            {/* Submission Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border-primary">
              <Link
                to="/login"
                className="px-5 py-2.5 bg-surface-sec hover:bg-surface-main text-text-secondary border border-border-primary rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-8 py-3 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
              >
                <Send size={14} />
                <span>Submit Signed Application to Admin</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
