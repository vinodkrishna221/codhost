import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

const supabase = createClientComponentClient<Database>();

export async function getDashboardStats(userId: string) {
  try {
    const { data: stats, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { data: stats, error: null };
  } catch (error) {
    return { data: null, error };
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
    return { data: null, error };
  }
}

export async function getRecommendedProblems(userId: string) {
  try {
    const { data: problems, error } = await supabase
      .from('problems')
      .select('*')
      .eq('is_active', true)
      .eq('visibility', 'public')
      .limit(3);

    if (error) throw error;
    return { data: problems, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function toggleProblemCompletion(
  userId: string,
  problemId: string,
  problemTitle: string,
  difficulty: string
) {
  try {
    // Check if problem is already completed
    const { data: existingActivity } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .eq('action', 'Solved')
      .single();

    if (existingActivity) {
      // Remove completion
      const { error } = await supabase
        .from('user_activities')
        .delete()
        .eq('id', existingActivity.id);

      if (error) throw error;
      return { data: { completed: false }, error: null };
    } else {
      // Mark as completed
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          problem_id: problemId,
          problem_title: problemTitle,
          action: 'Solved',
          difficulty: difficulty
        });

      if (error) throw error;
      return { data: { completed: true }, error: null };
    }
  } catch (error) {
    return { data: null, error };
  }
}