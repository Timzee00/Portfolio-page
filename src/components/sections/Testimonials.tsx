import { getTestimonials } from "@/lib/supabase/queries";

export async function Testimonials() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Testimonials</p>
      <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
        From people I&apos;ve worked with.
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <blockquote
            key={t.id}
            className="rounded-2xl border border-muted/20 bg-surface p-6"
          >
            <p className="text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-4 font-mono text-sm text-muted">
              {t.author_name}
              {t.author_role ? ` — ${t.author_role}` : ""}
              {t.author_company ? `, ${t.author_company}` : ""}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
