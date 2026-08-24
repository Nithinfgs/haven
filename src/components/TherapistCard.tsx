import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Therapist } from '../types';
import { AvailabilityBadge } from './AvailabilityBadge';
import { ArrowRight, Calendar } from 'lucide-react';

interface TherapistCardProps {
  therapist: Therapist;
  onRequestSession: (therapist: Therapist) => void;
}

export const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onRequestSession }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-surface-main border border-border-primary rounded-2xl p-6 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Header section */}
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={therapist.avatar}
            alt={therapist.name}
            className="w-14 h-14 rounded-xl object-cover bg-surface-sec border border-border-primary shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="font-extrabold text-text-primary text-base truncate">{therapist.name}</h4>
              <AvailabilityBadge status={therapist.status} />
            </div>
            <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">{therapist.credentials}</p>
          </div>
        </div>

        {/* Introduction */}
        <p className="text-text-secondary text-xs leading-relaxed mb-4 italic">
          "{therapist.introduction}"
        </p>

        {/* Why you might connect discovery indicator */}
        {therapist.whyConnect && (
          <div className="bg-brand-light/35 border border-brand-primary/10 rounded-xl p-3.5 mb-5 text-[10px] leading-relaxed">
            <span className="font-extrabold text-brand-primary block mb-0.5 uppercase tracking-wider text-[9px]">
              Why you might connect
            </span>
            <p className="text-text-secondary leading-normal">
              {therapist.whyConnect}
            </p>
          </div>
        )}

        {/* Spoken Languages */}
        {therapist.languages && therapist.languages.length > 0 && (
          <div className="flex items-center space-x-1.5 text-[10px] text-text-secondary font-semibold mb-3">
            <span className="text-brand-primary font-bold">Languages:</span>
            <span>{therapist.languages.join(' • ')}</span>
          </div>
        )}

        {/* Specialty tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {therapist.specialties.map((spec) => (
            <span
              key={spec}
              className="bg-surface-sec text-text-secondary text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-border-primary/20"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-2 pt-4 border-t border-border-primary">
        <Link
          to={`/therapist/${therapist.id}`}
          className="flex-1 inline-flex items-center justify-center space-x-1.5 h-10 px-4 bg-surface-main border border-border-primary hover:bg-surface-sec text-text-primary text-xs font-bold rounded-[10px] transition-colors"
        >
          <span>Profile</span>
          <ArrowRight size={12} />
        </Link>
        
        {therapist.status !== 'Offline' ? (
          <button
            onClick={() => onRequestSession(therapist)}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 h-10 px-4 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] active:bg-brand-pressed transition-colors shadow-xs cursor-pointer"
          >
            <Calendar size={12} />
            <span>Book</span>
          </button>
        ) : (
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center space-x-1.5 h-10 px-4 bg-surface-sec text-text-muted text-xs font-bold rounded-[10px] cursor-not-allowed"
          >
            <span>Unavailable</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
