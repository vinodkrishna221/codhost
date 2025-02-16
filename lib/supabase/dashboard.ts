import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';
import { PostgrestError } from '@supabase/supabase-js';

const supabase = createClientComponentClient<Database>();

export async function getDashboardStats(userId: string) {
  try {
    const { data: stats, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching stats:', error);
      return { data: null, error };
    }

    // If no stats found, return default values
    if (!stats) {
      return {
        data: {
          problems_solved: 0,
          current_streak: 0,
          achievement_points: 0
        },
        error: null
      };
    }

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return { data: null, error: error as PostgrestError };
  }
}

export async function getDashboardActivity(userId: string) {
  try {
    const { data: activities, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    return { data: activities, error: null };
  } catch (error) {
    console.error('Error in getDashboardActivity:', error);
    return { data: null, error: error as PostgrestError };
  }
}

export async function getRecommendedProblems(userId: string) {
  try {
    // First get the user's completed problems
    const { data: completedProblems } = await supabase
      .from('problem_completions')
      .select('problem_id')
      .eq('user_id', userId);

    const completedIds = completedProblems?.map(p => p.problem_id) || [];

    // Get problems not completed by the user
    const { data: problems, error } = await supabase
      .from('problems')
      .select('*')
      .eq('is_active', true)
      .eq('visibility', 'public')
      .not('id', 'in', `(${completedIds.join(',')})`)
      .limit(3);

    if (error) throw error;
    return { data: problems, error: null };
  } catch (error) {
    console.error('Error in getRecommendedProblems:', error);
    return { data: null, error: error as PostgrestError };
  }
}