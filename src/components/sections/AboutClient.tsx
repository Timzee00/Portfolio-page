"use client";

import { motion } from "framer-motion";
import type { AboutTimelineItem } from "@/types";

export function AboutClient({
  heading,
  timeline,
}: {
  heading: string;
  timeline: AboutTimelineItem[];
}) {
  return (
    <section id="about" className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="pointer-events-none absolute right-[-10%] top-20 h-64 w-64 rounded-full border border-accent-design/10 [transform:rotate(18deg)] sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute right-[5%] top-32 h-44 w-44 rounded-full border border-accent-dev/10 sm:h-64 sm:w-64" />

      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted"
          >
            01 / The person behind the work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.05 }}
            className="mt-4 max-w-xl font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {heading}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="mt-8 grid max-w-md grid-cols-2 gap-2"
          >
            <div className="relative overflow-hidden rounded-2xl border border-accent-design/20 bg-accent-design/[0.06] p-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent-design">Design</span>
              <p className="mt-2 font-display text-sm font-semibold">Visual thinking</p>
              <span className="absolute -bottom-5 -right-5 h-16 w-16 rounded-full border border-accent-design/20" />
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-accent-dev/20 bg-accent-dev/[0.05] p-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent-dev">Code</span>
              <p className="mt-2 font-display text-sm font-semibold">Functional systems</p>
              <span className="absolute -bottom-5 -right-5 h-16 w-16 rounded-full border border-accent-dev/20" />
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute bottom-6 left-[7px] top-6 w-px bg-gradient-to-b from-accent-design/60 via-muted/20 to-accent-dev/60" />
          <div className="space-y-5 sm:space-y-7">
            {timeline.map((item, i) => (
              <motion.article
                key={item.label + i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: Math.min(i * 0.07, 0.35), duration: 0.45 }}
                className="group relative pl-8 sm:pl-10"
              >
                <span
                  className={`absolute left-0 top-5 h-4 w-4 rounded-full border-4 border-background shadow-[0_0_0_1px_hsl(var(--muted)/0.18)] transition-transform duration-300 group-hover:scale-125 ${
                    i % 2 === 0 ? "bg-accent-design" : "bg-accent-dev"
                  }`}
                />
                <div className="relative overflow-hidden rounded-2xl border border-muted/15 bg-surface/50 p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-muted/30 group-hover:bg-surface sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{item.label}</p>
                    <span className="font-mono text-[9px] text-muted/40">0{i + 1}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">{item.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">{item.body}</p>
                  <div className="mt-5 h-px w-12 bg-foreground/15 transition-all duration-300 group-hover:w-24" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
