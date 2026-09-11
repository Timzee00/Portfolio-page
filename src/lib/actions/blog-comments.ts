"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBlogCommentsPage } from "@/lib/supabase/queries";
import { allowPublicAction, honeypotTriggered } from "@/lib/abuse";

const CommentSchema = z.object({
  author_name: z.string().trim().min(1, "Name is required").max(120),
  comment: z.string().trim().min(1, "Comment is required").max(2000),
});

export type BlogCommentFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function loadBlogCommentsPage(postId: string, page: number) {
  const safePage = Number.isInteger(page) ? Math.max(0, page) : 0;
  return getBlogCommentsPage(postId, safePage, 10);
}

export async function submitBlogComment(
  postId: string,
  slug: string,
  _prev: BlogCommentFormState,
  formData: FormData
): Promise<BlogCommentFormState> {
  if (honeypotTriggered(formData)) return { status: "success", message: "Thanks — your comment was received." };

  const parsedId = z.string().uuid().safeParse(postId);
  if (!parsedId.success) return { status: "error", message: "That post could not be found." };

  const parsed = CommentSchema.safeParse({
    author_name: formData.get("author_name"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const allowed = await allowPublicAction("blog-comment", 5, 3600, userData.user?.id);
  if (!allowed) return { status: "error", message: "Too many comments recently. Please try again later." };

  const { error } = await supabase.from("blog_comments").insert({
    post_id: parsedId.data,
    user_id: userData.user?.id ?? null,
    author_name: parsed.data.author_name,
    comment: parsed.data.comment,
    approved: false,
  });

  if (error) {
    console.error("submitBlogComment:", error.message);
    return { status: "error", message: "Couldn't submit your comment. Try again." };
  }

  revalidatePath(`/blog/${slug}`);
  return { status: "success", message: "Comment received — it will appear after approval." };
}
