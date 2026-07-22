import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { SignOutButton } from "@/components/admin/SignOutButton";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/github", label: "GitHub import" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page has its own layout-free route outside this guard —
  // see app/admin/login/page.tsx, which isn't wrapped by this file's
  // parent segment logic since Next.js layouts apply to nested routes
  // but requireAdmin() itself redirects to /admin/login, so this is
  // safe to call unconditionally here.
  await requireAdmin();

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl gap-10 px-6 py-12">
      <aside className="w-48 shrink-0">
        <p className="font-display text-lg font-bold">TIMZEE Admin</p>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10">
          <SignOutButton />
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
