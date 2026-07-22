"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ReviewSchema = z.object({
  author_name: z.string().trim().min(1, "Name is required").max(120),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional(),
});

export type ReviewFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitPortfolioReview(
  _prev: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const parsed = ReviewSchema.safeParse({
    author_name: formData.get("author_name"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase.from("portfolio_reviews").insert({
    author_name: parsed.data.author_name,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
    user_id: userData.user?.id ?? null,
  });

  if (error) {
    console.error("submitPortfolioReview:", error.message);
    return { status: "error", message: "Couldn't submit your review. Try again." };
  }

  revalidatePath("/");
  return { status: "success", message: "Thanks for the review!" };
}

export async function submitProjectReview(
  projectId: string,
  _prev: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const parsed = ReviewSchema.safeParse({
    author_name: formData.get("author_name"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase.from("project_reviews").insert({
    project_id: projectId,
    author_name: parsed.data.author_name,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
    user_id: userData.user?.id ?? null,
  });

  if (error) {
    console.error("submitProjectReview:", error.message);
    return { status: "error", message: "Couldn't submit your review. Try again." };
  }

  revalidatePath("/projects");
  return { status: "success", message: "Thanks for the review!" };
}

export async function markPortfolioReviewHelpful(reviewId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_portfolio_review_helpful", {
    review_id: reviewId,
  });
  if (error) console.error("markPortfolioReviewHelpful:", error.message);
  revalidatePath("/");
}

export async function markProjectReviewHelpful(reviewId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_project_review_helpful", {
    review_id: reviewId,
  });
  if (error) console.error("markProjectReviewHelpful:", error.message);
  revalidatePath("/projects");
}
