import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { HistoryEntry } from "@/state/predictionStore";

interface Props {
  history: HistoryEntry[];
}

export default function TrendChart({ history }: Props) {
  const data = [...history].reverse().map((entry, i) => ({
    name: `#${i + 1}`,
    risk: entry.result.riskPercentage,
    category: entry.result.riskCategory,
  }));

  if (data.length === 0) {
    return (
      <div className="glass-card p-8 text-center text-muted-foreground text-sm">
        No prediction history yet. Run your first prediction to see trends.
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(35, 95%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(35, 95%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 22%)" />
          <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 18%, 13%)",
              border: "1px solid hsl(220, 12%, 22%)",
              borderRadius: "8px",
              color: "hsl(40, 10%, 92%)",
            }}
          />
          <Area
            type="monotone"
            dataKey="risk"
            stroke="hsl(35, 95%, 55%)"
            strokeWidth={2}
            fill="url(#riskGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
