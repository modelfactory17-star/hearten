-- ============================================
-- Hearten Polls System
-- Run in Supabase SQL Editor
-- ============================================

-- 0. Add role column to profiles FIRST (policies below reference it)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';

-- 1. Polls table
CREATE TABLE IF NOT EXISTS polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read polls" ON polls FOR SELECT USING (true);

CREATE POLICY "Admin insert polls" ON polls FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin update polls" ON polls FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 2. Poll options
CREATE TABLE poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read options" ON poll_options FOR SELECT USING (true);

CREATE POLICY "Admin insert options" ON poll_options FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 3. Poll votes (multi-select: one user can vote for multiple options per poll)
CREATE TABLE poll_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, option_id, user_id)
);

ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read votes" ON poll_votes FOR SELECT USING (true);

CREATE POLICY "Auth insert votes" ON poll_votes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- N. Set your user as admin (replace with your email)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
