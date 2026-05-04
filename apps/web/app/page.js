import Link from "next/link";

export default function HomePage() {
  const highlights = [
    { value: "24/7", label: "team visibility" },
    { value: "3x", label: "faster updates" },
    { value: "100%", label: "audit coverage" }
  ];

  const features = [
    {
      title: "Clear ownership",
      text: "Assign action items, track due dates, and keep every workspace owner accountable."
    },
    {
      title: "Live announcements",
      text: "Share updates once and reach the right people across every active workspace."
    },
    {
      title: "Goal visibility",
      text: "See progress trends, milestones, and blockers without digging through separate tools."
    },
    {
      title: "Audit-ready history",
      text: "Review important activity in a clean timeline that stays easy to search and export."
    },
    {
      title: "Workspace admin",
      text: "Manage members, roles, and permissions from a single control surface."
    },
    {
      title: "Fast onboarding",
      text: "Get new teammates working quickly with a focused dashboard and simple flows."
    }
  ];

  const workflow = [
    {
      step: "01",
      title: "Set up your workspace",
      text: "Create a team space, invite members, and define the roles that match your process."
    },
    {
      step: "02",
      title: "Share work in context",
      text: "Post announcements, create goals, and add action items where the team already works."
    },
    {
      step: "03",
      title: "Track progress continuously",
      text: "Use dashboards, charts, and audit logs to keep the whole team aligned every day."
    }
  ];

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18),transparent_70%)] blur-2xl" />
        <div className="absolute right-[-6rem] top-[8rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.16),transparent_72%)] blur-2xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.12),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10 md:py-14 lg:px-8">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm text-[var(--text-muted)] shadow-[var(--shadow)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              Built for focused teams that need one clear source of truth
            </div>

            <h1 className="font-display mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Team collaboration that feels calm, fast, and easy to trust.
            </h1>

            <p className="text-muted mt-5 max-w-2xl text-base leading-7 md:text-lg">
              Sable & Stone brings goals, announcements, action items, and audit history into one polished workspace so teams can move quickly without losing context.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary px-5 py-3" href="/register">
                Get started
              </Link>
              <Link className="btn-outline px-5 py-3" href="/login">
                Sign in
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="panel rounded-2xl p-4">
                  <p className="font-display text-2xl font-semibold text-[var(--text-main)]">{item.value}</p>
                  <p className="text-muted mt-1 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up stagger-1">
            <article className="panel relative overflow-hidden p-5 md:p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60" />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-accent text-sm font-semibold uppercase tracking-[0.18em]">Workspace snapshot</p>
                  <h2 className="font-display mt-2 text-2xl font-semibold md:text-3xl">
                    Everything important, surfaced at a glance.
                  </h2>
                </div>
                <div className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                  Live
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="glass rounded-3xl p-4 md:p-5">
                  <p className="text-muted text-sm">Today&apos;s focus</p>
                  <p className="font-display mt-2 text-lg font-semibold">Launch readiness review</p>
                  <p className="text-muted mt-2 text-sm leading-6">
                    Confirm approvals, close blocked items, and publish the latest status update.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--accent-strong)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    4 tasks due before noon
                  </div>
                </div>

                <div className="glass rounded-3xl p-4 md:p-5">
                  <p className="text-muted text-sm">Progress</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Planning", value: "86%" },
                      { label: "Execution", value: "72%" },
                      { label: "Review", value: "91%" }
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted">{item.value}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-[var(--accent-soft)]">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)]"
                            style={{ width: item.value }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Members online", value: "18" },
                  { label: "Open items", value: "12" },
                  { label: "Alerts resolved", value: "29" }
                ].map((item) => (
                  <div key={item.label} className="glass rounded-2xl p-4 text-center">
                    <p className="font-display text-2xl font-semibold">{item.value}</p>
                    <p className="text-muted mt-1 text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="fade-up stagger-2 mt-16 md:mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-accent text-sm font-semibold uppercase tracking-[0.18em]">Why teams use it</p>
              <h2 className="font-display mt-2 text-3xl font-semibold md:text-4xl">A cleaner way to run everyday work.</h2>
            </div>
            <p className="text-muted hidden max-w-lg text-sm leading-6 md:block">
              The interface is designed to stay readable under pressure, with clear hierarchy, crisp cards, and strong contrast.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((item) => (
              <article key={item.title} className="panel rounded-3xl p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                  {item.title.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="font-display mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted mt-3 text-sm leading-6">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fade-up stagger-3 mt-16 md:mt-20">
          <article className="panel overflow-hidden rounded-[28px] p-6 md:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-accent text-sm font-semibold uppercase tracking-[0.18em]">How it works</p>
                <h2 className="font-display mt-2 text-3xl font-semibold md:text-4xl">
                  A simple flow that keeps the whole team moving.
                </h2>
                <p className="text-muted mt-4 max-w-xl text-sm leading-7 md:text-base">
                  Keep the path from planning to execution visible, so each update lands in the right place and stays easy to review later.
                </p>
              </div>

              <div className="grid gap-4">
                {workflow.map((item) => (
                  <div key={item.step} className="glass rounded-3xl p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] font-display text-sm font-semibold text-[var(--accent-strong)]">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                        <p className="text-muted mt-2 text-sm leading-6">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="fade-up mt-16 pb-4 md:mt-20 md:pb-8">
          <article className="panel rounded-[28px] px-6 py-8 md:px-10 md:py-10 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-accent text-sm font-semibold uppercase tracking-[0.18em]">Ready to start</p>
              <h2 className="font-display mt-2 text-3xl font-semibold md:text-4xl">
                Give your team a workspace that feels organized from day one.
              </h2>
              <p className="text-muted mt-4 text-sm leading-7 md:text-base">
                Sign in to pick up where you left off, or create an account and set up a workspace in a few minutes.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
              <Link className="btn-primary px-5 py-3" href="/register">
                Create account
              </Link>
              <Link className="btn-outline px-5 py-3" href="/login">
                Go to sign in
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
