import Link from "next/link";
import { getAllBlogPostsAdmin } from "@/lib/supabase/queries";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteBlogPost } from "@/lib/actions/admin/blog";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-accent-design px-5 py-2.5 text-sm font-medium text-background"
        >
          New post
        </Link>
      </div>

      <div className="mt-8 space-y-2">
        {posts.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border border-muted/20 bg-surface px-5 py-3"
          >
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="font-mono text-xs text-muted">
                /{p.slug} ·{" "}
                {p.status === "published" && p.published_at && new Date(p.published_at) > new Date()
                  ? `scheduled for ${new Date(p.published_at).toLocaleString()}`
                  : p.status}{" "}
                · {p.views} views
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/admin/blog/${p.id}`} className="text-accent-dev">
                Edit
              </Link>
              <DeleteButton
                action={deleteBlogPost.bind(null, p.id)}
                confirmMessage={`Delete "${p.title}"? This can't be undone.`}
              />
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="font-mono text-sm text-muted">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
