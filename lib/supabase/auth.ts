import { supabase, checkRateLimit } from './client';
import { AuthError } from './types';

const initializeUserData = async (userId: string, email: string) => {
  try {
    // Create profile if not exists
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        username: email.split('@')[0],
        full_name: null,
        avatar_url: null
      });

    if (profileError) throw profileError;

    // Insert initial user activity
    const { error: activityError } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        problem_title: 'Welcome',
        action: 'Joined',
        difficulty: 'Easy'
      });

    if (activityError) throw activityError;

  } catch (error) {
    console.error('Error initializing user data:', error);
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    if (checkRateLimit(email)) {
      throw new Error('Too many attempts. Please try again later.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    // Initialize user data after successful signup
    if (data.user) {
      await initializeUserData(data.user.id, email);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as AuthError };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    if (checkRateLimit(email)) {
      throw new Error('Too many attempts. Please try again later.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Initialize user data after successful signin (in case it doesn't exist)
    if (data.user) {
      await initializeUserData(data.user.id, email);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as AuthError };
  }
};

export const resetPassword = async (email: string) => {
  try {
    if (checkRateLimit(email)) {
      throw new Error('Too many attempts. Please try again later.');
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as AuthError };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
};

export const signInWithProvider = async (provider: 'google' | 'facebook') => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    // Initialize user data after successful OAuth signin
    if (data.user) {
      await initializeUserData(data.user.id, data.user.email || '');
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as AuthError };
  }
};