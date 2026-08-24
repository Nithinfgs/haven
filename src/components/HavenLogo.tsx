import React from 'react';

interface HavenLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export const HavenLogo: React.FC<HavenLogoProps> = ({
  size = 28,
  className = '',
  showText = false,
  textColor = 'text-text-primary',
}) => {
  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* Concept 2: The H-Embrace Hands Geometric Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-2xs"
      >
        {/* Soft Rounded Background Tile */}
        <rect width="100" height="100" rx="26" fill="currentColor" className="text-brand-primary" />

        {/* Left Column of 'H' */}
        <rect x="20" y="22" width="15" height="56" rx="7.5" fill="#FFFFFF" />

        {/* Right Column of 'H' */}
        <rect x="65" y="22" width="15" height="56" rx="7.5" fill="#FFFFFF" />

        {/* Upper Cradling Hand / Curve */}
        <path
          d="M32 44C42 38 58 38 68 44C60 48 50 49 32 44Z"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />

        {/* Lower Supportive Hand / Embracing Curve */}
        <path
          d="M68 56C58 62 42 62 32 56C40 52 50 51 68 56Z"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />

        {/* Gentle Core Light Center */}
        <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" fillOpacity="0.9" />
      </svg>

      {showText && (
        <span className={`font-black text-base tracking-tight ${textColor}`}>
          Haven
        </span>
      )}
    </div>
  );
};
