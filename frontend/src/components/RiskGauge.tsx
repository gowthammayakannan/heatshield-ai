import { motion } from "framer-motion";

interface Props {
  percentage: number;
  category: "low" | "moderate" | "high" | "extreme";
}

const categoryConfig = {
  low: { color: "var(--risk-low)", label: "Low Risk" },
  moderate: { color: "var(--risk-moderate)", label: "Moderate Risk" },
  high: { color: "var(--risk-high)", label: "High Risk" },
  extreme: { color: "var(--risk-extreme)", label: "Extreme Risk" },
};

export default function RiskGauge({ percentage, category }: Props) {
  const config = categoryConfig[category];
  const circumference = 2 * Math.PI * 80;
  const strokeDash = (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="12"
          />
          <motion.circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke={`hsl(${config.color})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {percentage}%
          </motion.span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
            Risk Level
          </span>
        </div>
      </div>
      <span
        className="px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{
          backgroundColor: `hsl(${config.color} / 0.15)`,
          color: `hsl(${config.color})`,
        }}
      >
        {config.label}
      </span>
    </div>
  );
}
