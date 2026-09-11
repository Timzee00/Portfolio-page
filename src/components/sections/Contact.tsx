"use client";

import { useFormState, useFormStatus } from "react-dom";
import { FiGithub, FiLinkedin, FiInstagram, FiMail } from "react-icons/fi";
import { submitContactMessage, type ContactState } from "@/lib/actions/contact";

const initialState: ContactState = { status: "idle" };

type ContactProps = {
  socials?: {
    github?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    email?: string | null;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-cursor="magnetic"
      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent-design px-7 py-3 text-sm font-semibold text-background transition-all hover:translate-y-[-1px] hover:shadow-[0_12px_40px_hsl(var(--accent-design)/0.18)] disabled:opacity-50 sm:w-auto"
    >
      {pending ? "Sending…" : "Start a conversation →"}
    </button>
  );
}

export function Contact({ socials }: ContactProps) {
  const [state, formAction] = useFormState(submitContactMessage, initialState);

  const socialLinks = [
    { icon: FiGithub, label: "GitHub", href: socials?.github },
    { icon: FiLinkedin, label: "LinkedIn", href: socials?.linkedin },
    { icon: FiInstagram, label: "Instagram", href: socials?.instagram },
    { icon: FiMail, label: "Email", href: socials?.email ? `mailto:${socials.email}` : null },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href));

  return (
    <section id="contact" className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-muted/15 bg-surface/60 p-5 sm:rounded-[2.5rem] sm:p-8 lg:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-accent-design/15 sm:h-80 sm:w-80" />
        <div className="pointer-events-none absolute bottom-[-6rem] left-[35%] h-48 w-48 rounded-full border border-accent-dev/10" />

        <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">09 / Open channel</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[0.92] tracking-tight sm:text-5xl lg:text-7xl">Have an idea that should exist?</h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-muted sm:text-base">Bring the rough idea. I’ll help turn it into something clear, useful, and ready for people to use.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-dev/20 bg-accent-dev/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-dev">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-dev" /> Available for projects
              </span>
            </div>
            <div className="mt-8 flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label === "Email" ? undefined : "_blank"}
                  rel={label === "Email" ? undefined : "noreferrer"}
                  aria-label={label}
                  data-cursor="magnetic"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-muted/20 bg-background/30 text-muted transition-all hover:-translate-y-1 hover:border-accent-dev/50 hover:text-accent-dev"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Name</label>
                <input id="name" name="name" required maxLength={120} autoComplete="name" placeholder="Your name" className="min-h-12 w-full rounded-2xl border border-muted/20 bg-background/40 px-4 text-sm outline-none transition-colors placeholder:text-muted/35 focus:border-accent-dev" />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="min-h-12 w-full rounded-2xl border border-muted/20 bg-background/40 px-4 text-sm outline-none transition-colors placeholder:text-muted/35 focus:border-accent-dev" />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Subject</label>
              <input id="subject" name="subject" maxLength={200} placeholder="What are we building?" className="min-h-12 w-full rounded-2xl border border-muted/20 bg-background/40 px-4 text-sm outline-none transition-colors placeholder:text-muted/35 focus:border-accent-dev" />
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Message</label>
              <textarea id="message" name="message" required maxLength={5000} rows={7} placeholder="Tell me the idea, problem, or project…" className="w-full resize-y rounded-2xl border border-muted/20 bg-background/40 px-4 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-muted/35 focus:border-accent-dev" />
            </div>

            <div className="sr-only" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="_website" tabIndex={-1} autoComplete="off" />
            </div>

            <SubmitButton />
            {state.status !== "idle" && (
              <p role="status" className={`text-sm ${state.status === "success" ? "text-accent-dev" : "text-accent-design"}`}>
                {state.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
