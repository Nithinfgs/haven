import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Eye, EyeOff, ArrowRight, Shield, Lock, ShieldCheck, User, ArrowUpRight, KeyRound, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HavenLogo } from '../components/HavenLogo';

interface LoginPageProps {
  onAuthenticated: (role?: 'user' | 'therapist' | 'admin') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthenticated }) => {
  const [tab, setTab] = useState<'student' | 'provider'>('student');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('HAVEN-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDevBypass = (selectedRole: 'user' | 'therapist' | 'admin') => {
    localStorage.setItem('haven_auth', selectedRole);
    localStorage.setItem('haven_role', selectedRole);
    sessionStorage.setItem('haven_session_auth', 'true');
    onAuthenticated(selectedRole);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tab === 'provider') {
      const code = accessCode.trim().toLowerCase();
      const mail = email.trim().toLowerCase();

      // Check if Admin master credentials
      const isAdmin = code.includes('admin') || mail.includes('admin') || password.toLowerCase().includes('admin');
      
      setLoading(true);
      setTimeout(() => {
        if (isAdmin) {
          handleDevBypass('admin');
        } else {
          handleDevBypass('therapist');
        }
        setLoading(false);
      }, 400);
      return;
    }

    // Student Validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (mode === 'signup' && !agreedToTerms) {
      setError('You must agree to the Terms of Service & Medical Disclaimer to create an account.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      handleDevBypass('user');
      setLoading(false);
    }, 400);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      handleDevBypass('user');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mb-3">
            <HavenLogo size={42} showText={true} />
          </div>
          <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
            {tab === 'student'
              ? mode === 'login' ? 'Welcome back' : 'Create your safe space'
              : 'Therapist & Administrator Portal'}
          </h1>
          <p className="text-text-secondary text-xs mt-1 font-semibold">
            {tab === 'student'
              ? 'Access your self-awareness tools, support circles, and counseling.'
              : 'Sign in with your clinical access code or administrative credentials.'}
          </p>
        </div>

        {/* 2 Clean Options: Student vs Provider/Admin */}
        <div className="flex p-1 bg-surface-sec border border-border-primary rounded-2xl mb-4 text-xs font-bold gap-1 shadow-2xs">
          <button
            type="button"
            onClick={() => { setTab('student'); setError(null); }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              tab === 'student'
                ? 'bg-surface-main text-brand-primary shadow-xs border border-border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <User size={14} />
            <span>Student / Member</span>
          </button>

          <button
            type="button"
            onClick={() => { setTab('provider'); setError(null); }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              tab === 'provider'
                ? 'bg-surface-main text-brand-primary shadow-xs border border-border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Therapist & Admin</span>
          </button>
        </div>

        {/* Main Auth Card */}
        <div className="bg-surface-main border border-border-primary rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
          
          {/* Google Sign-in for Students */}
          {tab === 'student' && (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-11 flex items-center justify-center space-x-2.5 border border-border-primary bg-surface-main hover:bg-surface-sec rounded-xl text-xs font-bold text-text-primary transition-all cursor-pointer shadow-2xs"
              >
                <svg width="17" height="17" viewBox="0 0 48 48" className="shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 3.2 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l7 5.4C12.4 13.6 17.7 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.8 6.8-16.9h.4z"/>
                  <path fill="#FBBC05" d="M10.7 28.1A14.6 14.6 0 0 1 9.5 24c0-1.4.2-2.8.6-4.1l-7-5.4A23.9 23.9 0 0 0 .5 24c0 3.8.9 7.4 2.6 10.5l7.6-6.4z"/>
                  <path fill="#34A853" d="M24 47c5.7 0 10.5-1.9 14-5.1l-7.4-5.7c-1.9 1.3-4.4 2.1-7 2.1-6.3 0-11.6-4.2-13.5-9.9l-7.6 6.4C6.9 41.7 14.8 47 24 47z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex-1 h-px bg-border-primary" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">or with email</span>
                <div className="flex-1 h-px bg-border-primary" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            
            {tab === 'provider' ? (
              <>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-text-secondary uppercase tracking-wider block flex items-center justify-between">
                    <span>Security Access Code / Key</span>
                    <span className="text-text-muted font-mono text-[9px]">Admin: ADMIN-2026 • Doc: HAVEN-2026</span>
                  </label>
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary pointer-events-none" />
                    <input
                      type="text"
                      placeholder="HAVEN-2026 or ADMIN-2026"
                      value={accessCode}
                      onChange={e => { setAccessCode(e.target.value); setError(null); }}
                      className="w-full h-10 pl-9 pr-3 bg-surface-sec border border-border-primary rounded-xl text-xs font-mono font-bold text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-text-secondary uppercase tracking-wider block">
                    Account Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type="email"
                      placeholder="provider@havenmind.org or admin@havenmind.org"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(null); }}
                      className="w-full h-10 pl-9 pr-3 bg-surface-sec border border-border-primary rounded-xl text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-text-secondary uppercase tracking-wider block">
                    Student Email
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type="email"
                      placeholder="sam@oakcreek.edu"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(null); }}
                      className="w-full h-10 pl-9 pr-3 bg-surface-sec border border-border-primary rounded-xl text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-text-secondary uppercase tracking-wider block">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(null); }}
                      className="w-full h-10 pl-9 pr-9 bg-surface-sec border border-border-primary rounded-xl text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="flex items-start space-x-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="signupTermsCheck"
                      checked={agreedToTerms}
                      onChange={e => { setAgreedToTerms(e.target.checked); setError(null); }}
                      className="mt-0.5 w-4 h-4 rounded border-border-primary text-brand-primary focus:ring-brand-primary cursor-pointer shrink-0"
                    />
                    <label htmlFor="signupTermsCheck" className="text-[10.5px] text-text-secondary font-semibold leading-relaxed cursor-pointer select-none">
                      I agree to the Terms of Service & Medical Disclaimers.
                    </label>
                  </div>
                )}
              </>
            )}

            {error && (
              <p className="text-[10px] font-bold text-accent-rose leading-tight">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand-primary hover:bg-brand-hover disabled:opacity-60 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs transition-all"
            >
              {loading ? (
                <span>Verifying Access…</span>
              ) : (
                <>
                  <span>
                    {tab === 'provider'
                      ? 'Sign In (Auto-Detects Admin / Therapist)'
                      : mode === 'login'
                      ? 'Sign in as Student'
                      : 'Create Student Account'}
                  </span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Student Toggle Login / Signup */}
          {tab === 'student' && (
            <p className="text-center text-[11px] text-text-secondary font-semibold pt-1">
              {mode === 'login' ? "Don't have a student account?" : 'Already registered?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError(null);
                }}
                className="text-brand-primary font-bold cursor-pointer hover:underline ml-1"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}

          {/* Dev Bypass Section */}
          <div className="pt-2 border-t border-border-primary/60 space-y-2">
            {tab === 'provider' ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDevBypass('admin')}
                  className="py-2.5 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary rounded-xl text-[10.5px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-2xs group"
                >
                  <Shield size={12} className="text-accent-amber group-hover:scale-110 transition-transform" />
                  <span>Dev: Enter Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDevBypass('therapist')}
                  className="py-2.5 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary rounded-xl text-[10.5px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-2xs group"
                >
                  <ShieldCheck size={12} className="text-brand-primary group-hover:scale-110 transition-transform" />
                  <span>Dev: Enter Therapist</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleDevBypass('user')}
                className="w-full py-2 bg-surface-sec hover:bg-surface-main text-text-primary border border-border-primary rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-2xs group"
              >
                <Sparkles size={12} className="text-brand-primary group-hover:scale-110 transition-transform" />
                <span>Dev Bypass: Enter as Student</span>
              </button>
            )}

            {/* Therapist Application Link Callout */}
            {tab === 'provider' && (
              <div className="pt-2 text-center space-y-1.5">
                <p className="text-[11px] text-text-secondary font-medium">
                  New practitioner applying to join Haven?
                </p>
                <Link
                  to="/apply-therapist"
                  className="inline-flex items-center justify-center space-x-1.5 w-full py-2.5 bg-brand-light hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Apply to Join Provider Network & Sign Contract</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
};
