"use client";

import { motion } from "framer-motion";

// Content here is hardcoded for now — moves into the admin dashboard's
// "Portfolio Settings" in Stage 7 (spec calls for everything editable).
const TIMELINE = [
  {
    year: "Journey",
    title: "Started building things",
    body: "Picked up design tools before code — CorelDRAW and Photoshop first, then taught myself to build the interfaces I was designing.",
  },
  {
    year: "Education",
    title: "Formal + self-taught",
    body: "Structured learning paired with a lot of late nights shipping small projects to see what actually held up in production.",
  },
  {
    year: "Experience",
    title: "Client and personal work",
    body: "Worked across frontend, backend automation, and design — usually on small teams where one person has to cover more than one role.",
  },
  {
    year: "Mission",
    title: "Where design and code meet",
    body: "Most interesting problems live at the seam between how something looks and how it's built. That's the work I keep coming back to.",
  },
];

export function About() {
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
        Developer on one side, designer on the other.
      </motion.h2>

      <div className="mt-16 space-y-12 border-l border-muted/20 pl-8">
        {TIMELINE.map((item, i) => (
          <motion.div
            key={item.year}
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
              {item.year}
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
