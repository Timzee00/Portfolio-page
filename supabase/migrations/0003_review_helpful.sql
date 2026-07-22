-- Atomic "helpful" counters for reviews — same reasoning as
-- 0002_view_counters.sql: RLS only lets the author or an admin UPDATE
-- a review row, but any visitor should be able to mark one helpful.

create function increment_portfolio_review_helpful(review_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update portfolio_reviews set helpful_count = helpful_count + 1 where id = review_id;
end;
$$;
grant execute on function increment_portfolio_review_helpful(uuid) to anon, authenticated;

create function increment_project_review_helpful(review_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update project_reviews set helpful_count = helpful_count + 1 where id = review_id;
end;
$$;
grant execute on function increment_project_review_helpful(uuid) to anon, authenticated;
