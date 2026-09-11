"use client";

import { useMemo, useState } from "react";
import { StarRating } from "./StarRating";

type ReviewLike = {
  id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  helpful_count: number;
  created_at: string;
};

export function ReviewsList({
  reviews,
  total,
  onMarkHelpful,
}: {
  reviews: ReviewLike[];
  total: number;
  onMarkHelpful: (id: string) => void;
}) {
  const [sort, setSort] = useState<"newest" | "highest" | "helpful">("newest");

  const sorted = useMemo(() => {
    const copy = [...reviews];
    if (sort === "newest") copy.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    if (sort === "highest") copy.sort((a, b) => b.rating - a.rating);
    if (sort === "helpful") copy.sort((a, b) => b.helpful_count - a.helpful_count);
    return copy;
  }, [reviews, sort]);

  if (total === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-muted/25 bg-surface/50 p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">First impression</p>
        <p className="mt-3 font-display text-2xl font-semibold">No reviews yet.</p>
        <p className="mt-2 text-sm text-muted">Be the first person to leave feedback.</p>
      </div>
    );
  }

  const average = (reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(reviews.length, 1)).toFixed(1);

  return (
    <div>
      <div className="mb-6 rounded-3xl border border-muted/20 bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-muted/20 bg-background font-display text-xl font-bold">
              {average}
            </div>
            <div>
              <StarRating value={Math.round(Number(average))} readOnly />
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                Based on {total.toLocaleString()} review{total === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-1 font-mono text-[11px] uppercase tracking-wider">
            {(["newest", "highest", "helpful"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                data-cursor="magnetic"
                className={`shrink-0 transition-colors ${sort === s ? "text-accent-dev" : "text-muted hover:text-foreground"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((review, index) => (
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

      {total > reviews.length && (
        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-wider text-muted">
          Showing {reviews.length} of {total.toLocaleString()} · More reviews are loaded separately to keep the page fast.
        </p>
      )}
    </div>
  );
}
