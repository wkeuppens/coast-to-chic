import { useState, useEffect } from 'react';
import { calculateCurrentDistance, hasProjectStarted } from '@/lib/distanceCalculator';

export function useCurrentDistance(updateIntervalMs: number = 60000) {
  const [distance, setDistance] = useState(() => calculateCurrentDistance());
  const [started, setStarted] = useState(() => hasProjectStarted());

  useEffect(() => {
    // Update distance periodically
    const interval = setInterval(() => {
      setDistance(calculateCurrentDistance());
      setStarted(hasProjectStarted());
    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [updateIntervalMs]);

  return { distance, hasStarted: started };
}
