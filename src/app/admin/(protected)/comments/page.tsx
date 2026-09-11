import Link from "next/link";
import { getAllBlogCommentsAdmin } from "@/lib/supabase/queries";
import { setBlogCommentApproved, deleteBlogComment } from "@/lib/actions/admin/blog-comments";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminCommentsPage() {
  const comments = await getAllBlogCommentsAdmin(50);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">Community</p>
          <h1 className="font-display text-3xl font-bold">Blog comments</h1>
        </div>
        <span className="font-mono text-xs text-muted">Latest 50</span>
      </div>

      <div className="mt-8 space-y-3">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-2xl border border-muted/20 bg-surface p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{comment.author_name}</p>
                  <span className={`rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${comment.approved ? "bg-accent-dev/10 text-accent-dev" : "bg-accent-design/10 text-accent-design"}`}>
                    {comment.approved ? "approved" : "pending"}
                  </span>
                </div>
                {comment.post_slug && (
                  <Link href={`/blog/${comment.post_slug}#comments`} className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-muted hover:text-accent-dev">
                    {comment.post_title ?? "View post"}
                  </Link>
                )}
              </div>
              <time dateTime={comment.created_at} className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {new Date(comment.created_at).toLocaleString()}
              </time>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted">{comment.comment}</p>

            <div className="mt-4 flex flex-wrap gap-4 border-t border-muted/10 pt-4 font-mono text-xs">
              <form action={setBlogCommentApproved.bind(null, comment.id, !comment.approved, comment.post_slug ?? "")}>
                <button type="submit" className="text-accent-dev hover:underline">
                  {comment.approved ? "Unapprove" : "Approve"}
                </button>
              </form>
              <DeleteButton
                action={deleteBlogComment.bind(null, comment.id, comment.post_slug ?? "")}
                confirmMessage="Delete this comment?"
              />
            </div>
          </article>
        ))}
        {comments.length === 0 && <p className="font-mono text-sm text-muted">No blog comments yet.</p>}
      </div>
    </div>
  );
}
