import { motion } from "framer-motion";
import { Brain, ShieldCheck, Database, Cpu, AlertTriangle } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const sections = [
  {
    icon: AlertTriangle,
    title: "The Problem",
    content:
      "Heat stress kills hundreds of workers annually worldwide. Traditional safety measures rely on static thresholds that fail to account for individual variability, cumulative exposure, and rapidly changing environmental conditions.",
  },
  {
    icon: Brain,
    title: "Our AI Approach",
    content:
      "HeatShield AI combines real-time weather data with work exposure parameters and personal physiological factors to generate context-aware risk predictions. The model evaluates multiple interacting variables simultaneously to provide a holistic risk assessment.",
  },
  {
    icon: Cpu,
    title: "System Architecture",
    content:
      "The system follows a three-tier architecture: (1) Data Collection Layer gathers environmental and user-reported data, (2) Analysis Engine processes inputs through our risk model, (3) Presentation Layer delivers interpretable results with actionable recommendations.",
  },
  {
    icon: Database,
    title: "Technology Stack",
    content:
      "Built with React and TypeScript for the frontend, with a Python-based ML backend. Weather data sourced from meteorological APIs. The prediction model uses ensemble methods combining physiological heat balance equations with environmental exposure indices.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible AI Disclaimer",
    content:
      "This system is designed as a decision-support tool, not a replacement for professional occupational health assessment. Predictions are estimates based on available data and should be used alongside, not instead of, established workplace safety protocols. Always consult qualified safety personnel for critical decisions.",
  },
];

export default function AboutPage() {
  return (
    <div className="container py-10 max-w-3xl space-y-8">
      <SectionHeader
        title="About HeatShield AI"
        subtitle="Understanding the system behind the predictions"
      />

      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <section.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-12">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
