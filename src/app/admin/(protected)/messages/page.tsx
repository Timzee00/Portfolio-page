import { getAllMessages } from "@/lib/supabase/queries";
import { markMessageRead, deleteMessage } from "@/lib/actions/admin/messages";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminMessagesPage() {
  const messages = await getAllMessages();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Messages</h1>

      <div className="mt-8 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border p-5 ${
              m.read ? "border-muted/20 bg-surface" : "border-accent-dev/40 bg-accent-dev/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {m.name} <span className="font-mono text-xs text-muted">&lt;{m.email}&gt;</span>
              </p>
              <time className="font-mono text-xs text-muted" dateTime={m.created_at}>
                {new Date(m.created_at).toLocaleString()}
              </time>
            </div>
            {m.subject && <p className="mt-1 text-sm font-medium">{m.subject}</p>}
            <p className="mt-2 text-sm text-muted">{m.message}</p>
            <div className="mt-3 flex items-center gap-4 font-mono text-xs">
              <form action={markMessageRead.bind(null, m.id, m.read)}>
                <button type="submit" className="text-accent-dev hover:underline">
                  Mark as {m.read ? "unread" : "read"}
                </button>
              </form>
              <DeleteButton action={deleteMessage.bind(null, m.id)} confirmMessage="Delete this message?" />
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="font-mono text-sm text-muted">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
