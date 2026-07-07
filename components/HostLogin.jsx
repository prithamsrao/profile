"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Modal from "./Modal";

export default function HostLogin() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isHost = session?.isHost;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    setOpen(false);
    setPassword("");
  }

  if (status === "loading") return null;

  if (isHost) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden font-mono text-xs text-cyan sm:inline">
          ● host mode
        </span>
        <button onClick={() => signOut({ redirect: false })} className="btn-secondary">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-secondary" aria-label="Host login">
        Host login
      </button>

      {open && (
        <Modal title="Host login" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-ink-secondary">
              Sign in with your host credentials to edit this portfolio.
            </p>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ink-secondary">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
