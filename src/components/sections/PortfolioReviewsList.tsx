"use client";

import { useEffect, useState } from "react";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import type { PortfolioReview } from "@/types";
import type { ReviewFormState } from "@/lib/actions/reviews";

export function PortfolioReviewsList({
  reviews,
  total,
  onMarkHelpful,
  submitReview,
}: {
  reviews: PortfolioReview[];
  total: number;
  onMarkHelpful: (id: string) => Promise<void>;
  submitReview: (prev: ReviewFormState, formData: FormData) => Promise<ReviewFormState>;
}) {
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    if (!reviewOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setReviewOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [reviewOpen]);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ReviewsList
          reviews={reviews}
          total={total}
          onMarkHelpful={(id) => void onMarkHelpful(id)}
        />

        <aside className="hidden rounded-3xl border border-muted/20 bg-surface p-6 lg:block">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Your turn</p>
          <h3 className="mt-3 font-display text-2xl font-semibold">Leave a review.</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            No scrolling marathon. Your review form is always one click away.
          </p>
          <button
            type="button"
            onClick={() => setReviewOpen(true)}
            data-cursor="magnetic"
            className="mt-6 w-full rounded-full bg-accent-design px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            Write a review
          </button>
        </aside>
      </div>

      <button
        type="button"
        onClick={() => setReviewOpen(true)}
        data-cursor="magnetic"
        className="mt-6 flex w-full items-center justify-center rounded-2xl border border-muted/20 bg-surface px-5 py-4 text-sm font-medium transition-colors hover:border-accent-design/50 hover:text-accent-design lg:hidden"
      >
        Write a review
      </button>

      {reviewOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-background/80 p-3 backdrop-blur-md sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setReviewOpen(false);
          }}
        >
          <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-muted/20 bg-surface p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Feedback</p>
                <h3 id="review-dialog-title" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
                  Tell me what you think.
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                aria-label="Close review form"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-muted/20 text-muted transition-colors hover:text-foreground"
              >
                ×
              </button>
            </div>
            <ReviewForm action={submitReview} />
          </div>
        </div>
      )}
    </>
  );
}
