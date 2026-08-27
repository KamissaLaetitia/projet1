'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle, Phone, Sparkles, MapPin } from 'lucide-react';
import { localStore } from '@/lib/supabase';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

const STATUS_STEPS: { key: OrderStatus; label: string; description: string; icon: any }[] = [
  { key: 'confirmed', label: 'Commande Confirmée', description: 'Reçue et validée par notre chef pâtissier', icon: CheckCircle2 },
  { key: 'preparing', label: 'En Préparation au Laboratoire', description: 'Confection artisanale, pochage et glaçage', icon: Clock },
  { key: 'in_delivery', label: 'En Cours de Livraison', description: 'En route dans notre camionnette réfrigérée', icon: Truck },
  { key: 'delivered', label: 'Gâteau Livré', description: 'Remis en main propre ou retiré en boutique', icon: Package },
];

function SuiviCommandeContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('numero') || '';

  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialOrderNumber) {
      handleSearchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearchOrder = (query: string) => {
    const clean = query.trim().toUpperCase();
    if (!clean) return;
    const found = localStore.getOrderByNumber(clean);
    setSearchedOrder(found);
    setHasSearched(true);
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'pending' || status === 'confirmed') return 0;
    if (status === 'preparing') return 1;
    if (status === 'in_delivery') return 2;
    if (status === 'delivered') return 3;
    return -1;
  };

  const currentStepIdx = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <div className="bg-caffeine-dark min-h-screen pb-24">
      
      {/* Top Banner */}
      <div className="bg-caffeine-darker border-b border-caffeine-cardBorder py-8 sm:py-12 px-4 text-center relative">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caffeine-gold/10 border border-caffeine-gold/30 text-caffeine-gold text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>Suivi Logistique & Laboratoire</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-caffeine-cream">
            Suivi de Votre <span className="gold-gradient-text">Commande en Direct</span>
          </h1>
          <p className="text-caffeine-subtle text-xs sm:text-sm mt-2 sm:mt-3 max-w-md mx-auto">
            Entrez votre numéro de commande pour connaître l&apos;état exact de confection et de livraison.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* Search Order Form */}
        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] mb-8 sm:mb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchOrder(orderQuery);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-caffeine-subtle absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Exemple : CMD-8492 ou CMD-7319"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder text-sm text-caffeine-cream placeholder:text-caffeine-muted uppercase font-mono font-bold focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-caffeine-primary text-sm !py-3.5 !px-8 flex items-center justify-center gap-2 shadow-gold-sm"
            >
              <span>Vérifier le Statut</span>
              <Truck className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Links */}
          <div className="mt-4 text-xs text-caffeine-subtle flex flex-wrap items-center gap-2 font-medium">
            <span>Exemples de commandes récentes :</span>
            <button
              type="button"
              onClick={() => {
                setOrderQuery('CMD-8492');
                handleSearchOrder('CMD-8492');
              }}
              className="text-caffeine-gold hover:underline font-mono font-bold"
            >
              CMD-8492
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setOrderQuery('CMD-7319');
                handleSearchOrder('CMD-7319');
              }}
              className="text-caffeine-gold hover:underline font-mono font-bold"
            >
              CMD-7319
            </button>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && !searchedOrder && (
          <div className="p-10 rounded-3xl bg-white border border-red-200 text-center space-y-3 shadow-md">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h2 className="font-display font-bold text-lg text-caffeine-cream">
              Aucune commande trouvée pour le numéro &quot;{orderQuery}&quot;
            </h2>
            <p className="text-xs text-caffeine-subtle max-w-md mx-auto">
              Vérifiez l&apos;orthographe de votre numéro de commande dans votre email de confirmation ou contactez notre laboratoire.
            </p>
          </div>
        )}

        {searchedOrder && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Live Status Timeline Card */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white border border-caffeine-gold/40 shadow-[0_16px_50px_rgba(180,130,80,0.12)] space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-caffeine-cardBorder">
                <div>
                  <span className="text-[10px] uppercase font-bold text-caffeine-gold tracking-widest block">
                    Commande Client
                  </span>
                  <h2 className="font-display font-black text-2xl text-caffeine-cream flex items-center gap-3">
                    <span>{searchedOrder.orderNumber}</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-caffeine-gold/15 text-caffeine-gold border border-caffeine-gold/30">
                      {searchedOrder.status.toUpperCase()}
                    </span>
                  </h2>
                </div>

                <div className="text-left sm:text-right text-xs text-caffeine-subtle font-medium">
                  <span>Destinataire : <strong className="text-caffeine-cream font-bold">{searchedOrder.customerName}</strong></span>
                  <span className="block mt-0.5">Livraison prévue le : <strong className="text-caffeine-gold font-bold">{searchedOrder.deliveryDate} ({searchedOrder.deliveryTimeSlot})</strong></span>
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {STATUS_STEPS.map((s, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const Icon = s.icon;

                  return (
                    <div
                      key={s.key}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-sm ${
                        isCurrent
                          ? 'bg-caffeine-gold/10 border-caffeine-gold shadow-gold-sm'
                          : isCompleted
                          ? 'bg-caffeine-surface border-green-500/30'
                          : 'bg-caffeine-surface/40 border-caffeine-cardBorder opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isCompleted ? 'bg-caffeine-gold text-white font-black shadow-sm' : 'bg-white border border-caffeine-cardBorder text-caffeine-subtle'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {isCompleted && <span className="text-green-600 text-xs font-bold">✓</span>}
                      </div>

                      <div>
                        <h3 className={`font-bold text-xs ${isCurrent ? 'text-caffeine-gold' : 'text-caffeine-cream'}`}>
                          {s.label}
                        </h3>
                        <p className="text-[11px] text-caffeine-subtle mt-1 leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ordered Items Summary */}
              <div className="pt-6 border-t border-caffeine-cardBorder space-y-4">
                <h3 className="font-display font-bold text-base text-caffeine-cream">
                  Gâteaux en Confection :
                </h3>

                <div className="space-y-3">
                  {searchedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder flex items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-14 h-14 rounded-xl object-cover bg-white border border-caffeine-cardBorder/60 shadow-sm"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-caffeine-cream">{item.productName}</h4>
                          <span className="text-[11px] text-caffeine-subtle block font-medium">Quantité : {item.quantity} ({item.portions} parts)</span>
                          {item.customMessage && (
                            <span className="text-[11px] text-caffeine-gold italic block font-medium">
                              &ldquo;{item.customMessage}&rdquo;
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-display font-bold text-sm text-caffeine-gold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assistance Callout */}
              <div className="p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-caffeine-subtle shadow-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-caffeine-gold" />
                  <span>Une question sur votre livraison ? Service client au <strong>01 42 68 90 00</strong></span>
                </div>
                <Link href="/contact" className="text-caffeine-gold hover:underline font-bold">
                  Contacter le laboratoire →
                </Link>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function SuiviCommandePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-caffeine-gold">Chargement du suivi de commande...</div>}>
      <SuiviCommandeContent />
    </Suspense>
  );
}
