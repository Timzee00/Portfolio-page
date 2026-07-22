"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
              <a
                href={link.href}
                data-cursor="magnetic"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="hidden font-mono text-xs text-muted md:inline-flex md:items-center md:gap-1">
          <kbd className="rounded border border-muted/30 px-1.5 py-0.5">⌘</kbd>
          <kbd className="rounded border border-muted/30 px-1.5 py-0.5">K</kbd>
          <span className="ml-1">to search</span>
        </span>
        {/* Mobile drawer trigger — wire up in the nav/mobile-menu pass */}
        <button
          aria-label="Open menu"
          className="text-foreground md:hidden"
          data-cursor="magnetic"
        >
          <span className="block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
        </button>
      </nav>
    </header>
  );
}
