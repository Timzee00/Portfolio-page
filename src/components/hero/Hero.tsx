"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TypingRole } from "./TypingRole";
import type { HeroBackgroundType } from "@/types";

const DEFAULT_ROLES = [
  "Frontend Developer",
  "Graphics Designer",
  "Python Developer",
  "Node.js Developer",
  "Creative Technologist",
  "UI Designer",
  "Full Stack Developer",
];

type HeroProps = {
  roles?: string[];
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  backgroundType?: HeroBackgroundType;
  backgroundUrl?: string | null;
};

export function Hero({
  roles = DEFAULT_ROLES,
  avatarUrl,
  resumeUrl,
  backgroundType = "grid",
  backgroundUrl,
}: HeroProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const useCustomBackground = backgroundType !== "grid" && !!backgroundUrl;

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const prefersReducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let frame: number;
    let targetX = 0.5;
    let targetY = 0.5;
    let currentX = 0.5;
    let currentY = 0.5;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
    };

    const tick = () => {
      // Ease toward the pointer instead of snapping — keeps the light
      // feeling weighted rather than jittery.
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el.style.setProperty("--mx", `${currentX * 100}%`);
      el.style.setProperty("--my", `${currentY * 100}%`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6">
      {useCustomBackground && backgroundUrl && (
        <div className="absolute inset-0" aria-hidden>
          {backgroundType === "video" ? (
            <video
              src={backgroundUrl}
              className="h-full w-full object-cover opacity-40"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={backgroundUrl}
              alt=""
              className="h-full w-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-background/60" />
        </div>
      )}
      {!useCustomBackground && (
        <>
          {/* Signature element: two textures — a design-tool ruler/grid and a
              code-editor line grid — cross-faded by a cursor-tracked light.
              Move your mouse to feel the "designer vs developer" duality. */}
          <div
            ref={canvasRef}
            className="pointer-events-none absolute inset-0"
            style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
            aria-hidden
          >
            {/* Design-tool grid (ruler ticks), tinted magenta near cursor */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--accent-design) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent-design) / 0.5) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage:
                  "radial-gradient(420px circle at var(--mx) var(--my), black, transparent)",
                WebkitMaskImage:
                  "radial-gradient(420px circle at var(--mx) var(--my), black, transparent)",
              }}
            />
        {/* Code-editor dot grid, tinted cyan away from cursor */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--accent-dev) / 0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(600px circle at var(--mx) var(--my), transparent, black)",
            WebkitMaskImage:
              "radial-gradient(600px circle at var(--mx) var(--my), transparent, black)",
          }}
        />
      </div>
        </>
      )}

      <div className="relative mx-auto max-w-4xl text-center">
        {avatarUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto mb-8 h-28 w-28"
          >
            <div className="absolute inset-0 -z-10 animate-float rounded-full bg-accent-design/30 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt=""
              className="h-28 w-28 rounded-full border border-muted/20 object-cover"
            />
          </motion.div>
        )}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-muted"
        >
          Creative Developer · Graphics Designer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl"
        >
          <span className="text-accent-design">TIM</span>
          <span className="font-mono text-accent-dev">ZEE</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 font-mono text-lg text-muted md:text-xl"
        >
          <TypingRole roles={roles} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            data-cursor="magnetic"
            className="rounded-full bg-accent-design px-7 py-3 text-sm font-medium text-background transition-transform hover:scale-105"
          >
            Explore Projects
          </a>
          <a
            href="#contact"
            data-cursor="magnetic"
            className="rounded-full border border-muted/40 px-7 py-3 text-sm font-medium transition-colors hover:border-accent-dev hover:text-accent-dev"
          >
            Hire Me
          </a>
          <a
            href={resumeUrl ?? "/resume.pdf"}
            data-cursor="magnetic"
            className="rounded-full px-7 py-3 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Download Resume ↓
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-muted"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll ↓
      </motion.div>
    </section>
  );
}
