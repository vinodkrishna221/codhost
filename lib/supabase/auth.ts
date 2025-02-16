import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthError, Profile, UserStats } from './types';

const supabase = createClientComponentClient();

async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('SignUp error:', error);
    return { data: null, error: error as AuthError };
  }
}

async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('SignIn error:', error);
    return { data: null, error: error as AuthError };
  }
}

async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as AuthError };
  }
}

async function signInWithProvider(provider: 'google' | 'github') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as AuthError };
  }
}

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
}

async function getProfile(): Promise<{ data: Profile | null; error: AuthError | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: null };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('GetProfile error:', error);
    return { data: null, error: error as AuthError };
  }
}

async function getUserStats(): Promise<{ data: UserStats | null; error: AuthError | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: null };

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('GetUserStats error:', error);
    return { data: null, error: error as AuthError };
  }
}

async function updateProfile(profile: Partial<Profile>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return { data: null, error: error as AuthError };
  }
}

export {
  signIn,
  signUp,
  signOut,
  resetPassword,
  signInWithProvider,
  getProfile,
  getUserStats,
  updateProfile
};