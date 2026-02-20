import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Detects whether the background behind the nav is dark or light
 * by sampling the computed background color of elements at the nav's position.
 */
export const useNavTheme = (): 'light' | 'dark' => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // light text for dark hero bg
  const rafId = useRef<number>(0);
  const lastTheme = useRef<'light' | 'dark'>('light');

  const check = useCallback(() => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const navRect = nav.getBoundingClientRect();
    const y = navRect.top + navRect.height / 2;
    const x = window.innerWidth / 2;

    const elements = document.elementsFromPoint(x, y);

    for (const el of elements) {
      if (nav.contains(el)) continue;

      const bg = getComputedStyle(el).backgroundColor;
      if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') continue;

      const match = bg.match(/([\d.]+)/g);
      if (match && match.length >= 3) {
        const [r, g, b] = match.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const newTheme = luminance < 0.5 ? 'light' : 'dark';
        if (newTheme !== lastTheme.current) {
          lastTheme.current = newTheme;
          setTheme(newTheme);
        }
      }
      break;
    }
  }, []);

  useEffect(() => {
    // Initial check after a small delay for paint
    const timeout = setTimeout(check, 100);

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(check);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [check]);

  return theme; // 'light' = use light text (dark bg), 'dark' = use dark text (light bg)
};
