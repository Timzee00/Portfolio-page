"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface/70 py-3 shadow-lg backdrop-blur-md"
          : "bg-transparent py-6"
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#" className="font-display text-lg font-bold tracking-tight">
          TIMZEE
        </a>

        <ul className="hidden gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              
                href={link.href}
                data-cursor="magnetic"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          <span className="font-mono text-xs text-muted">
            <kbd className="rounded border border-muted/30 px-1.5 py-0.5">⌘</kbd>{" "}
            <kbd className="rounded border border-muted/30 px-1.5 py-0.5">K</kbd>
            <span className="ml-1">to search</span>
          </span>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            data-cursor="magnetic"
            className="relative h-5 w-6 text-foreground"
          >
            <span
              className={cn(
                "absolute left-0 top-0.5 block h-0.5 w-6 bg-current transition-transform duration-200",
                menuOpen && "translate-y-2 rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-2.5 block h-0.5 w-6 bg-current transition-opacity duration-200",
                menuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[18px] block h-0.5 w-6 bg-current transition-transform duration-200",
                menuOpen && "-translate-y-2 -rotate-45"
              )}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-muted/10 bg-surface md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((link) => (
                <li key={link.href}>
                  
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-2 py-3 text-base text-muted transition-colors hover:bg-background hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
