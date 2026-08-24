import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartHandshake, MessageSquare, UsersRound, AlertTriangle } from 'lucide-react';

interface MobileNavigationProps {
  userAvatar?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ userAvatar = 'S' }) => {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  const links = [
    { to: '/', label: 'Home', icon: HeartHandshake },
    { to: '/talk-now', label: 'Talk', icon: MessageSquare },
    { to: '/community', label: 'Community', icon: UsersRound },
    { to: '/urgent-support', label: 'Support', icon: AlertTriangle },
    { to: '/profile', label: 'Profile', icon: () => <span className="w-5 h-5 rounded-full bg-brand-light text-brand-primary flex items-center justify-center text-[10px] font-bold leading-none">{userAvatar}</span> },
  ];

  return (
    <nav className="bg-surface-main border-t border-border-primary fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to || (link.to !== '/' && link.to !== '/profile' && link.to !== '/urgent-support' && location.pathname.startsWith(link.to));
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors ${
                isActive ? 'text-brand-primary' : 'text-text-secondary'
              }`}
            >
              {typeof Icon === 'function' ? (
                <Icon />
              ) : (
                // @ts-ignore
                <Icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
              )}
              <span className="text-[10px] font-semibold mt-1 tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
