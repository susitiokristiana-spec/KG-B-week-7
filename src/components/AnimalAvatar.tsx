import React, { useState } from 'react';
import { motion } from 'motion/react';
import { VisualMode } from '../types';

interface AnimalAvatarProps {
  animalId: string;
  realPhotoUrl?: string;
  visualMode?: VisualMode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  state?: 'idle' | 'celebrating' | 'wrong' | 'speaking';
  className?: string;
}

export const AnimalAvatar: React.FC<AnimalAvatarProps> = ({
  animalId,
  realPhotoUrl,
  visualMode = 'real',
  size = 'md',
  state = 'idle',
  className = '',
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  const getAnimation = () => {
    switch (state) {
      case 'celebrating':
        return {
          scale: [1, 1.14, 1, 1.1, 1],
          rotate: [0, -5, 5, -2, 0],
          transition: { duration: 1.2, repeat: Infinity, repeatDelay: 0.5 },
        };
      case 'wrong':
        return {
          x: [-6, 6, -6, 6, 0],
          rotate: [-3, 3, -3, 3, 0],
          transition: { duration: 0.5 },
        };
      case 'speaking':
        return {
          scale: [1, 1.07, 1],
          transition: { duration: 0.6, repeat: Infinity },
        };
      default: // idle
        return {
          y: [0, -3, 0],
          transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const },
        };
    }
  };

  // Render Real Photograph
  if (visualMode === 'real' && realPhotoUrl && !imageError && animalId !== 'misteri') {
    return (
      <motion.div
        animate={getAnimation()}
        className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}
      >
        <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-3 border-amber-300 shadow-md bg-amber-50 relative group">
          <img
            src={realPhotoUrl}
            alt={animalId}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle real photography badge */}
          <span className="absolute bottom-1 right-1 text-[9px] font-extrabold bg-black/60 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs select-none">
            REAL
          </span>
        </div>
      </motion.div>
    );
  }

  // Fallback or Cartoon SVG rendering
  const renderSvg = () => {
    switch (animalId) {
      case 'kucing':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <polygon points="25,48 40,15 55,42" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
            <polygon points="32,44 42,24 50,40" fill="#FDE68A" />
            <polygon points="95,48 80,15 65,42" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
            <polygon points="88,44 78,24 70,40" fill="#FDE68A" />
            <ellipse cx="60" cy="65" rx="42" ry="36" fill="#FBBF24" stroke="#B45309" strokeWidth="3" />
            <ellipse cx="60" cy="74" rx="20" ry="14" fill="#FEF3C7" />
            <ellipse cx="46" cy="58" rx="6" ry="8" fill="#1E293B" />
            <circle cx="48" cy="55" r="2.5" fill="#FFFFFF" />
            <ellipse cx="74" cy="58" rx="6" ry="8" fill="#1E293B" />
            <circle cx="76" cy="55" r="2.5" fill="#FFFFFF" />
            <circle cx="34" cy="70" r="5" fill="#F87171" opacity="0.4" />
            <circle cx="86" cy="70" r="5" fill="#F87171" opacity="0.4" />
            <polygon points="56,70 64,70 60,75" fill="#EC4899" />
            <path d="M55,75 Q60,82 60,78 Q60,82 65,75" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="22" y1="68" x2="42" y2="70" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="76" x2="42" y2="74" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            <line x1="98" y1="68" x2="78" y2="70" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="76" x2="78" y2="74" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'anjing':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <path d="M22,38 C14,50 14,75 26,82 C34,84 38,70 34,50 Z" fill="#9A3412" stroke="#7C2D12" strokeWidth="3" />
            <path d="M98,38 C106,50 106,75 94,82 C86,84 82,70 86,50 Z" fill="#9A3412" stroke="#7C2D12" strokeWidth="3" />
            <ellipse cx="60" cy="62" rx="40" ry="36" fill="#EA580C" stroke="#7C2D12" strokeWidth="3" />
            <ellipse cx="60" cy="74" rx="22" ry="17" fill="#FED7AA" />
            <circle cx="45" cy="54" r="6" fill="#1E293B" />
            <circle cx="47" cy="52" r="2.2" fill="#FFFFFF" />
            <circle cx="75" cy="54" r="6" fill="#1E293B" />
            <circle cx="77" cy="52" r="2.2" fill="#FFFFFF" />
            <ellipse cx="60" cy="68" rx="8" ry="6" fill="#1E293B" />
            <path d="M57,80 C57,89 63,89 63,80 Z" fill="#F43F5E" />
            <line x1="60" y1="80" x2="60" y2="85" stroke="#BE123C" strokeWidth="1.5" />
            <path d="M52,75 Q60,82 68,75" fill="none" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'sapi':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <path d="M30,38 Q32,18 42,22" fill="none" stroke="#FDE68A" strokeWidth="7" strokeLinecap="round" />
            <path d="M90,38 Q88,18 78,22" fill="none" stroke="#FDE68A" strokeWidth="7" strokeLinecap="round" />
            <ellipse cx="24" cy="46" rx="14" ry="8" fill="#FFFFFF" stroke="#475569" strokeWidth="2.5" transform="rotate(-18 24 46)" />
            <ellipse cx="96" cy="46" rx="14" ry="8" fill="#FFFFFF" stroke="#475569" strokeWidth="2.5" transform="rotate(18 96 46)" />
            <ellipse cx="60" cy="58" rx="38" ry="34" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
            <path d="M36,36 C42,42 48,34 46,28 C38,28 32,30 36,36 Z" fill="#1E293B" />
            <path d="M78,42 C86,40 92,48 88,58 C80,56 74,48 78,42 Z" fill="#1E293B" />
            <circle cx="45" cy="50" r="5" fill="#1E293B" />
            <circle cx="47" cy="48" r="2" fill="#FFFFFF" />
            <circle cx="75" cy="50" r="5" fill="#1E293B" />
            <circle cx="77" cy="48" r="2" fill="#FFFFFF" />
            <rect x="36" y="66" width="48" height="28" rx="14" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2.5" />
            <circle cx="48" cy="80" r="4" fill="#9F1239" />
            <circle cx="72" cy="80" r="4" fill="#9F1239" />
            <path d="M54,85 Q60,89 66,85" fill="none" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'ayam-jago':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <path d="M46,30 Q46,14 54,20 Q60,10 68,18 Q76,12 76,28 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2.5" />
            <circle cx="60" cy="60" r="32" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
            <circle cx="44" cy="65" r="4.5" fill="#F87171" opacity="0.4" />
            <circle cx="50" cy="52" r="5.5" fill="#1E293B" />
            <circle cx="52" cy="50" r="2" fill="#FFFFFF" />
            <circle cx="72" cy="52" r="5.5" fill="#1E293B" />
            <circle cx="74" cy="50" r="2" fill="#FFFFFF" />
            <polygon points="54,62 68,62 61,74" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            <ellipse cx="61" cy="80" rx="6" ry="9" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          </svg>
        );

      case 'ayam-betina':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <path d="M52,28 Q56,20 60,24 Q64,18 68,26 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <circle cx="60" cy="60" r="32" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="48" cy="54" r="5" fill="#1E293B" />
            <circle cx="50" cy="52" r="1.8" fill="#FFFFFF" />
            <circle cx="72" cy="54" r="5" fill="#1E293B" />
            <circle cx="74" cy="52" r="1.8" fill="#FFFFFF" />
            <polygon points="55,63 65,63 60,73" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <ellipse cx="90" cy="84" rx="8" ry="11" fill="#FFFFFF" stroke="#FBBF24" strokeWidth="2" transform="rotate(15 90 84)" />
          </svg>
        );

      case 'bebek':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="60" cy="55" r="34" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
            <path d="M57,22 Q60,14 64,22" fill="none" stroke="#CA8A04" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="48" cy="48" rx="5" ry="7" fill="#1E293B" />
            <circle cx="50" cy="46" r="2.2" fill="#FFFFFF" />
            <ellipse cx="72" cy="48" rx="5" ry="7" fill="#1E293B" />
            <circle cx="74" cy="46" r="2.2" fill="#FFFFFF" />
            <circle cx="38" cy="58" r="5" fill="#FB923C" opacity="0.4" />
            <circle cx="82" cy="58" r="5" fill="#FB923C" opacity="0.4" />
            <ellipse cx="60" cy="68" rx="20" ry="12" fill="#FB923C" stroke="#C2410C" strokeWidth="2.5" />
          </svg>
        );

      case 'kambing':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <path d="M36,36 Q30,16 44,18" fill="none" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
            <path d="M84,36 Q90,16 76,18" fill="none" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="26" cy="46" rx="14" ry="7" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" transform="rotate(-25 26 46)" />
            <ellipse cx="94" cy="46" rx="14" ry="7" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" transform="rotate(25 94 46)" />
            <polygon points="40,38 80,38 72,78 48,78" fill="#F1F5F9" stroke="#64748B" strokeWidth="3" />
            <polygon points="54,78 66,78 60,94" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
            <ellipse cx="46" cy="50" rx="5" ry="3.5" fill="#1E293B" />
            <ellipse cx="74" cy="50" rx="5" ry="3.5" fill="#1E293B" />
          </svg>
        );

      case 'kuda':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <polygon points="40,32 46,14 54,28" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <polygon points="68,28 76,14 82,32" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <path d="M44,36 L76,36 L70,82 L50,82 Z" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            <ellipse cx="60" cy="80" rx="14" ry="10" fill="#FDE68A" />
            <circle cx="48" cy="46" r="5" fill="#1E293B" />
            <circle cx="72" cy="46" r="5" fill="#1E293B" />
            <polygon points="60,42 62,46 66,47 63,50 64,54 60,51 56,54 57,50 54,47 58,46" fill="#FFFFFF" />
          </svg>
        );

      case 'kelinci':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <ellipse cx="44" cy="24" rx="8" ry="22" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" transform="rotate(-10 44 24)" />
            <ellipse cx="44" cy="24" rx="4.5" ry="16" fill="#FBCFE8" transform="rotate(-10 44 24)" />
            <ellipse cx="76" cy="24" rx="8" ry="22" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" transform="rotate(10 76 24)" />
            <ellipse cx="76" cy="24" rx="4.5" ry="16" fill="#FBCFE8" transform="rotate(10 76 24)" />
            <circle cx="60" cy="68" r="34" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
            <ellipse cx="46" cy="62" rx="5" ry="7" fill="#1E293B" />
            <circle cx="48" cy="59" r="2.2" fill="#FFFFFF" />
            <ellipse cx="74" cy="62" rx="5" ry="7" fill="#1E293B" />
            <circle cx="76" cy="59" r="2.2" fill="#FFFFFF" />
            <polygon points="56,72 64,72 60,77" fill="#F43F5E" />
          </svg>
        );

      case 'domba':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="38" cy="40" r="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="60" cy="32" r="16" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="82" cy="40" r="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="32" cy="60" r="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="88" cy="60" r="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <ellipse cx="60" cy="60" rx="22" ry="20" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="52" cy="56" r="4.5" fill="#1E293B" />
            <circle cx="68" cy="56" r="4.5" fill="#1E293B" />
          </svg>
        );

      case 'burung':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <path d="M52,24 Q56,12 66,22" fill="none" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="60" cy="60" rx="32" ry="30" fill="#4ADE80" stroke="#16A34A" strokeWidth="3" />
            <circle cx="52" cy="52" r="5.5" fill="#1E293B" />
            <circle cx="74" cy="52" r="5.5" fill="#1E293B" />
            <polygon points="56,60 68,60 62,72" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
          </svg>
        );

      case 'misteri':
      default:
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
            <rect x="22" y="28" width="76" height="74" rx="20" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="4" />
            <rect x="28" y="34" width="64" height="62" rx="15" fill="#7C3AED" />
            <rect x="52" y="28" width="16" height="74" fill="#FBBF24" />
            <rect x="22" y="58" width="76" height="14" fill="#FBBF24" />
            <text
              x="60"
              y="73"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="44"
              fontWeight="bold"
              fontFamily="Fredoka, sans-serif"
              className="drop-shadow-sm"
            >
              ?
            </text>
          </svg>
        );
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}
    >
      {renderSvg()}
    </motion.div>
  );
};
