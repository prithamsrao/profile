"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

export default function Hero({ profile }) {
  const { data: session } = useSession();
  const isHost = session?.isHost;
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  const socials = [
    { label: "GitHub", url: profile.github },
    { label: "LinkedIn", url: profile.linkedin },
    { label: "Twitter", url: profile.twitter },
    { label: "Website", url: profile.website },
  ].filter((s) => s.url);

  return (
    <section id="top" className="grid-backdrop relative overflow-hidden border-b border-base-border">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <p className="eyebrow mb-4">
          <span className="animate-blink text-cyan">▍</span> online
        </p>

        <h1 className="font-display text-4xl leading-tight text-ink-primary sm:text-5xl md:text-6xl">
          {profile.name}
        </h1>

        <p className="scan-underline in-view mt-3 font-mono text-lg text-violet sm:text-xl">
          {profile.title}
        </p>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-secondary">
          {profile.bio}
        </p>

        {profile.location && (
          <p className="mt-3 font-mono text-xs text-ink-muted">📍 {profile.location}</p>
        )}

        {socials.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="btn-secondary">
                {s.label}
              </a>
            ))}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="btn-primary">
                Contact me
              </a>
            )}
          </div>
        )}

        {isHost && (
          <button onClick={() => setEditing(true)} className="btn-secondary mt-8">
            Edit intro
          </button>
        )}
      </div>

      {editing && (
        <Modal title="Edit intro" onClose={() => setEditing(false)}>
          <form onSubmit={handleSave} className="space-y-3">
            {[
              ["name", "Name"],
              ["title", "Title / tagline"],
              ["location", "Location"],
              ["email", "Email"],
              ["github", "GitHub URL"],
              ["linkedin", "LinkedIn URL"],
              ["twitter", "Twitter URL"],
              ["website", "Website URL"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="mb-1 block font-mono text-xs text-ink-secondary">{label}</label>
                <input
                  className="input"
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Bio</label>
              <textarea
                className="input min-h-[100px]"
                value={form.bio || ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}
