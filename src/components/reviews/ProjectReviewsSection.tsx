import { getProjectReviews } from "@/lib/supabase/queries";
import { submitProjectReview, markProjectReviewHelpful } from "@/lib/actions/reviews";
import { ReviewForm } from "./ReviewForm";
import { ProjectReviewsListClient } from "./ProjectReviewsListClient";

export async function ProjectReviewsSection({ projectId }: { projectId: string }) {
  const reviews = await getProjectReviews(projectId);
  const boundSubmit = submitProjectReview.bind(null, projectId);

  return (
    <div className="mt-20">
      <h2 className="font-display text-xl font-semibold">Reviews</h2>
      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_300px]">
        <ProjectReviewsListClient reviews={reviews} onMarkHelpful={markProjectReviewHelpful} />
        <ReviewForm action={boundSubmit} />
      </div>
    </div>
  );
}
