export default function Footer({ name }) {
  return (
    <footer className="border-t border-base-border py-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 font-mono text-xs text-ink-muted">
        <span>© {new Date().getFullYear()} {name}</span>
        <span>built with Next.js</span>
      </div>
    </footer>
  );
}
