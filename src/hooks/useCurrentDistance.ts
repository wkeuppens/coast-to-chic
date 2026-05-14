/**
 * src/hooks/useCurrentDistance.ts
 * Replaced: was using hardcoded calculators.
 * Now fetches real stats from the backend API.
 */
import { useState, useEffect } from 'react';
import { archive } from '@/lib/api';

export function useCurrentDistance(updateIntervalMs: number = 60000) {
  const [distance, setDistance] = useState(0);
  const [countries, setCountries] = useState(0);
  const [runners, setRunners] = useState(0);
  const [books, setBooks] = useState(0);
  const [started, setStarted] = useState(true);

  const fetchStats = async () => {
    try {
      const stats = await archive.stats();
      setDistance(stats.totalKm);
      setCountries(stats.countries);
      setRunners(stats.runners);
      setBooks(stats.booksSold);
      setStarted(stats.completedStages > 0);
    } catch {
      // Silently fail — counters stay at last known values
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, updateIntervalMs);
    return () => clearInterval(interval);
  }, [updateIntervalMs]);

  return { distance, hasStarted: started, countries, runners, books };
}
