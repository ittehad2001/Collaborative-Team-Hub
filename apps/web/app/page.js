import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
      <section className="glass w-full rounded-3xl p-8 shadow-xl md:p-12">
        <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          FredoCloud Team Hub
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
          Collaborate on goals, announcements and action items in real time.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
          Built with Next.js, Express, Prisma and Socket.io in a monorepo. Invite your team, track progress, and stay aligned.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-semibold text-white shadow-md transition hover:opacity-95"
            href="/login"
          >
            Sign In
          </Link>
          <Link
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            href="/register"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white/80 p-4">
            <p className="font-semibold text-slate-900">Workspace Roles</p>
            <p className="mt-1">Admin/Member permissions with invites by email.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white/80 p-4">
            <p className="font-semibold text-slate-900">Live Updates</p>
            <p className="mt-1">Socket events for goals, announcements and items.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white/80 p-4">
            <p className="font-semibold text-slate-900">Analytics</p>
            <p className="mt-1">Completion insights with chart + CSV export.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
