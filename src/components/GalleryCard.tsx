import React from 'react';
import { motion } from 'motion/react';

interface GalleryCardProps {
  imageUrl: string;
  index: number;
}

export const GalleryCard = ({ imageUrl, index }: GalleryCardProps) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="aspect-square relative overflow-hidden rounded-lg group"
  >
    <img 
      src={imageUrl} 
      onError={(e) => {
        const fallbacks = [
          "https://images.unsplash.com/photo-1523050335456-9da9278335ee?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1541339907198-e08756defe93?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400"
        ];
        (e.target as HTMLImageElement).src = fallbacks[index % fallbacks.length];
      }}
      alt="Graduation memory" 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-navy-base/20 group-hover:bg-transparent transition-colors duration-500" />
  </motion.div>
);
