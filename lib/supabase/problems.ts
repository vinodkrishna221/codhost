import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

const supabase = createClientComponentClient<Database>();

export async function getProblems(page = 1) {
  try {
    // First, get the problems
    const { data: problems, error: problemsError } = await supabase
      .from('problems')
      .select(`
        *,
        solutions (*)
      `)
      .eq('is_active', true)
      .eq('visibility', 'public')
      .order('id', { ascending: true })
      .range((page - 1) * 6, page * 6 - 1);

    if (problemsError) throw problemsError;

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('problems')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('visibility', 'public');

    if (countError) throw countError;

    return {
      data: {
        problems: problems || [],
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