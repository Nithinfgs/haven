import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface SupportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  to: string;
  badge?: string;
  variant?: 'indigo' | 'neutral' | 'teal';
}

export const SupportCard: React.FC<SupportCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  to,
  badge,
  variant = 'indigo',
}) => {
  const themes = {
    indigo: {
      borderHover: 'hover:border-brand-primary',
      iconBg: 'bg-brand-light text-brand-primary',
      button: 'bg-brand-primary hover:bg-brand-hover text-white active:bg-brand-pressed',
    },
    neutral: {
      borderHover: 'hover:border-border-strong',
      iconBg: 'bg-surface-sec text-text-secondary',
      button: 'bg-text-primary hover:bg-black text-white',
    },
    teal: {
      borderHover: 'hover:border-accent-teal',
      iconBg: 'bg-accent-teal-light text-accent-teal',
      button: 'bg-accent-teal hover:bg-accent-teal-hover text-white',
    },
  };

  const currentTheme = themes[variant];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`relative flex flex-col justify-between p-8 rounded-2xl border border-border-primary bg-white ${currentTheme.borderHover} hover:shadow-md transition-all duration-200`}
    >
      {badge && (
        <span className="absolute top-4 right-4 bg-accent-amber-light text-accent-amber text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-accent-amber/10">
          {badge}
        </span>
      )}
      
      <div>
        <div className={`inline-flex items-center justify-center p-3 rounded-[10px] mb-6 ${currentTheme.iconBg}`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary text-xs leading-relaxed mb-6">{description}</p>
      </div>

      <Link
        to={to}
        className={`inline-flex items-center justify-center space-x-2 w-full h-11 px-5 rounded-[10px] text-xs font-semibold tracking-wide transition-all duration-150 ${currentTheme.button}`}
      >
        <span>{buttonText}</span>
        <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
};
