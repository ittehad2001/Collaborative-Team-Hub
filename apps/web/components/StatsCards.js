export default function StatsCards({ data }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card label="Total Goals" value={data?.totalGoals || 0} />
      <Card label="Completed This Week" value={data?.completedThisWeek || 0} />
      <Card label="Overdue" value={data?.overdueCount || 0} />
    </section>
  );
}

function Card({ label, value }) {
  return (
    <article className="panel p-5">
      <p className="text-muted text-xs font-semibold uppercase tracking-[0.16em]">{label}</p>
      <p className="font-display mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </article>
  );
}
