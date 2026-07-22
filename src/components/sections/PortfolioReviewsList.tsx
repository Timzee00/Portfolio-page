"use client";

import { ReviewsList } from "@/components/reviews/ReviewsList";
import type { PortfolioReview } from "@/types";

export function PortfolioReviewsList({
  reviews,
  onMarkHelpful,
}: {
  reviews: PortfolioReview[];
  onMarkHelpful: (id: string) => Promise<void>;
}) {
  return (
    <ReviewsList
      reviews={reviews}
      onMarkHelpful={(id) => {
        // Server action reference passed from the parent Server
        // Component — fire and forget from the client's perspective.
        void onMarkHelpful(id);
      }}
    />
  );
}
