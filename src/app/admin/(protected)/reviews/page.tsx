import { getAllReviewsAdmin } from "@/lib/supabase/queries";
import { setReviewApproved, deleteReview } from "@/lib/actions/admin/reviews";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminReviewsPage() {
  const { portfolio, project } = await getAllReviewsAdmin();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Reviews</h1>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Portfolio reviews</h2>
        <div className="mt-4 space-y-2">
          {portfolio.map((r) => (
            <div key={r.id} className="rounded-xl border border-muted/20 bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{r.author_name} — {r.rating}★</p>
                <span className={`font-mono text-xs ${r.approved ? "text-accent-dev" : "text-accent-design"}`}>
                  {r.approved ? "approved" : "pending"}
                </span>
              </div>
              {r.comment && <p className="mt-1 text-sm text-muted">{r.comment}</p>}
              <div className="mt-3 flex gap-4 font-mono text-xs">
                <form action={setReviewApproved.bind(null, "portfolio", r.id, !r.approved)}>
                  <button type="submit" className="text-accent-dev hover:underline">
                    {r.approved ? "Unapprove" : "Approve"}
                  </button>
                </form>
                <DeleteButton action={deleteReview.bind(null, "portfolio", r.id)} confirmMessage="Delete this review?" />
              </div>
            </div>
          ))}
          {portfolio.length === 0 && <p className="font-mono text-sm text-muted">No portfolio reviews yet.</p>}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold">Project reviews</h2>
        <div className="mt-4 space-y-2">
          {project.map((r) => (
            <div key={r.id} className="rounded-xl border border-muted/20 bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {r.author_name} — {r.rating}★{" "}
                  <span className="font-mono text-xs text-muted">on {r.project_title ?? "unknown project"}</span>
                </p>
                <span className={`font-mono text-xs ${r.approved ? "text-accent-dev" : "text-accent-design"}`}>
                  {r.approved ? "approved" : "pending"}
                </span>
              </div>
              {r.comment && <p className="mt-1 text-sm text-muted">{r.comment}</p>}
              <div className="mt-3 flex gap-4 font-mono text-xs">
                <form action={setReviewApproved.bind(null, "project", r.id, !r.approved)}>
                  <button type="submit" className="text-accent-dev hover:underline">
                    {r.approved ? "Unapprove" : "Approve"}
                  </button>
                </form>
                <DeleteButton action={deleteReview.bind(null, "project", r.id)} confirmMessage="Delete this review?" />
              </div>
            </div>
          ))}
          {project.length === 0 && <p className="font-mono text-sm text-muted">No project reviews yet.</p>}
        </div>
      </section>
    </div>
  );
}
