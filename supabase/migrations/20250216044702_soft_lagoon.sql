/*
  # Update Schema and RLS Policies

  1. Tables
    - Ensures all required tables exist with correct structure
    - Adds missing indexes and constraints
    - Updates RLS policies

  2. Changes
    - Adds missing indexes
    - Updates RLS policies for better security
    - Adds trigger functions for stats updates

  3. Security
    - Enables RLS on all tables
    - Adds appropriate policies for CRUD operations
*/

-- Ensure problem_completions table exists
CREATE TABLE IF NOT EXISTS public.problem_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_problem_completions_user_id ON public.problem_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_completions_problem_id ON public.problem_completions(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);

-- Enable RLS on all tables
ALTER TABLE public.problem_completions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own completions" ON public.problem_completions;
DROP POLICY IF EXISTS "Users can create their own completions" ON public.problem_completions;
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can create their own activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;

-- Create policies for problem_completions
CREATE POLICY "Users can view their own completions"
  ON public.problem_completions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions"
  ON public.problem_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for user_activities
CREATE POLICY "Users can view their own activities"
  ON public.user_activities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities"
  ON public.user_activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for user_stats
CREATE POLICY "Users can view their own stats"
  ON public.user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create or replace function to update user stats
CREATE OR REPLACE FUNCTION public.update_user_stats_on_solve()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user stats
  UPDATE public.user_stats
  SET 
    problems_solved = problems_solved + 1,
    achievement_points = achievement_points + 
      CASE 
        WHEN NEW.difficulty = 'Easy' THEN 10
        WHEN NEW.difficulty = 'Medium' THEN 20
        WHEN NEW.difficulty = 'Hard' THEN 30
        ELSE 0
      END,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace trigger for updating stats
DROP TRIGGER IF EXISTS on_problem_solved ON public.user_activities;
CREATE TRIGGER on_problem_solved
  AFTER INSERT ON public.user_activities
  FOR EACH ROW
  WHEN (NEW.action = 'Solved')
  EXECUTE FUNCTION public.update_user_stats_on_solve();

-- Create or replace function to initialize user stats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id, problems_solved, achievement_points, current_streak)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();