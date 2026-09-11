import { getPortfolioReviewsPage } from "@/lib/supabase/queries";
import { submitPortfolioReview, markPortfolioReviewHelpful } from "@/lib/actions/reviews";
import { PortfolioReviewsList } from "./PortfolioReviewsList";

export async function PortfolioReviews() {
  const { reviews, total } = await getPortfolioReviewsPage(0, 6);

  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">06 / Reviews</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            People who stopped by.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">
            Real feedback, presented without turning the page into an endless wall of comments.
          </p>
        </div>
        <div className="shrink-0">
          <span className="font-mono text-xs text-muted">{total.toLocaleString()} review{total === 1 ? "" : "s"}</span>
        </div>
      </div>

      <PortfolioReviewsList
        reviews={reviews}
        total={total}
        onMarkHelpful={markPortfolioReviewHelpful}
        submitReview={submitPortfolioReview}
      />
    </section>
  );
}
