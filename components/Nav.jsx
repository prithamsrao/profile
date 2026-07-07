"use client";

import HostLogin from "./HostLogin";

const LINKS = [
  { href: "#projects", label: "projects" },
  { href: "#experience", label: "experience" },
  { href: "#education", label: "education" },
  { href: "#recommendations", label: "recommendations" },
  { href: "#contact", label: "contact" },
];

export default function Nav({ name }) {
  return (
    <header className="sticky top-0 z-40 border-b border-base-border/80 bg-base-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-sm text-ink-primary">
          <span className="text-cyan">/</span>
          {name || "portfolio"}
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-xs text-ink-secondary transition-colors hover:text-cyan"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <HostLogin />
      </nav>
    </header>
  );
}
