import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useEffect } from 'react';

const sections = [
  {
    number: '1',
    title: 'Welcome',
    content: [
      'Follow the Coast is a long journey carried forward by many people.',
      'Each participant runs a single stage.\nTogether, those stages slowly trace the coastline of Europe.',
      'You are not joining an event.\nYou are continuing something already in motion.',
    ],
  },
  {
    number: '2',
    title: 'What You Are Part Of',
    content: [
      'Follow the Coast is:',
    ],
    list: [
      'a relay around Europe\'s coastline',
      'a shared endurance project',
      'a collective cultural document created over years',
    ],
    after: [
      'Every runner inherits the route from someone else and passes it forward.',
      'The project moves slowly.\nThat is intentional.',
    ],
  },
  {
    number: '3',
    title: 'Your Stage',
    content: [
      'A stage is approximately 100 km.',
      'You may run:',
    ],
    list: ['Solo', 'As a Duo', 'As a Team'],
    after: [
      'Each format carries equal value.\nThe only requirement is that the stage continues.',
      'Your responsibility is simple:',
      'arrive prepared, complete your section, and hand the journey onward.',
    ],
  },
  {
    number: '4',
    title: 'Before the Start',
    content: ['You will receive:'],
    list: [
      'exact start coordinates',
      'finish location',
      'assigned date',
      'planning documents',
    ],
    after: [
      'Your route between these points is yours to design.',
      'Planning is part of participation.',
      'The coastline decides the experience more than any organiser ever could.',
    ],
  },
  {
    number: '5',
    title: 'The Spirit of Running',
    content: [
      'Follow the Coast is not a race.',
      'There are no rankings.\nNo podium.\nNo time pressure beyond continuity.',
      'Some moments will feel effortless.\nOthers will not.',
      'Both belong equally to the project.',
      'Run honestly.\nRespect the landscape.\nRespect the next runner waiting for you.',
    ],
  },
  {
    number: '6',
    title: 'Support on the Route',
    content: [
      'Where access allows, the Follow the Coast crew accompanies the stage.',
      'They provide:',
    ],
    list: [
      'logistical presence',
      'basic food and water',
      'coordination support',
      'photographic documentation',
    ],
    after: [
      'Bring what you personally need to move safely and comfortably.',
    ],
  },
  {
    number: '7',
    title: 'Following the Coast',
    content: [
      'The guiding principle is simple:',
      'stay as close to the sea as realistically possible.',
      'This sometimes means:',
    ],
    list: [
      'detours around harbours',
      'unexpected terrain',
      'wet feet',
      'longer distances than expected',
    ],
    after: [
      'The coastline is never perfectly logical.\nThat is part of its character.',
    ],
  },
  {
    number: '8',
    title: 'Timing & Continuity',
    content: [
      'Each stage connects directly to the next.',
      'Standard start time: 07:00',
      'Your finish coordinate becomes the next runner\'s start.',
      'The journey continues from the exact point you leave it.',
      'This precision keeps the project alive.',
    ],
  },
  {
    number: '9',
    title: 'The Handover',
    content: ['At the end of your stage:'],
    list: [
      'your finish coordinate is recorded',
      'the next runner begins from that point',
      'the chain remains unbroken',
    ],
    after: [
      'No gaps.\nNo approximations.',
      'The continuity between coordinates is the heart of Follow the Coast.',
    ],
  },
  {
    number: '10',
    title: 'Photography & Documentation',
    content: [
      'A professional photographer documents your stage.',
      'The images become part of:',
    ],
    list: [
      'the Follow the Coast archive',
      'future publications',
      'the evolving visual record of Europe\'s coastline',
    ],
    after: [
      'After your stage, you receive access to a curated image selection.',
      'Some photographs will later be released as limited edition prints chosen by the photographer.',
      'If a selected image was made during your stage, you will receive the opportunity to purchase it before public release.',
    ],
  },
  {
    number: '11',
    title: 'The Book',
    content: [
      'Every stage eventually lives inside a Follow the Coast book.',
      'The books are not souvenirs.\nThey are the lasting record of the journey.',
      'Your footsteps become part of that archive.',
      'One copy of the relevant publication is included with your participation.',
    ],
  },
  {
    number: '12',
    title: 'Commitment',
    content: [
      'Participation requires commitment.',
      'The project depends on reliability between participants.',
      'If circumstances change:',
    ],
    list: [
      'another runner may replace you',
      'postponement may be possible but cannot be guaranteed',
    ],
    after: [
      'Participation fees are therefore non-refundable.',
      'This protects continuity for everyone involved.',
    ],
  },
  {
    number: '13',
    title: 'Responsibility',
    content: [
      'Follow the Coast provides coordination, not supervision.',
      'Each participant remains responsible for:',
    ],
    list: [
      'personal safety',
      'navigation choices',
      'health and risk management',
    ],
    after: [
      'Run within your abilities.\nPrepare seriously.',
    ],
  },
  {
    number: '14',
    title: 'The Community',
    content: [
      'You will meet people you have never met before.',
      'Some will run before you.\nOthers will follow after.',
      'Most connections happen briefly:',
      'at dawn,\nat handovers,\non tired legs beside the sea.',
      'These moments are enough.',
    ],
  },
  {
    number: '15',
    title: 'After Your Stage',
    content: [
      'The project continues without pause.',
      'Your stage becomes one link in a chain that will take years to complete.',
      'You remain part of Follow the Coast long after finishing.',
      'Many runners return.\nNot to repeat a stage,\nbut to stay connected to the journey.',
    ],
  },
  {
    number: '16',
    title: 'One Simple Principle',
    content: [
      'Leave the coastline ready for the next person.',
    ],
  },
];

const ParticipantHandbook = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4"
          >
            Participant Handbook
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight"
          >
            Before You Run
          </motion.h1>
        </div>
      </section>

      {/* Sections */}
      <section className="pb-24 md:pb-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto space-y-20">
          {sections.map((section, idx) => (
            <motion.div
              key={section.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              {/* Section number & title */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-xs text-muted-foreground font-mono tabular-nums">
                  {section.number.padStart(2, '0')}
                </span>
                <h2 className="font-display text-lg md:text-xl font-bold uppercase tracking-wide">
                  {section.title}
                </h2>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border mb-8" />

              {/* Content paragraphs */}
              <div className="space-y-4">
                {section.content.map((para, i) => (
                  <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>

              {/* Bullet list */}
              {section.list && (
                <ul className="mt-4 space-y-2 pl-1">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm md:text-base text-foreground">
                      <span className="text-[#5E7687] mt-1.5 text-[6px]">●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* After-list paragraphs */}
              {section.after && (
                <div className="mt-6 space-y-4">
                  {section.after.map((para, i) => (
                    <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ParticipantHandbook;
