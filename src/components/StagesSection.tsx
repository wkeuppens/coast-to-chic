import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stages = [
  {
    id: '01',
    title: 'Málaga → Almería',
    distance: '94km',
    terrain: 'coastal cliffs & beaches',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1538964173425-93c73d540428?w=800&q=80',
  },
  {
    id: '02',
    title: 'Almería → Cartagena',
    distance: '108km',
    terrain: 'volcanic landscapes',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1504714146340-959ca07e1f38?w=800&q=80',
  },
  {
    id: '03',
    title: 'Cartagena → Alicante',
    distance: '96km',
    terrain: 'mediterranean shores',
    status: 'open',
    image: 'https://images.unsplash.com/photo-1534950947221-dcba2c5d8431?w=800&q=80',
  },
  {
    id: '04',
    title: 'Valencia → Tarragona',
    distance: '102km',
    terrain: 'golden beaches',
    status: 'open',
    image: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=80',
  },
];

export const StagesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stages" className="py-24 md:py-40 bg-secondary">
      <div ref={ref} className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-sm text-muted-foreground tracking-wide mb-4">Selected Stages</p>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground">
              100km of your story.
            </h2>
          </div>
          <a 
            href="#" 
            className="text-sm font-medium text-foreground underline underline-offset-4 hover:no-underline transition-all"
          >
            View all stages →
          </a>
        </motion.div>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex md:grid md:grid-cols-4 gap-0 min-w-max md:min-w-0">
          {stages.map((stage, index) => (
            <StageCard key={stage.id} stage={stage} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StageCard = ({ 
  stage, 
  index, 
  isInView 
}: { 
  stage: typeof stages[0]; 
  index: number;
  isInView: boolean;
}) => {
  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative w-80 md:w-auto border-r border-border last:border-r-0 overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden">
        <img 
          src={stage.image} 
          alt={stage.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
        
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-medium px-3 py-1 ${
            stage.status === 'completed' 
              ? 'bg-foreground text-primary-foreground' 
              : 'bg-accent text-accent-foreground'
          }`}>
            {stage.status === 'completed' ? 'Completed' : 'Open'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-background">
        <p className="text-xs text-muted-foreground mb-2">Stage {stage.id}</p>
        <h3 className="font-display text-lg font-medium text-foreground mb-1">
          {stage.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {stage.distance} · {stage.terrain}
        </p>
      </div>
    </motion.a>
  );
};