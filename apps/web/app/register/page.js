"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <div className="glass w-full rounded-2xl p-8 shadow-xl">
        <p className="text-sm font-medium text-emerald-600">Create account</p>
        <h1 className="mt-1 text-3xl font-bold">Join your team</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none ring-emerald-300 transition focus:ring-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none ring-emerald-300 transition focus:ring-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none ring-emerald-300 transition focus:ring-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-3 font-medium text-white shadow-md">{loading ? "Loading..." : "Create account"}</button>
      </form>
      </div>
    </main>
  );
}
