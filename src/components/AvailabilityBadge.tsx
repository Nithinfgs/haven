import React from 'react';
import type { Therapist } from '../types';

interface AvailabilityBadgeProps {
  status: Therapist['status'];
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ status }) => {
  const configs = {
    Available: {
      bg: 'bg-accent-teal-light text-accent-teal-hover border-accent-teal-light',
      text: 'Available today',
      dotColor: 'bg-accent-teal'
    },
    'In session': {
      bg: 'bg-accent-amber-light text-[#A86E1F] border-accent-amber-light',
      text: 'In session',
      dotColor: 'bg-accent-amber'
    },
    Offline: {
      bg: 'bg-surface-sec text-text-secondary border-surface-sec',
      text: 'Offline',
      dotColor: 'bg-text-muted'
    },
    pending_approval: {
      bg: 'bg-accent-amber/15 text-accent-amber border-accent-amber/20',
      text: 'Pending Review',
      dotColor: 'bg-accent-amber'
    },
    rejected: {
      bg: 'bg-accent-rose-light text-accent-rose border-accent-rose-light',
      text: 'Application Rejected',
      dotColor: 'bg-accent-rose'
    }
  };

  const current = configs[status] || configs.Offline;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${current.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor}`}></span>
      <span>{current.text}</span>
    </span>
  );
};
