"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Skill } from "@/types";

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const [activeId, setActiveId] = useState<string | null>(skills[0]?.id ?? null);
  const active = skills.find((s) => s.id === activeId) ?? skills[0] ?? null;

  return (
    <div className="relative">
      <div className="rounded-[2rem] border border-muted/15 bg-surface/40 p-3 sm:p-5">
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {skills.map((skill, index) => (
            <button
              key={skill.id}
              data-cursor="magnetic"
              onMouseEnter={() => setActiveId(skill.id)}
              onFocus={() => setActiveId(skill.id)}
              onClick={() => setActiveId(skill.id)}
              className={`group flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-2.5 text-left text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${
                activeId === skill.id
                  ? "border-accent-dev/70 bg-accent-dev/10 text-accent-dev shadow-[0_0_0_1px_hsl(var(--accent-dev)/0.12)]"
                  : "border-muted/20 bg-background/30 text-muted hover:border-muted/50 hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[9px] opacity-40">{String(index + 1).padStart(2, "0")}</span>
              {skill.name}
            </button>
          ))}
        </div>

        <div className="mt-3 overflow-hidden rounded-[1.5rem] border border-muted/15 bg-background/50 sm:mt-4">
          <div className="flex items-center justify-between gap-3 border-b border-muted/10 px-4 py-3 sm:px-5">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">Selected capability</span>
            <span className="h-2 w-2 rounded-full bg-accent-dev shadow-[0_0_14px_hsl(var(--accent-dev)/0.65)]" />
          </div>
          <div className="min-h-[150px] p-5 sm:min-h-[185px] sm:p-7">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent-design">Capability</p>
                      <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{active.name}</h3>
                    </div>
                    <div className="rounded-full border border-muted/15 bg-surface px-3 py-1.5 font-mono text-[10px] text-muted">
                      {active.category}{active.years_experience ? ` · ${active.years_experience}+ yrs` : ""}
                    </div>
                  </div>
                  {active.description && (
                    <p className="mt-5 max-w-2xl text-sm leading-6 text-muted sm:text-base">{active.description}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
