"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export function AchievementCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    const duration = 1200;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <p ref={ref} className="font-display text-4xl font-bold md:text-5xl">
        {display}
        {suffix}
      </p>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">{label}</p>
    </motion.div>
  );
}
