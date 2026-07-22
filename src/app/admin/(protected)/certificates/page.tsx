import { getCertificates } from "@/lib/supabase/queries";
import { createCertificate, deleteCertificate } from "@/lib/actions/admin/misc";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { MediaUpload } from "@/components/admin/MediaUpload";

export default async function AdminCertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Certificates</h1>

      <form action={createCertificate} className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-muted/20 bg-surface p-6">
        <input name="title" placeholder="Title" required className="w-full rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        <input name="issuer" placeholder="Issuer" className="w-full rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        <div>
          <label className="mb-1.5 block text-sm text-muted">Certificate image</label>
          <MediaUpload name="image_url" folder="certificates" accept="image/*" label="Drop an image, or click to browse" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">PDF (optional)</label>
          <MediaUpload name="file_url" folder="certificates" accept="application/pdf" label="Drop a PDF, or click to browse" />
        </div>
        <input name="issued_at" type="date" className="rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        <button type="submit" className="rounded-full bg-accent-design px-6 py-2.5 text-sm font-medium text-background">
          Add certificate
        </button>
      </form>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {certificates.map((c) => (
          <div key={c.id} className="rounded-xl border border-muted/20 bg-surface p-4">
            <p className="font-medium">{c.title}</p>
            {c.issuer && <p className="font-mono text-xs text-muted">{c.issuer}</p>}
            <div className="mt-3">
              <DeleteButton action={deleteCertificate.bind(null, c.id)} confirmMessage={`Delete "${c.title}"?`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
