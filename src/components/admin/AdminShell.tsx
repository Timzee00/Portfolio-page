"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export const ADMIN_NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/comments", label: "Blog comments" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/github", label: "GitHub import" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-muted/15 bg-background/95 px-5 backdrop-blur md:px-8 lg:hidden">
        <Link href="/admin" className="font-display text-lg font-bold">TIMZEE Admin</Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button type="button" aria-label={open ? "Close admin menu" : "Open admin menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-xl border border-muted/25 text-foreground transition hover:bg-surface">
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="flex w-5 flex-col gap-1.5">
              <span className={`h-px w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-px w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </header>

      {open && <button type="button" aria-label="Close admin menu" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(82vw,20rem)] flex-col border-r border-muted/15 bg-background px-5 py-7 shadow-2xl transition-transform duration-200 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <Link href="/admin" className="font-display text-lg font-bold" onClick={() => setOpen(false)}>TIMZEE Admin</Link>
          <button type="button" aria-label="Close admin menu" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg text-2xl text-muted hover:bg-surface hover:text-foreground">×</button>
        </div>
        <nav className="mt-8 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1">
          {ADMIN_NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-3 text-sm transition ${active ? "bg-surface text-foreground" : "text-muted hover:bg-surface hover:text-foreground"}`}>{item.label}</Link>;
          })}
        </nav>
        <div className="mt-6 border-t border-muted/15 pt-5"><SignOutButton /></div>
      </aside>

      <div className="mx-auto flex min-h-screen max-w-6xl px-5 py-8 sm:px-6 sm:py-10 lg:gap-10 lg:px-6 lg:py-12">
        <aside className="hidden w-48 shrink-0 lg:block">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="font-display text-lg font-bold">TIMZEE Admin</Link>
            <ThemeToggle />
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {ADMIN_NAV.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return <Link key={item.href} href={item.href} className={`rounded-lg px-3 py-2 text-sm transition ${active ? "bg-surface text-foreground" : "text-muted hover:bg-surface hover:text-foreground"}`}>{item.label}</Link>;
            })}
          </nav>
          <div className="mt-10"><SignOutButton /></div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
