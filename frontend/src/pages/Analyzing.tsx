import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingStages from "@/components/LoadingStages";
import { usePrediction, type LoadingStage } from "@/state/predictionStore";
import { fetchWeather, predictRisk } from "@/services/api";
import { generateId } from "@/utils/helpers";

const stageSequence: LoadingStage[] = [
  "fetching_weather",
  "calculating_heat_index",
  "evaluating_stress",
  "generating_recommendations",
];

export default function AnalyzingPage() {
  const navigate = useNavigate();
  const { state, dispatch } = usePrediction();
  const started = useRef(false);

  useEffect(() => {
    console.log("AnalyzingPage Mounted. Current State:", state);
    if (!state.userInputs) {
      console.error("Missing userInputs! Redirecting to /predict");
      navigate("/predict", { replace: true });
      return;
    }
    if (started.current) return;
    started.current = true;

    async function run() {
      try {
        // Stage 1
        dispatch({ type: "SET_LOADING_STAGE", payload: "fetching_weather" });
        const weather = await fetchWeather({
          location: state.userInputs!.city,
          lat: state.userInputs!.latitude,
          lon: state.userInputs!.longitude
        });
        dispatch({ type: "SET_WEATHER", payload: weather });

        // Stage 2
        dispatch({ type: "SET_LOADING_STAGE", payload: "calculating_heat_index" });
        await new Promise((r) => setTimeout(r, 900));

        // Stage 3
        dispatch({ type: "SET_LOADING_STAGE", payload: "evaluating_stress" });
        await new Promise((r) => setTimeout(r, 800));

        // Stage 4
        dispatch({ type: "SET_LOADING_STAGE", payload: "generating_recommendations" });
        const result = await predictRisk({ inputs: state.userInputs!, weather });

        dispatch({ type: "SET_RESULT", payload: result });
        dispatch({
          type: "ADD_HISTORY",
          payload: {
            id: generateId(),
            inputs: state.userInputs!,
            result,
            timestamp: new Date().toISOString(),
          },
        });

        navigate("/result", { replace: true });
      } catch (err: any) {
        console.error("Detailed Analysis Error:", err);
        dispatch({ type: "SET_ERROR", payload: err.message || "Analysis failed" });
        // DISABLE REDIRECT FOR DEBUGGING
        // navigate("/predict", { replace: true });
      }
    }

    run();
  }, []);

  if (state.error) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <div className="p-6 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-2">Analysis Failed</h2>
          <p className="font-mono text-sm break-all">{state.error}</p>
          <button
            onClick={() => navigate("/predict")}
            className="mt-4 px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16 flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-2"
      >
        <h1 className="text-2xl font-bold text-foreground">Analyzing Risk Factors</h1>
        <p className="text-sm text-muted-foreground">
          Processing data for <span className="text-primary">{state.userInputs?.city}</span>
        </p>
      </motion.div>
      <LoadingStages currentStage={state.loadingStage} />
    </div>
  );
}
