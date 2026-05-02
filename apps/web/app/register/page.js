"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../store/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, loading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await register(name, email, password);
    if (ok) router.push("/login");
  }

  return (
    <main className="auth-shell">
      <section className="auth-split panel grid md:grid-cols-2">
        <div className="auth-visual order-2 md:order-1">
          <div className="auth-visual-content">
            <p className="text-sm font-semibold">Collaborative Team Hub</p>
            <h2 className="font-display mt-2 text-2xl font-semibold">Start a workspace that feels effortless.</h2>
            <p className="text-muted mt-2 text-sm">
              Invite your team, set goals, and move faster with real-time updates.
            </p>
          </div>
        </div>
        <div className="auth-form order-1 md:order-2">
          <p className="text-accent text-sm font-semibold">Create account</p>
          <h1 className="font-display mt-3 text-3xl font-semibold">Join your team</h1>
          <p className="text-muted mt-2 text-sm">Create your login in seconds.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button disabled={loading} className="btn-primary w-full px-4 py-3">
              {loading ? "Loading..." : "Create account"}
            </button>
          </form>
          <p className="text-muted mt-4 text-sm">
            Already have an account? <Link className="text-blue-600" href="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
