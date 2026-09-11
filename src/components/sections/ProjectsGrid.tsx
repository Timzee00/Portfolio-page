"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => category === "All" ? projects : projects.filter((p) => p.category === category), [projects, category]);

  return (
    <div>
      <div className="flex items-end justify-between gap-6 border-b border-muted/15 pb-5">
        <div className="flex max-w-full flex-wrap gap-1.5">
          {categories.map((c) => (
            <button key={c} data-cursor="magnetic" onClick={() => setCategory(c)} className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${category === c ? "border-accent-design bg-accent-design text-background" : "border-muted/15 text-muted hover:border-muted/40 hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:block">{String(filtered.length).padStart(2, "0")} projects</span>
      </div>

      <motion.div layout className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-12">
        {filtered.map((project, index) => (
          <div key={project.id} className={index === 0 ? "md:col-span-7" : index === 1 ? "md:col-span-5" : "md:col-span-6"}>
            <ProjectCard project={project} featured={index === 0} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
