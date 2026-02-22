import { useCallback, useEffect, useRef, useState } from 'react';

interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

interface Velocity {
  x: number;
  y: number;
}

interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.4;
const ZOOM_STEP = 0.08;
const FRICTION = 0.92;
const VELOCITY_THRESHOLD = 0.3;

/**
 * Clamp camera so the content edges align with viewport edges.
 * Camera x/y is the translation of the world layer (positive = world moves right/down).
 */
function clampCamera(x: number, y: number, zoom: number, vw: number, vh: number, bounds: Bounds | null): { x: number; y: number } {
  if (!bounds) return { x, y };
  
  const contentW = (bounds.right - bounds.left) * zoom;
  const contentH = (bounds.bottom - bounds.top) * zoom;

  // If content smaller than viewport, center it
  if (contentW <= vw) {
    x = -(bounds.left + bounds.right) / 2 * zoom;
  } else {
    const minX = -(bounds.right * zoom - vw / 2);
    const maxX = -(bounds.left * zoom + vw / 2);
    // Note: minX < maxX when content > viewport (since bounds.left is negative)
    x = Math.max(minX, Math.min(maxX, x));
  }

  if (contentH <= vh) {
    y = -(bounds.top + bounds.bottom) / 2 * zoom;
  } else {
    const minY = -(bounds.bottom * zoom - vh / 2);
    const maxY = -(bounds.top * zoom + vh / 2);
    y = Math.max(minY, Math.min(maxY, y));
  }

  return { x, y };
}

export function useCanvasCamera(
  containerRef: React.RefObject<HTMLElement | null>,
  bounds: Bounds | null = null
) {
  const initialZoom = typeof window !== 'undefined' && window.innerWidth < 768 ? 0.6 : 1;
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, zoom: initialZoom });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, camX: 0, camY: 0 });
  const velocity = useRef<Velocity>({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const rafId = useRef<number>(0);
  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;

  const getViewport = useCallback(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }), []);

  const applyClamp = useCallback((x: number, y: number, zoom: number) => {
    const vp = getViewport();
    return clampCamera(x, y, zoom, vp.w, vp.h, boundsRef.current);
  }, [getViewport]);

  // Momentum loop
  const tickMomentum = useCallback(() => {
    const v = velocity.current;
    if (Math.abs(v.x) < VELOCITY_THRESHOLD && Math.abs(v.y) < VELOCITY_THRESHOLD) {
      velocity.current = { x: 0, y: 0 };
      return;
    }
    v.x *= FRICTION;
    v.y *= FRICTION;
    setCamera((c) => {
      const clamped = applyClamp(c.x + v.x, c.y + v.y, c.zoom);
      return { ...c, ...clamped };
    });
    rafId.current = requestAnimationFrame(tickMomentum);
  }, [applyClamp]);

  const onPointerDown = useCallback((e: PointerEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    velocity.current = { x: 0, y: 0 };
    cancelAnimationFrame(rafId.current);
    dragStart.current = { x: e.clientX, y: e.clientY, camX: 0, camY: 0 };
    lastPointer.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    setCamera((c) => {
      dragStart.current.camX = c.x;
      dragStart.current.camY = c.y;
      return c;
    });
    (e.currentTarget as HTMLElement)?.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const now = performance.now();
    const dt = now - lastPointer.current.t || 1;
    velocity.current = {
      x: (e.clientX - lastPointer.current.x) / dt * 16,
      y: (e.clientY - lastPointer.current.y) / dt * 16,
    };
    lastPointer.current = { x: e.clientX, y: e.clientY, t: now };
    setCamera((c) => {
      const clamped = applyClamp(dragStart.current.camX + dx, dragStart.current.camY + dy, c.zoom);
      return { ...c, ...clamped };
    });
  }, [applyClamp]);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    rafId.current = requestAnimationFrame(tickMomentum);
  }, [tickMomentum]);

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      setCamera((c) => {
        const newZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, c.zoom - e.deltaY * 0.005));
        const clamped = applyClamp(c.x, c.y, newZoom);
        return { ...clamped, zoom: newZoom };
      });
    } else {
      setCamera((c) => {
        const clamped = applyClamp(c.x - e.deltaX, c.y - e.deltaY, c.zoom);
        return { ...c, ...clamped };
      });
    }
  }, [applyClamp]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const step = 80;
    let dx = 0, dy = 0, dz = 0;
    switch (e.key) {
      case 'ArrowUp':    dy = step; break;
      case 'ArrowDown':  dy = -step; break;
      case 'ArrowLeft':  dx = step; break;
      case 'ArrowRight': dx = -step; break;
      case '=': case '+': dz = ZOOM_STEP; break;
      case '-': dz = -ZOOM_STEP; break;
      default: return;
    }
    e.preventDefault();
    setCamera((c) => {
      const newZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, c.zoom + dz));
      const clamped = applyClamp(c.x + dx, c.y + dy, newZoom);
      return { ...clamped, zoom: newZoom };
    });
  }, [applyClamp]);

  // Re-clamp on resize
  useEffect(() => {
    const onResize = () => {
      setCamera((c) => {
        const clamped = applyClamp(c.x, c.y, c.zoom);
        return { ...c, ...clamped };
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [applyClamp]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(rafId.current);
    };
  }, [containerRef, onPointerDown, onPointerMove, onPointerUp, onWheel, onKeyDown]);

  return { camera, setCamera, isDragging: isDragging.current };
}
