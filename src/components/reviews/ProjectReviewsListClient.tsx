"use client";

import { ReviewsList } from "./ReviewsList";
import type { ProjectReview } from "@/types";

export function ProjectReviewsListClient({
  reviews,
  onMarkHelpful,
}: {
  reviews: ProjectReview[];
  onMarkHelpful: (id: string) => Promise<void>;
}) {
  return (
    <ReviewsList
      reviews={reviews}
      onMarkHelpful={(id) => {
        void onMarkHelpful(id);
      }}
    />
  );
}
