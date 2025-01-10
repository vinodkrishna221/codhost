// Types for authentication and user data
import { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthState {
  loading: boolean;
  error: AuthError | null;
}