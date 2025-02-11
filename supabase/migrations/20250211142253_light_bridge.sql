/*
  # Add Problem Completions Table

  1. New Tables
    - `problem_completions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `problem_id` (uuid, references problems)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `problem_completions` table
    - Add policies for authenticated users to:
      - View their own completions
      - Create new completions
*/

-- Create problem_completions table
CREATE TABLE IF NOT EXISTS public.problem_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Enable RLS
ALTER TABLE public.problem_completions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own completions"
  ON public.problem_completions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions"
  ON public.problem_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_problem_completions_user_id ON public.problem_completions(user_id);
CREATE INDEX idx_problem_completions_problem_id ON public.problem_completions(problem_id);