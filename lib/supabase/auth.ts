import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthError, Profile, UserStats } from './types';

const supabase = createClientComponentClient();

export async function signUp(email: string, password: string) {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) throw authError;

    if (authData.user) {
      // 2. Create user profile in users_table
      const { error: profileError } = await supabase
        .from('users_table')
        .insert([{
          id: authData.user.id,
          email: authData.user.email,
          created_at: new Date().toISOString(),
        }]);

      if (profileError) throw profileError;

      // 3. Initialize user stats - FIXED: Added explicit id field
      const { error: statsError } = await supabase
        .from('user_stats')
        .insert([{
          id: authData.user.id, // Add this line
          user_id: authData.user.id,
          problems_solved: 0,
          achievement_points: 0,
          current_streak: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (statsError) {
        console.error('Stats creation error:', statsError);
        throw statsError;
      }

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

    // Verify user data exists
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users_table')
        .select(`
          *,
          user_stats (*)
        `)
        .eq('id', data.user.id)
        .single();

      if (userError || !userData) {
        // Handle missing data by creating it
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
    // Check and create users_table record if missing
    const { data: existingUser } = await supabase
      .from('users_table')
      .select('*')
      .eq('id', userId)
      .single();

    if (!existingUser) {
      const { error: userError } = await supabase
        .from('users_table')
        .insert([{
          id: userId,
          email: email,
          created_at: new Date().toISOString(),
        }]);

      if (userError) throw userError;
    }

    // Check and create user_stats record if missing
    const { data: existingStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existingStats) {
      const { error: statsError } = await supabase
        .from('user_stats')
        .insert([{
          id: userId, // Add this line
          user_id: userId,
          problems_solved: 0,
          achievement_points: 0,
          current_streak: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (statsError) {
        console.error('Stats creation error:', statsError);
        throw statsError;
      }
    }

    // Verify data creation
    const { data: verifyData, error: verifyError } = await supabase
      .from('users_table')
      .select(`
        *,
        user_stats (*)
      `)
      .eq('id', userId)
      .single();

    if (verifyError || !verifyData) {
      throw new Error('Failed to verify user data creation');
    }

    return verifyData;
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
      .from('users_table')
      .select(`
        *,
        user_stats (*)
      `)
      .eq('id', session.user.id)
      .single();

    if (error) throw error;

    // If data exists but is incomplete, create missing data
    if (!data || !data.user_stats) {
      await createMissingUserData(session.user.id, session.user.email!);
      // Fetch again after creating missing data
      const { data: refreshedData, error: refreshError } = await supabase
        .from('users_table')
        .select(`
          *,
          user_stats (*)
        `)
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
      .from('users_table')
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