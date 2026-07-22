-- Atomic view counters. Direct UPDATEs on blog_posts/projects are
-- admin-only per 0001's RLS policies — these functions run as their
-- owner (bypassing that restriction) so a public page view can still
-- increment the count without opening write access more broadly.

create function increment_blog_post_views(post_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update blog_posts
  set views = views + 1
  where slug = post_slug and status = 'published';
end;
$$;

grant execute on function increment_blog_post_views(text) to anon, authenticated;

create function increment_project_views(project_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update projects
  set views = views + 1
  where slug = project_slug and status = 'published';
end;
$$;

grant execute on function increment_project_views(text) to anon, authenticated;
