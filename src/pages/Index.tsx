import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { HeroSection } from '@/components/HeroSection';
import { MarqueeTicker } from '@/components/MarqueeTicker';
import { JourneySection } from '@/components/JourneySection';
import { PullQuote } from '@/components/PullQuote';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { StagesSection } from '@/components/StagesSection';
import { PhotoGallery } from '@/components/PhotoGallery';
import { BookSection } from '@/components/BookSection';
import { EventsSection } from '@/components/EventsSection';
import { SupportSection } from '@/components/SupportSection';
import { PartnersSection } from '@/components/PartnersSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Footer } from '@/components/Footer';
import { LoadingScreen } from '@/components/LoadingScreen';
import { FullBleedImage } from '@/components/editorial/FullBleedImage';
import coastalPath from '@/assets/coastal-path.jpg';
import sailboatSea from '@/assets/sailboat-sea.jpg';

/**
 * Homepage — structured like the opening of the book:
 * 
 * 1. Full-viewport hero (plate)
 * 2. Quiet data strip
 * 3. Introduction + route map
 * 4. Pull quote (pause)
 * 5. How it works
 * 6. Full-bleed image (visual breath)
 * 7. Stages
 * 8. Photo gallery (horizontal)
 * 9. Books (full-bleed + text)
 * 10. Pull quote (pause)
 * 11. Side routes
 * 12. Support + Partners
 * 13. Newsletter
 * 14. Footer (colophon)
 */
const Index = () => {
  const isFirstVisit = !sessionStorage.getItem('ftc_visited');
  const [isLoading, setIsLoading] = useState(isFirstVisit);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('ftc_visited', '1');
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <SEO path="/" />
      <main className="overflow-x-hidden">
        <Navigation />

        {/* Chapter 1: Opening */}
        <HeroSection />
        <MarqueeTicker />

        {/* Chapter 2: The Story */}
        <JourneySection />
        <PullQuote text="Sea on the right. Always south. 100 km at a time." />

        {/* Chapter 3: Participation */}
        <HowItWorksSection />
        <FullBleedImage
          src={coastalPath}
          alt="Coastal path winding along the shore"
          aspectRatio="21 / 9"
        />

        {/* Chapter 4: Stages */}
        <StagesSection />

        {/* Chapter 5: Photography */}
        <PhotoGallery />

        {/* Chapter 6: The Books */}
        <BookSection />
        <PullQuote text="Salty breeze. The sound of your own footsteps." variant="light" />

        {/* Chapter 7: Side Routes */}
        <EventsSection />

        {/* Chapter 8: Support */}
        <FullBleedImage
          src={sailboatSea}
          alt="Sailboat on the open sea"
          aspectRatio="21 / 9"
        />
        <SupportSection />
        <PartnersSection />

        {/* Chapter 9: Stay Connected */}
        <NewsletterSection />

        {/* Colophon */}
        <Footer />
      </main>
    </>
  );
};

export default Index;
