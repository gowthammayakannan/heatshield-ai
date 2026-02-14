import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Shield, Activity, ArrowRight, Thermometer, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function HomePage() {
  return (
    <div className="container py-12 space-y-20">
      {/* Hero */}
      <motion.section className="text-center space-y-6 py-16" {...fadeUp}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
          <Flame className="h-4 w-4" />
          AI-Powered Heat Stress Prevention
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto text-gradient-hero">
          Protect Workers From
          <br />
          <span className="text-primary">Deadly Heat Stress</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Real-time risk prediction combining environmental data, work conditions,
          and personal factors to keep your workforce safe.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link to="/predict">
              Start Prediction <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </motion.section>

      {/* Problem Context */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-6"
      >
        {[
          {
            icon: Thermometer,
            title: "Rising Temperatures",
            desc: "Global heat events are increasing in frequency and severity, putting outdoor workers at unprecedented risk.",
          },
          {
            icon: Users,
            title: "Workforce Vulnerability",
            desc: "Construction, agriculture, and industrial workers face daily heat exposure with limited protective measures.",
          },
          {
            icon: Shield,
            title: "Preventable Deaths",
            desc: "Most heat-related fatalities are preventable with early detection and proper intervention protocols.",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-card p-6 space-y-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <card.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Workflow */}
      <section className="text-center space-y-8">
        <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Activity, step: "01", title: "Input Context", desc: "Provide location, work conditions, and personal factors" },
            { icon: Brain, step: "02", title: "AI Analysis", desc: "Our model evaluates environmental and physiological risk" },
            { icon: Shield, step: "03", title: "Get Protected", desc: "Receive actionable safety recommendations instantly" },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground max-w-[240px]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass-card p-10 text-center space-y-4 glow-primary"
      >
        <h2 className="text-2xl font-bold text-foreground">Ready to Protect Your Team?</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Run your first heat stress risk assessment in under 60 seconds.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/predict">
            Start Now <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.section>
    </div>
  );
}
