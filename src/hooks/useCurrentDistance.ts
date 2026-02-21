import { useState, useEffect } from 'react';
import { calculateCurrentDistance, hasProjectStarted } from '@/lib/distanceCalculator';
import { calculateCountries, calculateRunners, calculateBooks } from '@/lib/counterCalculator';

export function useCurrentDistance(updateIntervalMs: number = 60000) {
  const [distance, setDistance] = useState(() => calculateCurrentDistance());
  const [started, setStarted] = useState(() => hasProjectStarted());
  const [countries, setCountries] = useState(() => calculateCountries());
  const [runners, setRunners] = useState(() => calculateRunners());
  const [books, setBooks] = useState(() => calculateBooks());

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(calculateCurrentDistance());
      setStarted(hasProjectStarted());
      setCountries(calculateCountries());
      setRunners(calculateRunners());
      setBooks(calculateBooks());
    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [updateIntervalMs]);

  return { distance, hasStarted: started, countries, runners, books };
}
