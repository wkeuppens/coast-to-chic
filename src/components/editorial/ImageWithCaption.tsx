import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: string;
  className?: string;
}

/**
 * Contained image with optional editorial caption — like a plate in a catalogue.
 */
export const ImageWithCaption = ({
  src,
  alt,
  caption,
  aspectRatio = '3 / 2',
  className = '',
}: ImageWithCaptionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <figure ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="overflow-hidden"
        style={{ aspectRatio }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </motion.div>
      {caption && (
        <figcaption className="mt-3">
          <p className="text-caption text-muted-foreground">{caption}</p>
        </figcaption>
      )}
    </figure>
  );
};
