import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import RiskGauge from "@/components/RiskGauge";
import FactorCard from "@/components/FactorCard";
import { usePrediction } from "@/state/predictionStore";
import { formatDate } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";

const urgencyColors: Record<string, string> = {
  high: "var(--risk-high)",
  medium: "var(--risk-moderate)",
  low: "var(--risk-low)",
};

export default function ResultPage() {
  const navigate = useNavigate();
  const { state, dispatch } = usePrediction();
  const result = state.predictionResult;

  useEffect(() => {
    if (!result) navigate("/predict", { replace: true });
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div className="container py-10 max-w-4xl space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/predict")}
            className="flex items-center text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Prediction
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Risk Assessment Result
          </h1>
        </div>

        {/* Data Source Badge */}
        {state.weatherData?.source && (
          <div className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium border flex items-center gap-2 ${state.weatherData.source === 'live_api'
              ? 'bg-green-500/10 text-green-500 border-green-500/20'
              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            }`}>
            <div className={`w-2 h-2 rounded-full ${state.weatherData.source === 'live_api' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
              }`} />
            {state.weatherData.source === 'live_api' ? 'LIVE WEATHER DATA' : 'SIMULATION MODE (MOCK)'}
          </div>
        )}
      </div>

      {/* Section 1 & 2 — Summary + Gauge */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <RiskGauge percentage={result.riskPercentage} category={result.riskCategory} />
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold text-foreground">Risk Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* Section 3 — Contributing Factors */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Contributing Factors</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {result.factors.map((f) => (
            <FactorCard key={f.label} {...f} />
          ))}
        </div>
      </motion.section>

      {/* Section 4 — Recommendations */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" /> Safety Recommendations
        </h3>
        <div className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="glass-card p-4 flex items-start gap-3">
              <span
                className="mt-0.5 h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: `hsl(${urgencyColors[rec.urgency]})` }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-foreground">{rec.title}</span>
                  <span
                    className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-semibold"
                    style={{
                      backgroundColor: `hsl(${urgencyColors[rec.urgency]} / 0.15)`,
                      color: `hsl(${urgencyColors[rec.urgency]})`,
                    }}
                  >
                    {rec.urgency}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{rec.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Section 5 — Metadata */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Prediction Metadata</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">Location</span>
            <p className="text-foreground font-medium">{result.metadata.location}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Timestamp</span>
            <p className="text-foreground font-medium">{formatDate(result.metadata.timestamp)}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Environment</span>
            <p className="text-foreground font-medium">{result.metadata.environmentalSnapshot}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
