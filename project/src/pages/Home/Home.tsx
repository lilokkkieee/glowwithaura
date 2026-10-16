import Hero from '@/components/Hero/Hero';
import FeatureStrip from '@/components/FeatureStrip/FeatureStrip';
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel';
import OccasionCards from '@/components/OccasionCards/OccasionCards';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import AboutSection from '@/components/AboutSection/AboutSection';
import GallerySection from '@/components/GallerySection/GallerySection';
import CustomCTA from '@/components/CustomCTA/CustomCTA';
import FAQ from '@/components/FAQ/FAQ';
import Testimonials from '@/components/Testimonials/Testimonials';
import { getBestSellers } from '@/data/products';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-forest-900">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Features */}
      <FeatureStrip />

      {/* 3. Best sellers / Signature collection */}
      <ProductCarousel
        eyebrow="Signature Collection"
        title="Our Bestsellers"
        subtitle="The signature scents our community keeps coming back for."
        products={getBestSellers()}
        dark={false}
        viewAllTo="/collections"
        viewAllLabel="View All Candles"
      />

      {/* 4. Custom candles — occasion cards (main focus) */}
      <OccasionCards />

      {/* 5. How it works */}
      <HowItWorks />

      {/* 6. About / Story */}
      <AboutSection />

      {/* 7. Gallery */}
      <GallerySection />

      {/* 8. Custom CTA */}
      <CustomCTA />

     {/* 9. Testimonials */}
      <Testimonials />

      {/* 10. FAQ */}
      <FAQ />
    </div>
  );
}
