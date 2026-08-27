'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Sparkles, Filter, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { SloganTicker } from '@/components/SloganTicker';
import { formatPrice } from '@/lib/utils';
import { useProducts } from '@/context/ProductsContext';

function CatalogueContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const { products } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceMax, setPriceMax] = useState<number>(150000);
  const [onlyPromos, setOnlyPromos] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesTagline = product.tagline.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesTagline && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      // Price filter
      const effectivePrice = product.discountPrice || product.price;
      if (effectivePrice > priceMax) {
        return false;
      }
      // Promo filter
      if (onlyPromos && !product.isPromotion) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return 0; // default
    });
  }, [products, selectedCategory, searchQuery, sortBy, priceMax, onlyPromos]);

  return (
    <div className="bg-caffeine-dark min-h-screen pb-24">
      
      {/* Top Banner */}
      <div className="bg-caffeine-darker border-b border-caffeine-cardBorder py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caffeine-gold/10 border border-caffeine-gold/30 text-caffeine-gold text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalogue Gourmand Complet</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-caffeine-cream">
            Nos Gâteaux & <span className="gold-gradient-text">Créations d&apos;Exception</span>
          </h1>
          <p className="text-caffeine-subtle text-xs sm:text-base mt-2 sm:mt-3 max-w-xl mx-auto">
            Découvrez nos recettes artisanales préparées sur commande avec des ingrédients 100% nobles.
          </p>
        </div>
      </div>

      <SloganTicker />

      {/* Main Catalogue Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* Search & Sort Controls Bar */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-caffeine-cardBorder shadow-[0_4px_20px_rgba(180,130,80,0.07)] mb-6 sm:mb-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-caffeine-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un gâteau, saveur (chocolat, vanille, fruits...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-caffeine-subtle hover:text-caffeine-cream"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Buttons & Sorting */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3.5 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs font-bold text-caffeine-cream flex items-center gap-2 shadow-sm"
            >
              <Filter className="w-4 h-4 text-caffeine-gold" />
              <span>Filtres</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-caffeine-subtle hidden sm:inline-block font-medium">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs font-bold text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm"
              >
                <option value="featured">Recommandés</option>
                <option value="popular">Plus populaires</option>
                <option value="rating">Mieux notés (★)</option>
                <option value="price-asc">Prix : Croissant</option>
                <option value="price-desc">Prix : Décroissant</option>
              </select>
            </div>

          </div>

        </div>

        {/* Layout Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Sidebar Filter (Desktop) */}
          <aside className={`lg:block ${mobileFilterOpen ? 'block mb-6' : 'hidden'} lg:col-span-1 p-6 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_4px_20px_rgba(180,130,80,0.07)] space-y-6`}>
            
            <div className="flex items-center justify-between pb-4 border-b border-caffeine-cardBorder">
              <h3 className="font-display font-bold text-base text-caffeine-cream flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-caffeine-gold" />
                <span>Filtres</span>
              </h3>
              {(selectedCategory !== 'all' || searchQuery || onlyPromos || priceMax < 150000) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setOnlyPromos(false);
                    setPriceMax(150000);
                  }}
                  className="text-[11px] text-caffeine-gold hover:underline font-semibold"
                >
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-caffeine-subtle mb-3">
                Catégories
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-caffeine-gold text-white font-black shadow-gold-sm'
                      : 'text-caffeine-cream/85 hover:bg-caffeine-surface hover:text-caffeine-gold'
                  }`}
                >
                  <span>Tous les gâteaux</span>
                  <span className="text-[10px] opacity-80">({products.length})</span>
                </button>

                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat.slug).length;
                  const isActive = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-caffeine-gold text-white font-bold shadow-gold-sm'
                          : 'text-caffeine-cream/85 hover:bg-caffeine-surface hover:text-caffeine-gold'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Max Filter */}
            <div className="pt-4 border-t border-caffeine-cardBorder">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-caffeine-subtle">
                  Budget Maximum
                </h4>
                <span className="text-xs font-bold text-caffeine-gold">{formatPrice(priceMax)}</span>
              </div>
              <input
                type="range"
                min="15000"
                max="150000"
                step="5000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-caffeine-gold cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-caffeine-muted mt-1">
                <span>15 000 FCFA</span>
                <span>150 000 FCFA</span>
              </div>
            </div>

            {/* Checkbox: Promotions Only */}
            <div className="pt-4 border-t border-caffeine-cardBorder">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-caffeine-cream">
                <input
                  type="checkbox"
                  checked={onlyPromos}
                  onChange={(e) => setOnlyPromos(e.target.checked)}
                  className="w-4 h-4 rounded bg-caffeine-surface border-caffeine-cardBorder text-caffeine-gold accent-caffeine-gold"
                />
                <span>Uniquement les offres en promotion (-%)</span>
              </label>
            </div>

          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-3">
            
            {/* Active Filters Summary Bar */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-caffeine-subtle">
                <strong className="text-caffeine-cream font-bold">{filteredProducts.length}</strong> gâteau(x) trouvé(s)
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 p-8 rounded-3xl bg-white border border-caffeine-cardBorder text-center flex flex-col items-center shadow-[0_4px_20px_rgba(180,130,80,0.07)]">
                <span className="text-4xl mb-3">🎂</span>
                <h3 className="font-display font-bold text-lg text-caffeine-cream mb-1">
                  Aucun gâteau ne correspond à vos filtres
                </h3>
                <p className="text-xs text-caffeine-subtle max-w-sm mb-6">
                  Essayez d&apos;élargir votre recherche de prix ou de réinitialiser vos critères.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setOnlyPromos(false);
                    setPriceMax(150000);
                  }}
                  className="btn-caffeine-primary text-xs !py-2.5 !px-6"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-caffeine-gold">Chargement du catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
