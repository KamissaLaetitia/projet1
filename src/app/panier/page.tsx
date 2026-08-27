'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { checkoutFormSchema, CheckoutFormData } from '@/lib/validations';
import { localStore } from '@/lib/supabase';
import { Order } from '@/lib/types';

export default function CartAndCheckoutPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getTotal,
    clearCart,
  } = useCartStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      deliveryMethod: 'livraison_express',
      paymentMethod: 'carte',
      deliveryTimeSlot: '14h00 - 16h00',
    },
  });

  const selectedDeliveryMethod = watch('deliveryMethod');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  const onSubmitOrder = async (data: CheckoutFormData) => {
    // Generate order number like CMD-9381
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CMD-${randomNum}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      deliveryCity: data.deliveryCity,
      deliveryPostalCode: data.deliveryPostalCode,
      deliveryDate: data.deliveryDate,
      deliveryTimeSlot: data.deliveryTimeSlot,
      deliveryMethod: data.deliveryMethod,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.imageUrl,
        quantity: i.quantity,
        unitPrice: i.itemPrice,
        portions: i.selectedPortions,
        customMessage: i.customMessage,
      })),
      subtotal,
      discountAmount: discount,
      promoCode: appliedPromo?.code,
      deliveryFee,
      totalAmount: total,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order locally and in Supabase
    localStore.addOrder(newOrder);
    setConfirmedOrder(newOrder);
    clearCart();
    setStep(3);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d69e3d', '#fce0a2', '#ffffff', '#ff9e2c'],
      });
    } catch {}
  };

  const copyOrderNumber = () => {
    if (confirmedOrder) {
      navigator.clipboard.writeText(confirmedOrder.orderNumber);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    }
  };

  // STEP 3: Order Confirmation
  if (step === 3 && confirmedOrder) {
    return (
      <div className="bg-caffeine-dark min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-white border border-caffeine-gold/45 rounded-3xl p-8 sm:p-12 shadow-[0_16px_50px_rgba(180,130,80,0.15)] animate-fade-in">
          
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-caffeine-gold to-caffeine-goldHover flex items-center justify-center mx-auto text-white shadow-gold-md animate-float">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold text-caffeine-gold tracking-widest block mb-2">
              Commande Enregistrée avec Succès !
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-caffeine-cream">
              Merci pour votre gourmandise, {confirmedOrder.customerName.split(' ')[0]} !
            </h1>
            <p className="text-sm text-caffeine-subtle mt-3 leading-relaxed">
              Un email de confirmation a été envoyé à <strong>{confirmedOrder.customerEmail}</strong>. Nos chefs pâtissiers préparent votre gâteau avec le plus grand soin.
            </p>
          </div>

          {/* Order Reference Box */}
          <div className="p-5 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder flex items-center justify-between shadow-sm">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-caffeine-subtle tracking-wider block">
                Numéro de Commande
              </span>
              <span className="font-mono font-black text-xl text-caffeine-gold">
                {confirmedOrder.orderNumber}
              </span>
            </div>
            <button
              onClick={copyOrderNumber}
              className="px-3.5 py-2 rounded-xl bg-white border border-caffeine-gold/40 hover:border-caffeine-gold text-caffeine-cream text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copiedNumber ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-caffeine-gold" />}
              <span>{copiedNumber ? 'Copié' : 'Copier'}</span>
            </button>
          </div>

          {/* Delivery Details Summary */}
          <div className="p-6 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder text-left space-y-3 text-xs text-caffeine-subtle shadow-sm">
            <div className="flex justify-between py-1 border-b border-caffeine-cardBorder/60">
              <span>Date de livraison / retrait :</span>
              <strong className="text-caffeine-cream font-bold">{confirmedOrder.deliveryDate} ({confirmedOrder.deliveryTimeSlot})</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-caffeine-cardBorder/60">
              <span>Adresse de destination :</span>
              <strong className="text-caffeine-cream font-bold">{confirmedOrder.deliveryAddress}, {confirmedOrder.deliveryCity}</strong>
            </div>
            <div className="flex justify-between py-1 text-sm font-bold text-caffeine-cream pt-2">
              <span>Montant total réglé :</span>
              <span className="text-caffeine-gold font-display font-black text-base">{formatPrice(confirmedOrder.totalAmount)}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href={`/suivi-commande?numero=${confirmedOrder.orderNumber}`}
              className="btn-caffeine-primary flex-1 text-center text-sm !py-3.5 flex items-center justify-center gap-2 shadow-gold-md"
            >
              <Truck className="w-4 h-4" />
              <span>Suivre ma commande en direct</span>
            </Link>
            <Link
              href="/catalogue"
              className="btn-caffeine-secondary flex-1 text-center text-sm !py-3.5"
            >
              Retour à la boutique
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // EMPTY CART
  if (items.length === 0 && step === 1) {
    return (
      <div className="bg-caffeine-dark min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-white border border-caffeine-cardBorder flex items-center justify-center text-caffeine-gold mb-6 shadow-[0_8px_30px_rgba(180,130,80,0.08)]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-display font-black text-3xl text-caffeine-cream mb-2">
          Votre Panier est Actuellement Vide
        </h1>
        <p className="text-sm text-caffeine-subtle max-w-md mb-8">
          Offrez-vous un moment de pur délice avec nos gâteaux d&apos;anniversaire, pièces montées et entremets créatifs.
        </p>
        <Link href="/catalogue" className="btn-caffeine-primary text-sm !py-3.5 !px-8 shadow-gold-md">
          Explorer le Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-caffeine-dark min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Step Progress Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-caffeine-cardBorder -translate-y-1/2 -z-0" />
            
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                  step >= 1 ? 'bg-caffeine-gold text-white shadow-gold-sm' : 'bg-white border border-caffeine-cardBorder text-caffeine-subtle'
                }`}
              >
                1
              </div>
              <span className="text-[11px] font-bold text-caffeine-cream uppercase tracking-wider">Panier</span>
            </div>

            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                  step >= 2 ? 'bg-caffeine-gold text-white shadow-gold-sm' : 'bg-white border border-caffeine-cardBorder text-caffeine-subtle'
                }`}
              >
                2
              </div>
              <span className="text-[11px] font-bold text-caffeine-cream uppercase tracking-wider">Livraison & Paiement</span>
            </div>

            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 3 ? 'bg-caffeine-gold text-white shadow-gold-sm' : 'bg-white border border-caffeine-cardBorder text-caffeine-subtle'
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-bold text-caffeine-cream uppercase tracking-wider">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form or Cart List (7/12 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {step === 1 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-caffeine-cardBorder">
                  <h2 className="font-display font-black text-xl sm:text-2xl text-caffeine-cream">
                    Articles dans votre panier ({items.length})
                  </h2>
                  <Link href="/catalogue" className="text-xs text-caffeine-gold hover:underline font-bold">
                    + Ajouter d&apos;autres gâteaux
                  </Link>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover bg-white border border-caffeine-cardBorder/60 flex-shrink-0 shadow-sm"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-caffeine-cream">{item.product.name}</h3>
                          <span className="text-xs text-caffeine-subtle block">{item.selectedPortions} parts</span>
                          {item.customMessage && (
                            <span className="text-xs text-caffeine-gold italic block mt-0.5 font-medium">
                              Plaque : &ldquo;{item.customMessage}&rdquo;
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center border border-caffeine-cardBorder rounded-lg bg-white shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-xs text-caffeine-subtle hover:text-caffeine-gold"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-caffeine-cream">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-xs text-caffeine-subtle hover:text-caffeine-gold"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-display font-black text-base text-caffeine-gold">
                          {formatPrice(item.itemPrice * item.quantity)}
                        </span>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-caffeine-muted hover:text-red-500 p-1 transition-colors"
                          title="Supprimer l'article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-caffeine-primary text-sm !py-3.5 !px-8 flex items-center gap-2 shadow-gold-md"
                  >
                    <span>Passer à la livraison</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Checkout Form */}
            {step === 2 && (
              <form onSubmit={handleSubmit(onSubmitOrder)} className="space-y-6">
                
                {/* 1. Coordonnées Client */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] space-y-4">
                  <h2 className="font-display font-black text-lg sm:text-xl text-caffeine-cream flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-caffeine-gold text-white flex items-center justify-center text-xs font-black shadow-sm">1</span>
                    <span>Vos Coordonnées</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                        Nom complet *
                      </label>
                      <input
                        {...register('customerName')}
                        placeholder="Ex : Sophie Martin"
                        className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                      />
                      {errors.customerName && <span className="text-[10px] text-red-500 mt-1">{errors.customerName.message}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                        Téléphone portable *
                      </label>
                      <input
                        {...register('customerPhone')}
                        placeholder="Ex : 06 12 34 56 78"
                        className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                      />
                      {errors.customerPhone && <span className="text-[10px] text-red-500 mt-1">{errors.customerPhone.message}</span>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                        Adresse email de confirmation *
                      </label>
                      <input
                        type="email"
                        {...register('customerEmail')}
                        placeholder="Ex : sophie.martin@gmail.com"
                        className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                      />
                      {errors.customerEmail && <span className="text-[10px] text-red-500 mt-1">{errors.customerEmail.message}</span>}
                    </div>
                  </div>
                </div>

                {/* 2. Mode & Adresse de Livraison */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] space-y-4">
                  <h2 className="font-display font-black text-lg sm:text-xl text-caffeine-cream flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-caffeine-gold text-white flex items-center justify-center text-xs font-black shadow-sm">2</span>
                    <span>Livraison ou Retrait en Laboratoire</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <label className="flex items-center gap-3 p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder cursor-pointer hover:border-caffeine-gold/50 shadow-sm transition-all">
                      <input
                        type="radio"
                        value="livraison_express"
                        {...register('deliveryMethod')}
                        className="accent-caffeine-gold"
                      />
                      <div>
                        <strong className="text-xs text-caffeine-cream block font-bold">Livraison Réfrigérée à Domicile</strong>
                        <span className="text-[10px] text-caffeine-subtle">Camionnette isotherme 4°C</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder cursor-pointer hover:border-caffeine-gold/50 shadow-sm transition-all">
                      <input
                        type="radio"
                        value="retrait_boutique"
                        {...register('deliveryMethod')}
                        className="accent-caffeine-gold"
                      />
                      <div>
                        <strong className="text-xs text-caffeine-cream block font-bold">Retrait en Boutique / Labo</strong>
                        <span className="text-[10px] text-caffeine-subtle">Paris Marais ou Lyon Presqu&apos;île (Gratuit)</span>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                        Adresse complète *
                      </label>
                      <input
                        {...register('deliveryAddress')}
                        placeholder="Numéro, rue, bâtiment, code d'accès..."
                        className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                      />
                      {errors.deliveryAddress && <span className="text-[10px] text-red-500 mt-1">{errors.deliveryAddress.message}</span>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                        Ville *
                      </label>
                      <input
                        {...register('deliveryCity')}
                        placeholder="Ex : Paris"
                        className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                      />
                      {errors.deliveryCity && <span className="text-[10px] text-red-500 mt-1">{errors.deliveryCity.message}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                        Code postal *
                      </label>
                      <input
                        {...register('deliveryPostalCode')}
                        placeholder="Ex : 75004"
                        className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                      />
                      {errors.deliveryPostalCode && <span className="text-[10px] text-red-500 mt-1">{errors.deliveryPostalCode.message}</span>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                        Date de livraison souhaitée *
                      </label>
                      <input
                        type="date"
                        {...register('deliveryDate')}
                        className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                      />
                      {errors.deliveryDate && <span className="text-[10px] text-red-500 mt-1">{errors.deliveryDate.message}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                        Créneau horaire *
                      </label>
                      <select
                        {...register('deliveryTimeSlot')}
                        className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                      >
                        <option value="09h00 - 12h00">Matin (09h00 - 12h00)</option>
                        <option value="14h00 - 16h00">Après-midi (14h00 - 16h00)</option>
                        <option value="16h00 - 19h00">Fin de journée (16h00 - 19h00)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                        Instructions particulières de livraison (Optionnel)
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={2}
                        placeholder="Interphone, étage, sonner chez..."
                        className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Moyen de Paiement */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] space-y-4">
                  <h2 className="font-display font-black text-lg sm:text-xl text-caffeine-cream flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-caffeine-gold text-white flex items-center justify-center text-xs font-black shadow-sm">3</span>
                    <span>Mode de Règlement Sécurisé</span>
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder cursor-pointer hover:border-caffeine-gold/50 shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="carte"
                          {...register('paymentMethod')}
                          className="accent-caffeine-gold"
                        />
                        <span className="text-xs font-bold text-caffeine-cream">Carte Bancaire (CB, Visa, Mastercard)</span>
                      </div>
                      <CreditCard className="w-5 h-5 text-caffeine-gold" />
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder cursor-pointer hover:border-caffeine-gold/50 shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="paypal"
                          {...register('paymentMethod')}
                          className="accent-caffeine-gold"
                        />
                        <span className="text-xs font-bold text-caffeine-cream">PayPal Express</span>
                      </div>
                      <span className="text-xs font-black text-blue-600">PayPal</span>
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder cursor-pointer hover:border-caffeine-gold/50 shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="livraison"
                          {...register('paymentMethod')}
                          className="accent-caffeine-gold"
                        />
                        <span className="text-xs font-bold text-caffeine-cream">Règlement à la livraison / au retrait</span>
                      </div>
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    </label>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-caffeine-secondary text-xs !py-3 !px-6 shadow-sm order-2 sm:order-1 text-center"
                  >
                    ← Modifier le Panier
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-caffeine-primary text-xs sm:text-sm !py-3.5 sm:!py-4 !px-6 sm:!px-10 shadow-gold-md flex items-center justify-center gap-2 order-1 sm:order-2 text-center"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Confirmer & Payer ({formatPrice(total)})</span>
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Right Summary Sidebar (5/12 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] space-y-6">
              <h2 className="font-display font-black text-lg text-caffeine-cream pb-4 border-b border-caffeine-cardBorder">
                Récapitulatif de Commande
              </h2>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code Promo (ex: BIENVENUE20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs text-caffeine-cream uppercase placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-white border border-caffeine-gold/50 hover:bg-caffeine-gold hover:text-white text-caffeine-gold text-xs font-bold transition-all shadow-sm"
                  >
                    Appliquer
                  </button>
                </div>
                {promoFeedback && (
                  <p className={`text-[10px] flex items-center gap-1 ${promoFeedback.isError ? 'text-red-500' : 'text-green-600'}`}>
                    {promoFeedback.isError ? <AlertCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    {promoFeedback.text}
                  </p>
                )}
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
                    <span>Code <strong>{appliedPromo.code}</strong> (-{appliedPromo.discountPercent}%)</span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-[10px] text-caffeine-subtle hover:text-red-500 underline"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </form>

              {/* Cost Lines */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-caffeine-subtle">
                  <span>Sous-total ({items.length} article(s))</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Remise promotionnelle</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-caffeine-subtle">
                  <span>Frais de livraison réfrigérée</span>
                  <span>{deliveryFee === 0 ? <strong className="text-green-600">Offerts dès 50€</strong> : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-caffeine-cream pt-3 border-t border-caffeine-cardBorder font-display">
                  <span>Total TTC</span>
                  <span className="text-caffeine-gold text-2xl">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder space-y-2 text-xs text-caffeine-subtle shadow-sm">
                <div className="flex items-center gap-2 text-caffeine-cream font-medium">
                  <ShieldCheck className="w-4 h-4 text-caffeine-gold" />
                  <span>Paiement 100% Sécurisé SSL 256 bits</span>
                </div>
                <div className="flex items-center gap-2 text-caffeine-cream font-medium">
                  <Clock className="w-4 h-4 text-caffeine-gold" />
                  <span>Garantie fraîcheur le jour de l&apos;événement</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
