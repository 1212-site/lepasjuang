import React from 'react';

interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export const TimelineItem = ({ time, title, description, isLast = false }: TimelineItemProps) => (
  <div className="flex gap-6 md:gap-10">
    <div className="flex flex-col items-center">
      <div className="w-4 h-4 rounded-sm bg-gold/80 border border-gold" />
      {!isLast && <div className="w-px h-full bg-linear-to-b from-gold/50 to-transparent my-2" />}
    </div>
    <div className="pb-10">
      <span className="text-sm font-medium text-gold/90 font-sans tracking-wide">{time}</span>
      <h3 className="text-xl md:text-2xl font-serif text-white mt-1 mb-2">{title}</h3>
      <p className="text-blue-200/70 text-sm md:text-base leading-relaxed max-w-lg">{description}</p>
    </div>
  </div>
);
