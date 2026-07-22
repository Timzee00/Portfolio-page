import { getCertificates } from "@/lib/supabase/queries";

export async function Certificates() {
  const certificates = await getCertificates();
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="mx-auto max-w-5xl px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Certificates</p>
      <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Credentials.</h2>

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        {certificates.map((cert) => (
          <a
            key={cert.id}
            href={cert.file_url ?? cert.image_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            data-cursor="magnetic"
            className="group rounded-2xl border border-muted/20 bg-surface p-5 transition-colors hover:border-accent-design/50"
          >
            <p className="font-medium group-hover:text-accent-design">{cert.title}</p>
            {cert.issuer && <p className="mt-1 font-mono text-xs text-muted">{cert.issuer}</p>}
            {cert.issued_at && (
              <p className="mt-3 font-mono text-xs text-muted">
                {new Date(cert.issued_at).getFullYear()}
              </p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
