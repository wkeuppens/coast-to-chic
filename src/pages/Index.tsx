import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { JourneySection } from '@/components/JourneySection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { StagesSection } from '@/components/StagesSection';
import { BookSection } from '@/components/BookSection';
import { EventsSection } from '@/components/EventsSection';
import { PartnersSection } from '@/components/PartnersSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { LoadingScreen } from '@/components/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <CustomCursor />
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <main className="overflow-x-hidden cursor-none">
        <Navigation />
        <HeroSection />
        <JourneySection />
        <HowItWorksSection />
        <StagesSection />
        <BookSection />
        <EventsSection />
        <PartnersSection />
        <NewsletterSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
