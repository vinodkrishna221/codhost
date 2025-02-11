import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

const supabase = createClientComponentClient<Database>();

export async function getProblems(page = 1) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Base query
    let query = supabase
      .from('problems')
      .select(`
        *,
        solutions (*),
        problem_completions (
          completed_at
        )
      `)
      .eq('is_active', true)
      .eq('visibility', 'public')
      .order('id', { ascending: true })
      .range((page - 1) * 6, page * 6 - 1);

    // Add user filter for completions if logged in
    if (session?.user) {
      query = query.eq('problem_completions.user_id', session.user.id);
    }

    const { data: problems, error: problemsError } = await query;

    if (problemsError) throw problemsError;

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('problems')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('visibility', 'public');

    if (countError) throw countError;

    // Transform the response to include isCompleted flag
    const transformedProblems = problems?.map(problem => ({
      ...problem,
      isCompleted: problem.problem_completions && problem.problem_completions.length > 0
    }));

    return {
      data: {
        problems: transformedProblems || [],
        metadata: {
          total_count: count || 0,
          page: page,
          total_pages: Math.ceil((count || 0) / 6)
        }
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching problems:', error);
    return { data: null, error };
  }
}

export async function getProblemCompletionStatus(problemId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { data: null, error: null };

    const { data, error } = await supabase
      .from('problem_completions')
      .select('completed_at')
      .eq('problem_id', problemId)
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching problem completion status:', error);
    return { data: null, error };
  }
}