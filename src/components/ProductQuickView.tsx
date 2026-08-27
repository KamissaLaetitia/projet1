'use client';

import React, { useState } from 'react';
import { X, Star, Users, Check, ShoppingBag, Sparkles, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addItem } = useCartStore();
  const [imgError, setImgError] = useState(false);
  const [selectedPortions, setSelectedPortions] = useState<number>(
    product.defaultPortions || (product.portions && product.portions[0]) || 8
  );
  const [customMessage, setCustomMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [includeCandles, setIncludeCandles] = useState(false);
  const [candleNumber, setCandleNumber] = useState<number | undefined>(undefined);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate dynamic price based on portions
  let unitPrice = product.discountPrice || product.price;
  if (product.portions && product.portions.length > 1 && product.pricePerPortion) {
    unitPrice = product.pricePerPortion * selectedPortions;
  }
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, {
      portions: selectedPortions,
      customMessage: customMessage.trim(),
      quantity,
      includeCandles,
      candleNumber,
    });
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white border border-caffeine-cardBorder rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] animate-slide-up flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/90 border border-caffeine-cardBorder text-caffeine-cream hover:text-caffeine-gold hover:bg-white transition-colors shadow-sm"
          aria-label="Fermer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          
          {/* Left Column: Product Image & Highlights */}
          <div className="relative bg-caffeine-surface aspect-[4/3] sm:aspect-square md:aspect-auto min-h-[200px] sm:min-h-[260px] md:min-h-full">
            {!imgError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={() => setImgError(true)}
                loading="eager"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col items-center justify-center gap-3">
                <span className="text-5xl sm:text-6xl">🎂</span>
                <span className="text-xs sm:text-sm font-semibold text-amber-700/70 text-center px-4 sm:px-6">{product.name}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 p-2.5 sm:p-3 rounded-xl glass-panel text-[11px] sm:text-xs text-caffeine-cream flex items-center justify-between shadow-md">
              <span className="flex items-center gap-1.5 text-caffeine-gold font-bold">
                <Clock className="w-3.5 h-3.5 shrink-0" /> Préparé en {product.preparationTimeHours}h
              </span>
              <span className="flex items-center gap-1.5 text-green-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> 100% Frais
              </span>
            </div>
          </div>

          {/* Right Column: Customization Options */}
          <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-caffeine-subtle mb-2">
                <span className="font-bold text-caffeine-gold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-caffeine-gold/10 border border-caffeine-gold/20">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1 text-caffeine-gold">
                  <Star className="w-3.5 h-3.5 fill-caffeine-gold shrink-0" />
                  <span className="font-bold text-caffeine-cream">{product.rating}</span>
                  <span className="text-caffeine-subtle text-[11px]">({product.reviewsCount} avis)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-display font-black text-lg sm:text-2xl text-caffeine-cream mb-1.5 sm:mb-2">
                {product.name}
              </h2>

              {/* Tagline */}
              <p className="text-xs text-caffeine-subtle leading-relaxed mb-4 sm:mb-6">
                {product.description}
              </p>

              {/* 1. Portions Selector */}
              {product.portions && product.portions.length > 1 && (
                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-caffeine-cream mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-caffeine-gold shrink-0" />
                    <span>Nombre de parts :</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                    {product.portions.map((portion) => (
                      <button
                        key={portion}
                        type="button"
                        onClick={() => setSelectedPortions(portion)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                          selectedPortions === portion
                            ? 'bg-caffeine-gold text-white border-caffeine-gold shadow-gold-sm'
                            : 'bg-caffeine-surface border-caffeine-cardBorder text-caffeine-cream hover:border-caffeine-gold/50 shadow-sm'
                        }`}
                      >
                        {portion} parts
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Custom Inscription on Cake */}
              <div className="mb-4 sm:mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-caffeine-cream mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-caffeine-gold shrink-0" />
                  <span>Message sur plaque chocolat (Offert) :</span>
                </label>
                <input
                  type="text"
                  maxLength={40}
                  placeholder="Ex : Joyeux Anniversaire Sarah ! (Optionnel)"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                />
                <span className="text-[10px] text-caffeine-muted block mt-1">
                  Écrit à la main au cornet de chocolat noir par nos chefs.
                </span>
              </div>

              {/* 3. Optional Candles & Quantity */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-caffeine-cream">Quantité :</span>
                  <div className="flex items-center border border-caffeine-cardBorder rounded-lg bg-caffeine-surface shadow-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-sm text-caffeine-subtle hover:text-caffeine-gold"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-caffeine-cream">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-sm text-caffeine-subtle hover:text-caffeine-gold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-caffeine-subtle block">
                    Total
                  </span>
                  <span className="text-lg sm:text-xl font-black text-caffeine-gold font-display">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleAddToCart}
              disabled={addedSuccess}
              className={`w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-gold-md ${
                addedSuccess
                  ? 'bg-green-500 text-white'
                  : 'btn-caffeine-primary'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ajouté au panier avec succès !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter au Panier • {formatPrice(totalPrice)}</span>
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
