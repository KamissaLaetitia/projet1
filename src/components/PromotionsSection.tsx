'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, Clock, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/context/ProductsContext';

export const PromotionsSection = () => {
  const { products } = useProducts();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dynamic countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const promoProducts = products.filter((p) => p.isPromotion);

  return (
    <section id="promotions" className="py-16 sm:py-24 bg-caffeine-dark border-b border-caffeine-cardBorder relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-caffeine-caramel/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Countdown */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Tag className="w-3.5 h-3.5" />
              <span>Offres Limitées du Moment</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-caffeine-cream">
              Vente & Publicité : <span className="gold-gradient-text">Offres Spéciales.</span>
            </h2>
            <p className="text-caffeine-subtle text-sm sm:text-base mt-2 max-w-xl">
              Profitez de réductions exclusives sur nos créations d&apos;exception. Offres valables dans la limite des stocks disponibles.
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex items-center gap-3 bg-white border border-caffeine-gold/35 p-3.5 rounded-2xl shadow-[0_4px_16px_rgba(180,130,80,0.1)] self-start lg:self-auto">
            <Clock className="w-5 h-5 text-caffeine-gold animate-pulse" />
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col items-center px-2 py-1 bg-caffeine-surface border border-caffeine-cardBorder/60 rounded-lg min-w-[38px] shadow-sm">
                <span className="font-mono font-black text-sm text-caffeine-gold">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase text-caffeine-subtle font-bold">H</span>
              </div>
              <span className="text-caffeine-gold font-bold">:</span>
              <div className="flex flex-col items-center px-2 py-1 bg-caffeine-surface border border-caffeine-cardBorder/60 rounded-lg min-w-[38px] shadow-sm">
                <span className="font-mono font-black text-sm text-caffeine-gold">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase text-caffeine-subtle font-bold">M</span>
              </div>
              <span className="text-caffeine-gold font-bold">:</span>
              <div className="flex flex-col items-center px-2 py-1 bg-caffeine-surface border border-caffeine-cardBorder/60 rounded-lg min-w-[38px] shadow-sm">
                <span className="font-mono font-black text-sm text-caffeine-gold">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase text-caffeine-subtle font-bold">S</span>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Code Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 sm:mb-12">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-caffeine-gold/40 shadow-[0_6px_22px_rgba(180,130,80,0.09)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-caffeine-gold tracking-wider block">
                Nouveau Client
              </span>
              <h3 className="text-base sm:text-lg font-black text-caffeine-cream font-display">-20% Première Commande</h3>
              <p className="text-[11px] text-caffeine-subtle mt-0.5">Dès 25 000 FCFA d&apos;achat</p>
            </div>
            <button
              onClick={() => handleCopyCode('GOURMAND20')}
              className="px-3 py-2 rounded-xl bg-caffeine-gold/15 border border-caffeine-gold/40 hover:bg-caffeine-gold hover:text-white text-caffeine-gold text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0 self-start sm:self-auto"
            >
              {copiedCode === 'GOURMAND20' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 shrink-0" />
                  <span>GOURMAND20</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-caffeine-cardBorder shadow-[0_6px_22px_rgba(180,130,80,0.07)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-caffeine-gold tracking-wider block">
                Spécial Fête
              </span>
              <h3 className="text-base sm:text-lg font-black text-caffeine-cream font-display">-15% Anniversaire</h3>
              <p className="text-[11px] text-caffeine-subtle mt-0.5">Dès 20 000 FCFA d&apos;achat</p>
            </div>
            <button
              onClick={() => handleCopyCode('ANNIVERSAIRE15')}
              className="px-3 py-2 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder hover:border-caffeine-gold hover:text-caffeine-gold text-caffeine-cream text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0 self-start sm:self-auto"
            >
              {copiedCode === 'ANNIVERSAIRE15' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-caffeine-gold shrink-0" />
                  <span>ANNIVERSAIRE15</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-caffeine-cardBorder shadow-[0_6px_22px_rgba(180,130,80,0.07)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-caffeine-gold tracking-wider block">
                Grand Événement
              </span>
              <h3 className="text-base sm:text-lg font-black text-caffeine-cream font-display">-10% Mariage & Prestige</h3>
              <p className="text-[11px] text-caffeine-subtle mt-0.5">Dès 70 000 FCFA d&apos;achat</p>
            </div>
            <button
              onClick={() => handleCopyCode('MARIAGE10')}
              className="px-3 py-2 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder hover:border-caffeine-gold hover:text-caffeine-gold text-caffeine-cream text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0 self-start sm:self-auto"
            >
              {copiedCode === 'MARIAGE10' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-caffeine-gold shrink-0" />
                  <span>MARIAGE10</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Promo Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {promoProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
