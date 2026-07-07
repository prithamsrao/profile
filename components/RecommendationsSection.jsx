"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import SectionHeader from "./SectionHeader";

const EMPTY = { name: "", role: "", quote: "", photo: "", order: 0 };

export default function RecommendationsSection({ items }) {
  const { data: session } = useSession();
  const isHost = session?.isHost;
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const isNew = !editing.id;
    await fetch(isNew ? "/api/recommendations" : `/api/recommendations/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this recommendation?")) return;
    await fetch(`/api/recommendations/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <section id="recommendations" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader eyebrow="~/recommendations" title="What people say" isHost={isHost}
        onAdd={() => setEditing({ ...EMPTY })} addLabel="Add recommendation" />

      {items.length === 0 && <p className="text-sm text-ink-muted">No recommendations yet.</p>}

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((r) => (
          <div key={r.id} className="card">
            <p className="text-sm italic leading-relaxed text-ink-secondary">&ldquo;{r.quote}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3">
              {r.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photo} alt={r.name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet/20 font-mono text-xs text-violet">
                  {r.name?.[0] || "?"}
                </div>
              )}
              <div>
                <p className="text-sm text-ink-primary">{r.name}</p>
                <p className="font-mono text-xs text-ink-muted">{r.role}</p>
              </div>
            </div>

            {isHost && (
              <div className="mt-4 flex gap-3 border-t border-base-border pt-3">
                <button onClick={() => setEditing(r)} className="font-mono text-xs text-ink-secondary hover:text-cyan">Edit</button>
                <button onClick={() => handleDelete(r.id)} className="font-mono text-xs text-ink-secondary hover:text-red-400">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit recommendation" : "Add recommendation"} onClose={() => setEditing(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Name</label>
              <input required className="input" value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Role / relationship</label>
              <input required className="input" placeholder="Engineering Manager at Acme" value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Quote</label>
              <textarea required className="input min-h-[100px]" value={editing.quote}
                onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Photo URL (optional)</label>
              <input className="input" value={editing.photo}
                onChange={(e) => setEditing({ ...editing, photo: e.target.value })} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}
