import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Create a single instance of the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase.auth.token',
  },
});

// Rate limiting configuration
const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

const rateLimitMap = new Map<string, { attempts: number; timestamp: number }>();

export const checkRateLimit = (email: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(email);

  if (!userLimit || (now - userLimit.timestamp) > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(email, { attempts: 1, timestamp: now });
    return false;
  }

  if (userLimit.attempts >= RATE_LIMIT_ATTEMPTS) {
    return true;
  }

  rateLimitMap.set(email, {
    attempts: userLimit.attempts + 1,
    timestamp: userLimit.timestamp,
  });
  return false;
}