import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UsersRound,
  MessageSquare,
  Shield,
  BarChart3,
  Settings,
  Menu,
  X,
  ArrowLeft,
  LogOut,
  BriefcaseBusiness,
  ShieldCheck
} from 'lucide-react';
import { HavenLogo } from '../components/HavenLogo';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { to: '/admin', label: 'Executive Governance (Applications)', icon: ShieldCheck, exact: true },
    { to: '/admin/clinical', label: 'Clinical Therapist Hub', icon: LayoutDashboard },
    { to: '/admin/therapists', label: 'Therapist Directory Roster', icon: BriefcaseBusiness },
    { to: '/admin/users', label: 'Students & Patients', icon: UsersRound },
    { to: '/admin/communities', label: 'Community Rooms', icon: MessageSquare },
    { to: '/admin/moderation', label: 'Safety & Moderation', icon: Shield },
    { to: '/admin/analytics', label: 'Platform Analytics', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleToggle = () => setCollapsed(!collapsed);
  const handleMobileToggle = () => setMobileOpen(!mobileOpen);

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
  };

  return (
    <div className="flex h-screen bg-bg-app text-text-primary">
      {/* Mobile Top Header */}
      <header className="bg-surface-main border-b border-border-primary flex items-center justify-between px-4 py-3 md:hidden fixed top-0 left-0 right-0 z-30 shadow-xs">
        <div className="flex items-center space-x-2">
          <button onClick={handleMobileToggle} className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg">
            <Menu size={20} />
          </button>
          <span className="font-bold text-text-primary text-sm flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded bg-brand-primary flex items-center justify-center text-white text-[10px] font-black">H</span>
            <span>Haven Admin</span>
          </span>
        </div>
        <Link to="/" className="text-text-secondary hover:text-text-primary p-1">
          <ArrowLeft size={18} />
        </Link>
      </header>

      {/* Sidebar - Pure white/neutral background */}
      <aside
        className={`fixed inset-y-0 left-0 bg-surface-main border-r border-border-primary flex flex-col justify-between z-40 transition-all duration-200 md:relative md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div>
          {/* Header */}
          <div className="h-16 border-b border-border-primary flex items-center justify-between px-6 shrink-0">
            <Link to="/" className="flex items-center space-x-2 overflow-hidden hover:opacity-90">
              <HavenLogo size={24} showText={!collapsed} />
            </Link>
            {/* Collapse toggle */}
            <button
              onClick={handleToggle}
              className="text-text-secondary hover:text-text-primary hidden md:block"
            >
              <Menu size={16} />
            </button>
            {/* Close button */}
            <button
              onClick={handleMobileToggle}
              className="text-text-secondary hover:text-text-primary block md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* User profile detail block */}
          {!collapsed && (
            <div className="p-4 bg-surface-sec/40 border-b border-border-primary/60 hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  ADM
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-text-primary text-xs truncate">Clinical Administrator</h5>
                  <p className="text-[9px] text-brand-primary font-bold truncate uppercase tracking-wider">
                    Executive Governance
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-[10px] text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-light text-brand-primary'
                      : 'text-text-secondary hover:bg-surface-sec hover:text-text-primary'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border-primary">
          <Link
            to="/"
            className="flex items-center space-x-3 px-3 py-2.5 text-text-secondary hover:bg-surface-sec hover:text-text-primary rounded-[10px] text-xs font-semibold transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Exit Portal</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={handleMobileToggle}
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-30 md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto pt-16 md:pt-0">
        <div className="p-6 md:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
