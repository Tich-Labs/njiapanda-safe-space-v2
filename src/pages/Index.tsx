import { Shield, MessageCircle, Phone, MapPin, Radio, BookOpen, ArrowRight, Search } from "lucide-react";
import heroImage from "@/assets/njiapanda_hero.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const options = [
  {
    icon: MessageCircle,
    title: "Write what happened",
    description: "Share your experience, completely anonymous",
    path: "/share",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    title: "Plan for your safety",
    description: "Create a quiet, private plan at your own pace",
    path: "/safety",
    color: "bg-safe/10 text-safe",
  },
  {
    icon: MapPin,
    title: "Find help near you",
    description: "Discover safe services and trusted support",
    path: "/resources",
    color: "bg-accent-foreground/10 text-accent-foreground",
  },
];

const Index = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      {/* Hero — quiet, visual, no text overlay */}
      <section className="px-0" aria-label="Hero">
        <img src={heroImage} alt="Njiapanda illustration" className="w-full object-cover" />
      </section>

      {/* Welcome — warmth + anonymity, single focus */}
      <section className="px-4 pt-5 pb-1" aria-label="Welcome">
        <div className="mx-auto max-w-lg text-center">
          <div className="rounded-xl bg-secondary px-4 py-3">
            <p className="text-sm font-medium text-secondary-foreground">
              You are safe here. You are anonymous. Nothing is saved or shared.
            </p>
          </div>
        </div>
      </section>

      {/* Recognition — primary action, above the emotional journey */}
      <section className="px-4 pt-6 pb-1" aria-label="Recognition">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 text-center">
            <h2 className="font-display text-xl font-semibold text-foreground">Something feels wrong?</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              You don&rsquo;t have to name it yet. Start gently with a quiet self-check &mdash; no answers saved, no judgment.
            </p>
            <button
              onClick={() => navigate('/self-check')}
              className="mt-4 w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Take a gentle self-check
            </button>
          </div>
        </div>
      </section>

      {/* Connection — stories before action */}
      <section className="px-4 pt-4 pb-1" aria-label="Connection">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <BookOpen className="mx-auto h-6 w-6 text-ochre" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-semibold text-foreground">Hear from others like you</h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Short, quiet stories that can help you recognise what&rsquo;s happening &mdash; at your own pace, without pressure.
            </p>
            <button
              onClick={() => navigate('/hadithi')}
              className="mt-4 w-full rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted active:scale-[0.98]"
            >
              Read quiet stories
            </button>
          </div>
        </div>
      </section>

      {/* Exploration — progressive disclosure */}
      <section className="px-4 pt-4 pb-1" aria-label="Options">
        <div className="mx-auto max-w-lg">
          <button
            onClick={() => setShowOptions((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-muted-foreground/30 bg-card p-4 text-sm font-medium text-foreground transition-all hover:bg-muted"
            aria-expanded={showOptions}
          >
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            {showOptions ? "Hide your options" : "Explore your options when you\u2019re ready"}
          </button>
          {showOptions && (
            <div className="mt-3 space-y-3">
              {options.map((action, i) => (
                <motion.button
                  key={action.path}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.35 }}
                  onClick={() => navigate(action.path)}
                  className="flex min-h-[64px] w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${action.color}`}>
                    <action.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-card-foreground">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Support — collapsed by default, no pressure */}
      <section className="px-4 pt-4 pb-1" aria-label="Help">
        <div className="mx-auto max-w-lg">
          <button
            onClick={() => setShowHelp((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emergency/20 bg-card p-4 text-sm font-medium text-foreground transition-all hover:bg-emergency/5"
            aria-expanded={showHelp}
          >
            {showHelp ? "Hide support options" : "When you need support"}
          </button>
          {showHelp && (
            <div className="mt-3 space-y-3">
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate('/helpline')}
                className="flex min-h-[56px] w-full items-center gap-4 rounded-xl border border-emergency/30 bg-emergency/5 p-4 text-left transition-all hover:bg-emergency/10 active:scale-[0.98]"
              >
                <Phone className="h-5 w-5 text-emergency shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-emergency">Talk to someone who can help</span>
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                onClick={() => navigate('/signal')}
                className="flex min-h-[56px] w-full items-center gap-4 rounded-xl border border-warning/30 bg-warning/5 p-4 text-left transition-all hover:bg-warning/10 active:scale-[0.98]"
              >
                <Radio className="h-5 w-5 text-warning shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-warning">Send a quiet signal for help</span>
              </motion.button>
            </div>
          )}
        </div>
      </section>

      {/* Trust banner — always visible */}
      <section className="px-4 pb-8 pt-4" aria-label="Privacy assurance">
        <div className="mx-auto max-w-lg rounded-xl bg-secondary p-4 text-center">
          <Shield className="mx-auto mb-2 h-5 w-5 text-primary" aria-hidden="true" />
          <p className="text-sm font-medium text-secondary-foreground">
            You are safe. No one will know you visited. You can leave at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
