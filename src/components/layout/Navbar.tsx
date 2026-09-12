"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/#about", label: "About", index: "01" },
  { href: "/#skills", label: "Skills", index: "02" },
  { href: "/#projects", label: "Projects", index: "03" },
  { href: "/blog", label: "Journal", index: "04" },
  { href: "/#contact", label: "Contact", index: "05" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdmin) return;
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      setMenuOpen(false);
      return;
    }
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, isAdmin]);

  // The admin dashboard has its own dedicated sidebar/drawer.
  if (isAdmin) return null;

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500 sm:px-5", scrolled ? "pt-3" : "pt-4 sm:pt-5")}>
      <nav className={cn("mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-3 transition-all duration-500 sm:px-5", scrolled ? "border-muted/20 bg-surface/80 py-2.5 shadow-2xl shadow-black/20 backdrop-blur-xl" : "border-transparent bg-transparent py-2.5")}>
        <a href="#" aria-label="Timzee home" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-foreground/20 bg-foreground text-background shadow-sm transition-transform duration-300 group-hover:rotate-6"><span className="font-display text-sm font-black">T</span><span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-accent-design/80 blur-[5px]" /></span>
          <span className="hidden font-display text-sm font-bold tracking-[0.18em] sm:block">TIMZEE</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">{LINKS.map((link) => <li key={link.href}><a href={link.href} data-cursor="magnetic" className="group flex items-center gap-2 rounded-full px-3.5 py-2 text-sm text-muted transition-all hover:bg-foreground/5 hover:text-foreground"><span className="font-mono text-[9px] text-muted/50 transition-colors group-hover:text-accent-design">{link.index}</span>{link.label}</a></li>)}</ul>
        <div className="hidden items-center gap-4 md:flex"><span className="font-mono text-[10px] uppercase tracking-wider text-muted/70"><kbd className="rounded-md border border-muted/30 px-1.5 py-0.5">⌘</kbd>{" "}<kbd className="rounded-md border border-muted/30 px-1.5 py-0.5">K</kbd></span><ThemeToggle /></div>
        <div className="flex items-center gap-2 md:hidden"><ThemeToggle /><button onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} data-cursor="magnetic" className="relative grid h-10 w-10 place-items-center rounded-xl border border-muted/20 bg-foreground/[0.04]"><span className="relative h-4 w-5"><span className={cn("absolute left-0 top-0 h-px w-5 bg-current transition-all duration-300", menuOpen && "top-2 rotate-45")} /><span className={cn("absolute left-0 top-2 h-px w-5 bg-current transition-all duration-200", menuOpen && "opacity-0")} /><span className={cn("absolute left-0 top-4 h-px w-5 bg-current transition-all duration-300", menuOpen && "top-2 -rotate-45")} /></span></button></div>
      </nav>
      <AnimatePresence>{menuOpen && <motion.div initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }} transition={{ duration: 0.25, ease: "easeOut" }} className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-muted/20 bg-surface/95 shadow-2xl backdrop-blur-2xl md:hidden"><div className="border-b border-muted/10 px-5 py-4"><p className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted">Navigate the work</p></div><ul className="p-2">{LINKS.map((link, i) => <motion.li key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}><a href={link.href} onClick={() => setMenuOpen(false)} className="group flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors active:bg-foreground/10 hover:bg-foreground/5"><span className="flex items-center gap-3"><span className="font-mono text-[10px] text-muted/50">{link.index}</span><span className="font-display text-lg font-semibold">{link.label}</span></span><span className="text-muted transition-transform group-hover:translate-x-1">↗</span></a></motion.li>)}</ul><div className="m-2 flex items-center justify-between rounded-xl border border-accent-design/20 bg-accent-design/5 px-4 py-3"><span className="font-mono text-[9px] uppercase tracking-widest text-muted">Creative + Code</span><span className="h-2 w-2 rounded-full bg-accent-dev shadow-[0_0_12px_hsl(var(--accent-dev))]" /></div></motion.div>}</AnimatePresence>
    </header>
  );
}
