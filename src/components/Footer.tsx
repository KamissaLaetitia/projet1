'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock, Send, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  return (
    <footer className="bg-caffeine-darker border-t border-caffeine-cardBorder pt-12 sm:pt-16 pb-8 sm:pb-10 text-caffeine-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Slogan Callout (Style Caffeine X) */}
        <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-white border border-caffeine-gold/35 shadow-[0_12px_40px_rgba(180,130,80,0.1)] mb-10 sm:mb-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs uppercase font-bold text-caffeine-gold tracking-widest block mb-2">
              Le Club Privilège Gourmand
            </span>
            <h2 className="font-display font-black text-xl sm:text-3xl text-caffeine-cream">
              Recevez nos créations éphémères & -15% sur votre première commande
            </h2>
            <p className="text-xs sm:text-sm text-caffeine-subtle mt-2">
              Une seule lettre d&apos;information par mois. Pas de spam, uniquement de la haute pâtisserie.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              placeholder="Votre adresse email..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 sm:py-3.5 rounded-full bg-caffeine-surface border border-caffeine-cardBorder text-xs text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all"
            />
            <button
              type="submit"
              className="btn-caffeine-primary text-xs !py-3 sm:!py-3.5 !px-6 flex items-center justify-center gap-2 whitespace-nowrap shadow-sm hover:shadow-md"
            >
              <span>{subscribed ? 'Inscrit avec succès !' : 'S\'inscrire'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Multi-Column Main Footer Links (Caffeine X Structure) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-14">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-caffeine-gold to-caffeine-goldHover flex items-center justify-center shadow-gold-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg tracking-wider text-caffeine-cream flex items-center gap-1">
                  PÂTISSERIE <span className="text-caffeine-gold">ROYALE</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-caffeine-subtle font-semibold">
                  Haute Gourmandise
                </span>
              </div>
            </Link>

            <p className="text-xs text-caffeine-subtle leading-relaxed max-w-sm">
              Maison artisanale dédiée à l&apos;art du gâteau d&apos;exception. Pièces montées, entremets haute couture, cupcakes et réalisations sur-mesure pour tous vos événements de prestige.
            </p>

            <div className="pt-2 text-xs text-caffeine-subtle space-y-2">
              <div className="flex items-center gap-2 text-caffeine-cream">
                <Phone className="w-4 h-4 text-caffeine-gold" />
                <span>01 42 68 90 00 (Service Client 7j/7)</span>
              </div>
              <div className="flex items-center gap-2 text-caffeine-cream">
                <Mail className="w-4 h-4 text-caffeine-gold" />
                <span>contact@patisserie-royale.fr</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation & Menu */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-caffeine-gold mb-4">
              Catalogue
            </h3>
            <ul className="space-y-2.5 text-xs text-caffeine-subtle">
              <li>
                <Link href="/catalogue?category=anniversaire" className="hover:text-caffeine-gold transition-colors">
                  Gâteaux d&apos;Anniversaire
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=mariage" className="hover:text-caffeine-gold transition-colors">
                  Pièces Montées de Mariage
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=cupcakes" className="hover:text-caffeine-gold transition-colors">
                  Cupcakes & Mignardises
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=personnalises" className="hover:text-caffeine-gold transition-colors">
                  Gâteaux Personnalisés
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=entremets" className="hover:text-caffeine-gold transition-colors">
                  Tartes & Entremets
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=coffrets" className="hover:text-caffeine-gold transition-colors">
                  Coffrets Dégustation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services & Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-caffeine-gold mb-4">
              Services & Suivi
            </h3>
            <ul className="space-y-2.5 text-xs text-caffeine-subtle">
              <li>
                <Link href="/sur-mesure" className="hover:text-caffeine-gold transition-colors">
                  Demande de Gâteau Sur-Mesure
                </Link>
              </li>
              <li>
                <Link href="/suivi-commande" className="hover:text-caffeine-gold transition-colors">
                  Suivi de Commande en Direct
                </Link>
              </li>
              <li>
                <Link href="/#pourquoi-nous" className="hover:text-caffeine-gold transition-colors">
                  Nos Engagements Qualité & Bio
                </Link>
              </li>
              <li>
                <Link href="/#avis" className="hover:text-caffeine-gold transition-colors">
                  Avis Clients Vérifiés
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-caffeine-gold transition-colors">
                  Nous Contacter & Laboratoires
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-caffeine-gold/80 hover:text-caffeine-gold transition-colors font-medium">
                  Espace Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Laboratoires & Horaires (Caffeine X location style) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-caffeine-gold mb-4">
              Nos Laboratoires
            </h3>
            <div className="space-y-3 text-xs text-caffeine-subtle">
              <div>
                <strong className="text-caffeine-cream block font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-caffeine-gold" /> Paris - Le Marais
                </strong>
                <span>28 Rue des Rosiers, 75004 Paris</span>
              </div>
              <div>
                <strong className="text-caffeine-cream block font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-caffeine-gold" /> Lyon - Presqu&apos;île
                </strong>
                <span>12 Rue Mercière, 69002 Lyon</span>
              </div>
              <div className="pt-2 border-t border-caffeine-cardBorder flex items-center gap-1.5 text-caffeine-cream">
                <Clock className="w-3.5 h-3.5 text-caffeine-gold" />
                <span>Ouvert 7j/7 de 8h30 à 19h30</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-caffeine-cardBorder/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-caffeine-muted text-center sm:text-left">
          <p>© 2026 Pâtisserie Royale. Tous droits réservés. Inspiré du modèle Caffeine X.</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-caffeine-subtle transition-colors">
              Mentions Légales
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-caffeine-subtle transition-colors">
              Politique de Confidentialité
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-caffeine-subtle transition-colors">
              Conditions Générales de Vente
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
