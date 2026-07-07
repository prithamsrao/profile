"use client";

export default function SectionHeader({ eyebrow, title, isHost, onAdd, addLabel }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="font-display text-2xl text-ink-primary sm:text-3xl">{title}</h2>
      </div>
      {isHost && onAdd && (
        <button onClick={onAdd} className="btn-primary shrink-0">
          + {addLabel || "Add"}
        </button>
      )}
    </div>
  );
}
