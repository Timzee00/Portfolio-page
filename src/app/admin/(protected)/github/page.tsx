import { GithubImportClient } from "@/components/admin/GithubImportClient";

export default function AdminGithubPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">GitHub import</h1>
      <p className="mt-1 text-sm text-muted">
        Pulls your public repos and imports one as a draft project — review and
        publish it from Projects afterward.
      </p>
      <div className="mt-8">
        <GithubImportClient />
      </div>
    </div>
  );
}
