import type { WeatherData, PredictionResult } from "@/state/predictionStore";

export const mockWeather: WeatherData = {
  temperature: 42,
  humidity: 65,
  heatIndex: 52,
  windSpeed: 8,
  uvIndex: 11,
  condition: "Clear Sky",
};

export const mockPrediction: PredictionResult = {
  riskCategory: "high",
  riskPercentage: 78,
  summary:
    "High heat stress risk detected. Combination of extreme temperature, high humidity, and prolonged outdoor exposure creates dangerous conditions for physical labor.",
  factors: [
    { icon: "thermometer", label: "Temperature", severity: "high", value: "42°C" },
    { icon: "droplets", label: "Humidity", severity: "high", value: "65%" },
    { icon: "sun", label: "UV Index", severity: "high", value: "11 (Extreme)" },
    { icon: "clock", label: "Exposure Duration", severity: "moderate", value: "6 hours" },
    { icon: "activity", label: "Activity Level", severity: "moderate", value: "Heavy" },
    { icon: "cup-soda", label: "Hydration", severity: "low", value: "Moderate" },
  ],
  recommendations: [
    {
      title: "Immediate Hydration Protocol",
      explanation: "Consume 250ml of water every 15 minutes. Electrolyte supplements recommended.",
      urgency: "high",
    },
    {
      title: "Mandatory Rest Intervals",
      explanation: "Enforce 15-minute shaded rest breaks every 45 minutes of work.",
      urgency: "high",
    },
    {
      title: "Shift Rescheduling",
      explanation: "Move heavy physical work to early morning (before 10 AM) or late afternoon (after 4 PM).",
      urgency: "medium",
    },
    {
      title: "Cooling Equipment",
      explanation: "Provide cooling vests and misting stations at the work site.",
      urgency: "medium",
    },
    {
      title: "Buddy System",
      explanation: "Pair workers to monitor each other for signs of heat exhaustion.",
      urgency: "low",
    },
  ],
  metadata: {
    location: "Dubai, UAE",
    timestamp: new Date().toISOString(),
    environmentalSnapshot: "Clear sky, 42°C, 65% humidity, wind 8 km/h, UV 11",
  },
};
