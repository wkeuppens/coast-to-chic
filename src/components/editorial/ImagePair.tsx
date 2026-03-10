import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ImagePairProps {
  left: { src: string; alt: string; caption?: string };
  right: { src: string; alt: string; caption?: string };
  /** Gap between images */
  gap?: string;
}

/**
 * Two images side by side — like a book spread with facing photographs.
 * On mobile they stack vertically.
 */
export const ImagePair = ({ left, right, gap = '1rem' }: ImagePairProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 px-page"
      style={{ gap }}
    >
      {[left, right].map((img, i) => (
        <motion.figure
          key={i}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
        >
          <div className="overflow-hidden" style={{ aspectRatio: '3 / 2' }}>
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          {img.caption && (
            <figcaption className="mt-3">
              <p className="text-caption text-muted-foreground">{img.caption}</p>
            </figcaption>
          )}
        </motion.figure>
      ))}
    </div>
  );
};
