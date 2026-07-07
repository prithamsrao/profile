"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import SectionHeader from "./SectionHeader";

const EMPTY = { category: "", name: "", order: 0 };

export default function SkillsSection({ items }) {
  const { data: session } = useSession();
  const isHost = session?.isHost;
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const grouped = items.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const isNew = !editing.id;
    await fetch(isNew ? "/api/skills" : `/api/skills/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this skill?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader eyebrow="~/skills" title="Skills & tools" isHost={isHost}
        onAdd={() => setEditing({ ...EMPTY })} addLabel="Add skill" />

      {items.length === 0 && <p className="text-sm text-ink-muted">No skills added yet.</p>}

      <div className="grid gap-6 sm:grid-cols-3">
        {Object.entries(grouped).map(([category, skills]) => (
          <div key={category} className="card">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wide text-violet">{category}</h3>
            <ul className="space-y-2">
              {skills.map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm text-ink-secondary">
                  <span>{s.name}</span>
                  {isHost && (
                    <span className="flex gap-2 font-mono text-[11px]">
                      <button onClick={() => setEditing(s)} className="hover:text-cyan">edit</button>
                      <button onClick={() => handleDelete(s.id)} className="hover:text-red-400">del</button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit skill" : "Add skill"} onClose={() => setEditing(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Category</label>
              <input required className="input" placeholder="Languages / Frameworks / Tools" value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Skill name</label>
              <input required className="input" value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
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
