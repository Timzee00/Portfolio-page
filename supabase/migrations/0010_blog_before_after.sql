-- Optional before/after media for blog posts.
-- Existing posts remain normal blog posts because before_after defaults to false.
alter table public.blog_posts
  add column if not exists before_after boolean not null default false,
  add column if not exists before_media_type text,
  add column if not exists before_media_url text,
  add column if not exists before_project_url text,
  add column if not exists after_media_type text,
  add column if not exists after_media_url text,
  add column if not exists after_project_url text;

alter table public.blog_posts
  drop constraint if exists blog_posts_before_media_type_check,
  drop constraint if exists blog_posts_after_media_type_check;

alter table public.blog_posts
  add constraint blog_posts_before_media_type_check
    check (before_media_type is null or before_media_type in ('image', 'video')),
  add constraint blog_posts_after_media_type_check
    check (after_media_type is null or after_media_type in ('image', 'video'));

create index if not exists blog_posts_before_after_idx
  on public.blog_posts (before_after)
  where before_after = true;
