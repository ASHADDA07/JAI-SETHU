import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({ children, className = '', hoverEffect = false, onClick }: GlassCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-surface/60 backdrop-blur-md border border-white/5 
        p-6 rounded-xl transition-all duration-500
        ${hoverEffect ? 'cursor-pointer hover:border-gold/50 hover:bg-surfaceHighlight hover:shadow-[0_0_30px_-10px_rgba(198,161,91,0.15)] group' : ''}
        ${className}
      `}
    >
      {/* Subtle shine effect on top border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      {children}
    </div>
  );
};