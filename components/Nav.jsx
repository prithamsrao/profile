"use client";

import { useState } from "react";
import HostLogin from "./HostLogin";

const LINKS = [
  { href: "#projects", label: "projects" },
  { href: "#experience", label: "experience" },
  { href: "#education", label: "education" },
  { href: "#recommendations", label: "recommendations" },
  { href: "#contact", label: "contact" },
];

export default function Nav({ name }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-base-border/80 bg-base-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-sm text-ink-primary" onClick={() => setMenuOpen(false)}>
          <span className="text-cyan">/</span>
          {name || "portfolio"}
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="font-mono text-xs text-ink-secondary transition-colors hover:text-cyan">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <HostLogin />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-base-border bg-base-surface2 text-ink-secondary transition-colors hover:text-cyan md:hidden"
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2 L14 14 M14 2 L2 14" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 4 H14 M2 8 H14 M2 12 H14" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-base-border bg-base-bg px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setMenuOpen(false)} className="font-mono text-sm text-ink-secondary transition-colors hover:text-cyan">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
