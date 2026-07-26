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
    <section id="about" className="mx-auto max-w-4xl px-6 py-32">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="font-mono text-xs uppercase tracking-[0.3em] text-muted"
      >
        About
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.05 }}
        className="mt-3 font-display text-4xl font-bold md:text-5xl"
      >
        {heading}
      </motion.h2>

      <div className="mt-16 space-y-12 border-l border-muted/20 pl-8">
        {timeline.map((item, i) => (
          <motion.div
            key={item.label + i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08 }}
            className="relative"
          >
            <span
              className={`absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full ${
                i % 2 === 0 ? "bg-accent-design" : "bg-accent-dev"
              }`}
            />
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {item.label}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold">
              {item.title}
            </h3>
            <p className="mt-2 max-w-xl text-muted">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
