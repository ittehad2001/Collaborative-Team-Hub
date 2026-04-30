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
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{value}</p>
    </article>
  );
}
