"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/types";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <motion.div layout whileHover={{ y: -5 }} transition={{ duration: 0.22 }} className="h-full">
      <Link href={`/projects/${project.slug}`} data-cursor="magnetic" className="group relative flex h-full min-h-[25rem] flex-col overflow-hidden rounded-[1.35rem] border border-muted/15 bg-surface transition-all duration-300 hover:border-accent-dev/45 hover:shadow-2xl">
        <div className={`relative overflow-hidden bg-background ${featured ? "h-[24rem] sm:h-[29rem]" : "h-[19rem] sm:h-[22rem]"}`}>
          {project.thumbnail_url ? (
            <img src={project.thumbnail_url} alt="" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-background font-mono text-xs text-muted">No thumbnail</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/5 to-transparent opacity-70" />
          <div className="absolute left-5 top-5 rounded-full border border-foreground/15 bg-background/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground backdrop-blur-md">{project.category}</div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-dev">{String(project.id).padStart(2, "0")}</p>
              <h3 className={`font-display font-semibold leading-tight text-foreground ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{project.title}</h3>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background/60 text-lg text-foreground backdrop-blur-md transition-all group-hover:-rotate-45 group-hover:border-accent-design group-hover:text-accent-design">↗</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <p className="max-w-2xl text-sm leading-6 text-muted">{project.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {project.tech_stack.slice(0, featured ? 5 : 4).map((tech) => (
              <span key={tech} className="rounded-full border border-muted/15 bg-background px-2.5 py-1 font-mono text-[10px] text-muted">{tech}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
