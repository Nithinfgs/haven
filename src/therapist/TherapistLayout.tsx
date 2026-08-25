import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Clock, 
  UserCheck, 
  Menu, 
  X, 
  ArrowLeft, 
  LogOut 
} from 'lucide-react';
import { HavenLogo } from '../components/HavenLogo';

export const TherapistLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [practitionerStatus, setPractitionerStatus] = useState<'online' | 'in_session' | 'offline'>('online');

  const menuItems = [
    { to: '/therapist-portal', label: 'Clinical Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/therapist-portal/sessions', label: 'Telehealth Sessions', icon: Calendar },
    { to: '/therapist-portal/notes', label: 'Client SOAP Notes', icon: FileText },
    { to: '/therapist-portal/availability', label: 'Availability & Slots', icon: Clock },
    { to: '/therapist-portal/profile', label: 'Credentials & Profile', icon: UserCheck },
  ];

  const handleToggle = () => setCollapsed(!collapsed);
  const handleMobileToggle = () => setMobileOpen(!mobileOpen);

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname === to || (to !== '/therapist-portal' && location.pathname.startsWith(to));
  };

  return (
    <div className="flex h-screen bg-bg-app text-text-primary selection:bg-accent-teal/20">
      
      {/* Mobile Top Header */}
      <header className="bg-surface-main border-b border-border-primary flex items-center justify-between px-4 py-3 md:hidden fixed top-0 left-0 right-0 z-30 shadow-xs">
        <div className="flex items-center space-x-2">
          <button onClick={handleMobileToggle} className="text-text-secondary hover:text-text-primary p-1.5 rounded-xl">
            <Menu size={20} />
          </button>
          <span className="font-bold text-text-primary text-xs flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-lg bg-accent-teal flex items-center justify-center text-white text-[10px] font-black">T</span>
            <span>Haven Clinical Portal</span>
          </span>
        </div>
        <Link to="/" className="text-text-secondary hover:text-text-primary p-1">
          <ArrowLeft size={18} />
        </Link>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-surface-main border-r border-border-primary flex flex-col justify-between z-40 transition-all duration-200 md:relative md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div>
          {/* Header */}
          <div className="h-16 border-b border-border-primary flex items-center justify-between px-6 shrink-0">
            <Link to="/therapist-portal" className="flex items-center space-x-2 overflow-hidden hover:opacity-90">
              <HavenLogo size={24} showText={!collapsed} />
            </Link>
            <button
              onClick={handleToggle}
              className="text-text-secondary hover:text-text-primary hidden md:block cursor-pointer"
            >
              <Menu size={16} />
            </button>
            <button
              onClick={handleMobileToggle}
              className="text-text-secondary hover:text-text-primary block md:hidden cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Practitioner Profile Badge */}
          {!collapsed && (
            <div className="p-4 bg-accent-teal-light/20 border-b border-border-primary/60 hidden md:block space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-accent-teal text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  MP
                </div>
                <div className="min-w-0">
                  <h5 className="font-extrabold text-text-primary text-xs truncate">Dr. Maya Patel</h5>
                  <p className="text-[10px] text-accent-teal font-mono font-bold truncate">
                    Licensed Clinical Psychologist
                  </p>
                </div>
              </div>

              {/* Status Switcher */}
              <div className="flex bg-surface-main border border-border-primary rounded-xl p-0.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setPractitionerStatus('online')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    practitionerStatus === 'online' ? 'bg-accent-teal text-white' : 'text-text-secondary'
                  }`}
                >
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => setPractitionerStatus('in_session')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    practitionerStatus === 'in_session' ? 'bg-accent-amber text-white' : 'text-text-secondary'
                  }`}
                >
                  In Session
                </button>
                <button
                  type="button"
                  onClick={() => setPractitionerStatus('offline')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    practitionerStatus === 'offline' ? 'bg-surface-sec text-text-muted' : 'text-text-secondary'
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.to, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-accent-teal text-white shadow-2xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-sec'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border-primary space-y-1">
          <Link
            to="/"
            className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-sec transition-colors"
          >
            <ArrowLeft size={16} className="shrink-0" />
            {!collapsed && <span>Return to Sanctuary</span>}
          </Link>

          <button
            onClick={() => {
              sessionStorage.removeItem('haven_session_auth');
              localStorage.removeItem('haven_auth');
              localStorage.removeItem('haven_role');
              window.location.hash = '#/login';
              window.location.reload();
            }}
            className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-accent-rose hover:bg-accent-rose-light/20 transition-colors cursor-pointer text-left"
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Clinical Body */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <Outlet />
      </main>

    </div>
  );
};
