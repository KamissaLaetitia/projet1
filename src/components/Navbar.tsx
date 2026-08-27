'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Sparkles, Search, Clock, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleCart, getItemsCount, getSubtotal } = useCartStore();

  const [itemsCount, setItemsCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Avoid hydration mismatch for persisted store values
  useEffect(() => {
    setItemsCount(getItemsCount());
    setSubtotal(getSubtotal());
  }, [getItemsCount, getSubtotal]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'Offres & Promos', href: '/#promotions' },
    { name: 'Pourquoi Nous', href: '/#pourquoi-nous' },
    { name: 'Avis Clients', href: '/#avis' },
    { name: 'Sur-Mesure', href: '/sur-mesure' },
    { name: 'Suivi Commande', href: '/suivi-commande' },
  ];

  // Lock body scroll when mobile menu is open on iOS / Android
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-caffeine-darker border-b border-caffeine-cardBorder py-1.5 px-3 sm:px-4 text-[11px] sm:text-xs text-caffeine-cream w-full max-w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="px-2 py-0.5 rounded-full bg-caffeine-gold/20 text-caffeine-gold font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wide shrink-0">
              OFFRE SPÉCIALE
            </span>
            <span className="text-caffeine-cream font-medium text-[11px] sm:text-xs truncate">
              Livraison offerte dès 30 000 FCFA avec le code <strong className="text-caffeine-gold font-bold">GOURMAND20</strong> (-20%)
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-caffeine-subtle text-xs shrink-0">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-caffeine-gold" />
              Commandes expédiées fraîches 7j/7
            </span>
            <span className="text-caffeine-cardBorder">|</span>
            <Link href="/admin" className="flex items-center gap-1.5 hover:text-caffeine-gold transition-colors font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-caffeine-gold" />
              Espace Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full max-w-full ${
          isScrolled
            ? 'glass-nav py-2.5 sm:py-3 shadow-md shadow-black/5'
            : 'bg-white/95 backdrop-blur-md border-b border-caffeine-cardBorder py-3 sm:py-4 shadow-sm shadow-black/[0.03]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-caffeine-gold to-caffeine-goldHover flex items-center justify-center shadow-gold-sm group-hover:scale-105 transition-transform shadow-md shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-sm xs:text-base sm:text-lg tracking-wider text-caffeine-cream flex items-center gap-1">
                PÂTISSERIE <span className="text-caffeine-gold">ROYALE</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-caffeine-subtle -mt-0.5 sm:-mt-1 font-semibold">
                Haute Gourmandise
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center lg:gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all ${
                    isActive
                      ? 'text-caffeine-gold bg-caffeine-surface border border-caffeine-gold/30 font-bold shadow-sm'
                      : 'text-caffeine-cream/80 hover:text-caffeine-gold hover:bg-caffeine-surface'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Search Link */}
            <Link
              href="/catalogue"
              aria-label="Rechercher des gâteaux"
              className="p-2 sm:p-2.5 rounded-full text-caffeine-subtle hover:text-caffeine-gold hover:bg-caffeine-surface border border-transparent hover:border-caffeine-cardBorder hover:shadow-sm transition-all hidden sm:flex"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Cart Button with Live Counter */}
            <button
              onClick={toggleCart}
              aria-label="Ouvrir le panier"
              className="relative p-2 sm:p-2.5 rounded-full bg-white border border-caffeine-cardBorder hover:border-caffeine-gold/60 text-caffeine-cream hover:text-caffeine-gold transition-all duration-200 group flex items-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-caffeine-gold group-hover:scale-110 transition-transform" />
              {itemsCount > 0 && (
                <>
                  <span className="hidden sm:inline-block text-xs font-bold text-caffeine-cream pr-1">
                    {formatPrice(subtotal)}
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 bg-caffeine-gold text-white font-black text-[10px] sm:text-[11px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-fade-in">
                    {itemsCount}
                  </span>
                </>
              )}
            </button>

            {/* Direct CTA button */}
            <Link
              href="/catalogue"
              className="btn-caffeine-primary text-xs sm:text-sm !py-2 sm:!py-2.5 !px-4 sm:!px-5 hidden md:inline-flex"
            >
              Commander
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-caffeine-cream hover:text-caffeine-gold hover:bg-caffeine-surface border border-caffeine-cardBorder/60 transition-colors"
              aria-label={mobileMenuOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Bulletproof Mobile Drawer (Standalone Portal Fixed Container) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden fixed inset-0 z-50 flex flex-col justify-start"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          {/* Dimmed Blur Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-fade-in"
            aria-hidden="true"
          />

          {/* Sliding Content Container */}
          <div className="relative w-full bg-white border-b-2 border-caffeine-gold/40 shadow-2xl z-10 max-h-[90vh] overflow-y-auto overscroll-contain flex flex-col">
            
            {/* Drawer Header with Title & Close Button */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-caffeine-surface border-b border-caffeine-cardBorder">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-caffeine-gold to-caffeine-goldHover flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-display font-black text-sm text-caffeine-cream tracking-wide">
                  PÂTISSERIE <span className="text-caffeine-gold">ROYALE</span>
                </span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white border border-caffeine-cardBorder text-caffeine-cream hover:text-caffeine-gold shadow-sm"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links Stack (Vertical Space-Y to Guarantee 0 Overlap on All Devices) */}
            <div className="p-4 space-y-2.5 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-xl font-display font-medium text-sm transition-all border ${
                      isActive
                        ? 'bg-caffeine-gold/15 border-caffeine-gold text-caffeine-gold font-bold shadow-sm'
                        : 'bg-caffeine-surface border-caffeine-cardBorder text-caffeine-cream active:bg-caffeine-gold/10'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className="text-caffeine-gold font-bold text-base">→</span>
                  </Link>
                );
              })}

              {/* Action Buttons at Bottom of Drawer */}
              <div className="pt-3 border-t border-caffeine-cardBorder space-y-2">
                <Link
                  href="/catalogue"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-caffeine-primary w-full text-center !py-3 text-sm flex items-center justify-center gap-2 shadow-gold-sm"
                >
                  <span>Explorer le Catalogue</span>
                  <Sparkles className="w-4 h-4" />
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-caffeine-secondary w-full text-center !py-2.5 text-xs flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-caffeine-gold" />
                  <span>Espace Administration</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
