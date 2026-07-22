import { getPortfolioReviews } from "@/lib/supabase/queries";
import { submitPortfolioReview, markPortfolioReviewHelpful } from "@/lib/actions/reviews";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { PortfolioReviewsList } from "./PortfolioReviewsList";

export async function PortfolioReviews() {
  const reviews = await getPortfolioReviews();

  return (
    <section id="reviews" className="mx-auto max-w-4xl px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Reviews</p>
      <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
        What visitors think.
      </h2>

      <div className="mt-12 grid gap-8 md:grid-cols-[1fr_320px]">
        <PortfolioReviewsList reviews={reviews} onMarkHelpful={markPortfolioReviewHelpful} />
        <ReviewForm action={submitPortfolioReview} />
      </div>
    </section>
  );
}
