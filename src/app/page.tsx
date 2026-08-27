import { HeroSection } from '@/components/HeroSection';
import { SloganTicker } from '@/components/SloganTicker';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { PromotionsSection } from '@/components/PromotionsSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { TestimonialsSection } from '@/components/TestimonialsSection';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Grande Section Hero avec mise en avant visuelle et badges */}
      <HeroSection />

      {/* 2. Bandeau Publicitaire Ticker Marquee avec les 4 slogans clés */}
      <SloganTicker />

      {/* 3. Présentation des Meilleures Ventes / Gâteaux Populaires avec onglets */}
      <FeaturedProducts />

      {/* 4. Section Promotions & Offres Spéciales avec compte à rebours */}
      <PromotionsSection />

      {/* 5. Section "Pourquoi nous choisir ?" (4 Piliers artisanaux & qualité) */}
      <WhyChooseUs />

      {/* 6. Section Avis Clients vérifiés avec étoiles */}
      <TestimonialsSection />
    </div>
  );
}
