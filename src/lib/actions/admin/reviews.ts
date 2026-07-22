"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ReviewKind = "portfolio" | "project";

const TABLE: Record<ReviewKind, "portfolio_reviews" | "project_reviews"> = {
  portfolio: "portfolio_reviews",
  project: "project_reviews",
};

export async function setReviewApproved(kind: ReviewKind, id: string, approved: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from(TABLE[kind]).update({ approved }).eq("id", id);
  if (error) console.error("setReviewApproved:", error.message);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function deleteReview(kind: ReviewKind, id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from(TABLE[kind]).delete().eq("id", id);
  if (error) console.error("deleteReview:", error.message);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/projects");
}
