"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, loading } = useAuthStore();
  const [email, setEmail] = useState("demo@teamhub.com");
  const [password, setPassword] = useState("demo1234");

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) router.push("/dashboard");
  }

  return (
    <main className="auth-shell">
      <section className="auth-split panel grid md:grid-cols-2">
        <div className="auth-form order-1">
          <p className="text-accent text-sm font-semibold">Collaborative Team Hub</p>
          <h1 className="font-display mt-3 text-3xl font-semibold">Welcome back</h1>
          <p className="text-muted mt-2 text-sm">Sign in to stay aligned with your team.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button disabled={loading} className="btn-primary w-full px-4 py-3">
              {loading ? "Loading..." : "Sign in"}
            </button>
          </form>
          <p className="text-muted mt-4 text-sm">
            New here? <Link className="text-blue-600" href="/register">Create an account</Link>
          </p>
        </div>
        <div className="auth-visual order-2">
          <div className="auth-visual-content">
            <p className="text-sm font-semibold">Built for collaborative teams</p>
            <h2 className="font-display mt-2 text-2xl font-semibold">Plan, execute, and stay in sync.</h2>
            <p className="text-muted mt-2 text-sm">
              Goals, action items, and announcements in one clean workspace.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
