'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Phone, Mail, Clock, Send, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { contactFormSchema, ContactFormData } from '@/lib/validations';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="bg-caffeine-dark min-h-screen pb-24">
      
      {/* Top Banner */}
      <div className="bg-caffeine-darker border-b border-caffeine-cardBorder py-8 sm:py-14 px-4 text-center relative">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caffeine-gold/10 border border-caffeine-gold/30 text-caffeine-gold text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Service Client & Boutiques</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-caffeine-cream">
            Contactez Notre <span className="gold-gradient-text">Maison de Pâtisserie</span>
          </h1>
          <p className="text-caffeine-subtle text-xs sm:text-base mt-2 sm:mt-3 max-w-lg mx-auto">
            Une question sur un gâteau, un ingrédient ou une livraison spéciale ? Notre équipe vous répond avec attention.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
          
          {/* Left Column: Contact Info & Locations (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Box */}
            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] space-y-6">
              <h2 className="font-display font-black text-xl text-caffeine-cream">
                Nos Coordonnées
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-caffeine-subtle font-medium">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder flex items-center justify-center text-caffeine-gold flex-shrink-0 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-caffeine-cream block font-bold">Téléphone</strong>
                    <span>01 42 68 90 00 (7j/7 de 8h à 20h)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder flex items-center justify-center text-caffeine-gold flex-shrink-0 shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-caffeine-cream block font-bold">Email</strong>
                    <span>contact@patisserie-royale.fr</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder flex items-center justify-center text-caffeine-gold flex-shrink-0 shadow-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-caffeine-cream block font-bold">Horaires d&apos;Ouverture</strong>
                    <span>Du Lundi au Dimanche : 08h30 – 19h30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Locations Cards */}
            <div className="p-8 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] space-y-5">
              <h3 className="font-display font-bold text-lg text-caffeine-cream">
                Nos Laboratoires & Boutiques
              </h3>

              <div className="p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder space-y-1 text-xs shadow-sm">
                <span className="font-bold text-caffeine-gold block">Paris - Le Marais</span>
                <p className="text-caffeine-cream font-medium">28 Rue des Rosiers, 75004 Paris</p>
                <span className="text-caffeine-subtle block">Retrait Click & Collect et dégustations sur RDV</span>
              </div>

              <div className="p-4 rounded-2xl bg-caffeine-surface border border-caffeine-cardBorder space-y-1 text-xs shadow-sm">
                <span className="font-bold text-caffeine-gold block">Lyon - Presqu&apos;île</span>
                <p className="text-caffeine-cream font-medium">12 Rue Mercière, 69002 Lyon</p>
                <span className="text-caffeine-subtle block">Laboratoire de création et retrait de commandes</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-caffeine-cardBorder shadow-[0_8px_30px_rgba(180,130,80,0.08)] space-y-6">
            <h2 className="font-display font-black text-2xl text-caffeine-cream">
              Envoyez-nous un Message
            </h2>

            {sent && (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Votre message a été transmis à notre équipe ! Nous vous répondrons très rapidement.</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                    Votre nom *
                  </label>
                  <input
                    {...register('name')}
                    placeholder="Ex : Jean Dupont"
                    className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                  />
                  {errors.name && <span className="text-[10px] text-red-500 mt-1">{errors.name.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                    Votre email *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="Ex : jean.dupont@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                  />
                  {errors.email && <span className="text-[10px] text-red-500 mt-1">{errors.email.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                  Téléphone (Optionnel)
                </label>
                <input
                  {...register('phone')}
                  placeholder="Ex : 06 12 34 56 78"
                  className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                  Objet de votre demande *
                </label>
                <input
                  {...register('subject')}
                  placeholder="Ex : Question sur la livraison du 30 août"
                  className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                />
                {errors.subject && <span className="text-[10px] text-red-500 mt-1">{errors.subject.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                  Votre message *
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  placeholder="Écrivez votre message ici..."
                  className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
                />
                {errors.message && <span className="text-[10px] text-red-500 mt-1">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-caffeine-primary w-full text-sm !py-3.5 shadow-gold-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le Message</span>
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
