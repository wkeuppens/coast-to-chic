// Simple cache for parsed SVG data to avoid duplicate fetches

interface CachedSVG {
  pathData: string;
  viewBox: string;
}

const cache = new Map<string, Promise<CachedSVG | null>>();

export function fetchAndParseSVG(
  url: string,
  smoothFn?: (d: string) => string
): Promise<CachedSVG | null> {
  const cacheKey = url;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const promise = fetch(url)
    .then(res => res.text())
    .then(svgText => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      
      const svg = doc.querySelector('svg');
      const paths = doc.querySelectorAll('path');
      
      if (!svg || paths.length === 0) return null;
      
      const viewBox = svg.getAttribute('viewBox') || '0 0 800 600';
      const rawPath = paths[0].getAttribute('d');
      
      if (!rawPath) return null;
      
      const pathData = smoothFn ? smoothFn(rawPath) : rawPath;
      
      return { pathData, viewBox };
    })
    .catch(() => {
      cache.delete(cacheKey);
      return null;
    });

  cache.set(cacheKey, promise);
  return promise;
}
