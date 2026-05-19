import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Trophy, Lightbulb, Users, Code, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const phases = [
  {
    title: "Phase 1: Core Frameworks & Environment",
    icon: Code,
    items: [
      { label: "Gemini Enterprise Agent Platform API Setup", url: "https://cloud.google.com/agent-platform" },
      { label: "Agent Builder Guide", url: "https://cloud.google.com/agent-builder" },
      { label: "Gemini Enterprise Agent Platform SDK for Python", url: "https://pypi.org/project/google-genai/" },
    ],
    notes: "Sign up for a no-cost trial at cloud.google.com/free, or use an existing account and request $100 in credits.",
  },
  {
    title: "Phase 2: Action Mechanisms & Data Connectivity",
    icon: Shield,
    items: [
      { label: "Agent Builder Extensions", url: "https://cloud.google.com/agent-builder/docs/extensions" },
      { label: "Agent Builder Data Stores", url: "https://cloud.google.com/agent-builder/docs/data-stores" },
    ],
    notes: "Give your agent agency over data and tools using Extensions and Data Stores.",
  },
  {
    title: "Phase 3: Partner Integration",
    icon: Users,
    items: [
      { label: "MongoDB MCP Server", url: "https://www.mongodb.com/docs/mcp-server/" },
    ],
    notes: "We are competing in the MongoDB partner track. Our agent integrates MongoDB MCP for survivor story storage and retrieval.",
  },
  {
    title: "Phase 4: Reasoning, State & Logic Hosting",
    icon: Lightbulb,
    items: [
      { label: "Agent Runtime", url: "https://cloud.google.com/agent-builder/docs/runtime" },
      { label: "Secret Manager", url: "https://cloud.google.com/secret-manager" },
    ],
    notes: "Managed orchestration for Python-based agents, plus secure storage for API keys.",
  },
  {
    title: "Phase 5: Deployment & Safety",
    icon: Shield,
    items: [
      { label: "Agent Builder Deployment", url: "https://cloud.google.com/agent-builder/docs/deploy" },
      { label: "Cloud Run Quickstart", url: "https://cloud.google.com/run/docs/quickstarts" },
      { label: "Gemini Safety Settings", url: "https://cloud.google.com/agent-platform/docs/safety" },
    ],
    notes: "",
  },
];

const judgingCriteria = [
  { icon: Code, title: "Technological Implementation", desc: "Does the interaction with Google Cloud and Partner services demonstrate quality software development?" },
  { icon: Lightbulb, title: "Design", desc: "Is the user experience and design of the project well thought out?" },
  { icon: Users, title: "Potential Impact", desc: "How big of an impact could the project have on target communities?" },
  { icon: Trophy, title: "Quality of the Idea", desc: "How creative and unique is the project?" },
];

const submissionReqs = [
  "URL to the hosted Project for judging and testing",
  "URL to open-source code repository (public, with license file)",
  "~3 minute demo video uploaded to YouTube or Vimeo",
  "Select which partner track (MongoDB)",
  "Text description with summary, technologies used, data sources, findings",
];

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-white font-semibold hover:bg-white/5 transition-colors"
      >
        {title}
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 px-5 py-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChallengeContext = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-28 bg-background text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 px-4 py-4 bg-background text-white">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white/40 hover:text-white/60">
            <ChevronDown className="h-5 w-5 rotate-90" />
          </button>
          <h1 className="font-display text-lg font-semibold text-white">Gemini Agent Challenge</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Intro */}
        <section>
          <p className="text-white/60 text-sm leading-relaxed">
            AI that doesn't just provide answers — it helps you take action. Building agents for real-world challenges.
            We are competing in the <span className="text-primary font-semibold">MongoDB partner track</span>.
            Prize pool per track: <span className="text-white font-semibold">$5,000</span> (1st), <span className="text-white font-semibold">$3,000</span> (2nd), <span className="text-white font-semibold">$2,000</span> (3rd).
          </p>
        </section>

        {/* Judging Criteria */}
        <section>
          <h2 className="font-display text-xl font-bold text-white mb-4">Judging Criteria</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {judgingCriteria.map((c) => (
              <div key={c.title} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <c.icon className="h-4 w-4 text-primary" />
                  <h3 className="text-white font-semibold text-sm">{c.title}</h3>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technologies Used */}
        <section>
          <h2 className="font-display text-xl font-bold text-white mb-4">Our Stack</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { label: "Frontend", value: "React + Vite + Tailwind CSS" },
              { label: "AI", value: "Gemini 2.5 Flash (text + audio)" },
              { label: "Hosting", value: "Firebase Hosting" },
              { label: "Backend", value: "GCP Cloud Run (Python + FastAPI)" },
              { label: "Database", value: "MongoDB Atlas (free tier)" },
              { label: "Partner", value: "MongoDB MCP Server" },
              { label: "Story Store", value: "MongoDB Atlas — sourced_stories" },
              { label: "Audio", value: "Gemini transcription" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white/40 text-xs font-mono uppercase tracking-wider min-w-[100px]">{t.label}</span>
                <span className="text-white/80 text-sm">{t.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Build Phases */}
        <section>
          <h2 className="font-display text-xl font-bold text-white mb-4">Build Resources</h2>
          <div className="space-y-3">
            {phases.map((phase) => (
              <CollapsibleSection key={phase.title} title={phase.title}>
                <ul className="space-y-2 mb-3">
                  {phase.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 underline underline-offset-2"
                      >
                        {item.label}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
                {phase.notes && <p className="text-white/40 text-xs">{phase.notes}</p>}
              </CollapsibleSection>
            ))}
          </div>
        </section>

        {/* Mission Context */}
        <section>
          <h2 className="font-display text-xl font-bold text-white mb-4">Our Mission</h2>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <p className="text-white/70 text-sm leading-relaxed">
              GBV survivors in Kenya face a critical gap: the distance between recognising abuse and reaching help.
              Njiapanda bridges this with an anonymous, trauma-informed platform featuring:
            </p>
            <ul className="text-white/60 text-sm space-y-1.5 list-disc pl-4">
              <li><strong className="text-white/80">Hadithi</strong> — AI-powered storytelling with survivor-sourced narratives, user submissions, and AI-generated awareness stories</li>
              <li><strong className="text-white/80">Quiet Signal</strong> — Anonymous distress signal routed to trained community responders</li>
              <li><strong className="text-white/80">Self-Check</strong> — Gentle recognition tool for naming abuse</li>
              <li><strong className="text-white/80">Safety Planning</strong> — Offline-capable interactive checklist</li>
              <li><strong className="text-white/80">Resource Directory</strong> — Verified organisations with zone-level mapping</li>
            </ul>
          </div>
        </section>

        {/* Submission Requirements */}
        <section>
          <h2 className="font-display text-xl font-bold text-white mb-4">Submission Checklist</h2>
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 space-y-2">
            {submissionReqs.map((req, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-[#C4871A]" />
                <span className="text-white/70 text-sm">{req}</span>
              </label>
            ))}
            <p className="text-white/40 text-xs pt-2 border-t border-white/10 mt-3">
              Deadline: June 11, 2026 at 2:00 PM PT. Judging: June 22 – July 6. Winners announced: July 7.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChallengeContext;
