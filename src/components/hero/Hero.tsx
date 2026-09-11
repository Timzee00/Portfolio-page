"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TypingRole } from "./TypingRole";
import type { HeroBackgroundType } from "@/types";

const DEFAULT_ROLES = ["Frontend Developer", "Graphics Designer", "Python Developer", "Node.js Developer", "Creative Technologist", "UI Designer", "Full Stack Developer"];

type HeroProps = { roles?: string[]; avatarUrl?: string | null; resumeUrl?: string | null; backgroundType?: HeroBackgroundType; backgroundUrl?: string | null };

export function Hero({ roles = DEFAULT_ROLES, avatarUrl, resumeUrl, backgroundType = "grid", backgroundUrl }: HeroProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const useCustomBackground = backgroundType !== "grid" && !!backgroundUrl;

  useEffect(() => {
    const el = canvasRef.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let targetX = 0.5, targetY = 0.5, currentX = 0.5, currentY = 0.5;
    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      targetY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    };
    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el.style.setProperty("--mx", `${currentX * 100}%`);
      el.style.setProperty("--my", `${currentY * 100}%`);
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(frame); };
  }, []);

  return (
    <section className="relative isolate flex min-h-[min(920px,100vh)] items-center overflow-hidden px-5 py-24 sm:px-8 lg:px-12">
      {useCustomBackground && backgroundUrl ? (
        <div className="absolute inset-0 -z-20" aria-hidden>
          {backgroundType === "video" ? <video src={backgroundUrl} className="h-full w-full object-cover opacity-30" autoPlay loop muted playsInline /> : <img src={backgroundUrl} alt="" className="h-full w-full object-cover opacity-30" />}
          <div className="absolute inset-0 bg-background/80" />
        </div>
      ) : (
        <div ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10" style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties} aria-hidden>
          <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "linear-gradient(hsl(var(--accent-design) / 0.38) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent-design) / 0.38) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(460px circle at var(--mx) var(--my), black, transparent)", WebkitMaskImage: "radial-gradient(460px circle at var(--mx) var(--my), black, transparent)" }} />
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(hsl(var(--accent-dev) / 0.55) 1px, transparent 1px)", backgroundSize: "30px 30px", maskImage: "radial-gradient(680px circle at var(--mx) var(--my), transparent, black)", WebkitMaskImage: "radial-gradient(680px circle at var(--mx) var(--my), transparent, black)" }} />
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-design/10 blur-[120px]" />
        </div>
      )}

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted"><span className="h-px w-8 bg-accent-dev" />Building ideas into digital experiences</motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.55 }}>
            <h1 className="font-display text-[clamp(4.5rem,12vw,9.5rem)] font-bold leading-[0.78] tracking-[-0.075em]"><span className="block text-accent-design">TIM</span><span className="ml-[0.12em] block font-mono text-[0.76em] tracking-[-0.09em] text-accent-dev">ZEE<span className="text-foreground">.</span></span></h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5 }} className="mt-9 flex min-h-8 items-center gap-3 font-mono text-sm text-muted sm:text-base"><span className="text-accent-dev">/</span><TypingRole roles={roles} /></motion.div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.5 }} className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">I design, build and experiment with software, brands and digital products — turning rough ideas into things people can actually use.</motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.5 }} className="mt-9 flex flex-wrap gap-3"><a href="#projects" data-cursor="magnetic" className="rounded-full bg-accent-design px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.04]">Explore the work</a><a href="#contact" data-cursor="magnetic" className="rounded-full border border-muted/35 px-6 py-3 text-sm font-medium transition-colors hover:border-accent-dev hover:text-accent-dev">Start a conversation</a></motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="relative mx-auto w-full max-w-[31rem] lg:ml-auto">
          <div className="absolute -inset-5 rounded-[2rem] border border-accent-dev/10" />
          <div className="relative overflow-hidden rounded-[1.5rem] border border-muted/20 bg-surface/75 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-muted/15 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted"><span>timzee / portfolio</span><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent-dev" />online</span></div>
            <div className="grid min-h-[22rem] grid-cols-2 gap-px bg-muted/10 p-px">
              <div className="relative col-span-2 flex min-h-40 items-end overflow-hidden bg-background p-6"><div className="absolute right-[-2rem] top-[-3rem] h-44 w-44 rounded-full border border-accent-design/25" /><div className="absolute right-8 top-8 h-24 w-24 rounded-full border border-accent-dev/30" /><div><p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-design">01 / curiosity</p><p className="mt-2 max-w-xs font-display text-2xl font-semibold leading-tight">There is more here than a portfolio.</p></div></div>
              <div className="bg-background p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Focus</p><p className="mt-8 font-display text-xl font-semibold">Code × Design</p></div>
              <div className="bg-background p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Next</p><a href="#about" className="mt-8 block font-display text-xl font-semibold transition-colors hover:text-accent-dev">See the story →</a></div>
            </div>
          </div>
          {avatarUrl && <div className="absolute -bottom-6 -left-5 hidden h-20 w-20 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:block"><img src={avatarUrl} alt="" className="h-full w-full object-cover" /></div>}
        </motion.div>
      </div>

      <motion.a href="#about" className="absolute bottom-7 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted" animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>Scroll to explore</motion.a>
      {resumeUrl && <a href={resumeUrl} className="sr-only">Download resume</a>}
    </section>
  );
}
