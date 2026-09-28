'use client';

import React from 'react';

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; showTagline?: boolean }> = ({
  size = 'md',
  showTagline = false,
}) => {
  const iconSizes = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-11 h-11' };
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };

  return (
    <div className="flex items-center gap-2.5 select-none group">
      <div className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 via-cyan-500/15 to-transparent border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]`}>
        <svg viewBox="0 0 32 32" className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16h4l3-8 5 16 4-10 3 4h5" />
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight font-bold">
          <span className={`${textSizes[size]} text-zinc-100 font-mono tracking-tighter`}>CP</span>
          <span className={`${textSizes[size]} text-cyan-400 font-sans tracking-tight ml-0.5`}>ulse</span>
          <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">v1.0</span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-zinc-400 -mt-0.5">Your competitive programming journey, unified.</span>
        )}
      </div>
    </div>
  );
};\n