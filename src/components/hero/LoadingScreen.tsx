"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show once per tab session — repeat visits within the session
    // skip straight to the hero instead of replaying every navigation.
    const alreadySeen = sessionStorage.getItem("timzee-loader-seen");
    if (alreadySeen) return;

    setVisible(true);

    const start = performance.now();
    const duration = 1400;

    let frame: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("timzee-loader-seen", "1");
        setTimeout(() => setVisible(false), 350);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="overflow-hidden" aria-hidden>
            <motion.p
              className="font-display text-6xl font-bold tracking-tight"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            >
              TIMZEE
            </motion.p>
          </div>

          <div className="flex items-center gap-3 font-mono text-sm text-muted">
            <span className="h-px w-10 bg-muted/40" />
            <span aria-live="polite">{progress}%</span>
            <span className="h-px w-10 bg-muted/40" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
