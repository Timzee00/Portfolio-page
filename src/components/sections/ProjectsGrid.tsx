"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );
  const [category, setCategory] = useState("All");

  const filtered = useMemo(
    () =>
      category === "All"
        ? projects
        : projects.filter((p) => p.category === category),
    [projects, category]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            data-cursor="magnetic"
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              category === c
                ? "bg-accent-design text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </div>
  );
}
