/**
 * Supabase configuration — real project credentials
 * Project: follow-the-coast (rxjoajurtgkcuicnbzmc)
 */
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)
  || 'https://rxjoajurtgkcuicnbzmc.supabase.co'

export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4am9hanVydGdrY3VpY25iem1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzQyNjQsImV4cCI6MjA5NTExMDI2NH0.3PwdbNWqUthGNRpqXa-n_k6i7X2L1kU2wb9muBrWOCs'

export function edgeFunctionUrl(name: string): string {
  return `${SUPABASE_URL}/functions/v1/${name}`
}

export const supabaseHeaders = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
}
