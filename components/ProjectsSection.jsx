"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import SectionHeader from "./SectionHeader";

const EMPTY = {
  title: "",
  summary: "",
  description: "",
  coverImage: "",
  techStack: "",
  repoUrl: "",
  demoUrl: "",
  articleUrl: "",
  order: 0,
};

export default function ProjectsSection({ projects }) {
  const { data: session } = useSession();
  const isHost = session?.isHost;
  const router = useRouter();

  const [editing, setEditing] = useState(null); // project object, or EMPTY for new, or null for closed
  const [expanded, setExpanded] = useState(null); // project id shown in detail modal (public view)
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const isNew = !editing.id;
    await fetch(isNew ? "/api/projects" : `/api/projects/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project? This can't be undone.")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader
        eyebrow="~/projects"
        title="Selected work"
        isHost={isHost}
        onAdd={() => setEditing({ ...EMPTY })}
        addLabel="Add project"
      />

      {projects.length === 0 && (
        <p className="text-sm text-ink-muted">No projects yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <div key={p.id} className="card flex flex-col">
            <h3 className="font-display text-lg text-ink-primary">{p.title}</h3>
            <p className="mt-2 text-sm text-ink-secondary">{p.summary}</p>

            {p.techStack && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.techStack.split(",").map((t) => (
                  <span key={t} className="tag">{t.trim()}</span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={() => setExpanded(p)} className="btn-secondary">
                Read more
              </button>
              {p.repoUrl && (
                <a href={p.repoUrl} target="_blank" rel="noreferrer" className="font-mono text-xs text-cyan hover:underline">
                  Repo ↗
                </a>
              )}
              {p.demoUrl && (
                <a href={p.demoUrl} target="_blank" rel="noreferrer" className="font-mono text-xs text-violet hover:underline">
                  Demo ↗
                </a>
              )}
            </div>

            {isHost && (
              <div className="mt-4 flex gap-3 border-t border-base-border pt-4">
                <button onClick={() => setEditing(p)} className="font-mono text-xs text-ink-secondary hover:text-cyan">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="font-mono text-xs text-ink-secondary hover:text-red-400">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail view (public) */}
      {expanded && (
        <Modal title={expanded.title} onClose={() => setExpanded(null)}>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-secondary">
            {expanded.description}
          </p>
          {expanded.techStack && (
            <div className="mt-4 flex flex-wrap gap-2">
              {expanded.techStack.split(",").map((t) => (
                <span key={t} className="tag">{t.trim()}</span>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {expanded.repoUrl && (
              <a href={expanded.repoUrl} target="_blank" rel="noreferrer" className="btn-secondary">Repo ↗</a>
            )}
            {expanded.demoUrl && (
              <a href={expanded.demoUrl} target="_blank" rel="noreferrer" className="btn-secondary">Live demo ↗</a>
            )}
            {expanded.articleUrl && (
              <a href={expanded.articleUrl} target="_blank" rel="noreferrer" className="btn-secondary">Write-up ↗</a>
            )}
          </div>
        </Modal>
      )}

      {/* Edit/add form (host) */}
      {editing && (
        <Modal title={editing.id ? "Edit project" : "Add project"} onClose={() => setEditing(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Title</label>
              <input required className="input" value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Short summary (shown on card)</label>
              <input className="input" value={editing.summary}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Detailed description</label>
              <textarea className="input min-h-[120px]" value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Tech stack (comma-separated)</label>
              <input className="input" placeholder="Next.js, Prisma, TailwindCSS" value={editing.techStack}
                onChange={(e) => setEditing({ ...editing, techStack: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">Repo URL</label>
                <input className="input" value={editing.repoUrl}
                  onChange={(e) => setEditing({ ...editing, repoUrl: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">Demo URL</label>
                <input className="input" value={editing.demoUrl}
                  onChange={(e) => setEditing({ ...editing, demoUrl: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">Article URL</label>
                <input className="input" value={editing.articleUrl}
                  onChange={(e) => setEditing({ ...editing, articleUrl: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Display order (lower = first)</label>
              <input type="number" className="input" value={editing.order}
                onChange={(e) => setEditing({ ...editing, order: e.target.value })} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
              {saving ? "Saving…" : "Save project"}
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}
