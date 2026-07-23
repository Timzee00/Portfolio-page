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
  // useFormStatus only works when called from a component nested inside
  // the <form> — not the component that renders the form itself.
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-cursor="magnetic"
      className="rounded-full bg-accent-design px-7 py-3 text-sm font-medium text-background transition-opacity disabled:opacity-50"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export function Contact({ socials }: ContactProps) {
  const [state, formAction] = useFormState(submitContactMessage, initialState);

  const socialLinks = [
    { icon: FiGithub, label: "GitHub", href: socials?.github },
    { icon: FiLinkedin, label: "LinkedIn", href: socials?.linkedin },
    { icon: FiInstagram, label: "Instagram", href: socials?.instagram },
    {
      icon: FiMail,
      label: "Email",
      href: socials?.email ? `mailto:${socials.email}` : null,
    },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href));

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Contact
      </p>
      <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
        Let&apos;s build something.
      </h2>

      <form action={formAction} className="mt-10 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 outline-none focus:border-accent-dev"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 outline-none focus:border-accent-dev"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm text-muted">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 outline-none focus:border-accent-dev"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 outline-none focus:border-accent-dev"
          />
        </div>

        <SubmitButton />

        {state.status !== "idle" && (
          <p
            role="status"
            className={`text-sm ${
              state.status === "success" ? "text-accent-dev" : "text-accent-design"
            }`}
          >
            {state.message}
          </p>
        )}
      </form>

      <div className="mt-14 flex gap-6">
        {socialLinks.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            data-cursor="magnetic"
            className="text-muted transition-colors hover:text-accent-dev"
          >
            <Icon size={22} />
          </a>
        ))}
      </div>
    </section>
  );
}
