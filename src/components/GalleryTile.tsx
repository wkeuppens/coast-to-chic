import { memo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

export interface StageTile {
  id: string;
  title: string;
  region: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  link: string;
}

/**
 * Single tile on the infinite canvas.
 * Positioned absolutely via translate3d for GPU compositing.
 * Uses transform + opacity only — no layout-triggering props.
 */
const GalleryTile = memo(
  ({ tile, onClick }: { tile: StageTile; onClick?: (tile: StageTile) => void }) => {
    const [loaded, setLoaded] = useState(false);
    const [hovered, setHovered] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        onClick?.(tile);
      },
      [onClick, tile]
    );

    return (
      <Link
        to={tile.link}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="absolute block select-none will-change-transform"
        style={{
          transform: `translate3d(${tile.x}px, ${tile.y}px, 0) scale(${hovered ? 1.03 : 1})`,
          width: tile.width,
          height: tile.height,
          transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
        draggable={false}
        aria-label={`${tile.title} — ${tile.region}`}
      >
        {/* Image */}
        <img
          ref={imgRef}
          src={tile.image}
          alt={tile.region}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)',
            opacity: hovered ? 0.95 : 0.7,
            transition: 'opacity 0.35s ease',
          }}
        />

        {/* Label */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none"
          style={{
            transform: `translateY(${hovered ? 0 : 4}px)`,
            opacity: hovered ? 1 : 0.85,
            transition: 'transform 0.35s ease, opacity 0.35s ease',
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1 font-display">
            {tile.title}
          </p>
          <h3 className="font-display text-base md:text-lg text-white leading-tight">
            {tile.region}
          </h3>
        </div>

        {/* Hover border */}
        <div
          className="absolute inset-0 pointer-events-none border border-white/0"
          style={{
            borderColor: hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0)',
            transition: 'border-color 0.35s ease',
          }}
        />
      </Link>
    );
  }
);

GalleryTile.displayName = 'GalleryTile';
export default GalleryTile;
