'use client';

import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles } from 'lucide-react';
import { REVIEWS } from '@/lib/data';

export const TestimonialsSection = () => {
  return (
    <section id="avis" className="py-16 sm:py-24 bg-caffeine-dark border-b border-caffeine-cardBorder relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caffeine-gold/10 border border-caffeine-gold/30 text-caffeine-gold text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Témoignages & Émotions</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-caffeine-cream">
            Ce que nos clients <span className="gold-gradient-text">disent de nous.</span>
          </h2>
          <p className="text-caffeine-subtle text-xs sm:text-base mt-2 sm:mt-3">
            Plus de 1 200 gourmands nous font confiance pour sublimer leurs mariages, anniversaires et réceptions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-caffeine-cardBorder hover:border-caffeine-gold/50 transition-all duration-300 flex flex-col justify-between shadow-[0_4px_20px_rgba(180,130,80,0.07)] hover:shadow-[0_12px_32px_rgba(180,130,80,0.13)] relative group"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 text-caffeine-gold">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-caffeine-gold" />
                    ))}
                  </div>
                  <Quote className="w-5 sm:w-6 h-5 sm:h-6 text-caffeine-gold/30 group-hover:text-caffeine-gold/60 transition-colors" />
                </div>

                {/* Cake Name Tag */}
                {review.productName && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-caffeine-gold block mb-2">
                    {review.productName}
                  </span>
                )}

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-caffeine-cream/90 italic leading-relaxed mb-5 sm:mb-6 font-sans">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-3 sm:pt-4 border-t border-caffeine-cardBorder/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-caffeine-cream flex items-center gap-1">
                    <span>{review.authorName}</span>
                    {review.isVerifiedBuyer && (
                      <span title="Acheteur Vérifié"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></span>
                    )}
                  </h3>
                  {review.occasion && (
                    <span className="text-[10px] text-caffeine-subtle">
                      {review.occasion}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-caffeine-muted font-medium">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-10 sm:mt-14 p-4 sm:p-6 rounded-2xl bg-white border border-caffeine-cardBorder flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-6 text-center text-xs text-caffeine-subtle shadow-[0_4px_20px_rgba(180,130,80,0.06)]">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">🏆</span>
            <span className="font-bold text-caffeine-cream">Médaille d&apos;Or de la Pâtisserie 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">🌿</span>
            <span className="font-bold text-caffeine-cream">Farines & Chocolats 100% Éco-responsables</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">⭐</span>
            <span className="font-bold text-caffeine-cream">Note Moyenne de 4.95 / 5 sur Google & Trustpilot</span>
          </div>
        </div>

      </div>
    </section>
  );
};
