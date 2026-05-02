import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12">
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="fade-up">
          <p className="text-accent text-sm font-semibold">Sable & Stone</p>
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Team collaboration, streamlined.
          </h1>
          <p className="text-muted mt-4 max-w-xl text-base md:text-lg">
            Organize goals, announcements, and action items with real-time updates and clear visibility.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary px-5 py-3" href="/login">
              Sign In
            </Link>
            <Link className="btn-outline px-5 py-3" href="/register">
              Create Account
            </Link>
          </div>
        </div>

        <div className="fade-up stagger-1">
          <article className="panel p-6">
            <h2 className="font-display text-2xl font-semibold">Everything your team needs, in one place.</h2>
            <p className="text-muted mt-2 text-sm">
              Clean dashboards, instant updates, and focused workflows for daily execution.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Roles & access", text: "Invite members with clear roles." },
                { title: "Live updates", text: "Real-time changes across teams." },
                { title: "Goal tracking", text: "Progress insights and charts." },
                { title: "Audit trail", text: "Exportable activity history." }
              ].map((item) => (
                <div key={item.title} className="glass rounded-2xl p-4">
                  <p className="font-display text-base font-semibold">{item.title}</p>
                  <p className="text-muted mt-1 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
