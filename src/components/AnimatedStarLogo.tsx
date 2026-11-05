import React from 'react';

interface AnimatedStarLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRays?: boolean;
  className?: string;
}

export const AnimatedStarLogo: React.FC<AnimatedStarLogoProps> = ({
  size = 'md',
  showRays = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { container: 'w-10 h-10', star: 'w-8 h-8' },
    md: { container: 'w-14 h-14', star: 'w-12 h-12' },
    lg: { container: 'w-24 h-24', star: 'w-20 h-20' },
    xl: { container: 'w-32 h-32', star: 'w-28 h-28' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${currentSize.container} ${className}`}>
      {/* 1. Animated Golden Glow & Ambient Rays */}
      {showRays && (
        <div className="absolute inset-0 rounded-full animate-spin [animation-duration:14s] pointer-events-none opacity-70">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="friendlyRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#FDE68A" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2={i % 2 === 0 ? '8' : '16'}
                stroke="url(#friendlyRayGrad)"
                strokeWidth={i % 2 === 0 ? '2' : '1.2'}
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </svg>
        </div>
      )}

      {/* 2. Soft Pulsing Halo Behind the Star Mascot */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-rose-400 blur-md opacity-50 animate-pulse pointer-events-none" />

      {/* 3. THE FRIENDLY STAR MASCOT (Karakter Bintang Hebat Ramah Remaja SMP) */}
      <div className="relative z-10 transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer">
        <svg
          viewBox="0 0 120 120"
          className={`${currentSize.star} filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]`}
        >
          <defs>
            {/* Warm Friendly Golden Gradient for Star Body */}
            <linearGradient id="starBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="25%" stopColor="#FDE047" />
              <stop offset="65%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            {/* Inner Belly Soft Glow */}
            <radialGradient id="starBellyGlow" cx="50%" cy="55%" r="45%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#FEF08A" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>

            {/* Cheerful Red-White Ribbon / Headband Gradient */}
            <linearGradient id="headbandRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>

            {/* Rosy Blush Gradient */}
            <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FB7185" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* STAR BODY WITH SOFT ROUNDED FRIENDLY CONTOURS */}
          {/* Path of a chubby, friendly 5-point star with rounded corners */}
          <path
            d="M 60 10 
               C 62 10, 65 17, 72 32 
               C 76 39, 83 41, 98 43 
               C 106 44, 108 48, 103 54 
               C 92 65, 89 71, 93 86 
               C 95 94, 91 97, 85 93 
               C 72 85, 66 84, 60 88 
               C 54 84, 48 85, 35 93 
               C 29 97, 25 94, 27 86 
               C 31 71, 28 65, 17 54 
               C 12 48, 14 44, 22 43 
               C 37 41, 44 39, 48 32 
               C 55 17, 58 10, 60 10 Z"
            fill="url(#starBodyGrad)"
            stroke="#D97706"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Highlight / Soft Specular Arc */}
          <ellipse cx="60" cy="56" rx="26" ry="24" fill="url(#starBellyGlow)" />

          {/* COOL INDONESIAN HERO HEADBAND (Pita Merah Putih Khas Pelajar Hebat) */}
          <g>
            {/* Red band across top star forehead */}
            <path
              d="M 45 28 C 55 24, 65 24, 75 28 L 74 34 C 64 30, 56 30, 46 34 Z"
              fill="url(#headbandRed)"
              stroke="#991B1B"
              strokeWidth="0.8"
            />
            {/* White stripe inside headband */}
            <path
              d="M 46 32 C 55 29, 65 29, 74 32 L 74 34 C 65 31, 55 31, 46 34 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* FRIENDLY CARTOON EYES (Mata Ramah & Bersemangat) */}
          {/* Left Eye */}
          <g>
            <ellipse cx="48" cy="52" rx="4.5" ry="6.5" fill="#1E293B" />
            {/* Catchlight sparkle inside eye */}
            <circle cx="46.5" cy="49.5" r="2.2" fill="#FFFFFF" />
            <circle cx="49.5" cy="54.5" r="1.1" fill="#FFFFFF" />
            {/* Cute friendly eyebrow */}
            <path d="M 43 43 C 46 41, 51 42, 53 44" fill="none" stroke="#92400E" strokeWidth="1.6" strokeLinecap="round" />
          </g>

          {/* Right Eye */}
          <g>
            <ellipse cx="72" cy="52" rx="4.5" ry="6.5" fill="#1E293B" />
            {/* Catchlight sparkle inside eye */}
            <circle cx="70.5" cy="49.5" r="2.2" fill="#FFFFFF" />
            <circle cx="73.5" cy="54.5" r="1.1" fill="#FFFFFF" />
            {/* Cute friendly eyebrow */}
            <path d="M 67 44 C 69 42, 74 41, 77 43" fill="none" stroke="#92400E" strokeWidth="1.6" strokeLinecap="round" />
          </g>

          {/* ROSY BLUSH CHEEKS (Pipi Merona Ramah) */}
          <ellipse cx="39" cy="60" rx="5" ry="3" fill="url(#blushGrad)" />
          <ellipse cx="81" cy="60" rx="5" ry="3" fill="url(#blushGrad)" />

          {/* CHEERFUL WARM SMILE (Senyum Bahagia & Ramah) */}
          <path
            d="M 52 61 C 54 69, 66 69, 68 61"
            fill="#B91C1C"
            stroke="#92400E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Cute Tongue inside mouth */}
          <path
            d="M 56 65 C 58 68, 62 68, 64 65 Z"
            fill="#F43F5E"
          />

          {/* SHINING SPARKLE ON TOP RIGHT POINT */}
          <g transform="translate(86, 24) scale(0.65)">
            <polygon
              points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
