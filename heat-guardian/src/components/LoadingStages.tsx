import { motion } from "framer-motion";
import { Cloud, Calculator, HeartPulse, ShieldCheck, Check } from "lucide-react";
import type { LoadingStage } from "@/state/predictionStore";

const stages = [
  { key: "fetching_weather", label: "Fetching environmental data", icon: Cloud },
  { key: "calculating_heat_index", label: "Calculating heat index", icon: Calculator },
  { key: "evaluating_stress", label: "Evaluating physiological stress", icon: HeartPulse },
  { key: "generating_recommendations", label: "Generating safety recommendations", icon: ShieldCheck },
] as const;

interface Props {
  currentStage: LoadingStage;
}

export default function LoadingStages({ currentStage }: Props) {
  console.log("Rendering LoadingStages with:", currentStage);
  const currentIdx = stages.findIndex((s) => s.key === currentStage);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {stages.map((stage, idx) => {
        const isActive = idx === currentIdx;
        const isDone = idx < currentIdx || currentStage === null;
        const Icon = stage.icon;

        return (
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${isActive
                ? "border-primary/50 bg-primary/5 glow-primary"
                : isDone
                  ? "border-risk-low/30 bg-risk-low/5"
                  : "border-border/30 bg-card/50"
              }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${isActive
                  ? "bg-primary/20 text-primary"
                  : isDone
                    ? "bg-risk-low/20 text-risk-low"
                    : "bg-muted text-muted-foreground"
                }`}
            >
              {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>
            <span
              className={`text-sm font-medium ${isActive ? "text-primary" : isDone ? "text-risk-low" : "text-muted-foreground"
                }`}
            >
              {stage.label}
            </span>
            {isActive && (
              <motion.div
                className="ml-auto h-2 w-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
