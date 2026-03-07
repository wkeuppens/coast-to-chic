import { memo, useState, useCallback } from 'react';
import { EditorialArrow } from './EditorialArrow';
import type { StageTileData } from '@/data/stages';

/**
 * Single tile on the infinite canvas — styled as an archival entry.
 * Shows enriched metadata on hover: stage number, location, date, status, shoreholder.
 */
const GalleryTile = memo(
  ({ tile, onClick }: { tile: StageTileData; onClick?: (tile: StageTileData) => void }) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);
    const [hovered, setHovered] = useState(false);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        onClick?.(tile);
      },
      [onClick, tile]
    );

    const placeholderHue = tile.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

    return (
      <a
        href={tile.link}
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
        aria-label={`${tile.title} — ${tile.location}, ${tile.country}`}
      >
        {/* Image or Placeholder */}
        {!errored ? (
          <img
            src={tile.image}
            alt={tile.location}
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className="w-full h-full object-cover"
            style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />
        ) : null}

        {/* Placeholder background */}
        {(!loaded || errored) && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, hsl(${placeholderHue} 30% 18%) 0%, hsl(${(placeholderHue + 30) % 360} 25% 12%) 100%)`,
            }}
          >
            <span className="font-display text-white/20 text-2xl tracking-wider">
              {tile.title}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
            opacity: hovered ? 0.95 : 0.7,
            transition: 'opacity 0.35s ease',
          }}
        />

        {/* Archival metadata label */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none"
          style={{
            transform: `translateY(${hovered ? 0 : 4}px)`,
            opacity: hovered ? 1 : 0.85,
            transition: 'transform 0.35s ease, opacity 0.35s ease',
          }}
        >
          {/* Stage number */}
          <p className="text-caption text-white/50 mb-1.5">
            {tile.title}
          </p>

          {/* Location with arrow on hover */}
          <div className="flex items-center gap-2">
            <div
              style={{
                width: hovered ? 16 : 0,
                opacity: hovered ? 0.6 : 0,
                transition: 'width 0.3s ease, opacity 0.3s ease',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <EditorialArrow size={16} className="invert" />
            </div>
            <h3 className="font-display text-base md:text-lg text-white leading-tight">
              {tile.location}
            </h3>
          </div>

          {/* Expanded metadata on hover */}
          <div
            className="overflow-hidden"
            style={{
              maxHeight: hovered ? 60 : 0,
              opacity: hovered ? 1 : 0,
              transition: 'max-height 0.35s ease, opacity 0.3s ease',
            }}
          >
            <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[10px] text-white/40 font-display">{tile.country}</span>
              <span className="text-[10px] text-white/20">·</span>
              <span className="text-[10px] text-white/40 font-display">{tile.season} {tile.year}</span>
              {tile.shoreholder && (
                <>
                  <span className="text-[10px] text-white/20">·</span>
                  <span className="text-[10px] text-white/40 font-display italic">{tile.shoreholder}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hover border */}
        <div
          className="absolute inset-0 pointer-events-none border border-white/0"
          style={{
            borderColor: hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0)',
            transition: 'border-color 0.35s ease',
          }}
        />
      </a>
    );
  }
);

GalleryTile.displayName = 'GalleryTile';
export default GalleryTile;
