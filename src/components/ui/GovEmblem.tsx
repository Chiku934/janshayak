import React from 'react';

export const GovEmblem: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
      {/* Ashoka Wheel Emblem Graphic */}
      <svg viewBox="0 0 100 100" className="w-full h-full text-blue-900 drop-shadow-sm">
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="50" cy="50" r="41" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="10" fill="#1e3a8a" />
        <circle cx="50" cy="50" r="4" fill="#ffffff" />
        {/* 24 Spoke Chakra Rays */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="7"
            stroke="#1e3a8a"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${i * 15} 50 50)`}
          />
        ))}
      </svg>
    </div>
  );
};
