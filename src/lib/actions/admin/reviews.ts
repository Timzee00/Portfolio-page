"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";

type ReviewKind = "portfolio" | "project";

const TABLE: Record<ReviewKind, "portfolio_reviews" | "project_reviews"> = {
  portfolio: "portfolio_reviews",
  project: "project_reviews",
};

export async function setReviewApproved(kind: ReviewKind, id: string, approved: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from(TABLE[kind]).update({ approved }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function deleteReview(kind: ReviewKind, id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from(TABLE[kind]).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/projects");
}
