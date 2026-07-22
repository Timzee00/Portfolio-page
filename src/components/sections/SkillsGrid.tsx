"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Skill } from "@/types";

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = skills.find((s) => s.id === activeId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <button
            key={skill.id}
            data-cursor="magnetic"
            onMouseEnter={() => setActiveId(skill.id)}
            onFocus={() => setActiveId(skill.id)}
            onMouseLeave={() => setActiveId((id) => (id === skill.id ? null : id))}
            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
              activeId === skill.id
                ? "border-accent-dev bg-accent-dev/10 text-accent-dev"
                : "border-muted/30 text-muted hover:border-muted/60 hover:text-foreground"
            }`}
          >
            {skill.name}
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[92px]">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-muted/20 bg-surface p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">
                  {active.name}
                </h3>
                <span className="font-mono text-xs text-muted">
                  {active.category}
                  {active.years_experience
                    ? ` · ${active.years_experience}+ yrs`
                    : ""}
                </span>
              </div>
              {active.description && (
                <p className="mt-2 text-sm text-muted">{active.description}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
