'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Eye, Sparkles, Users } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { ProductQuickView } from './ProductQuickView';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const currentPrice = product.discountPrice || product.price;

  return (
    <>
      <div className="group relative bg-white border border-caffeine-cardBorder hover:border-caffeine-gold/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_16px_36px_rgba(180,130,80,0.16)] card-hover-glow flex flex-col justify-between h-full shadow-[0_4px_20px_rgba(180,130,80,0.07)]">
        
        {/* Card Image & Badges */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-caffeine-surface">
          {!imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={() => setImgError(true)}
              loading="eager"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">🎂</span>
              <span className="text-xs font-semibold text-amber-700/70 text-center px-4 line-clamp-2">{product.name}</span>
            </div>
          )}
          
          {/* Subtle gradient on image bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
            {product.isPromotion && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md backdrop-blur-md border border-red-400/40">
                Promo
              </span>
            )}
            {product.isPopular && !product.isPromotion && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-caffeine-gold to-caffeine-goldHover text-white shadow-md backdrop-blur-md font-bold">
                Signature
              </span>
            )}
            {product.isNew && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md backdrop-blur-md">
                Nouveau
              </span>
            )}
          </div>

          {/* Category Tag on Top Right */}
          <div className="absolute top-3.5 right-3.5 z-10">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-caffeine-cream border border-caffeine-gold/30 backdrop-blur-md shadow-sm">
              {product.categoryName}
            </span>
          </div>

          {/* Hover Quick Action Overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3.5 backdrop-blur-[2px] z-20">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="p-3.5 rounded-full bg-white border border-caffeine-gold/60 text-caffeine-gold hover:bg-caffeine-gold hover:text-white transition-all transform translate-y-3 group-hover:translate-y-0 duration-300 shadow-xl"
              title="Aperçu rapide & personnalisation"
              aria-label="Aperçu rapide"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleQuickAdd}
              className="p-3.5 rounded-full bg-gradient-to-r from-caffeine-gold to-caffeine-goldHover text-white hover:scale-105 transition-all transform translate-y-3 group-hover:translate-y-0 duration-300 shadow-xl font-bold"
              title="Ajouter au panier directement"
              aria-label="Ajouter au panier"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
          
          <div>
            {/* Rating & Portions info */}
            <div className="flex items-center justify-between text-xs text-caffeine-subtle mb-2.5">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-caffeine-gold text-caffeine-gold" />
                <span className="font-bold text-caffeine-cream">{product.rating}</span>
                <span className="text-[11px]">({product.reviewsCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-caffeine-subtle font-medium">
                <Users className="w-3.5 h-3.5 text-caffeine-gold" />
                <span>{product.defaultPortions} parts</span>
              </div>
            </div>

            {/* Product Title */}
            <Link href={`/produit/${product.id}`} className="block group-hover:text-caffeine-gold transition-colors">
              <h3 className="font-display font-black text-base sm:text-lg text-caffeine-cream line-clamp-1 mb-1.5">
                {product.name}
              </h3>
            </Link>

            {/* Tagline / Subtitle */}
            <p className="text-xs text-caffeine-subtle line-clamp-2 leading-relaxed mb-4 sm:mb-5 font-sans">
              {product.tagline || product.description}
            </p>
          </div>

          {/* Price & Action Button Footer */}
          <div className="pt-3.5 sm:pt-4 border-t border-caffeine-cardBorder/70 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mt-auto">
            <div className="flex flex-col">
              <span className="text-[9px] text-caffeine-subtle uppercase tracking-widest font-bold">
                Prix dès
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-caffeine-gold font-display tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-caffeine-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setQuickViewOpen(true)}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold bg-caffeine-surface border border-caffeine-cardBorder hover:border-caffeine-gold/70 text-caffeine-cream hover:text-caffeine-gold shadow-sm hover:shadow transition-all"
              >
                Personnaliser
              </button>
              <button
                onClick={handleQuickAdd}
                className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-black bg-gradient-to-r from-caffeine-gold to-caffeine-goldHover text-white hover:shadow-gold-md hover:scale-102 transition-all flex items-center gap-1.5 shadow-gold-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Commander</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Quick View & Customization Modal */}
      {quickViewOpen && (
        <ProductQuickView
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
};
