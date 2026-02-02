import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MagneticButton } from './MagneticButton';

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
            <p className="text-sm text-muted-foreground tracking-wide mb-4 flex items-center gap-2">
              <motion.span
                className="h-px bg-foreground inline-block w-8"
              />
              Stages
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground">
              100 km sections.
            </h2>
          </div>
          <MagneticButton
            href="#" 
            className="text-sm font-medium text-foreground group"
            strength={0.3}
          >
            <span className="relative">
              View all stages
              <motion.span 
                className="absolute -bottom-1 left-0 h-px bg-foreground"
                initial={{ width: '100%' }}
                whileHover={{ width: 0 }}
                transition={{ duration: 0.3 }}
              />
            </span>
            <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
          </MagneticButton>
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
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative w-80 md:w-auto border-r border-border last:border-r-0 overflow-hidden"
      whileHover={{ y: -8 }}
    >
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden relative">
        <motion.img 
          src={stage.image} 
          alt={stage.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status badge with pulse on open */}
        <div className="absolute top-4 right-4">
          <motion.span 
            className={`text-xs font-medium px-3 py-1 ${
              stage.status === 'completed' 
                ? 'bg-foreground text-primary-foreground' 
                : 'bg-accent text-accent-foreground'
            }`}
            animate={stage.status === 'open' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {stage.status === 'completed' ? 'Completed' : 'Open'}
          </motion.span>
        </div>

        {/* Hover reveal: Stage number */}
        <motion.div
          className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ y: 10 }}
          whileHover={{ y: 0 }}
        >
          <span className="font-display text-6xl font-bold opacity-30">{stage.id}</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 bg-background relative overflow-hidden">
        {/* Animated underline */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-accent"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
        
        <p className="text-xs text-muted-foreground mb-2">Stage {stage.id}</p>
        <h3 className="font-display text-lg font-medium text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
          {stage.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {stage.distance} · {stage.terrain}
        </p>
      </div>
    </motion.a>
  );
};
