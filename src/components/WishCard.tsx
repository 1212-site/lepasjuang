import React from 'react';
import { motion } from 'motion/react';
import { Quote, Trash2 } from 'lucide-react';
import { Wish } from '../types';

interface WishCardProps {
  wish: Wish;
  onDelete?: () => void;
}

export const WishCard = ({ wish, onDelete }: WishCardProps) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="navy-card p-6 rounded-xl relative overflow-hidden mb-6 group/card"
  >
    <Quote className="absolute top-4 right-4 w-10 h-10 text-white/5" />
    
    {onDelete && (
      <button 
        type="button"
        onClick={onDelete}
        className="absolute top-4 right-4 z-20 p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg md:opacity-0 md:group-hover/card:opacity-100 focus:opacity-100 transition-all cursor-pointer"
        title="Hapus Ucapan"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )}

    <p className="text-blue-100/90 italic mb-6 relative z-10 font-sans leading-relaxed text-sm md:text-base pr-8">
      "{wish.message}"
    </p>
    <div className="flex items-center gap-4 flex-wrap">
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-serif text-white text-lg shrink-0">
        {wish.initial}
      </div>
      <div>
        <h4 className="text-white font-medium text-sm">{wish.name}</h4>
        <p className="text-blue-200/50 text-xs">{wish.major}</p>
      </div>
    </div>
  </motion.div>
);
