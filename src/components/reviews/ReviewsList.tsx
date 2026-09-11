"use client";

import { StarRating } from "./StarRating";

type ReviewLike = {
  id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  helpful_count: number;
  created_at: string;
};

type ReviewSort = "newest" | "highest" | "helpful";

export function ReviewsList({
  reviews,
  total,
  average,
  sort,
  onSortChange,
  onMarkHelpful,
  onLoadMore,
  loading,
}: {
  reviews: ReviewLike[];
  total: number;
  average: number;
  sort: ReviewSort;
  onSortChange: (sort: ReviewSort) => void;
  onMarkHelpful: (id: string) => void;
  onLoadMore: () => void;
  loading: boolean;
}) {
  if (total === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-muted/25 bg-surface/50 p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">First impression</p>
        <p className="mt-3 font-display text-2xl font-semibold">No reviews yet.</p>
        <p className="mt-2 text-sm text-muted">Be the first person to leave feedback.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 rounded-3xl border border-muted/20 bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-muted/20 bg-background font-display text-xl font-bold">
              {average.toFixed(1)}
            </div>
            <div>
              <StarRating value={Math.round(average)} readOnly />
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                Average across all {total.toLocaleString()} review{total === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-1 font-mono text-[11px] uppercase tracking-wider">
            {(["newest", "highest", "helpful"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSortChange(option)}
                data-cursor="magnetic"
                className={`shrink-0 transition-colors ${sort === option ? "text-accent-dev" : "text-muted hover:text-foreground"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((review, index) => (
          <article
            key={review.id}
            className="group relative overflow-hidden rounded-2xl border border-muted/15 bg-surface p-5 transition-transform duration-300 hover:-translate-y-0.5 hover:border-muted/30 sm:p-6"
          >
            <span className="absolute left-0 top-0 h-full w-px bg-accent-dev/50 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{review.author_name}</p>
                <time className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-muted" dateTime={review.created_at}>
                  {new Date(review.created_at).toLocaleDateString()}
                </time>
              </div>
              <StarRating value={review.rating} readOnly size={14} />
            </div>
            {review.comment && <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{review.comment}</p>}
            <div className="mt-4 flex items-center justify-between border-t border-muted/10 pt-3 font-mono text-[10px] uppercase tracking-wider text-muted">
              <span>Review {String(index + 1).padStart(2, "0")}</span>
              <button
                onClick={() => onMarkHelpful(review.id)}
                data-cursor="magnetic"
                className="transition-colors hover:text-accent-dev"
              >
                Helpful · {review.helpful_count}
              </button>
            </div>
          </article>
        ))}
      </div>

      {reviews.length < total && (
        <div className="mt-7 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            data-cursor="magnetic"
            className="rounded-full border border-muted/25 bg-surface px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-all hover:border-accent-dev/50 hover:text-accent-dev disabled:cursor-wait disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more reviews"}
          </button>
          <p className="text-center font-mono text-[10px] uppercase tracking-wider text-muted">
            Showing {reviews.length.toLocaleString()} of {total.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
