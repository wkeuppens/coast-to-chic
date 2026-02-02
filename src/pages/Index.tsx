import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { JourneySection } from '@/components/JourneySection';
import { StagesSection } from '@/components/StagesSection';
import { BookSection } from '@/components/BookSection';
import { CausesSection } from '@/components/CausesSection';
import { JoinSection } from '@/components/JoinSection';
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
        <StagesSection />
        <BookSection />
        <CausesSection />
        <JoinSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;