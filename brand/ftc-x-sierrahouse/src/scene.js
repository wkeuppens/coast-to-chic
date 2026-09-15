/**
 * Builds the lockup as a live SVG and drives it from the timeline.
 * Used by the preview page and by the offline frame renderer, so both show
 * exactly the same motion.
 */
import { SIERRA, WAVE, wavePath, waveCY, checkerCells, trianglePath } from './geometry.js';
import { stateAt, orderCells, totalDuration } from './timeline.js';
import { DEFAULTS, layout, frame } from './lockup.js';

export { DEFAULTS, layout };

const NS = 'http://www.w3.org/2000/svg';
const el = (name, attrs = {}) => {
  const n = document.createElementNS(NS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};

export function mountScene(container, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const L = layout(o);

  const { vbW, vbH, ox, oy } = frame(o, L);

  const svg = el('svg', {
    xmlns: NS, viewBox: `0 0 ${vbW.toFixed(3)} ${vbH.toFixed(3)}`,
    width: '100%', height: '100%',
    'shape-rendering': 'geometricPrecision',
  });
  const root = el('g', { transform: `translate(${ox.toFixed(3)} ${oy.toFixed(3)})`, fill: o.colour, stroke: o.colour });
  svg.appendChild(root);

  /* ------------------------------------------------------- wave mark ----- */
  const gFtc = el('g', { transform: `translate(${L.ftc.x.toFixed(3)} ${L.ftc.y.toFixed(3)}) scale(${L.ftc.scale})` });
  const wavePaths = [];
  for (let i = 0; i < WAVE.count; i++) {
    const p = el('path', {
      d: wavePath(waveCY(i)), fill: 'none', stroke: o.colour,
      'stroke-width': WAVE.stroke, 'stroke-linecap': 'butt',
      pathLength: 1, 'stroke-dasharray': '0 2', 'stroke-dashoffset': 0,
    });
    gFtc.appendChild(p); wavePaths.push(p);
  }
  root.appendChild(gFtc);

  /* --------------------------------------------------------------- ✕ ----- */
  const half = L.x.size / 2;
  const gX = el('g', {});
  const xArms = [
    // top-left → bottom-right, then top-right → bottom-left
    el('path', { d: `M ${-half} ${-half} L ${half} ${half}` }),
    el('path', { d: `M ${half} ${-half} L ${-half} ${half}` }),
  ];
  for (const a of xArms) {
    a.setAttribute('fill', 'none');
    a.setAttribute('stroke', o.colour);
    a.setAttribute('stroke-width', L.x.stroke);
    a.setAttribute('stroke-linecap', 'butt');
    a.setAttribute('pathLength', 1);
    a.setAttribute('stroke-dasharray', '0 3');
    a.setAttribute('stroke-dashoffset', -0.5);
    gX.appendChild(a);
  }
  root.appendChild(gX);

  /* ---------------------------------------------------------- emblem ----- */
  const gS = el('g', { transform: `translate(${L.sierra.x.toFixed(3)} ${L.sierra.y.toFixed(3)}) scale(${L.sierra.scale})` });
  const ordered = orderCells(checkerCells(), o.order);
  const cellNodes = ordered.map(({ r, c }) => {
    const cx = (c + 0.5) * SIERRA.cellW, cy = (r + 0.5) * SIERRA.cellH;
    const g = el('g', { transform: `translate(${cx.toFixed(3)} ${cy.toFixed(3)})` });
    g.appendChild(el('rect', {
      x: (-SIERRA.cellW / 2).toFixed(4), y: (-SIERRA.cellH / 2).toFixed(4),
      width: SIERRA.cellW.toFixed(4), height: SIERRA.cellH.toFixed(4),
      fill: o.colour, stroke: 'none',
    }));
    gS.appendChild(g);
    return g;
  });

  const clipId = `triclip-${Math.abs(hash(JSON.stringify(o)))}`;
  const defs = el('defs');
  const clip = el('clipPath', { id: clipId, clipPathUnits: 'userSpaceOnUse' });
  const clipRect = el('rect', { x: -10, y: SIERRA.height, width: SIERRA.width + 20, height: 0 });
  clip.appendChild(clipRect); defs.appendChild(clip); gS.appendChild(defs);

  const tri = el('path', { d: trianglePath(), fill: o.colour, stroke: o.colour, 'stroke-width': Math.max(0, o.outset * 2), 'clip-path': `url(#${clipId})` });
  gS.appendChild(tri);
  root.appendChild(gS);

  container.appendChild(svg);

  /* ----------------------------------------------------------- driver ---- */
  function setTime(t) {
    const s = stateAt(t, { cellCount: cellNodes.length, waveCount: WAVE.count, loop: o.loop, pop: o.pop });
    for (let i = 0; i < wavePaths.length; i++)
      wavePaths[i].setAttribute('stroke-dasharray', `${s.waves[i].toFixed(5)} 2`);
    for (let i = 0; i < xArms.length; i++) {
      const p = s.xArms[i];
      xArms[i].setAttribute('stroke-dasharray', `${p.toFixed(5)} 3`);
      xArms[i].setAttribute('stroke-dashoffset', (-(0.5 - p / 2)).toFixed(5));
    }
    gX.setAttribute('transform', `translate(${L.x.cx.toFixed(3)} ${L.x.cy.toFixed(3)}) scale(${s.xScale.toFixed(5)})`);
    for (let i = 0; i < cellNodes.length; i++) {
      const { s: sc, o: op } = s.cells[i];
      const n = cellNodes[i];
      const { r, c } = ordered[i];
      const cx = (c + 0.5) * SIERRA.cellW, cy = (r + 0.5) * SIERRA.cellH;
      n.setAttribute('transform', `translate(${cx.toFixed(3)} ${cy.toFixed(3)}) scale(${sc.toFixed(5)})`);
      n.setAttribute('opacity', op.toFixed(4));
    }
    const fill = s.triangle * SIERRA.height;
    clipRect.setAttribute('y', (SIERRA.height - fill).toFixed(4));
    clipRect.setAttribute('height', fill.toFixed(4));
    svg.setAttribute('opacity', s.globalAlpha.toFixed(4));
  }
  setTime(0);
  return { svg, setTime, duration: totalDuration(o.loop), layout: L, viewBox: [vbW, vbH] };
}

function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0; return h; }
