/*
  # Problems and Solutions Schema

  1. New Tables
    - problems
      - Core problem information and metadata
      - Includes JSON fields for flexible data storage
    - solutions
      - Linked to problems via foreign key
      - Stores solution approaches and complexity analysis
    
  2. Indexes
    - On frequently queried columns
    - For optimization of JOIN operations
    
  3. Functions
    - get_problems: Paginated problem fetching with metadata
*/

-- Create problems table
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  detailed_description TEXT NOT NULL,
  use_cases JSONB DEFAULT '[]'::JSONB,
  supported_languages JSONB DEFAULT '[]'::JSONB,
  key_insights JSONB DEFAULT '{}'::JSONB,
  is_active BOOLEAN DEFAULT true,
  visibility TEXT DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create solutions table
CREATE TABLE IF NOT EXISTS public.solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  approaches JSONB DEFAULT '[]'::JSONB,
  complexity_analysis JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_problems_is_active ON public.problems(is_active);
CREATE INDEX IF NOT EXISTS idx_problems_visibility ON public.problems(visibility);
CREATE INDEX IF NOT EXISTS idx_solutions_problem_id ON public.solutions(problem_id);

-- Create function to fetch problems with pagination
CREATE OR REPLACE FUNCTION public.get_problems(
  page_number INTEGER DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_limit INTEGER := 20;
  v_offset INTEGER := (page_number - 1) * v_limit;
  v_total_count INTEGER;
  v_result JSONB;
BEGIN
  -- Get total count
  SELECT COUNT(*)
  INTO v_total_count
  FROM public.problems p
  WHERE p.is_active = true AND p.visibility = 'public';

  -- Get paginated results
  SELECT jsonb_build_object(
    'problems', COALESCE(jsonb_agg(problem_data), '[]'::jsonb),
    'metadata', jsonb_build_object(
      'total_count', v_total_count,
      'page', page_number,
      'total_pages', CEIL(v_total_count::NUMERIC / v_limit)
    )
  )
  INTO v_result
  FROM (
    SELECT 
      p.id,
      p.title,
      COALESCE(p.summary, '') as summary,
      COALESCE(p.detailed_description, '') as detailed_description,
      COALESCE(p.use_cases, '[]'::jsonb) as use_cases,
      COALESCE(s.approaches, '[]'::jsonb) as approaches,
      COALESCE(s.complexity_analysis, '{}'::jsonb) as complexity_analysis,
      COALESCE(p.supported_languages, '[]'::jsonb) as supported_languages,
      COALESCE(p.key_insights, '{}'::jsonb) as key_insights
    FROM public.problems p
    LEFT JOIN public.solutions s ON p.id = s.problem_id
    WHERE p.is_active = true AND p.visibility = 'public'
    ORDER BY p.id ASC
    LIMIT v_limit
    OFFSET v_offset
  ) problem_data;

  RETURN v_result;
END;
$$;

-- Example query usage:
-- SELECT get_problems(1);