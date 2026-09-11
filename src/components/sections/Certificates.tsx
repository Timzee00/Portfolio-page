import { getCertificates } from "@/lib/supabase/queries";

export async function Certificates() {
  const certificates = await getCertificates();
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">04 / Proof of work</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Credentials that back the work.
            </h2>
          </div>
          <div className="flex items-end justify-between gap-6 border-b border-muted/20 pb-5">
            <p className="max-w-md text-sm leading-6 text-muted sm:text-base">
              A quick look at the learning, certifications, and milestones behind the projects.
            </p>
            <span className="hidden shrink-0 font-mono text-xs text-muted sm:block">
              {String(certificates.length).padStart(2, "0")} credentials
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, index) => (
            <a
              key={cert.id}
              href={cert.file_url ?? cert.image_url ?? "#"}
              target="_blank"
              rel="noreferrer"
              data-cursor="magnetic"
              className="group relative overflow-hidden rounded-[1.5rem] border border-muted/20 bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-accent-design/50 hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-background">
                {cert.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted">
                    Credential / {String(index + 1).padStart(2, "0")}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-70" />
                <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-background/70 text-lg opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  ↗
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium leading-6 transition-colors group-hover:text-accent-design">{cert.title}</p>
                    {cert.issuer && <p className="mt-1 font-mono text-xs text-muted">{cert.issuer}</p>}
                  </div>
                  {cert.issued_at && (
                    <span className="shrink-0 font-mono text-xs text-muted">
                      {new Date(cert.issued_at).getFullYear()}
                    </span>
                  )}
                </div>
                <div className="mt-5 h-px w-full bg-muted/15 transition-all duration-500 group-hover:bg-accent-design/40" />
                <p className="mt-4 text-xs text-muted transition-colors group-hover:text-foreground">View credential</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
