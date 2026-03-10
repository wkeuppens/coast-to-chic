import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FullBleedImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  caption?: string;
  priority?: boolean;
}

/**
 * Full-width image that bleeds to the edges — like a photographic plate in a book.
 * Fades in gently on scroll. Optional caption beneath.
 */
export const FullBleedImage = ({
  src,
  alt,
  aspectRatio = '16 / 9',
  caption,
  priority = false,
}: FullBleedImageProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <figure ref={ref} className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="w-full overflow-hidden"
        style={{ aspectRatio }}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          className="w-full h-full object-cover"
        />
      </motion.div>
      {caption && (
        <figcaption className="px-page mt-4">
          <p className="text-caption text-muted-foreground">{caption}</p>
        </figcaption>
      )}
    </figure>
  );
};
