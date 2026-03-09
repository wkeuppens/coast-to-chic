import { useCurrentDistance } from '@/hooks/useCurrentDistance';

/**
 * Replaces the old marquee ticker with a simple editorial divider strip
 * showing key stats — like the book's data tables.
 */
export const MarqueeTicker = () => {
  const { distance, countries, runners, books } = useCurrentDistance(60000);

  const stats = [
    `${distance.toLocaleString('en-US')} km`,
    `${countries} countries`,
    `${runners} runners`,
    `${books} books`,
    'Since 2019',
  ];

  return (
    <div className="border-t border-b border-foreground py-4 mx-6 md:mx-12 lg:mx-16">
      <div className="flex flex-wrap justify-between gap-4">
        {stats.map((stat, i) => (
          <span
            key={i}
            className="text-caption text-muted-foreground"
          >
            {stat}
          </span>
        ))}
      </div>
    </div>
  );
};
