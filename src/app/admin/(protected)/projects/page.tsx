import Link from "next/link";
import { getAllProjectsAdmin } from "@/lib/supabase/queries";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProject } from "@/lib/actions/admin/projects";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-accent-design px-5 py-2.5 text-sm font-medium text-background"
        >
          New project
        </Link>
      </div>

      <div className="mt-8 space-y-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border border-muted/20 bg-surface px-5 py-3"
          >
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="font-mono text-xs text-muted">
                /{p.slug} · {p.status} · {p.category}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/admin/projects/${p.id}`} className="text-accent-dev">
                Edit
              </Link>
              <DeleteButton
                action={deleteProject.bind(null, p.id)}
                confirmMessage={`Delete "${p.title}"? This can't be undone.`}
              />
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="font-mono text-sm text-muted">No projects yet.</p>
        )}
      </div>
    </div>
  );
}
