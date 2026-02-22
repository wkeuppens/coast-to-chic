/**
 * API Client — Centralized fetch wrapper for backend integration.
 *
 * Usage:
 *   import { api } from '@/lib/apiClient';
 *   const stages = await api.get<StageResponse[]>('/archive/tiles');
 *   await api.post('/newsletter', { email });
 *
 * Configure the base URL via the VITE_API_BASE_URL environment variable.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

interface ApiError {
  status: number;
  message: string;
  body?: unknown;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      message: res.statusText,
    };
    try {
      error.body = await res.json();
    } catch {
      // response may not be JSON
    }
    throw error;
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>('GET', path, undefined, headers),

  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>('POST', path, body, headers),

  put: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>('PUT', path, body, headers),

  delete: <T>(path: string, headers?: Record<string, string>) =>
    request<T>('DELETE', path, undefined, headers),
};
