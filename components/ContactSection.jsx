"use client";

export default function ContactSection({ profile }) {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <p className="eyebrow mb-2">~/contact</p>
      <h2 className="font-display text-2xl text-ink-primary sm:text-3xl">Let&apos;s talk</h2>
      <p className="mt-4 max-w-lg text-sm text-ink-secondary">
        Open to new opportunities and interesting conversations. Reach out through
        whichever channel is easiest for you.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {profile.email && (
          <a href={`mailto:${profile.email}`} className="btn-primary">
            {profile.email}
          </a>
        )}
        {profile.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-secondary">LinkedIn ↗</a>
        )}
        {profile.github && (
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn-secondary">GitHub ↗</a>
        )}
        {profile.twitter && (
          <a href={profile.twitter} target="_blank" rel="noreferrer" className="btn-secondary">Twitter ↗</a>
        )}
      </div>
    </section>
  );
}
