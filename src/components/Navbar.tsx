'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Sparkles, Search } from 'lucide-react';
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
      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 w-full max-w-full ${
          isScrolled
            ? 'glass-nav shadow-md shadow-black/5'
            : 'bg-white border-b border-caffeine-cardBorder shadow-sm shadow-black/[0.03]'
        }`}
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-caffeine-gold to-caffeine-goldHover flex items-center justify-center shadow-gold-sm group-hover:scale-105 transition-transform shadow-md shrink-0">
              <Sparkles className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
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
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
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
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-caffeine-gold group-hover:scale-110 transition-transform" />
              {itemsCount > 0 && (
                <>
                  <span className="hidden sm:inline-block text-xs font-bold text-caffeine-cream pr-1">
                    {formatPrice(subtotal)}
                  </span>
                  <span className="absolute -top-1 -right-1 bg-caffeine-gold text-white font-black text-[10px] sm:text-[11px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-fade-in">
                    {itemsCount}
                  </span>
                </>
              )}
            </button>

            {/* Direct CTA button on Desktop ONLY */}
            <Link
              href="/catalogue"
              className="btn-caffeine-primary text-xs xl:text-sm !py-2 !px-5 hidden lg:inline-flex shrink-0"
            >
              Commander
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              id="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              className="flex lg:hidden items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-caffeine-surface hover:bg-caffeine-gold/10 border border-caffeine-cardBorder text-caffeine-cream hover:text-caffeine-gold shadow-sm active:scale-90 transition-all cursor-pointer shrink-0 select-none touch-manipulation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-caffeine-cream stroke-[2.2]" />
              ) : (
                <Menu className="w-5 h-5 text-caffeine-cream stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu (Directly Under the Navbar) */}
        <div
          id="mobile-nav-drawer"
          className={`lg:hidden w-full bg-white border-t border-caffeine-cardBorder shadow-2xl max-h-[80vh] overflow-y-auto overscroll-contain transition-all ${
            mobileMenuOpen ? 'block' : 'hidden'
          }`}
          style={{ backgroundColor: '#ffffff' }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          <div className="p-4 space-y-2.5" style={{ backgroundColor: '#ffffff' }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full min-h-[48px] flex items-center justify-between px-4 py-3.5 rounded-xl font-display font-bold text-sm transition-all border block shadow-xs ${
                    isActive
                      ? 'border-caffeine-gold text-caffeine-gold font-black'
                      : 'border-caffeine-cardBorder text-caffeine-cream active:bg-caffeine-gold/10'
                  }`}
                  style={{ backgroundColor: isActive ? '#faeed9' : '#fdf8f2' }}
                >
                  <span className="tracking-wide">{link.name}</span>
                  <span className="text-caffeine-gold font-black text-base">→</span>
                </Link>
              );
            })}

            {/* Action Button at Bottom of Dropdown */}
            <div className="pt-3 border-t border-caffeine-cardBorder" style={{ backgroundColor: '#ffffff' }}>
              <Link
                href="/catalogue"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-caffeine-primary w-full text-center !py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-gold-md block"
              >
                <span>Explorer le Catalogue de Gâteaux</span>
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
