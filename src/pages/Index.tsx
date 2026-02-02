import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { JourneySection } from '@/components/JourneySection';
import { StagesSection } from '@/components/StagesSection';
import { BookSection } from '@/components/BookSection';
import { CausesSection } from '@/components/CausesSection';
import { JoinSection } from '@/components/JoinSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <JourneySection />
      <StagesSection />
      <BookSection />
      <CausesSection />
      <JoinSection />
      <Footer />
    </main>
  );
};

export default Index;