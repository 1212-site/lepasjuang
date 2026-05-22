import React from 'react';

interface CountdownItemProps {
  value: number;
  label: string;
}

export const CountdownItem = ({ value, label }: CountdownItemProps) => (
  <div className="flex flex-col items-center justify-center bg-navy-light/30 border border-white/10 rounded-lg p-4 min-w-[80px] md:min-w-[100px]">
    <span className="text-2xl md:text-4xl font-serif font-bold text-white">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[10px] md:text-xs uppercase tracking-widest text-blue-200/60 mt-1">
      {label}
    </span>
  </div>
);
