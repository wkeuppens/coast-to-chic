// Parse SVG path to extract points
export function parsePathToPoints(d: string): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  // Match all commands and their coordinates
  const commands = d.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
  
  let currentX = 0;
  let currentY = 0;
  
  for (const cmd of commands) {
    const type = cmd[0];
    const args = cmd.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number);
    
    switch (type.toUpperCase()) {
      case 'M':
      case 'L':
        for (let i = 0; i < args.length; i += 2) {
          if (type === type.toUpperCase()) {
            currentX = args[i];
            currentY = args[i + 1];
          } else {
            currentX += args[i];
            currentY += args[i + 1];
          }
          points.push({ x: currentX, y: currentY });
        }
        break;
      case 'H':
        currentX = type === 'H' ? args[0] : currentX + args[0];
        points.push({ x: currentX, y: currentY });
        break;
      case 'V':
        currentY = type === 'V' ? args[0] : currentY + args[0];
        points.push({ x: currentX, y: currentY });
        break;
      case 'C':
        // Cubic bezier - just take the end point
        for (let i = 0; i < args.length; i += 6) {
          currentX = args[i + 4];
          currentY = args[i + 5];
          points.push({ x: currentX, y: currentY });
        }
        break;
      case 'Q':
        // Quadratic bezier - take end point
        for (let i = 0; i < args.length; i += 4) {
          currentX = args[i + 2];
          currentY = args[i + 3];
          points.push({ x: currentX, y: currentY });
        }
        break;
      case 'Z':
        // Close path - ignore
        break;
    }
  }
  
  return points;
}

// Simplify points using Ramer-Douglas-Peucker algorithm
function simplifyPoints(points: { x: number; y: number }[], tolerance: number): { x: number; y: number }[] {
  if (points.length <= 2) return points;
  
  // Find the point with the maximum distance from line
  let maxDist = 0;
  let maxIndex = 0;
  
  const start = points[0];
  const end = points[points.length - 1];
  
  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], start, end);
    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDist > tolerance) {
    const left = simplifyPoints(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyPoints(points.slice(maxIndex), tolerance);
    return [...left.slice(0, -1), ...right];
  } else {
    return [start, end];
  }
}

function perpendicularDistance(
  point: { x: number; y: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number }
): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  if (dx === 0 && dy === 0) {
    return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
  }
  
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (dx * dx + dy * dy);
  
  const nearestX = lineStart.x + t * dx;
  const nearestY = lineStart.y + t * dy;
  
  return Math.sqrt((point.x - nearestX) ** 2 + (point.y - nearestY) ** 2);
}

// Convert points to smooth bezier path using Catmull-Rom splines
// with adaptive tension based on angle sharpness
function pointsToCatmullRomBezier(
  points: { x: number; y: number }[], 
  tension: number = 0.5,
  adaptiveTension: boolean = false
): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }
  
  let d = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    
    // Calculate adaptive tension for sharp corners
    let localTension = tension;
    if (adaptiveTension && i > 0 && i < points.length - 2) {
      const angle = calculateAngle(p0, p1, p2);
      // If angle is sharp (less than 120 degrees), increase tension to smooth it
      if (angle < 120) {
        localTension = tension * (1 + (120 - angle) / 60);
      }
    }
    
    // Calculate control points using Catmull-Rom to Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6 * localTension;
    const cp1y = p1.y + (p2.y - p0.y) / 6 * localTension;
    const cp2x = p2.x - (p3.x - p1.x) / 6 * localTension;
    const cp2y = p2.y - (p3.y - p1.y) / 6 * localTension;
    
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  
  return d;
}

// Calculate angle at point p1 (in degrees)
function calculateAngle(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const v1x = p0.x - p1.x;
  const v1y = p0.y - p1.y;
  const v2x = p2.x - p1.x;
  const v2y = p2.y - p1.y;
  
  const dot = v1x * v2x + v1y * v2y;
  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);
  
  if (mag1 === 0 || mag2 === 0) return 180;
  
  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return Math.acos(cosAngle) * (180 / Math.PI);
}

// Main smoothing function
export function smoothPath(
  pathD: string, 
  simplifyTolerance: number = 2, 
  tension: number = 1,
  adaptiveTension: boolean = true
): string {
  // Parse path to points
  const points = parsePathToPoints(pathD);
  
  if (points.length < 2) return pathD;
  
  // Simplify to reduce noise (light simplification)
  const simplified = simplifyPoints(points, simplifyTolerance);
  
  // Convert to smooth bezier with adaptive tension for sharp corners
  return pointsToCatmullRomBezier(simplified, tension, adaptiveTension);
}
