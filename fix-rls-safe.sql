-- SAFE RLS Fix for homepage_config - NO DATA CHANGES
-- Run this in Supabase SQL editor

-- First, check what columns exist in homepage_config
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'homepage_config';

-- Enable RLS on homepage_config table ONLY
alter table if exists homepage_config enable row level security;

-- Drop any existing policies to avoid conflicts
drop policy if exists "public read homepage_config" on homepage_config;
drop policy if exists "auth manage homepage_config" on homepage_config;

-- Create public read policy for homepage_config (allows anyone to read)
create policy "public read homepage_config"
on homepage_config
for select
to anon, authenticated
using (true);

-- Create admin write policy for homepage_config (allows authenticated users to manage)
create policy "auth manage homepage_config"
on homepage_config
for all
to authenticated
using (true)
with check (true);

-- DO NOT CREATE OR MODIFY TABLE - KEEP EXISTING DATA INTACT
