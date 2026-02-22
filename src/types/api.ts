/**
 * Shared API request/response types for backend integration.
 *
 * These types define the shape of data exchanged with the backend.
 * The frontend currently uses local placeholder data matching these shapes.
 */

/* ── Archive / Stages ── */

export interface StageResponse {
  id: string;
  title: string;
  stageNumber: number;
  location: string;
  country: string;
  year: number;
  season: string;
  status: 'Completed' | 'Upcoming';
  shoreholder?: string;
  startCoord?: [number, number];
  endCoord?: [number, number];
  image: string;
  /** Canvas position — may be computed server-side or client-side */
  x: number;
  y: number;
  width: number;
  height: number;
  link: string;
}

/* ── Shoreholders ── */

export interface ShoreholderResponse {
  stageNumber: number;
  name: string;
  location: string;
  country: string;
  year: number;
}

/* ── Newsletter ── */

export interface NewsletterSubscribeRequest {
  email: string;
}

export interface NewsletterSubscribeResponse {
  success: boolean;
  message?: string;
}

/* ── Registration ── */

export interface RegistrationRequest {
  tier: 'solo' | 'duo' | 'team';
  stageNumber: number;
  name: string;
  email: string;
  phone?: string;
}

export interface RegistrationResponse {
  success: boolean;
  confirmationId?: string;
  message?: string;
}

/* ── Checkout / Payment ── */

export interface CheckoutRequest {
  product: string;
  variant?: string;
  price: string;
  customerEmail: string;
  customerName: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface CheckoutResponse {
  success: boolean;
  /** Redirect URL for payment provider (e.g. Stripe Checkout session) */
  paymentUrl?: string;
  orderId?: string;
}

/* ── Photographers ── */

export interface PhotographerResponse {
  id: number;
  name: string;
  bio: string;
  photo: string;
  website?: string;
  instagram?: string;
}

/* ── Prints ── */

export interface PrintResponse {
  id: number;
  photographer: string;
  photographerId: number;
  title: string;
  location: string;
  stage: string;
  image: string;
  price: string;
  editionSize: number;
  remaining: number;
}
