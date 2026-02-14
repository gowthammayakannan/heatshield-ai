import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface UserInputs {
  city: string;
  latitude?: number;
  longitude?: number;
  exposureDuration: number;
  activityLevel: string;
  hydrationLevel: string;
  ageGroup: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  heatIndex: number;
  windSpeed: number;
  uvIndex: number;
  condition: string;
  source?: string;
}

export interface PredictionResult {
  riskCategory: "low" | "moderate" | "high" | "extreme";
  riskPercentage: number;
  summary: string;
  factors: {
    icon: string;
    label: string;
    severity: "low" | "moderate" | "high";
    value: string;
  }[];
  recommendations: {
    title: string;
    explanation: string;
    urgency: "low" | "medium" | "high";
  }[];
  metadata: {
    location: string;
    timestamp: string;
    environmentalSnapshot: string;
  };
}

export interface HistoryEntry {
  id: string;
  inputs: UserInputs;
  result: PredictionResult;
  timestamp: string;
}

export type LoadingStage =
  | "fetching_weather"
  | "calculating_heat_index"
  | "evaluating_stress"
  | "generating_recommendations"
  | null;

export interface PredictionState {
  userInputs: UserInputs | null;
  weatherData: WeatherData | null;
  predictionResult: PredictionResult | null;
  loadingStage: LoadingStage;
  history: HistoryEntry[];
  error: string | null;
}

type Action =
  | { type: "SET_INPUTS"; payload: UserInputs }
  | { type: "SET_WEATHER"; payload: WeatherData }
  | { type: "SET_RESULT"; payload: PredictionResult }
  | { type: "SET_LOADING_STAGE"; payload: LoadingStage }
  | { type: "ADD_HISTORY"; payload: HistoryEntry }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET_PREDICTION" };

const initialState: PredictionState = {
  userInputs: null,
  weatherData: null,
  predictionResult: null,
  loadingStage: null,
  history: JSON.parse(localStorage.getItem("heatshield_history") || "[]"),
  error: null,
};

function reducer(state: PredictionState, action: Action): PredictionState {
  switch (action.type) {
    case "SET_INPUTS":
      return { ...state, userInputs: action.payload, error: null };
    case "SET_WEATHER":
      return { ...state, weatherData: action.payload };
    case "SET_RESULT":
      return { ...state, predictionResult: action.payload, loadingStage: null };
    case "SET_LOADING_STAGE":
      return { ...state, loadingStage: action.payload };
    case "ADD_HISTORY":
      return { ...state, history: [action.payload, ...state.history] };
    case "SET_ERROR":
      return { ...state, error: action.payload, loadingStage: null };
    case "RESET_PREDICTION":
      return { ...state, userInputs: null, weatherData: null, predictionResult: null, loadingStage: null, error: null };
    default:
      return state;
  }
}

const PredictionContext = createContext<{
  state: PredictionState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    localStorage.setItem("heatshield_history", JSON.stringify(state.history));
  }, [state.history]);

  return (
    <PredictionContext.Provider value={{ state, dispatch }}>
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  const ctx = useContext(PredictionContext);
  if (!ctx) throw new Error("usePrediction must be used within PredictionProvider");
  return ctx;
}
