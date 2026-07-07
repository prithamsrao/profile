"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import SectionHeader from "./SectionHeader";

const EMPTY = { institution: "", degree: "", field: "", startDate: "", endDate: "", description: "", order: 0 };

export default function EducationSection({ items }) {
  const { data: session } = useSession();
  const isHost = session?.isHost;
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const isNew = !editing.id;
    await fetch(isNew ? "/api/education" : `/api/education/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this education entry?")) return;
    await fetch(`/api/education/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <section id="education" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader eyebrow="~/education" title="Education" isHost={isHost}
        onAdd={() => setEditing({ ...EMPTY })} addLabel="Add entry" />

      {items.length === 0 && <p className="text-sm text-ink-muted">No education entries yet.</p>}

      <div className="relative space-y-8 border-l border-base-border pl-6">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-violet shadow-glow-violet" />
            <p className="font-mono text-xs text-ink-muted">
              {item.startDate} — {item.endDate || "Present"}
            </p>
            <h3 className="mt-1 font-display text-lg text-ink-primary">{item.degree}{item.field ? `, ${item.field}` : ""}</h3>
            <p className="font-mono text-sm text-violet">{item.institution}</p>
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
        <Modal title={editing.id ? "Edit education" : "Add education"} onClose={() => setEditing(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Institution</label>
              <input required className="input" value={editing.institution}
                onChange={(e) => setEditing({ ...editing, institution: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">Degree</label>
                <input className="input" value={editing.degree}
                  onChange={(e) => setEditing({ ...editing, degree: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">Field of study</label>
                <input className="input" value={editing.field}
                  onChange={(e) => setEditing({ ...editing, field: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">Start</label>
                <input className="input" placeholder="2019" value={editing.startDate}
                  onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">End (blank = Present)</label>
                <input className="input" placeholder="2023" value={editing.endDate}
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
