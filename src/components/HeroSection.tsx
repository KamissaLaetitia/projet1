'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Sparkles, ShieldCheck, Truck, Award } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useProducts } from '@/context/ProductsContext';

export const HeroSection = () => {
  const { addItem } = useCartStore();
  const { products } = useProducts();
  const signatureCake = products[0]; // Premier gâteau du catalogue (géré par la vendeuse)

  return (
    <section className="relative overflow-hidden bg-caffeine-dark pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-caffeine-cardBorder">
      {/* Background Radial Glow Lights */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-200/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-caffeine-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Advertising Copy, Badges & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center flex-wrap sm:flex-nowrap gap-1.5 sm:gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/95 border border-caffeine-gold/40 text-caffeine-gold text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-5 sm:mb-6 shadow-gold-sm backdrop-blur-md animate-fade-in shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-caffeine-gold animate-pulse shrink-0" />
              <span>Haute Pâtisserie Artisanale</span>
              <span className="w-1.5 h-1.5 rounded-full bg-caffeine-gold hidden sm:inline-block shrink-0" />
              <span className="text-caffeine-cream font-extrabold">Fait Main à Paris</span>
            </div>

            {/* Main Advertising Headline (Style Caffeine X Display 1) */}
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-caffeine-cream leading-[1.15] sm:leading-[1.1] mb-5 sm:mb-6">
              Des gâteaux qui rendent chaque moment{' '}
              <span className="gold-gradient-text">inoubliable.</span>
            </h1>

            {/* Catchy Description */}
            <p className="text-sm sm:text-base lg:text-lg text-caffeine-subtle leading-relaxed mb-6 sm:mb-8 max-w-2xl font-sans font-normal">
              Faites-vous plaisir avec nos créations gourmandes d&apos;exception. Des pièces montées majestueuses aux entremets signatures et cupcakes fondants, personnalisez et commandez votre gâteau en quelques clics.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10">
              <Link
                href="/catalogue"
                className="btn-caffeine-primary text-sm sm:text-base !py-3.5 sm:!py-4 !px-7 sm:!px-9 flex items-center justify-center gap-3 shadow-gold-md group text-center"
              >
                <span>Commander Maintenant</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                href="/sur-mesure"
                className="btn-caffeine-secondary text-sm sm:text-base !py-3.5 sm:!py-4 !px-6 sm:!px-8 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md text-center"
              >
                <Sparkles className="w-4 h-4 text-caffeine-gold shrink-0" />
                <span>Gâteau Sur-Mesure</span>
              </Link>
            </div>

            {/* Proof & Rating Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-caffeine-cardBorder w-full">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 sm:gap-1.5 text-caffeine-gold font-black text-base sm:text-xl font-display">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-caffeine-gold text-caffeine-gold shrink-0" />
                  <span>4.95 / 5</span>
                </div>
                <span className="text-[10px] sm:text-xs text-caffeine-subtle mt-0.5 font-medium">+1 200 avis clients</span>
              </div>
              <div className="flex flex-col border-x border-caffeine-cardBorder px-2 sm:px-4">
                <div className="flex items-center gap-1 sm:gap-1.5 text-caffeine-cream font-black text-base sm:text-xl font-display">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-caffeine-gold shrink-0" />
                  <span>24h - 48h</span>
                </div>
                <span className="text-[10px] sm:text-xs text-caffeine-subtle mt-0.5 font-medium">Livraison fraîcheur</span>
              </div>
              <div className="flex flex-col pl-1 sm:pl-2">
                <div className="flex items-center gap-1 sm:gap-1.5 text-caffeine-cream font-black text-base sm:text-xl font-display">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-caffeine-gold shrink-0" />
                  <span>100% Bio</span>
                </div>
                <span className="text-[10px] sm:text-xs text-caffeine-subtle mt-0.5 font-medium">Ingrédients nobles</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Floating Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full mt-6 lg:mt-0">
            
            {/* Main Visual Container with Golden Border Aura & Soft Box Shadow */}
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[28px] sm:rounded-[32px] overflow-hidden p-2 sm:p-2.5 bg-gradient-to-b from-caffeine-gold/30 via-caffeine-cardBorder to-white shadow-[0_20px_50px_rgba(180,130,80,0.18)] group">
              <div className="relative w-full h-full rounded-[22px] sm:rounded-[24px] overflow-hidden bg-caffeine-surface shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85"
                  alt="Gâteau d'exception au chocolat noir Valrhona et or comestible"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-1000 ease-out"
                />
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Bottom Overlay Info on Cake */}
                <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-panel border border-caffeine-gold/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xl backdrop-blur-xl">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-caffeine-gold uppercase tracking-widest block">
                      Gâteau Signature
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-caffeine-cream line-clamp-1 font-display">
                      Le Royal Chocolat Grand Cru
                    </h2>
                    <span className="text-[11px] sm:text-xs text-caffeine-subtle">
                      Chocolat 70% & Feuillantine Or
                    </span>
                  </div>
                  <button
                    onClick={() => signatureCake && addItem(signatureCake)}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-caffeine-gold to-caffeine-goldHover text-white font-black text-xs hover:scale-105 transition-all shadow-gold-sm shrink-0 w-full sm:w-auto text-center"
                  >
                    28 000 FCFA
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
