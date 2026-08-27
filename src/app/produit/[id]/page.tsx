'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  Star,
  Users,
  Clock,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { REVIEWS } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/context/ProductsContext';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { products } = useProducts();

  const product = useMemo(() => {
    return products.find((p) => p.id === productId || p.slug === productId);
  }, [products, productId]);

  const [selectedPortions, setSelectedPortions] = useState<number>(
    product?.defaultPortions || 8
  );
  const [activeImage, setActiveImage] = useState<string>(
    product?.imageUrl || ''
  );
  const [customMessage, setCustomMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const { addItem } = useCartStore();

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-caffeine-dark">
        <h1 className="font-display font-bold text-2xl text-caffeine-cream mb-3">
          Gâteau introuvable
        </h1>
        <p className="text-caffeine-subtle text-sm mb-6">
          La création demandée n&apos;existe plus ou a été retirée du catalogue.
        </p>
        <Link href="/catalogue" className="btn-caffeine-primary text-xs !py-3 !px-6">
          Retour au Catalogue
        </Link>
      </div>
    );
  }

  // Calculate dynamic unit price
  let unitPrice = product.discountPrice || product.price;
  if (product.portions && product.portions.length > 1 && product.pricePerPortion) {
    unitPrice = product.pricePerPortion * selectedPortions;
  }
  const totalPrice = unitPrice * quantity;

  const allImages = [product.imageUrl, ...(product.additionalImages || [])];
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const handleAddToCart = () => {
    addItem(product, {
      portions: selectedPortions,
      customMessage: customMessage.trim(),
      quantity,
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="bg-caffeine-dark min-h-screen pb-24">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-xs font-semibold text-caffeine-subtle hover:text-caffeine-gold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au catalogue</span>
        </Link>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Image Gallery (5/12 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Featured Image */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-caffeine-cardBorder shadow-[0_16px_40px_rgba(180,130,80,0.14)] group">
              <img
                src={activeImage || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isPromotion && (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-red-500 text-white shadow-md">
                    Promo
                  </span>
                )}
                {product.isPopular && !product.isPromotion && (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-caffeine-gold text-white shadow-md">
                    Signature
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                      (activeImage || product.imageUrl) === img
                        ? 'border-caffeine-gold shadow-gold-sm scale-105'
                        : 'border-caffeine-cardBorder opacity-80 hover:opacity-100 shadow-sm'
                    }`}
                  >
                    <img src={img} alt={`${product.name} vue ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Guarantees Box */}
            <div className="p-6 rounded-2xl bg-white border border-caffeine-cardBorder grid grid-cols-2 gap-4 text-xs text-caffeine-subtle shadow-[0_4px_20px_rgba(180,130,80,0.06)]">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-caffeine-gold flex-shrink-0" />
                <div>
                  <strong className="text-caffeine-cream block font-bold">Livraison Réfrigérée</strong>
                  <span>Véhicule isotherme à 4°C</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-caffeine-gold flex-shrink-0" />
                <div>
                  <strong className="text-caffeine-cream block font-bold">Délai Fabrication</strong>
                  <span>{product.preparationTimeHours}h à l&apos;avance</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Customization & Purchase Options (6/12 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-caffeine-gold px-3 py-1 rounded-full bg-caffeine-gold/10 border border-caffeine-gold/20">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1.5 text-caffeine-gold">
                  <Star className="w-4 h-4 fill-caffeine-gold" />
                  <span className="font-black text-caffeine-cream text-sm">{product.rating}</span>
                  <span className="text-xs text-caffeine-subtle">({product.reviewsCount} avis vérifiés)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-display font-black text-3xl sm:text-4xl text-caffeine-cream mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Tagline */}
              <p className="text-sm sm:text-base text-caffeine-gold font-medium mb-4">
                {product.tagline}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-caffeine-subtle leading-relaxed mb-6 font-sans">
                {product.description}
              </p>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder flex items-center justify-between mb-6 shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-caffeine-subtle tracking-wider block">
                    Prix pour {selectedPortions} parts
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-black text-3xl text-caffeine-gold">
                      {formatPrice(unitPrice)}
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm text-caffeine-muted line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs text-caffeine-subtle font-medium">
                  Soit ≈ <strong className="text-caffeine-cream font-bold">{formatPrice(unitPrice / selectedPortions)}</strong> / part
                </span>
              </div>

              {/* 1. Portions Selector */}
              {product.portions && product.portions.length > 1 && (
                <div className="mb-5 sm:mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-caffeine-cream mb-2 sm:mb-2.5 flex items-center gap-2">
                    <Users className="w-4 h-4 text-caffeine-gold shrink-0" />
                    <span>Sélectionnez le format (Nombre de convives) :</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {product.portions.map((portion) => (
                      <button
                        key={portion}
                        type="button"
                        onClick={() => setSelectedPortions(portion)}
                        className={`py-2.5 sm:py-3 px-2 rounded-2xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center ${
                          selectedPortions === portion
                            ? 'bg-caffeine-gold text-white border-caffeine-gold shadow-gold-sm'
                            : 'bg-white border-caffeine-cardBorder text-caffeine-cream hover:border-caffeine-gold/50 shadow-sm'
                        }`}
                      >
                        <span className="font-black text-sm">{portion}</span>
                        <span className="text-[10px] opacity-80 uppercase">parts</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Custom Inscription on Cake */}
              <div className="mb-5 sm:mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-caffeine-cream mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-caffeine-gold shrink-0" />
                  <span>Personnalisation sur plaque chocolat (Offerte) :</span>
                </label>
                <input
                  type="text"
                  maxLength={45}
                  placeholder="Ex : Joyeux Anniversaire Lucas ! (Optionnel)"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                />
              </div>

              {/* 3. Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-caffeine-cardBorder">
                
                {/* Quantity adjuster */}
                <div className="flex items-center justify-between border border-caffeine-cardBorder rounded-2xl bg-caffeine-surface p-2 px-3 sm:w-36 shadow-sm">
                  <span className="text-xs font-bold text-caffeine-subtle sm:hidden">Quantité :</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-xl bg-white text-caffeine-cream hover:text-caffeine-gold flex items-center justify-center font-bold text-sm shadow-sm"
                    >
                      -
                    </button>
                    <span className="font-black text-sm text-caffeine-cream">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-xl bg-white text-caffeine-cream hover:text-caffeine-gold flex items-center justify-center font-bold text-sm shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 sm:gap-3 transition-all shadow-gold-md ${
                    addedSuccess
                      ? 'bg-green-500 text-white'
                      : 'btn-caffeine-primary'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-5 h-5 shrink-0" />
                      <span>Ajouté au panier !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 shrink-0" />
                      <span>Commander • {formatPrice(totalPrice)}</span>
                    </>
                  )}
                </button>

              </div>

            </div>

            {/* Ingredients & Allergens Box */}
            <div className="p-6 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_4px_20px_rgba(180,130,80,0.06)] space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-caffeine-gold mb-2">
                  Ingrédients d&apos;Exception :
                </h3>
                <p className="text-xs text-caffeine-subtle leading-relaxed">
                  {product.ingredients.join(', ')}.
                </p>
              </div>

              <div className="pt-3 border-t border-caffeine-cardBorder flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-caffeine-subtle">Allergènes :</span>
                {product.allergens.map((all, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-caffeine-surface border border-caffeine-cardBorder text-caffeine-cream shadow-sm"
                  >
                    {all}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Related Cakes Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-caffeine-cardBorder">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-caffeine-gold block mb-1">
                  Dans la même collection
                </span>
                <h2 className="font-display font-black text-2xl text-caffeine-cream">
                  Vous aimerez aussi nos créations
                </h2>
              </div>
              <Link href="/catalogue" className="text-xs text-caffeine-gold hover:underline font-bold">
                Voir tout →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
