import React from "react";
import { Thermometer, Droplets, Sun, Clock, Activity, CupSoda } from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  thermometer: Thermometer,
  droplets: Droplets,
  sun: Sun,
  clock: Clock,
  activity: Activity,
  "cup-soda": CupSoda,
};

const severityColors = {
  low: "var(--risk-low)",
  moderate: "var(--risk-moderate)",
  high: "var(--risk-high)",
};

interface Props {
  icon: string;
  label: string;
  severity: "low" | "moderate" | "high";
  value: string;
}

export default function FactorCard({ icon, label, severity, value }: Props) {
  const Icon = iconMap[icon] || Thermometer;
  const color = severityColors[severity];

  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: `hsl(${color} / 0.15)` }}
      >
        <Icon className="h-5 w-5" style={{ color: `hsl(${color})` }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
      <span
        className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: `hsl(${color} / 0.15)`,
          color: `hsl(${color})`,
        }}
      >
        {severity}
      </span>
    </div>
  );
}
