import { getTestimonials } from "@/lib/supabase/queries";
import { createTestimonial, deleteTestimonial, toggleTestimonialPinned } from "@/lib/actions/admin/misc";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Testimonials</h1>

      <form action={createTestimonial} className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-muted/20 bg-surface p-6">
        <input name="author_name" placeholder="Name" required className="w-full rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        <div className="grid grid-cols-2 gap-4">
          <input name="author_role" placeholder="Role" className="rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
          <input name="author_company" placeholder="Company" className="rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        </div>
        <textarea name="quote" placeholder="Quote" required rows={3} className="w-full rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="pinned" /> Pin to top
        </label>
        <button type="submit" className="rounded-full bg-accent-design px-6 py-2.5 text-sm font-medium text-background">
          Add testimonial
        </button>
      </form>

      <div className="mt-8 space-y-2">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-xl border border-muted/20 bg-surface p-5">
            <p className="text-sm">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-3 flex items-center justify-between font-mono text-xs text-muted">
              <span>{t.author_name}{t.author_role ? ` — ${t.author_role}` : ""}</span>
              <div className="flex items-center gap-3">
                <form action={toggleTestimonialPinned.bind(null, t.id, t.pinned)}>
                  <button type="submit" className={t.pinned ? "text-accent-dev" : "hover:text-foreground"}>
                    {t.pinned ? "Pinned" : "Pin"}
                  </button>
                </form>
                <DeleteButton action={deleteTestimonial.bind(null, t.id)} confirmMessage="Delete this testimonial?" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
