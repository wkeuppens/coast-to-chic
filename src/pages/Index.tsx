import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { HeroSection } from '@/components/HeroSection';
import { JourneySection } from '@/components/JourneySection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { StagesSection } from '@/components/StagesSection';
import { BookSection } from '@/components/BookSection';
import { EventsSection } from '@/components/EventsSection';
import { PartnersSection } from '@/components/PartnersSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Footer } from '@/components/Footer';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MarqueeTicker } from '@/components/MarqueeTicker';
import { PhotoGallery } from '@/components/PhotoGallery';
import { PullQuote } from '@/components/PullQuote';
import { SupportSection } from '@/components/SupportSection';

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
        <HeroSection />
        <MarqueeTicker />
        <JourneySection />
        <PullQuote text="Sea on the right. Always south. 100 km at a time." />
        <HowItWorksSection />
        <StagesSection />
        <PhotoGallery />
        <BookSection />
        <PullQuote text="Salty breeze. The sound of your own footsteps." variant="light" />
        <EventsSection />
        <SupportSection />
        <PartnersSection />
        <NewsletterSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
