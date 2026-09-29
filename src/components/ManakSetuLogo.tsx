'use client';

import React from 'react';

interface ManakSetuLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function ManakSetuLogo({
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}: ManakSetuLogoProps) {
  const iconSizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconPx = iconSizes[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Precision Institutional Mark: Bridge (Setu) + Standards Seal / Rosette + Verification */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          width={iconPx}
          height={iconPx}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 hover:scale-105"
        >
          {/* Base Shield / Seal outline with soft rounded bevel */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="12"
            fill="#0F766E"
            stroke="#0D625C"
            strokeWidth="1.5"
          />

          {/* Institutional Grid / Radial subtle geometry */}
          <circle cx="24" cy="24" r="16" stroke="white" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 2" />

          {/* The Bridge (Setu) Arch Architecture */}
          {/* Left Pier */}
          <rect x="10" y="27" width="4.5" height="9" rx="1.5" fill="#FFFFFF" fillOpacity="0.95" />
          {/* Right Pier */}
          <rect x="33.5" y="27" width="4.5" height="9" rx="1.5" fill="#FFFFFF" fillOpacity="0.95" />

          {/* Setu Span / Bridge Arch */}
          <path
            d="M10 27C14 21 34 21 38 27C34 24.5 14 24.5 10 27Z"
            fill="#D97706"
          />
          <path
            d="M9 28C14.5 22.5 33.5 22.5 39 28"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Central Standards Verification Rosette & Diamond */}
          <path
            d="M24 9L28.5 13.5L24 18L19.5 13.5L24 9Z"
            fill="#D97706"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />

          {/* Verification Checkpoint Core */}
          <circle cx="24" cy="13.5" r="2" fill="#FFFFFF" />

          {/* Vertical Alignment Ray of Precision */}
          <line x1="24" y1="18" x2="24" y2="24" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2" />

          {/* Bridge Keystone Base */}
          <path
            d="M21.5 24H26.5L25.5 29H22.5L21.5 24Z"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      {/* Product Name & Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-bold tracking-tight text-charcoal leading-none ${textClasses[size]}`}>
            Maanak<span className="text-brand">Setu</span>
          </span>
          {/* Official Ministry / Department Photo / Emblem */}
          <div
            className="inline-flex items-center rounded-md overflow-hidden bg-white/95 dark:bg-white/90 p-0.5 border border-govborder/80 shadow-2xs"
            title="Department of Consumer Affairs • Bureau of Indian Standards"
          >
            <img
              src="/official-emblem.png"
              alt="Department of Consumer Affairs"
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>
        {showTagline && (
          <span className="text-xs text-govmuted tracking-normal mt-0.5 font-normal">
            From Tender Requirement to Standards-Ready Specification
          </span>
        )}
      </div>
    </div>
  );
}
