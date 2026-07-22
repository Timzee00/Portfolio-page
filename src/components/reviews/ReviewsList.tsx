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
  onMarkHelpful,
}: {
  reviews: ReviewLike[];
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

  if (reviews.length === 0) {
    return <p className="font-mono text-sm text-muted">No reviews yet — be the first.</p>;
  }

  const average = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <StarRating value={Math.round(Number(average))} readOnly />
          <span className="font-mono text-sm text-muted">
            {average} average · {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex gap-2 font-mono text-xs">
          {(["newest", "highest", "helpful"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              data-cursor="magnetic"
              className={sort === s ? "text-accent-dev" : "text-muted hover:text-foreground"}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((review) => (
          <div key={review.id} className="rounded-xl border border-muted/20 bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="font-medium">{review.author_name}</p>
              <StarRating value={review.rating} readOnly size={14} />
            </div>
            {review.comment && <p className="mt-2 text-sm text-muted">{review.comment}</p>}
            <div className="mt-3 flex items-center gap-3 font-mono text-xs text-muted">
              <time dateTime={review.created_at}>
                {new Date(review.created_at).toLocaleDateString()}
              </time>
              <button
                onClick={() => onMarkHelpful(review.id)}
                data-cursor="magnetic"
                className="hover:text-accent-dev"
              >
                Helpful ({review.helpful_count})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
