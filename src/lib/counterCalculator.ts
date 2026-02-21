// Dynamic counters for countries, runners, and books
// All dates in UTC

interface CounterMilestone {
  date: string; // YYYY-MM-DD
  value: number;
}

// Countries: starts at 5, then increases on specific dates
const COUNTRY_MILESTONES: CounterMilestone[] = [
  { date: '2026-04-26', value: 6 },
  { date: '2026-04-27', value: 7 },
  { date: '2026-05-20', value: 8 },
  { date: '2026-10-10', value: 9 },
  { date: '2026-10-18', value: 10 },
];
const BASE_COUNTRIES = 5;

// Books: starts at 3, goes to 4 on June 21
const BOOK_MILESTONES: CounterMilestone[] = [
  { date: '2026-06-21', value: 4 },
];
const BASE_BOOKS = 3;

// Runners: starts at 350
// +3/day Apr 16–May 20 (except pause days & Apr 26)
// +20 on Apr 26
// +3/day Oct 8–Nov 23
const BASE_RUNNERS = 350;

const RUNNER_RANGES: Array<{ start: string; end: string }> = [
  { start: '2026-04-16', end: '2026-05-20' },
  { start: '2026-10-08', end: '2026-11-23' },
];

const RUNNER_SPECIAL_DAYS: Record<string, number> = {
  '2026-04-26': 20, // +20 instead of +3
};

const RUNNERS_PER_DAY = 3;

function toUTCDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fmtDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export function calculateCountries(): number {
  const today = fmtDate(new Date());
  let val = BASE_COUNTRIES;
  for (const m of COUNTRY_MILESTONES) {
    if (today >= m.date) val = m.value;
  }
  return val;
}

export function calculateBooks(): number {
  const today = fmtDate(new Date());
  let val = BASE_BOOKS;
  for (const m of BOOK_MILESTONES) {
    if (today >= m.date) val = m.value;
  }
  return val;
}

export function calculateRunners(): number {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let total = BASE_RUNNERS;

  for (const range of RUNNER_RANGES) {
    const start = toUTCDate(range.start);
    const end = toUTCDate(range.end);
    if (today < start) continue;

    const countEnd = today < end ? today : end;
    const cur = new Date(start);
    while (cur <= countEnd) {
      const key = fmtDate(cur);
      if (key in RUNNER_SPECIAL_DAYS) {
        total += RUNNER_SPECIAL_DAYS[key];
      } else {
        total += RUNNERS_PER_DAY;
      }
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
  }

  return total;
}
