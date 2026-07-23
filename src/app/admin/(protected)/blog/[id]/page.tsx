import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { updateBlogPost } from "@/lib/actions/admin/blog";

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  const boundUpdate = updateBlogPost.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Edit post</h1>
      <div className="mt-8">
        <BlogPostForm post={post} action={boundUpdate} />
      </div>
    </div>
  );
}
