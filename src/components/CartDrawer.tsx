'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getTotal,
    getItemsCount,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const itemsCount = getItemsCount();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({
      text: res.message,
      isError: !res.success,
    });
    if (res.success) setPromoInput('');
  };

  const freeDeliveryThreshold = 30000;
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-caffeine-cardBorder shadow-2xl flex flex-col justify-between animate-slide-up">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-caffeine-cardBorder flex items-center justify-between bg-caffeine-darker">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-caffeine-gold" />
              <h2 className="font-display font-bold text-lg text-caffeine-cream">
                Votre Panier Gourmand ({itemsCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-caffeine-subtle hover:text-caffeine-cream hover:bg-white transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3 bg-caffeine-surface border-b border-caffeine-cardBorder text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              {amountNeededForFreeDelivery > 0 ? (
                <span className="text-caffeine-cream">
                  Plus que <strong className="text-caffeine-gold">{formatPrice(amountNeededForFreeDelivery)}</strong> pour la livraison gratuite !
                </span>
              ) : (
                <span className="text-green-600 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-caffeine-gold" /> Félicitations ! Livraison gratuite activée.
                </span>
              )}
              <span className="text-caffeine-subtle">{Math.round(freeDeliveryProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-caffeine-cardBorder rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-caffeine-gold to-caffeine-goldHover transition-all duration-500 rounded-full"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-caffeine-surface border border-caffeine-cardBorder flex items-center justify-center text-caffeine-subtle mb-4 shadow-sm">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-lg text-caffeine-cream mb-1">
                  Votre panier est vide
                </h3>
                <p className="text-xs text-caffeine-subtle max-w-xs mb-6">
                  Découvrez nos créations gourmandes et ajoutez votre premier gâteau d&apos;exception.
                </p>
                <Link
                  href="/catalogue"
                  onClick={closeCart}
                  className="btn-caffeine-primary text-xs !py-2.5 !px-6"
                >
                  Découvrir les Gâteaux
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder/80 flex gap-3.5 relative group shadow-sm"
                >
                  {/* Item Image */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover object-center flex-shrink-0 bg-white border border-caffeine-cardBorder/60 shadow-sm"
                  />

                  {/* Item Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-caffeine-cream line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-caffeine-muted hover:text-red-500 p-0.5 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-caffeine-subtle mt-0.5">
                        <span>{item.selectedPortions} parts</span>
                        {item.customMessage && (
                          <span className="block text-caffeine-gold italic truncate mt-0.5 font-medium">
                            &quot;{item.customMessage}&quot;
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-caffeine-cardBorder/50">
                      <div className="flex items-center border border-caffeine-cardBorder rounded-lg bg-white shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-caffeine-subtle hover:text-caffeine-gold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-caffeine-cream">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-caffeine-subtle hover:text-caffeine-gold"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-display font-bold text-sm text-caffeine-gold">
                        {formatPrice(item.itemPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-caffeine-cardBorder bg-caffeine-darker space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code promo (ex: BIENVENUE20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-caffeine-cardBorder text-xs text-caffeine-cream placeholder:text-caffeine-muted uppercase focus:outline-none focus:border-caffeine-gold shadow-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-white border border-caffeine-gold/50 hover:bg-caffeine-gold hover:text-white text-caffeine-gold text-xs font-bold transition-all shadow-sm"
                  >
                    Appliquer
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[10px] flex items-center gap-1 ${promoMessage.isError ? 'text-red-500' : 'text-green-600'}`}>
                    {promoMessage.isError ? <AlertCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    {promoMessage.text}
                  </p>
                )}
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                    <span>Code <strong>{appliedPromo.code}</strong> (-{appliedPromo.discountPercent}%)</span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-[10px] text-caffeine-subtle hover:text-red-500 underline ml-2"
                    >
                      Retirer
                    </button>
                  </div>
                )}
              </form>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-caffeine-subtle">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Réduction code promo</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-caffeine-subtle">
                  <span>Livraison réfrigérée</span>
                  <span>{deliveryFee === 0 ? <strong className="text-green-600">Gratuite</strong> : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-caffeine-cream pt-2 border-t border-caffeine-cardBorder font-display">
                  <span>Total TTC</span>
                  <span className="text-caffeine-gold text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/panier"
                onClick={closeCart}
                className="btn-caffeine-primary w-full text-center text-sm !py-3.5 flex items-center justify-center gap-2 shadow-gold-md"
              >
                <span>Passer la Commande</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
