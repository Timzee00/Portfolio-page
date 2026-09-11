-- Partial indexes match the public review queries and keep pagination fast
-- as the approved review set grows.

create index portfolio_reviews_approved_created_idx
  on portfolio_reviews (created_at desc)
  where approved = true;

create index portfolio_reviews_approved_rating_idx
  on portfolio_reviews (rating desc, created_at desc)
  where approved = true;

create index portfolio_reviews_approved_helpful_idx
  on portfolio_reviews (helpful_count desc, created_at desc)
  where approved = true;
