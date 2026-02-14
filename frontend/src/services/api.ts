import { mockWeather, mockPrediction } from "@/data/mockPrediction";
import type { WeatherData, PredictionResult, UserInputs } from "@/state/predictionStore";

const USE_MOCK = false; // Toggle for mock mode

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWeather(params: { location?: string; lat?: number; lon?: number }): Promise<WeatherData> {
  if (USE_MOCK) {
    await delay(1200);
    return { ...mockWeather };
  }

  const query = new URLSearchParams();
  if (params.lat && params.lon) {
    query.append("lat", params.lat.toString());
    query.append("lon", params.lon.toString());
  } else if (params.location) {
    query.append("location", params.location);
  } else {
    throw new Error("Location or coordinates required");
  }

  // Use BASE_URL from environment variable (Render URL in prod, empty in dev)
  const res = await fetch(`${BASE_URL}/api/weather?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch weather data");
  return res.json();
}

export async function predictRisk(payload: {
  inputs: UserInputs;
  weather: WeatherData;
}): Promise<PredictionResult> {
  if (USE_MOCK) {
    await delay(1500);
    return {
      ...mockPrediction,
      metadata: {
        ...mockPrediction.metadata,
        location: payload.inputs.city,
        timestamp: new Date().toISOString(),
      },
    };
  }

  const res = await fetch(`${BASE_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Prediction service unavailable");
  return res.json();
}

export async function getHealthStatus(): Promise<{ status: string }> {
  if (USE_MOCK) {
    return { status: "operational" };
  }
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error("System health check failed");
  return res.json();
}
