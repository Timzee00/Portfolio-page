"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div layout whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="magnetic"
        className="group block h-full rounded-2xl border border-muted/20 bg-surface p-6 transition-colors hover:border-accent-dev/50"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-dev">
            {project.category}
          </span>
        </div>

        <h3 className="mt-4 font-display text-xl font-semibold group-hover:text-accent-design">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-muted">{project.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech_stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-background px-2.5 py-1 font-mono text-xs text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
