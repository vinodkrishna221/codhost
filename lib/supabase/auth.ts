import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthError, Profile, UserStats } from './types';

const supabase = createClientComponentClient();

export async function signUp(email: string, password: string) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: authData.user.email,
          created_at: new Date().toISOString(),
        }]);

      if (profileError) throw profileError;

      // Create user stats
      const { error: statsError } = await supabase
        .from('user_stats')
        .insert([{
          id: authData.user.id,
          user_id: authData.user.id,
          problems_solved: 0,
          achievement_points: 0,
          current_streak: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (statsError) throw statsError;

      return { data: authData, error: null };
    }

    return { data: null, error: new Error('User creation failed') };
  } catch (error) {
    console.error('SignUp error:', error);
    return { data: null, error: error as AuthError };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, user_stats(*)')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        await createMissingUserData(data.user.id, email);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('SignIn error:', error);
    return { data: null, error: error as AuthError };
  }
}

async function createMissingUserData(userId: string, email: string) {
  try {
    // Check and create profile if missing
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          email: email,
          created_at: new Date().toISOString(),
        }]);
      
      if (profileError) throw profileError;
    }

    // Check and create user stats if missing
    const { data: existingStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existingStats) {
      const { error: statsError } = await supabase
        .from('user_stats')
        .insert([{
          id: userId,
          user_id: userId,
          problems_solved: 0,
          achievement_points: 0,
          current_streak: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);
      
      if (statsError) throw statsError;
    }

    return true;
  } catch (error) {
    console.error('Error creating missing user data:', error);
    throw error;
  }
}

export async function resetPassword(email: string) {
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

export async function signInWithProvider(provider: 'google' | 'github') {
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

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
}

export async function getProfile(): Promise<{ data: Profile | null; error: AuthError | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: null };

    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_stats(*)')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;

    if (!data) {
      await createMissingUserData(session.user.id, session.user.email!);
      const { data: refreshedData, error: refreshError } = await supabase
        .from('profiles')
        .select('*, user_stats(*)')
        .eq('id', session.user.id)
        .single();

      if (refreshError) throw refreshError;
      return { data: refreshedData, error: null };
    }

    return { data, error: null };
  } catch (error) {
    console.error('GetProfile error:', error);
    return { data: null, error: error as AuthError };
  }
}

export async function getUserStats(): Promise<{ data: UserStats | null; error: AuthError | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: null };

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      // If stats don't exist, create them
      if (error.code === 'PGRST116') {
        await createMissingUserData(session.user.id, session.user.email!);
        // Fetch again after creating
        const { data: refreshedData, error: refreshError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (refreshError) throw refreshError;
        return { data: refreshedData, error: null };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('GetUserStats error:', error);
    return { data: null, error: error as AuthError };
  }
}

export async function updateProfile(profile: Partial<Profile>) {
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

export { signIn, signUp, resetPassword, signOut, signInWithProvider };