"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import SectionHeader from "./SectionHeader";

const EMPTY = { company: "", role: "", location: "", startDate: "", endDate: "", description: "", order: 0 };

export default function ExperienceSection({ items }) {
  const { data: session } = useSession();
  const isHost = session?.isHost;
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const isNew = !editing.id;
    await fetch(isNew ? "/api/experience" : `/api/experience/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this experience entry?")) return;
    await fetch(`/api/experience/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader eyebrow="~/experience" title="Work experience" isHost={isHost}
        onAdd={() => setEditing({ ...EMPTY })} addLabel="Add role" />

      {items.length === 0 && <p className="text-sm text-ink-muted">No experience entries yet.</p>}

      <div className="relative space-y-8 border-l border-base-border pl-6">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan shadow-glow-cyan" />
            <p className="font-mono text-xs text-ink-muted">
              {item.startDate} — {item.endDate || "Present"} {item.location ? `· ${item.location}` : ""}
            </p>
            <h3 className="mt-1 font-display text-lg text-ink-primary">{item.role}</h3>
            <p className="font-mono text-sm text-cyan">{item.company}</p>
            {item.description && <p className="mt-2 text-sm text-ink-secondary">{item.description}</p>}

            {isHost && (
              <div className="mt-3 flex gap-3">
                <button onClick={() => setEditing(item)} className="font-mono text-xs text-ink-secondary hover:text-cyan">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="font-mono text-xs text-ink-secondary hover:text-red-400">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit role" : "Add role"} onClose={() => setEditing(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">Company</label>
                <input required className="input" value={editing.company}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">Role</label>
                <input required className="input" value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Location</label>
              <input className="input" value={editing.location}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">Start</label>
                <input className="input" placeholder="2022" value={editing.startDate}
                  onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">End (blank = Present)</label>
                <input className="input" value={editing.endDate}
                  onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Description</label>
              <textarea className="input min-h-[80px]" value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
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
