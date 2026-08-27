'use client';

import React from 'react';
import { Award, Sparkles, Truck, HeartHandshake, ShieldCheck, Clock } from 'lucide-react';

const FEATURES = [
  {
    icon: Award,
    title: '100% Ingrédients Nobles & Bio',
    description: 'Chocolats grands crus Valrhona, vanille Bourbon de Madagascar et beurres AOP de Normandie. Zéro conservateur artificiel.',
  },
  {
    icon: Sparkles,
    title: 'Créations 100% Personnalisables',
    description: 'Plaques en chocolat personnalisées, modelages raffinés, choix des saveurs et compositions adaptées à vos régimes et envies.',
  },
  {
    icon: Truck,
    title: 'Livraison Réfrigérée Express 24h',
    description: 'Véhicules frigorifiques respectant scrupuleusement la chaîne du froid. Livraison ponctuelle sur le créneau de votre choix.',
  },
  {
    icon: HeartHandshake,
    title: 'Service & Satisfaction Garantie',
    description: 'Une équipe de pâtissiers et conseillers dévoués. Plus de 98% de clients conquis et un accompagnement sur-mesure.',
  },
];

export const WhyChooseUs = () => {
  return (
    <section id="pourquoi-nous" className="py-16 sm:py-24 bg-caffeine-darker border-b border-caffeine-cardBorder relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Style Caffeine X) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caffeine-gold/10 border border-caffeine-gold/30 text-caffeine-gold text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Excellence & Savoir-Faire</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-caffeine-cream">
            Pourquoi choisir notre <span className="gold-gradient-text">Maison de Haute Pâtisserie ?</span>
          </h2>
          <p className="text-caffeine-subtle text-xs sm:text-base mt-3 sm:mt-4 leading-relaxed">
            Nous transformons chaque événement en une expérience gustative et visuelle inoubliable grâce à l&apos;exigence artisanale française.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-caffeine-cardBorder hover:border-caffeine-gold/60 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(180,130,80,0.14)] shadow-[0_4px_20px_rgba(180,130,80,0.07)] group flex flex-col justify-between"
              >
                <div>
                  {/* Icon Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border border-caffeine-gold/40 flex items-center justify-center text-caffeine-gold mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg text-caffeine-cream mb-3 group-hover:text-caffeine-gold transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-caffeine-subtle leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-caffeine-cardBorder/60 flex items-center gap-1.5 text-xs text-caffeine-gold font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Artisanat certifié</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
