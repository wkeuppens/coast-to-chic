// Distance calculator for the Follow the Coast project
// Adds 100km per active day, gradually between 7am and 10pm UTC+1

// Pause days (rest days where no distance is added)
const PAUSE_DAYS = new Set([
  // April-May 2026 pause days
  '2026-04-21',
  '2026-04-29',
  '2026-05-06',
  '2026-05-13',
  // October-November 2026 pause days
  '2026-10-22',
  '2026-10-29',
  '2026-11-05',
  '2026-11-12',
]);

// Active date ranges (start and end dates inclusive)
const ACTIVE_RANGES: Array<{ start: string; end: string }> = [
  // Spring leg
  { start: '2026-04-16', end: '2026-05-20' },
  // Autumn leg
  { start: '2026-10-08', end: '2026-11-23' },
];

const BASE_DISTANCE_KM = 16000;  // Starting distance before April 16, 2026
const KM_PER_DAY = 100;
const DAY_START_HOUR = 7;  // 7am UTC+1
const DAY_END_HOUR = 22;   // 10pm UTC+1

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

function isActiveDate(date: Date): boolean {
  const dateKey = formatDateKey(date);
  
  // Check if it's a pause day
  if (PAUSE_DAYS.has(dateKey)) {
    return false;
  }
  
  // Check if date is within any active range
  return ACTIVE_RANGES.some(range => {
    const start = parseDate(range.start);
    const end = parseDate(range.end);
    return isDateInRange(date, start, end);
  });
}

function countActiveDaysBefore(targetDate: Date): number {
  let count = 0;
  
  for (const range of ACTIVE_RANGES) {
    const rangeStart = parseDate(range.start);
    const rangeEnd = parseDate(range.end);
    
    // Skip if target is before this range starts
    if (targetDate < rangeStart) continue;
    
    // Determine the end date for counting
    const countEnd = targetDate < rangeEnd ? targetDate : rangeEnd;
    
    // Count each day in the range
    const current = new Date(rangeStart);
    while (current < countEnd) {
      if (!PAUSE_DAYS.has(formatDateKey(current))) {
        count++;
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }
  }
  
  return count;
}

function getDayProgress(now: Date): number {
  // Get current hour in UTC+1
  const utcHour = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utc1Hour = utcHour + 1; // UTC+1
  const currentTimeInHours = utc1Hour + utcMinutes / 60;
  
  if (currentTimeInHours < DAY_START_HOUR) {
    return 0;
  }
  
  if (currentTimeInHours >= DAY_END_HOUR) {
    return 1;
  }
  
  // Calculate progress between 7am and 10pm (15 hours)
  const dayDuration = DAY_END_HOUR - DAY_START_HOUR; // 15 hours
  const elapsed = currentTimeInHours - DAY_START_HOUR;
  
  return Math.min(1, Math.max(0, elapsed / dayDuration));
}

export function calculateCurrentDistance(): number {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  
  // Start with base distance, then add completed active days
  const completedDays = countActiveDaysBefore(today);
  let totalKm = BASE_DISTANCE_KM + (completedDays * KM_PER_DAY);
  
  // Add partial progress for today if it's an active day
  if (isActiveDate(today)) {
    const dayProgress = getDayProgress(now);
    totalKm += dayProgress * KM_PER_DAY;
  }
  
  return Math.round(totalKm);
}

// Get the first active date for reference
export function getProjectStartDate(): Date {
  return parseDate(ACTIVE_RANGES[0].start);
}

// Check if the project has started
export function hasProjectStarted(): boolean {
  const now = new Date();
  const start = getProjectStartDate();
  return now >= start;
}
