'use client';

import React from 'react';
import { Sparkles, Heart, Star, Award } from 'lucide-react';

const SLOGANS = [
  { text: 'Des gâteaux qui rendent chaque moment inoubliable', icon: Sparkles },
  { text: 'Faites-vous plaisir avec nos créations gourmandes', icon: Heart },
  { text: 'Votre gâteau, votre occasion, votre style', icon: Award },
  { text: 'Commandez votre gâteau en quelques clics', icon: Star },
];

export const SloganTicker = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-white via-caffeine-surface to-white border-y border-caffeine-gold/25 py-3.5 shadow-sm">
      <div className="flex w-max animate-marquee space-x-8 items-center">
        {/* Double the list for seamless continuous loop */}
        {[...SLOGANS, ...SLOGANS, ...SLOGANS, ...SLOGANS].map((slogan, index) => {
          const Icon = slogan.icon;
          return (
            <div
              key={index}
              className="flex items-center space-x-3 text-caffeine-cream/90 font-display font-medium text-sm md:text-base tracking-wide whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-caffeine-gold animate-pulse" />
              <Icon className="w-4 h-4 text-caffeine-gold inline-block flex-shrink-0" />
              <span className="font-semibold">{slogan.text}</span>
              <span className="text-caffeine-gold/40 text-lg font-serif">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
