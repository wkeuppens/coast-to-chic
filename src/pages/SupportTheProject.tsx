import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { PartnersSection } from '@/components/PartnersSection';
import coastalPath from '@/assets/coastal-path.jpg';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SectionWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeIn}
      transition={{ duration: 0.8 }}
      className={`py-16 md:py-24 px-6 md:px-12 lg:px-24 ${className}`}
    >
      <div className="max-w-4xl mx-auto">{children}</div>
    </motion.section>
  );
};

const supportTypes = [
  {
    title: 'Project Partner',
    text: 'Support the long-term mission. Your name travels with the project across borders and years.',
  },
  {
    title: 'Stage Partner',
    text: 'Adopt a specific stage. Be connected to a stretch of coastline, a runner, and a story.',
  },
  {
    title: 'Community Supporter',
    text: 'Help build the network around the project — events, gatherings, and shared moments along the way.',
  },
  {
    title: 'Equipment & Logistics Partner',
    text: 'Provide what keeps the crew moving. Vehicles, gear, food, or local infrastructure.',
  },
];

const SupportTheProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CustomCursor />
      <SEO
        title="Support the Project"
        description="Support the long-term journey around Europe's coastline. Discover how partners help Follow the Coast move forward."
        path="/support"
      />
      <main className="overflow-x-hidden cursor-none">
        <Navigation />

        {/* 1. HERO */}
        <section className="relative min-h-[70vh] flex items-end">
          <div className="absolute inset-0">
            <img
              src={coastalPath}
              alt="Coastal path along Europe's shoreline"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-foreground/40" />
          </div>
          <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-16 md:pb-24 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-display text-4xl md:text-6xl text-primary-foreground mb-6"
            >
              Carry the coastline with us
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4 mb-8"
            >
              <p className="text-primary-foreground/80 text-lg max-w-xl leading-relaxed">
                Follow the Coast moves forward one stage at a time.
              </p>
              <p className="text-primary-foreground/80 text-lg max-w-xl leading-relaxed">
                What began as a run has become a long-term archive of landscapes, people, and effort along Europe's shoreline.
              </p>
              <p className="text-primary-foreground/80 text-lg max-w-xl leading-relaxed">
                The project continues thanks to partners and supporters who believe in documenting something slowly, over many years.
              </p>
            </motion.div>
            <motion.a
              href="#contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="inline-block px-8 py-3 rounded-full bg-primary-foreground text-foreground font-display text-sm uppercase tracking-wider hover:bg-primary-foreground/90 transition-colors"
            >
              Start a conversation
            </motion.a>
          </div>
        </section>

        {/* 2. CURRENT PARTNERS — intro + reuse existing component */}
        <div className="py-16 md:py-24 px-6 md:px-12 lg:px-24 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-accent font-display uppercase tracking-wider mb-2">Current partners</p>
            <p className="text-foreground leading-relaxed">
              These organisations already help keep the journey moving.
            </p>
          </div>
        </div>
        <PartnersSection />

        {/* 3. WHY PARTNERS JOIN */}
        <SectionWrapper>
          <p className="text-accent font-display text-sm uppercase tracking-wider mb-4">Values</p>
          <h2 className="font-display text-2xl md:text-3xl mb-12">Why partners decide to join</h2>
          <div className="max-w-2xl space-y-6">
            <p className="text-foreground leading-relaxed">
              Many partnerships begin quietly.
            </p>
            <p className="text-foreground leading-relaxed">
              Someone follows the journey for a while.<br />
              Reads a book.<br />
              Meets a runner.<br />
              Sees a stretch of coastline differently.
            </p>
            <p className="text-foreground leading-relaxed">
              At some point the question changes from<br />
              <span className="italic">What is this project?</span><br />
              to<br />
              <span className="italic">How can we help it continue?</span>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              That is usually where partnerships start.
            </p>
          </div>
        </SectionWrapper>

        {/* 4. WAYS TO SUPPORT */}
        <SectionWrapper className="bg-secondary">
          <p className="text-accent font-display text-sm uppercase tracking-wider mb-4">Partnership</p>
          <h2 className="font-display text-2xl md:text-3xl mb-12">Ways to support</h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {supportTypes.map((type) => (
              <div key={type.title} className="border-l-2 border-accent pl-6">
                <h3 className="font-display text-lg mb-3">{type.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{type.text}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* 5. WHO TYPICALLY BECOMES A PARTNER */}
        <SectionWrapper>
          <h2 className="font-display text-2xl md:text-3xl mb-8">Who usually becomes a partner</h2>
          <p className="text-foreground leading-relaxed mb-8">
            Partners often come from different places:
          </p>
          <ul className="space-y-3 text-muted-foreground leading-relaxed">
            <li><span className="text-accent">•</span> brands connected to movement or landscape</li>
            <li><span className="text-accent">•</span> hospitality projects rooted in place</li>
            <li><span className="text-accent">•</span> cultural institutions</li>
            <li><span className="text-accent">•</span> small companies supporting long-term work</li>
            <li><span className="text-accent">•</span> individuals who simply want the journey to continue</li>
          </ul>
          <p className="text-foreground leading-relaxed mt-8">
            Every collaboration is shaped individually.
          </p>
        </SectionWrapper>

        {/* 6. WHAT PARTNERSHIP IS NOT */}
        <SectionWrapper className="border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl mb-8">What partnership is not</h2>
          <p className="text-foreground leading-relaxed max-w-2xl">
            Follow the Coast does not place logos on runners or fill stages with advertising. There are no banners at finish lines, no branded content requirements, no social media obligations.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4 max-w-2xl">
            Partnership here means contributing to something that exists quietly, over a long time. The project speaks for itself.
          </p>
        </SectionWrapper>

        {/* 7. LONG-TERM PROJECT */}
        <SectionWrapper className="bg-secondary">
          <h2 className="font-display text-2xl md:text-3xl mb-8">A project measured in years</h2>
          <p className="text-foreground leading-relaxed max-w-2xl">
            Follow the Coast is not built for a season. It moves slowly, deliberately, across years and borders. Each stage adds to an archive that will outlast any single run.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4 max-w-2xl">
            Supporting this project means believing that slow, continuous work creates something worth preserving.
          </p>
        </SectionWrapper>

        {/* 8. CONTACT */}
        <section id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-2xl md:text-4xl mb-6"
            >
              Start the conversation
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 mb-10"
            >
              <p className="text-foreground leading-relaxed">
                If you feel connected to the project, we would like to hear from you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Partnership begins with a conversation.
              </p>
            </motion.div>
            <motion.a
              href="mailto:hello@followthecoast.com"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-block px-8 py-3 rounded-full bg-foreground text-primary-foreground font-display text-sm uppercase tracking-wider hover:bg-foreground/90 transition-colors"
            >
              hello@followthecoast.com
            </motion.a>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default SupportTheProject;
