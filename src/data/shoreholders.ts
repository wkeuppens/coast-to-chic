/**
 * Shoreholders — Runner data for each completed stage.
 * ─────────────────────────────────────────────────────
 * This file is designed to be easily replaced by:
 *  • A CSV/Excel import (match the ShoreholderEntry shape)
 *  • A database query (e.g. Supabase table `shoreholders`)
 *  • An API endpoint returning the same structure
 *
 * To connect to a database, replace the SHOREHOLDERS export
 * with a React Query hook or async fetch that returns ShoreholderEntry[].
 *
 * Required fields per entry:
 *   stageNumber — unique stage identifier (1-based)
 *   name        — runner's full name
 *   location    — stage location/city
 *   country     — country code or name
 *   year        — year the stage was completed
 */

export interface ShoreholderEntry {
  stageNumber: number;
  name: string;
  location: string;
  country: string;
  year: number;
}

/**
 * Placeholder data — replace with real data from Excel/database.
 * Each entry maps 1:1 to a completed stage.
 */
import { STAGES } from './stages';

export const SHOREHOLDERS: ShoreholderEntry[] = STAGES
  .filter(s => s.status === 'Completed' && s.shoreholder)
  .map(s => ({
    stageNumber: s.stageNumber,
    name: s.shoreholder!,
    location: s.location,
    country: s.country,
    year: s.year,
  }))
  .sort((a, b) => a.stageNumber - b.stageNumber);
