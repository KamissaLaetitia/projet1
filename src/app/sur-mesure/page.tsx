'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Calendar, Users, Heart, CheckCircle2, ShieldCheck, Clock, Send } from 'lucide-react';
import { customCakeFormSchema, CustomCakeFormData } from '@/lib/validations';
import confetti from 'canvas-confetti';

export default function CustomCakePage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomCakeFormData>({
    resolver: zodResolver(customCakeFormSchema),
    defaultValues: {
      eventType: 'anniversaire',
      guestCount: 20,
      budgetRange: '150€ - 300€',
    },
  });

  const onSubmit = (data: CustomCakeFormData) => {
    // In production, save to Supabase custom_cake_requests table
    setSubmitted(true);
    reset();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#d69e3d', '#f5e7ce', '#ffffff'],
      });
    } catch {}
  };

  return (
    <div className="bg-caffeine-dark min-h-screen pb-24">
      
      {/* Top Banner */}
      <div className="bg-caffeine-darker border-b border-caffeine-cardBorder py-8 sm:py-14 px-4 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caffeine-gold/10 border border-caffeine-gold/30 text-caffeine-gold text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier de Haute Création</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-caffeine-cream">
            Votre Gâteau, Votre Occasion, <span className="gold-gradient-text">Votre Style.</span>
          </h1>
          <p className="text-caffeine-subtle text-xs sm:text-base mt-2 sm:mt-3 max-w-xl mx-auto">
            Pièces d&apos;art uniques pour mariages, anniversaires spectaculaires et événements d&apos;entreprise. Devis gratuit et réponse sous 2 heures.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        
        {submitted ? (
          <div className="p-6 sm:p-14 rounded-2xl sm:rounded-3xl bg-white border border-caffeine-gold/50 text-center space-y-6 shadow-[0_16px_40px_rgba(180,130,80,0.14)] animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-caffeine-gold/20 border border-caffeine-gold flex items-center justify-center mx-auto text-caffeine-gold shadow-gold-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-display font-black text-xl sm:text-3xl text-caffeine-cream">
              Demande de Devis Transmise avec Succès !
            </h2>
            <p className="text-xs sm:text-sm text-caffeine-subtle max-w-md mx-auto leading-relaxed">
              Notre chef pâtissier créatif étudie votre projet et vous recontactera par email ou téléphone dans les plus brefs délais avec une proposition détaillée.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-caffeine-primary text-xs !py-3 !px-8 shadow-gold-sm"
            >
              Faire une autre demande
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Form Column (8 cols) */}
            <div className="lg:col-span-8 p-4 sm:p-10 rounded-2xl sm:rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_10px_35px_rgba(180,130,80,0.08)] space-y-6">
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                      Votre nom & prénom *
                    </label>
                    <input
                      {...register('fullName')}
                      placeholder="Ex : Céline Duval"
                      className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                    />
                    {errors.fullName && <span className="text-[10px] text-red-500 mt-1">{errors.fullName.message}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                      Numéro de téléphone *
                    </label>
                    <input
                      {...register('phone')}
                      placeholder="Ex : 06 98 76 54 32"
                      className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 mt-1">{errors.phone.message}</span>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="Ex : celine.duval@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                    />
                    {errors.email && <span className="text-[10px] text-red-500 mt-1">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-caffeine-cardBorder">
                  <div>
                    <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                      Type d&apos;événement *
                    </label>
                    <select
                      {...register('eventType')}
                      className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                    >
                      <option value="anniversaire">Anniversaire / Fête privée</option>
                      <option value="mariage">Mariage / Fiançailles</option>
                      <option value="bapteme">Baptême / Communion / Baby Shower</option>
                      <option value="entreprise">Événement Entreprise / Gala</option>
                      <option value="autre">Autre célébration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                      Nombre d&apos;invités (parts) *
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="500"
                      {...register('guestCount')}
                      className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                      Date de l&apos;événement *
                    </label>
                    <input
                      type="date"
                      {...register('eventDate')}
                      className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                    />
                    {errors.eventDate && <span className="text-[10px] text-red-500 mt-1">{errors.eventDate.message}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                      Budget estimé
                    </label>
                    <select
                      {...register('budgetRange')}
                      className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                    >
                      <option value="50 000 - 100 000 FCFA">50 000 FCFA - 100 000 FCFA</option>
                      <option value="100 000 - 250 000 FCFA">100 000 FCFA - 250 000 FCFA</option>
                      <option value="250 000 - 500 000 FCFA">250 000 FCFA - 500 000 FCFA</option>
                      <option value="500 000 FCFA +">Plus de 500 000 FCFA (Prestige & Mariage)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                      Saveurs & Parfums souhaités *
                    </label>
                    <input
                      {...register('flavorPreference')}
                      placeholder="Ex : Chocolat praliné, Vanille fruits rouges, Pistache framboise..."
                      className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                      Description de votre projet (Thème, couleurs, inscription...) *
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      placeholder="Détaillez vos souhaits : thème floral, dorures, gâteau à étages, style moderne..."
                      className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                    />
                    {errors.description && <span className="text-[10px] text-red-500 mt-1">{errors.description.message}</span>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-caffeine-primary w-full text-sm !py-4 shadow-gold-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer ma Demande de Création Sur-Mesure</span>
                </button>

              </form>

            </div>

            {/* Sidebar Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-6 rounded-3xl bg-white border border-caffeine-gold/35 shadow-[0_6px_25px_rgba(180,130,80,0.08)] space-y-4">
                <span className="text-xs uppercase font-bold text-caffeine-gold tracking-wider block">
                  Notre Engagement
                </span>
                <h3 className="font-display font-black text-lg text-caffeine-cream">
                  Comment se déroule la création sur-mesure ?
                </h3>
                <ul className="space-y-3 text-xs text-caffeine-subtle">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-caffeine-gold text-white font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">1</span>
                    <span><strong>Étude & Devis :</strong> Réponse sous 2h avec croquis ou références.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-caffeine-gold text-white font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">2</span>
                    <span><strong>Dégustation :</strong> Échantillons de saveurs disponibles pour les grands mariages.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-caffeine-gold text-white font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">3</span>
                    <span><strong>Livraison Réfrigérée :</strong> Installation sur le lieu de réception le jour J.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_4px_16px_rgba(180,130,80,0.06)] space-y-2 text-xs text-caffeine-subtle">
                <div className="flex items-center gap-2 text-caffeine-cream font-bold">
                  <Clock className="w-4 h-4 text-caffeine-gold" />
                  <span>Délai recommandé</span>
                </div>
                <p>Commandez au moins 48h à l&apos;avance pour les gâteaux personnalisés et 2 semaines pour les pièces montées de mariage.</p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
