import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePrediction } from "@/state/predictionStore";
import SectionHeader from "@/components/SectionHeader";
import TrendChart from "@/components/TrendChart";
import { formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const riskBadgeColors: Record<string, string> = {
  low: "var(--risk-low)",
  moderate: "var(--risk-moderate)",
  high: "var(--risk-high)",
  extreme: "var(--risk-extreme)",
};

export default function HistoryPage() {
  const { state } = usePrediction();
  const navigate = useNavigate();

  return (
    <div className="container py-10 max-w-4xl space-y-8">
      <SectionHeader
        title="Prediction History"
        subtitle={`${state.history.length} assessment${state.history.length !== 1 ? "s" : ""} recorded this session`}
      />

      <TrendChart history={state.history} />

      {state.history.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <p className="text-muted-foreground">No predictions yet</p>
          <Button onClick={() => navigate("/predict")} className="gap-2">
            Run First Prediction <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {state.history.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => navigate("/result")}
            >
              <span
                className="text-xs font-bold uppercase px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `hsl(${riskBadgeColors[entry.result.riskCategory]} / 0.15)`,
                  color: `hsl(${riskBadgeColors[entry.result.riskCategory]})`,
                }}
              >
                {entry.result.riskCategory}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{entry.inputs.city}</p>
                <p className="text-xs text-muted-foreground truncate">{entry.result.summary}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-foreground">{entry.result.riskPercentage}%</p>
                <p className="text-[10px] text-muted-foreground">{formatDate(entry.timestamp)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
