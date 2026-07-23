import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/supabase/queries";
import { ProjectReviewsSection } from "@/components/reviews/ProjectReviewsSection";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-dev">
        {project.category}
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg text-muted">{project.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tech_stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            data-cursor="magnetic"
            className="rounded-full bg-accent-design px-6 py-2.5 text-sm font-medium text-background"
          >
            Live demo
          </a>
        )}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            data-cursor="magnetic"
            className="rounded-full border border-muted/40 px-6 py-2.5 text-sm font-medium hover:border-accent-dev hover:text-accent-dev"
          >
            GitHub
          </a>
        )}
      </div>

      {project.description && (
        <p className="mt-12 whitespace-pre-line leading-relaxed text-muted">
          {project.description}
        </p>
      )}

      {project.features.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-xl font-semibold">Features</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {project.challenges && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold">Challenges</h2>
          <p className="mt-2 text-muted">{project.challenges}</p>
        </div>
      )}

      {project.solutions && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold">Solutions</h2>
          <p className="mt-2 text-muted">{project.solutions}</p>
        </div>
      )}

      {project.lessons_learned && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold">
            Lessons learned
          </h2>
          <p className="mt-2 text-muted">{project.lessons_learned}</p>
        </div>
      )}

      <ProjectReviewsSection projectId={project.id} />
    </article>
  );
}
