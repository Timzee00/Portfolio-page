import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { createBlogPost } from "@/lib/actions/admin/blog";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">New post</h1>
      <div className="mt-8">
        <BlogPostForm action={createBlogPost} />
      </div>
    </div>
  );
}
