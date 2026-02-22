-- NOVA production setup
-- Run in Supabase SQL editor.

create extension if not exists "uuid-ossp";

-- Products: align optional storefront/admin fields
alter table if exists products
  add column if not exists colors text[] default '{}',
  add column if not exists is_bestseller boolean default false,
  add column if not exists is_new_arrival boolean default false,
  add column if not exists popularity integer default 0,
  add column if not exists discount_price numeric,
  add column if not exists is_featured boolean default false,
  add column if not exists is_visible boolean default true;

-- Orders: support checkout payload and admin export details
alter table if exists orders
  add column if not exists message text,
  add column if not exists items jsonb;

-- Site content singleton (used by Hero/Promo/Narrative editors)
create table if not exists site_content (
  id integer primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default now()
);

insert into site_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- Performance indexes
create index if not exists idx_products_visible on products(is_visible);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_products_bestseller on products(is_bestseller);
create index if not exists idx_products_collection_slug on products(collection_slug);
create index if not exists idx_products_created_at on products(created_at desc);
create index if not exists idx_orders_created_at on orders(created_at desc);

-- Enable RLS
alter table if exists products enable row level security;
alter table if exists collections enable row level security;
alter table if exists orders enable row level security;
alter table if exists site_content enable row level security;

-- Drop old policies safely
drop policy if exists "public read products" on products;
drop policy if exists "auth manage products" on products;
drop policy if exists "public read collections" on collections;
drop policy if exists "auth manage collections" on collections;
drop policy if exists "auth manage orders" on orders;
drop policy if exists "public read site_content" on site_content;
drop policy if exists "auth manage site_content" on site_content;

-- Storefront public reads
create policy "public read visible products"
on products
for select
to anon, authenticated
using (is_visible = true);

create policy "public read collections"
on collections
for select
to anon, authenticated
using (true);

create policy "public read site content"
on site_content
for select
to anon, authenticated
using (true);

-- Admin writes (authenticated app users)
create policy "auth manage products"
on products
for all
to authenticated
using (true)
with check (true);

create policy "auth manage collections"
on collections
for all
to authenticated
using (true)
with check (true);

create policy "auth manage orders"
on orders
for all
to authenticated
using (true)
with check (true);

create policy "auth manage site content"
on site_content
for all
to authenticated
using (true)
with check (true);

-- Storage bucket and policies for admin image uploads
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
drop policy if exists "auth upload product images" on storage.objects;
drop policy if exists "auth update product images" on storage.objects;
drop policy if exists "auth delete product images" on storage.objects;

create policy "public read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "auth upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images');

create policy "auth update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

create policy "auth delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images');

