-- ============================================
-- حكاية (Hikaya) — Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLE: posts (admin-created stories)
-- ============================================
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  image_url text,
  category text,
  status text not null default 'draft' check (status in ('published', 'draft')),
  views integer not null default 0,
  likes integer not null default 0,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_category_idx on public.posts (category);
create index if not exists posts_created_at_idx on public.posts (created_at desc);

-- ============================================
-- TABLE: user_stories (user submissions)
-- ============================================
create table if not exists public.user_stories (
  id uuid primary key default uuid_generate_v4(),
  name text,
  title text not null,
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists user_stories_status_idx on public.user_stories (status);

-- ============================================
-- updated_at trigger for posts
-- ============================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.posts enable row level security;
alter table public.user_stories enable row level security;

-- Posts: anyone can read published posts
create policy "Public can read published posts"
  on public.posts for select
  using (status = 'published');

-- Posts: authenticated admin (any logged-in user here; restrict further via app-level
-- ADMIN_USER_ID check, or replace with a role check) can read all posts
create policy "Authenticated users can read all posts"
  on public.posts for select
  to authenticated
  using (true);

-- Posts: authenticated users can insert/update/delete (admin route is protected
-- at the middleware/app level via ADMIN_USER_ID)
create policy "Authenticated users can insert posts"
  on public.posts for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update posts"
  on public.posts for update
  to authenticated
  using (true);

create policy "Authenticated users can delete posts"
  on public.posts for delete
  to authenticated
  using (true);

-- User stories: anyone can submit (insert) a story
create policy "Anyone can submit a story"
  on public.user_stories for insert
  to anon, authenticated
  with check (true);

-- User stories: only authenticated (admin) can read all submissions
create policy "Authenticated users can read submissions"
  on public.user_stories for select
  to authenticated
  using (true);

-- User stories: only authenticated (admin) can update status
create policy "Authenticated users can update submissions"
  on public.user_stories for update
  to authenticated
  using (true);

create policy "Authenticated users can delete submissions"
  on public.user_stories for delete
  to authenticated
  using (true);

-- ============================================
-- STORAGE: bucket for post cover images
-- ============================================
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Public can view post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Authenticated users can upload post images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images');

create policy "Authenticated users can update post images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-images');

create policy "Authenticated users can delete post images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images');

-- ============================================
-- RPC: increment view count (avoids race conditions)
-- ============================================
create or replace function public.increment_post_views(post_id uuid)
returns void as $$
begin
  update public.posts set views = views + 1 where id = post_id;
end;
$$ language plpgsql security definer;

-- ============================================
-- RPC: increment like count
-- ============================================
create or replace function public.increment_post_likes(post_id uuid)
returns void as $$
begin
  update public.posts set likes = likes + 1 where id = post_id;
end;
$$ language plpgsql security definer;
