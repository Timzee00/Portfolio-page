import { getSiteSettings } from "@/lib/supabase/queries";
import { updateSiteSettings } from "@/lib/actions/admin/settings";
import { MediaUpload } from "@/components/admin/MediaUpload";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Portfolio Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Site-wide fields — hero background, resume, avatar, social links.
        Everything below is read by the public site on every request, so
        changes go live immediately after saving.
      </p>

      <form action={updateSiteSettings} className="mt-8 max-w-2xl space-y-10">
        <section>
          <h2 className="font-display text-lg font-semibold">Identity</h2>
          <div className="mt-4 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm text-muted">Profile photo</label>
              <MediaUpload
                name="avatar_url"
                folder="avatar"
                accept="image/*"
                defaultValue={settings.avatar_url ?? undefined}
                label="Drop a profile photo, or click to browse"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted">Resume (PDF)</label>
              <MediaUpload
                name="resume_url"
                folder="resume"
                accept="application/pdf"
                defaultValue={settings.resume_url ?? undefined}
                label="Drop your resume PDF, or click to browse"
              />
              <p className="mt-1 font-mono text-xs text-muted">
                Replaces the file the hero&apos;s &quot;Download Resume&quot; button links to.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Hero background</h2>
          <div className="mt-4 space-y-5">
            <div>
              <label htmlFor="hero_background_type" className="mb-1.5 block text-sm text-muted">
                Type
              </label>
              <select
                id="hero_background_type"
                name="hero_background_type"
                defaultValue={settings.hero_background_type}
                className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
              >
                <option value="grid">Cursor-reactive grid (default, no upload needed)</option>
                <option value="image">Custom image</option>
                <option value="video">Custom looping video</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted">
                Background file (only used if type above is image/video)
              </label>
              <MediaUpload
                name="hero_background_url"
                folder="hero"
                accept="image/*,video/*"
                defaultValue={settings.hero_background_url ?? undefined}
                label="Drop a background image or video, or click to browse"
              />
            </div>
            <div>
              <label htmlFor="typing_roles" className="mb-1.5 block text-sm text-muted">
                Typing roles (comma-separated)
              </label>
              <input
                id="typing_roles"
                name="typing_roles"
                defaultValue={settings.typing_roles.join(", ")}
                className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Social links</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <Field label="GitHub URL" name="social_github" defaultValue={settings.social_github} />
            <Field label="LinkedIn URL" name="social_linkedin" defaultValue={settings.social_linkedin} />
            <Field label="Instagram URL" name="social_instagram" defaultValue={settings.social_instagram} />
            <Field label="Contact email" name="social_email" defaultValue={settings.social_email} />
          </div>
        </section>

        <button
          type="submit"
          className="rounded-full bg-accent-design px-6 py-2.5 text-sm font-medium text-background"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string | null;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
      />
    </div>
  );
}
