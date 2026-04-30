"use client";

import { PieChart, Pie, Tooltip, Cell } from "recharts";

const colors = { not_started: "#94a3b8", in_progress: "#3b82f6", done: "#22c55e" };

export default function GoalChart({ chart = [] }) {
  const grouped = chart.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <div className="panel p-5">
      <h3 className="mb-2 text-lg font-semibold">Goal Completion</h3>
      <div className="flex justify-center">
        <PieChart width={320} height={220}>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
            {data.map((entry) => <Cell key={entry.name} fill={colors[entry.name] || "#64748b"} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
