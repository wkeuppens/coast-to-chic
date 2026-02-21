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

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.6;
const ZOOM_STEP = 0.08;
const FRICTION = 0.92;
const VELOCITY_THRESHOLD = 0.3;

/**
 * Hook that manages a 2D camera for an infinite canvas.
 * Supports click-drag, touch, scroll-wheel panning, trackpad pinch zoom,
 * keyboard arrows, and momentum/inertia.
 */
export function useCanvasCamera(containerRef: React.RefObject<HTMLElement | null>) {
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, zoom: 1 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, camX: 0, camY: 0 });
  const velocity = useRef<Velocity>({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const rafId = useRef<number>(0);

  // ── Momentum loop ──
  const tickMomentum = useCallback(() => {
    const v = velocity.current;
    if (Math.abs(v.x) < VELOCITY_THRESHOLD && Math.abs(v.y) < VELOCITY_THRESHOLD) {
      velocity.current = { x: 0, y: 0 };
      return;
    }
    v.x *= FRICTION;
    v.y *= FRICTION;
    setCamera((c) => ({ ...c, x: c.x + v.x, y: c.y + v.y }));
    rafId.current = requestAnimationFrame(tickMomentum);
  }, []);

  // ── Pointer handlers ──
  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      velocity.current = { x: 0, y: 0 };
      cancelAnimationFrame(rafId.current);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        camX: 0, // filled from state in move
        camY: 0,
      };
      lastPointer.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      setCamera((c) => {
        dragStart.current.camX = c.x;
        dragStart.current.camY = c.y;
        return c;
      });
      (e.currentTarget as HTMLElement)?.setPointerCapture(e.pointerId);
    },
    []
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
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
      setCamera((c) => ({
        ...c,
        x: dragStart.current.camX + dx,
        y: dragStart.current.camY + dy,
      }));
    },
    []
  );

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    rafId.current = requestAnimationFrame(tickMomentum);
  }, [tickMomentum]);

  // ── Wheel (pan + zoom) ──
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    // Pinch-zoom (ctrlKey is set by trackpad pinch gestures)
    if (e.ctrlKey) {
      setCamera((c) => ({
        ...c,
        zoom: Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, c.zoom - e.deltaY * 0.005)),
      }));
    } else {
      setCamera((c) => ({
        ...c,
        x: c.x - e.deltaX,
        y: c.y - e.deltaY,
      }));
    }
  }, []);

  // ── Keyboard ──
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const step = 80;
    switch (e.key) {
      case 'ArrowUp':    setCamera((c) => ({ ...c, y: c.y + step })); break;
      case 'ArrowDown':  setCamera((c) => ({ ...c, y: c.y - step })); break;
      case 'ArrowLeft':  setCamera((c) => ({ ...c, x: c.x + step })); break;
      case 'ArrowRight': setCamera((c) => ({ ...c, x: c.x - step })); break;
      case '=':
      case '+': setCamera((c) => ({ ...c, zoom: Math.min(ZOOM_MAX, c.zoom + ZOOM_STEP) })); break;
      case '-': setCamera((c) => ({ ...c, zoom: Math.max(ZOOM_MIN, c.zoom - ZOOM_STEP) })); break;
      default: return;
    }
    e.preventDefault();
  }, []);

  // ── Attach listeners ──
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

  return { camera, isDragging: isDragging.current };
}
