/**
 * src/lib/api.ts
 * Typed API calls for all FTC backend endpoints.
 * Uses the same VITE_API_BASE_URL as apiClient.ts.
 */

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.error ?? `Request failed: ${path}`), { status: res.status, body });
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiStage {
  id: string;
  stageNumber: number;
  displayNumber?: number;
  title: string;
  country: string;
  region: string | null;
  distanceKm: number | null;
  startLocation: string;
  endLocation: string;
  startCoord: { lat: number; lng: number } | null;
  endCoord: { lat: number; lng: number } | null;
  shoreholder: string | null;
  shoreholderSlug: string | null;
  runDate: string | null;
  status: 'completed' | 'available' | 'locked' | 'booked';
  image: string;
  description: string | null;
  bookNumber: number | null;
  isIceland: boolean;
}

export interface IcelandStage {
  id: string;
  stageNumber: number;
  displayNumber: number;
  title: string;
  distanceKm: number | null;
  startLocation: string;
  endLocation: string;
  startCoord: { lat: number; lng: number } | null;
  endCoord: { lat: number; lng: number } | null;
  runDate: string | null;
  startTime: string | null;
  releaseAt: string | null;
  secondsUntilRelease: number | null;
  status: 'locked' | 'available' | 'booked';
  image: string | null;
  description: string | null;
  shoreholder: string | null;
}

export interface IcelandStagesResponse {
  stages: IcelandStage[];
  summary: { total: number; available: number; booked: number; locked: number };
}

export interface StatsResponse {
  completedStages: number;
  totalStages: number;
  totalKm: number;
  countries: number;
  runners: number;
  booksSold: number;
}

export interface BookPricingResponse {
  books: { id: string; title: string; subtitle: string; price: number }[];
  addon: { id: string; title: string; subtitle: string; price: number };
  tiers: { qty: number; total: number; perBook: number; saving: number; discountPct: number; label: string }[];
  shipping: { belgium: { single: number; bundle: number }; eu: { single: number; bundle: number }; note: string };
}

export interface CheckoutResponse {
  paymentUrl?: string;
  success?: boolean;
  message?: string;
  error?: string;
  secondsUntilRelease?: number;
}

export interface SessionResponse {
  status: string;
  customerEmail: string | null;
  productType: string | null;
  eventName: string | null;
  amountTotal: number | null;
  currency: string | null;
}

export interface ApiShoreholder {
  id: string;
  slug: string;
  name: string;
  nationality: string | null;
  bio: string | null;
  avatarUrl: string | null;
  stageNumber: number;
  runDate: string | null;
  instagramHandle: string | null;
}

export interface ApiPrint {
  id: string;
  slug: string;
  title: string;
  stageNumber: number | null;
  imageUrl: string | null;
  priceEur: number;
  dimensions: string | null;
  editionSize: number | null;
  available: boolean;
}

// ── Archive ───────────────────────────────────────────────────────────────────

export const archive = {
  tiles: () => req<ApiStage[]>('/api/archive/tiles'),
  tile: (n: number) => req<ApiStage>(`/api/archive/tiles/${n}`),
  stats: () => req<StatsResponse>('/api/archive/stats'),
};

// ── Iceland ───────────────────────────────────────────────────────────────────

export const iceland = {
  stages: () => req<IcelandStagesResponse>('/api/iceland/stages'),
  stage: (n: number) => req<IcelandStage>(`/api/iceland/stages/${n}`),
  map: () => req<IcelandStage[]>('/api/iceland/map'),
};

// ── Waitlists ─────────────────────────────────────────────────────────────────

export const waitlist = {
  joinIceland: (email: string, name?: string) =>
    req<{ success: boolean }>('/api/waitlist/iceland', {
      method: 'POST', body: JSON.stringify({ email, name }),
    }),
  icelandCount: () => req<{ count: number }>('/api/waitlist/iceland/count'),
  joinStage: (stageNumber: number, email: string, name?: string) =>
    req<{ success: boolean }>(`/api/stages/${stageNumber}/waitlist`, {
      method: 'POST', body: JSON.stringify({ email, name }),
    }),
};

// ── Checkout ──────────────────────────────────────────────────────────────────

type BookVariant = 'book_1' | 'book_2' | 'book_3';
type StageTier = 'stage_solo' | 'stage_duo' | 'stage_group';
type EventId =
  | 'book_launch_dinner' | 'ftk_35km' | 'ftk_75km'
  | 'trg_shared' | 'trg_own' | 'madeira'
  | 'tmb_2026_4day' | 'tmb_2027_4day' | 'tmb_2027_7day'
  | 'iceland';

export const checkout = {
  pricing: () => req<BookPricingResponse>('/api/checkout/pricing/books'),

  books: (params: {
    selectedBooks: BookVariant[];
    addCanaryIslands: boolean;
    countryCode: string;
    customerEmail: string;
    customerName: string;
  }) => req<CheckoutResponse>('/api/checkout', {
    method: 'POST', body: JSON.stringify({ productType: 'book', ...params }),
  }),

  stage: (params: {
    stageNumber: number;
    tier: StageTier;
    customerEmail: string;
    customerName: string;
  }) => req<CheckoutResponse>('/api/checkout', {
    method: 'POST', body: JSON.stringify({ productType: 'stage', ...params }),
  }),

  event: (params: {
    eventId: EventId;
    addDinner?: boolean;
    customerEmail: string;
    customerName: string;
  }) => req<CheckoutResponse>('/api/checkout', {
    method: 'POST', body: JSON.stringify({ productType: 'event', ...params }),
  }),

  bookLaunchFree: (params: { customerEmail: string; customerName: string }) =>
    req<CheckoutResponse>('/api/checkout', {
      method: 'POST', body: JSON.stringify({ productType: 'book_launch_free', ...params }),
    }),

  print: (params: { printId: string; printTitle: string; priceEur: number; customerEmail: string }) =>
    req<CheckoutResponse>('/api/checkout', {
      method: 'POST', body: JSON.stringify({ productType: 'print', ...params }),
    }),

  session: (sessionId: string) => req<SessionResponse>(`/api/checkout/session/${sessionId}`),
};

// ── Newsletter ─────────────────────────────────────────────────────────────────

export const newsletter = {
  subscribe: (email: string) =>
    req<{ success: boolean }>('/api/newsletter', {
      method: 'POST', body: JSON.stringify({ email }),
    }),
};

// ── Contact ───────────────────────────────────────────────────────────────────

export const contact = {
  send: (params: { name: string; email: string; subject?: string; message: string; source?: string }) =>
    req<{ success: boolean }>('/api/contact', {
      method: 'POST', body: JSON.stringify(params),
    }),
};

// ── Shoreholders ──────────────────────────────────────────────────────────────

export const shoreholders = {
  list: () => req<ApiShoreholder[]>('/api/shoreholders'),
};

// ── Prints ────────────────────────────────────────────────────────────────────

export const prints = {
  list: () => req<ApiPrint[]>('/api/prints'),
};
