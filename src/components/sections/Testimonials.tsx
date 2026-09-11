import { getTestimonials } from "@/lib/supabase/queries";

export async function Testimonials() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">07 / Social proof</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">People remember the work.</h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">{testimonials.length} voice{testimonials.length === 1 ? "" : "s"}</span>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-12">
        {testimonials.map((t, index) => (
          <blockquote
            key={t.id}
            className={`group relative overflow-hidden rounded-[1.8rem] border border-muted/15 bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-design/35 sm:p-8 ${
              index % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"
            }`}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] text-accent-design/70">0{index + 1}</span>
            <p className="mt-6 max-w-3xl font-display text-xl font-medium leading-relaxed tracking-tight sm:text-2xl">“{t.quote}”</p>
            <footer className="mt-8 flex flex-wrap items-end justify-between gap-3 border-t border-muted/10 pt-4">
              <div>
                <p className="text-sm font-semibold">{t.author_name}</p>
                {(t.author_role || t.author_company) && (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {t.author_role}{t.author_role && t.author_company ? " · " : ""}{t.author_company}
                  </p>
                )}
              </div>
              <span className="text-xl text-muted/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-dev">↗</span>
            </footer>
            <span className="pointer-events-none absolute -bottom-16 -right-12 h-40 w-40 rounded-full border border-accent-dev/10 transition-transform duration-700 group-hover:scale-125" />
          </blockquote>
        ))}
      </div>
    </section>
  );
}
