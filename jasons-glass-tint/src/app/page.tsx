// AI-EDITABLE: Homepage — main entry point for Jason's Glass Tint
// All sections are modular components in /src/components/

import Navigation        from '@/components/Navigation';
import HeroSection       from '@/components/HeroSection';
import TrustSection      from '@/components/TrustSection';
import ServicesSection   from '@/components/ServicesSection';
import AboutSection      from '@/components/AboutSection';
import GallerySection    from '@/components/GallerySection';
import FilmBenefitsSection from '@/components/FilmBenefitsSection';
import ReviewsSection    from '@/components/ReviewsSection';
import ProcessSection    from '@/components/ProcessSection';
import ServiceAreaSection from '@/components/ServiceAreaSection';
import CTASection        from '@/components/CTASection';
import Footer            from '@/components/Footer';
import FloatingCTA       from '@/components/FloatingCTA';
import { loadGallery }   from '@/lib/galleryStorage';

// Gallery photos are fetched on the server (refreshed hourly) so they are in
// the HTML Google reads instead of appearing only after JavaScript runs.
export const revalidate = 3600;

export default async function HomePage() {
  const gallery = await loadGallery().catch(() => []);
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <TrustSection />
        <ServicesSection />
        <AboutSection />
        <GallerySection initialItems={gallery} />
        <FilmBenefitsSection />
        <ReviewsSection />
        <ProcessSection />
        <ServiceAreaSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
