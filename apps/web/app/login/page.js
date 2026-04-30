"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <div className="glass w-full rounded-2xl p-8 shadow-xl">
        <p className="text-sm font-medium text-blue-600">Collaborative Team Hub</p>
        <h1 className="mt-1 text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to continue to your workspace.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none ring-blue-300 transition focus:ring-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none ring-blue-300 transition focus:ring-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-medium text-white shadow-md">{loading ? "Loading..." : "Sign in"}</button>
      </form>
      </div>
    </main>
  );
}
