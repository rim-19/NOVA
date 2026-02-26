-- Fix RLS for homepage_config table
-- Run this in Supabase SQL editor

-- Enable RLS on homepage_config table
alter table if exists homepage_config enable row level security;

-- Drop any existing policies to avoid conflicts
drop policy if exists "public read homepage_config" on homepage_config;
drop policy if exists "auth manage homepage_config" on homepage_config;

-- Create public read policy for homepage_config
create policy "public read homepage_config"
on homepage_config
for select
to anon, authenticated
using (true);

-- Create admin write policy for homepage_config
create policy "auth manage homepage_config"
on homepage_config
for all
to authenticated
using (true)
with check (true);

-- If homepage_config table doesn't exist, create it
create table if not exists homepage_config (
  id integer primary key default 1 check (id = 1),
  hero_tagline text default 'Luxury Intimate Collection',
  hero_title text default 'NOVA',
  hero_subtitle text default 'Desire is not worn. It is felt.',
  hero_cta_text text default 'Explore Collections',
  hero_cta_link text default '/collection',
  narrative_title text default 'Crafted for the Body, Celebrated by the Soul',
  narrative_content text default 'Each piece tells a story of intimacy and elegance.',
  updated_at timestamp with time zone default now()
);

-- Insert default config if table is empty
insert into homepage_config (id, hero_tagline, hero_title, hero_subtitle, hero_cta_text, hero_cta_link, narrative_title, narrative_content)
values (1, 
  'Luxury Intimate Collection',
  'NOVA', 
  'Desire is not worn. It is felt.',
  'Explore Collections',
  '/collection',
  'Crafted for the Body, Celebrated by the Soul',
  'Each piece tells a story of intimacy and elegance.'
)
on conflict (id) do nothing;
