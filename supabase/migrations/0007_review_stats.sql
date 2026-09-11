-- Keep portfolio review totals and ratings as O(1) reads.
-- This avoids exact COUNT(*) and averaging millions of rows on every page view.

create table portfolio_review_stats (
  id smallint primary key default 1 check (id = 1),
  total_reviews bigint not null default 0 check (total_reviews >= 0),
  rating_sum bigint not null default 0 check (rating_sum >= 0),
  updated_at timestamptz not null default now()
);

insert into portfolio_review_stats (id, total_reviews, rating_sum)
select
  1,
  count(*) filter (where approved),
  coalesce(sum(rating) filter (where approved), 0)
from portfolio_reviews
on conflict (id) do update set
  total_reviews = excluded.total_reviews,
  rating_sum = excluded.rating_sum,
  updated_at = now();

alter table portfolio_review_stats enable row level security;
create policy "public read portfolio review stats"
  on portfolio_review_stats for select using (true);

create or replace function sync_portfolio_review_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.approved then
      update portfolio_review_stats
      set total_reviews = total_reviews + 1,
          rating_sum = rating_sum + new.rating,
          updated_at = now()
      where id = 1;
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    if old.approved then
      update portfolio_review_stats
      set total_reviews = greatest(total_reviews - 1, 0),
          rating_sum = greatest(rating_sum - old.rating, 0),
          updated_at = now()
      where id = 1;
    end if;
    return old;
  end if;

  if old.approved and new.approved then
    update portfolio_review_stats
    set rating_sum = greatest(rating_sum - old.rating + new.rating, 0),
        updated_at = now()
    where id = 1;
  elsif old.approved and not new.approved then
    update portfolio_review_stats
    set total_reviews = greatest(total_reviews - 1, 0),
        rating_sum = greatest(rating_sum - old.rating, 0),
        updated_at = now()
    where id = 1;
  elsif not old.approved and new.approved then
    update portfolio_review_stats
    set total_reviews = total_reviews + 1,
        rating_sum = rating_sum + new.rating,
        updated_at = now()
    where id = 1;
  end if;

  return new;
end;
$$;

create trigger portfolio_review_stats_sync
after insert or update of approved, rating or delete on portfolio_reviews
for each row execute function sync_portfolio_review_stats();
