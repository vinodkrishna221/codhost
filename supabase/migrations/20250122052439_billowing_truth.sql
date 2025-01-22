/*
  # Authentication and User Tracking Schema

  1. New Tables
    - users_table
      - id (uuid, primary key)
      - email (text, unique)
      - username (text)
      - created_at (timestamp)
      - avatar_url (text)
      - current_rank (text)
    
    - user_stats
      - user_id (uuid, foreign key)
      - problems_solved (integer)
      - achievement_points (integer)
      - rank_position (integer)
      - last_updated (timestamp)
    
    - user_activities
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - problem_id (uuid, foreign key)
      - completed_at (timestamp)
      - problem_difficulty (text)
      - problem_title (text)
    
    - bookmarks
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - problem_id (uuid, foreign key)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users_table
CREATE TABLE IF NOT EXISTS public.users_table (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  avatar_url TEXT,
  current_rank TEXT DEFAULT 'E'
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.users_table(id) ON DELETE CASCADE,
  problems_solved INTEGER DEFAULT 0,
  achievement_points INTEGER DEFAULT 0,
  rank_position INTEGER,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Create user_activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users_table(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES public.problems(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  problem_difficulty TEXT NOT NULL,
  problem_title TEXT NOT NULL
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users_table(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Enable Row Level Security
ALTER TABLE public.users_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for users_table
CREATE POLICY "Users can view their own profile"
  ON public.users_table
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users_table
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for user_stats
CREATE POLICY "Users can view their own stats"
  ON public.user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policies for user_activities
CREATE POLICY "Users can view their own activities"
  ON public.user_activities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities"
  ON public.user_activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bookmarks"
  ON public.bookmarks
  FOR ALL
  USING (auth.uid() = user_id);

-- Create function to calculate and update rank
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
BEGIN
  NEW.current_rank := 
    CASE
      WHEN NEW.achievement_points >= 3600 THEN 'SSR'
      WHEN NEW.achievement_points >= 2800 THEN 'SSS'
      WHEN NEW.achievement_points >= 2100 THEN 'SS'
      WHEN NEW.achievement_points >= 1500 THEN 'S'
      WHEN NEW.achievement_points >= 1000 THEN 'A'
      WHEN NEW.achievement_points >= 600 THEN 'B'
      WHEN NEW.achievement_points >= 300 THEN 'C'
      WHEN NEW.achievement_points >= 100 THEN 'D'
      ELSE 'E'
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rank updates
CREATE TRIGGER update_rank_on_points_change
  BEFORE UPDATE OF achievement_points ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rank();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_completed_at ON public.user_activities(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_problem_id ON public.bookmarks(problem_id);