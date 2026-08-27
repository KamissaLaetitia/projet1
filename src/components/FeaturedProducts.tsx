'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCategory } from '@/lib/types';
import { CATEGORIES } from '@/lib/data';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/context/ProductsContext';

export const FeaturedProducts = () => {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filterTabs = [
    { id: 'all', name: 'Toutes les Créations' },
    ...CATEGORIES.map(cat => ({ id: cat.slug, name: cat.name }))
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="catalogue-section" className="py-16 sm:py-24 bg-caffeine-darker border-b border-caffeine-cardBorder relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Style Caffeine X) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caffeine-gold/10 border border-caffeine-gold/30 text-caffeine-gold text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nos Meilleures Ventes</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-caffeine-cream">
              Faites-vous plaisir avec nos <span className="gold-gradient-text">créations gourmandes.</span>
            </h2>
            <p className="text-caffeine-subtle text-xs sm:text-base mt-2 max-w-xl">
              Chaque gâteau est conçu avec passion dans notre laboratoire à partir des meilleures matières premières.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="btn-caffeine-secondary text-xs sm:text-sm self-start md:self-auto flex items-center gap-2 group whitespace-nowrap"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight className="w-4 h-4 text-caffeine-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-caffeine-gold text-white border-caffeine-gold shadow-gold-sm'
                    : 'bg-white border-caffeine-cardBorder text-caffeine-cream/85 hover:text-caffeine-gold hover:border-caffeine-gold/50 shadow-sm'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Advertising Banner */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white via-caffeine-surface to-white border border-caffeine-gold/35 shadow-[0_8px_30px_rgba(180,130,80,0.1)] flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 text-center sm:text-left">
          <div>
            <span className="text-[10px] sm:text-xs uppercase font-bold text-caffeine-gold tracking-widest block mb-1">
              Votre gâteau, votre occasion, votre style
            </span>
            <h3 className="font-display font-black text-lg sm:text-2xl text-caffeine-cream">
              Besoin d&apos;un gâteau 100% personnalisé sur-mesure ?
            </h3>
            <p className="text-xs text-caffeine-subtle mt-1 max-w-lg">
              Envoyez-nous votre modèle, nombre d&apos;invités et parfums préférés. Devis gratuit et réponse sous 2h.
            </p>
          </div>
          <Link
            href="/sur-mesure"
            className="btn-caffeine-primary text-xs sm:text-sm !py-3 !px-6 w-full sm:w-auto text-center shrink-0"
          >
            Demander un Devis Gratuit
          </Link>
        </div>

      </div>
    </section>
  );
};
