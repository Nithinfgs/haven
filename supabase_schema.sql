-- =========================================================================
-- HAVEN PLATFORM — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Execute this in your Supabase SQL Editor (supabase.com -> SQL Editor -> New Query -> Run)
-- =========================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE,
  name TEXT NOT NULL DEFAULT 'Sam',
  avatar TEXT DEFAULT 'S',
  age_range TEXT DEFAULT '14-17',
  school TEXT DEFAULT 'Oak Creek High',
  grade TEXT DEFAULT '11th Grade',
  bio TEXT DEFAULT 'Taking things one day at a time.',
  mood TEXT DEFAULT 'Reflective',
  theme TEXT DEFAULT 'light',
  palette TEXT DEFAULT 'haven',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. THERAPISTS TABLE
CREATE TABLE IF NOT EXISTS public.therapists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  credentials TEXT NOT NULL,
  avatar TEXT,
  introduction TEXT,
  full_bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{"English"}',
  available_today BOOLEAN DEFAULT true,
  online BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'Available',
  schedule TEXT[] DEFAULT '{"2:00 PM", "3:30 PM", "5:00 PM"}',
  why_connect TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. APPOINTMENTS & TELEHEALTH SESSIONS
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id TEXT NOT NULL,
  therapist_name TEXT NOT NULL,
  user_name TEXT NOT NULL DEFAULT 'Sam',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  meeting_link TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. REALTIME CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT DEFAULT 'user',
  sender_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DAILY HABITS
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT DEFAULT 'current_user',
  name TEXT NOT NULL,
  category TEXT DEFAULT 'morning',
  frequency TEXT DEFAULT 'daily',
  is_completed_today BOOLEAN DEFAULT false,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Allow read & write for public anon client (Demo & Prototype Mode)
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public therapists access" ON public.therapists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public appointments access" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public messages access" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public habits access" ON public.habits FOR ALL USING (true) WITH CHECK (true);

-- ENABLE REALTIME ON MESSAGES AND APPOINTMENTS
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- SEED DEFAULT THERAPISTS IF EMPTY
INSERT INTO public.therapists (id, name, credentials, avatar, introduction, specialties, languages, schedule)
VALUES 
  ('maya-patel', 'Dr. Maya Patel', 'Licensed Psychologist', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200', 'Specializes in adolescent stress, anxiety and cognitive behavioral mindfulness.', '{"Stress", "Anxiety", "School pressure"}', '{"English", "Hindi", "Tamil"}', '{"2:00 PM", "3:30 PM", "5:00 PM"}'),
  ('sarah-jenkins', 'Sarah Jenkins', 'Licensed Clinical Social Worker', 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200&h=200', 'Focuses on relationships, family dynamics and setting healthy boundaries.', '{"Relationships", "Family life", "Self-esteem"}', '{"English", "Telugu", "Kannada"}', '{"10:00 AM", "11:30 AM", "4:00 PM"}'),
  ('emma-zhao', 'Emma Zhao', 'Licensed Marriage & Family Therapist', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200', 'Guides teenagers through academic load and emotional resilience.', '{"Stress", "Identity", "Academic load"}', '{"English", "Tamil", "Telugu"}', '{"1:00 PM", "2:30 PM", "4:00 PM"}')
ON CONFLICT (id) DO NOTHING;
