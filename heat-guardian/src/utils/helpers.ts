export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case "low": return "risk-low";
    case "moderate": return "risk-moderate";
    case "high": return "risk-high";
    case "extreme": return "risk-extreme";
    default: return "muted-foreground";
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
