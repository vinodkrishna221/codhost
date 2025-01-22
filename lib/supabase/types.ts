import { Database } from './database.types';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  current_rank: string;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  problems_solved: number;
  achievement_points: number;
  rank_position: number | null;
  last_updated: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  problem_id: string | null;
  completed_at: string;
  problem_difficulty: string;
  problem_title: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  problem_id: string;
  created_at: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthState {
  loading: boolean;
  error: AuthError | null;
}

export type UserRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'SSR';

export const RANK_THRESHOLDS = {
  SSR: 3600,
  SSS: 2800,
  SS: 2100,
  S: 1500,
  A: 1000,
  B: 600,
  C: 300,
  D: 100,
  E: 0,
} as const;