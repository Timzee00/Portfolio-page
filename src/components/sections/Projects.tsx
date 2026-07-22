import { getPublishedProjects } from "@/lib/supabase/queries";
import { ProjectsGrid } from "./ProjectsGrid";

export async function Projects() {
  const projects = await getPublishedProjects();

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Projects
      </p>
      <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
        Featured work.
      </h2>

      {projects.length === 0 ? (
        <p className="mt-16 font-mono text-sm text-muted">
          No published projects yet — populate the `projects` table (see
          supabase/seed.sql for sample data).
        </p>
      ) : (
        <div className="mt-16">
          <ProjectsGrid projects={projects} />
        </div>
      )}
    </section>
  );
}
