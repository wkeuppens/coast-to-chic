/**
 * API Endpoint Paths — Single source of truth for all backend routes.
 *
 * When the backend is implemented, import these constants instead
 * of scattering raw strings across the codebase.
 */

export const ENDPOINTS = {
  /** GET — returns StageTileData[] */
  ARCHIVE_TILES: '/api/archive/tiles',

  /** GET — returns ShoreholderEntry[] */
  SHOREHOLDERS: '/api/shoreholders',

  /** POST — body: { email: string } */
  NEWSLETTER_SUBSCRIBE: '/api/newsletter',

  /** POST — body: RegistrationPayload */
  REGISTRATION: '/api/registration',

  /** POST — body: CheckoutPayload */
  CHECKOUT: '/api/checkout',

  /** GET — returns PhotographerData[] */
  PHOTOGRAPHERS: '/api/photographers',

  /** GET — returns PrintData[] */
  PRINTS: '/api/prints',
} as const;
