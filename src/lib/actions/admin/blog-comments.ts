"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export async function setBlogCommentApproved(id: string, approved: boolean, slug: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("blog_comments").update({ approved }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/comments");
  revalidatePath(`/blog/${slug}`);
}

export async function deleteBlogComment(id: string, slug: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("blog_comments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/comments");
  revalidatePath(`/blog/${slug}`);
}
