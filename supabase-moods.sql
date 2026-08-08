-- ============================================
-- Hearten Mood Reactions Table
-- Run in Supabase SQL Editor
-- ============================================

CREATE TABLE post_moods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('support', 'sad', 'angry', 'pig')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, mood)
);

ALTER TABLE post_moods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read moods" ON post_moods FOR SELECT USING (true);

CREATE POLICY "Auth insert moods" ON post_moods FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Auth delete moods" ON post_moods FOR DELETE 
  USING (auth.uid() = user_id);
