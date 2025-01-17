/*
  # Dashboard Tables Migration

  1. New Tables
    - `user_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `problems_solved` (integer)
      - `current_streak` (integer)
      - `achievement_points` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `problem_id` (uuid, references problems)
      - `problem_title` (text)
      - `action` (text)
      - `difficulty` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read their own data
      - Create their own activities
      - Update their own stats
*/

-- Create user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problems_solved INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  achievement_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES public.problems(id) ON DELETE SET NULL,
  problem_title TEXT NOT NULL,
  action TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at DESC);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for user_stats
CREATE POLICY "Users can view their own stats"
  ON public.user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.user_stats
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

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION handle_stats_updated_at();

-- Create function to initialize user stats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to initialize stats for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update user stats when a problem is solved
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
      END
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stats when activity is added
CREATE TRIGGER on_problem_solved
  AFTER INSERT ON public.user_activities
  FOR EACH ROW
  WHEN (NEW.action = 'Solved')
  EXECUTE FUNCTION public.update_user_stats_on_solve();