import { useState, useEffect, useRef } from "react";
import { BookOpen, PenLine, Sparkles, Heart, ArrowLeft, X, Mic, Type, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import StoryBlock, { StoryBlockType } from "@/components/hadithi/StoryBlock";
import AudioRecorder from "@/components/AudioRecorder";

type HadithiTab = "read" | "share" | "generate";
type StoryFormat = "text" | "illustrated";

const abuseTypes = [
  "Physical",
  "Sexual", 
  "Emotional",
  "Economic",
  "Financial Abuse",
  "Digital Surveillance",
  "Isolation",
  "Coercive Control",
  "Physical Abuse",
  "Reproductive Coercion",
  "Psychological Abuse",
  "Public Humiliation",
  "Stalking",
  "Sexual Coercion",
  "Spiritual Abuse",
  "Elder Abuse",
  "Workplace Abuse",
  "Child Marriage",
  "Other",
];

const Hadithi = () => {
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<HadithiTab>("read");
  const [storyPublished, setStoryPublished] = useState(false);
  
  // Read tab state
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [expandedStory, setExpandedStory] = useState<any>(null);
  
  // Share tab state
  const [shareText, setShareText] = useState("");
  const [shareAbuseType, setShareAbuseType] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shareSubmitted, setShareSubmitted] = useState(false);
  
  // Generate tab state
  const [prompt, setPrompt] = useState("");
  const [generateAbuseType, setGenerateAbuseType] = useState("");
  const [format, setFormat] = useState<StoryFormat>("illustrated");
  const [blocks, setBlocks] = useState<StoryBlockType[]>([]);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const promptRef = useRef("");
  const storyMetaRef = useRef<{ abuseType?: string; protagonist?: string; location?: string }>({});


  // Fetch stories — prioritize matching abuse type if user recently generated one
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("stories")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      
      let sorted = data || [];
      // If user recently generated a story type, boost matching stories to top
      const recentType = sessionStorage.getItem("hadithi-last-type");
      if (recentType && sorted.length > 0) {
        const matching = sorted.filter(s => 
          s.abuse_type?.toLowerCase().includes(recentType.toLowerCase()) ||
          s.tags?.some((t: string) => t.toLowerCase().includes(recentType.toLowerCase()))
        );
        const rest = sorted.filter(s => !matching.includes(s));
        sorted = [...matching, ...rest];
      }
      
      setStories(sorted);
      setLoading(false);
    };
    if (activeTab === "read") fetchStories();
  }, [activeTab]);

  // Filter stories
  const filteredStories = stories.filter(story => {
    const matchesSearch = !searchQuery || 
      story.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || story.abuse_type?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  // Handle resonance
  const handleResonance = async (storyId: string) => {
    await supabase.rpc("increment_resonance", { story_id: storyId });
    setStories(prev => prev.map(s => 
      s.id === storyId ? { ...s, resonance_count: (s.resonance_count || 0) + 1 } : s
    ));
  };

  // Handle share
  const handleShareStory = async () => {
    if (!shareText.trim() || !shareAbuseType || sharing) return;
    setSharing(true);
    try {
      await supabase.from("stories").insert({
        title: shareText.split(".")[0].slice(0, 60) || "Anonymous",
        text: shareText.trim(),
        abuse_type: shareAbuseType || "other",
        language: "en",
        source: "user_submission",
        status: "pending",
        message: shareText.trim(),
      });
      setShareSubmitted(true);
      setShareText("");
      setShareAbuseType("");
    } catch (err) {
      console.error(err);
    } finally {
      setSharing(false);
    }
  };

  // Handle AI generation
  const startGeneration = async () => {
    if (!prompt.trim() || !generateAbuseType || generating) return;
    setBlocks([]);
    setDone(false);
    setGenerating(true);
    promptRef.current = prompt.trim();

    const controller = new AbortController();

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const url = `https://${projectId}.supabase.co/functions/v1/hadithi-stream`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ prompt: `${generateAbuseType}: ${prompt.trim()}`, language: "en", format }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) throw new Error("Stream failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);
            if (event.type === "done") {
              setDone(true);
            } else if (event.type === "meta") {
              storyMetaRef.current = {
                abuseType: event.abuseType,
                protagonist: event.protagonist,
                location: event.location,
              };
              // Remember for story prioritization
              if (event.abuseType) {
                sessionStorage.setItem("hadithi-last-type", event.abuseType.split(" ")[0]);
              }
            } else if (event.type === "text" && typeof event.content === "string") {
              setBlocks(prev => [...prev, { id: crypto.randomUUID(), type: "text", content: event.content }]);
            } else if (event.type === "image" && typeof event.url === "string") {
              setBlocks(prev => [...prev, { id: crypto.randomUUID(), type: "image", url: event.url, alt: event.alt }]);
            } else if (event.type === "audio" && typeof event.data === "string") {
              setBlocks(prev => [...prev, { id: crypto.randomUUID(), type: "audio", data: event.data, mimeType: event.mimeType }]);
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("AI stream error:", err);
      }
    } finally {
      setGenerating(false);
      setDone(true);
    }
  };

  // Stories are now shared explicitly via the "Share anonymously" button
  // No auto-save — user controls when to publish


  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#091F1A" }}>
      {/* Header */}
      <div className="text-center py-6 px-4">
        <button onClick={() => navigate(-1)} className="absolute left-4 top-6 text-white/40">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-3xl font-bold text-white">Hadithi</h1>
        <p className="text-white/50 text-sm mt-1">
          Stories of recognition, resilience, and hope
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-white/10 px-4 gap-1 sticky top-0 z-10" style={{ backgroundColor: "#091F1A" }}>
        {[
          { id: "read", label: "Read stories", icon: BookOpen },
          { id: "share", label: "Share yours", icon: PenLine },
          { id: "generate", label: "Generate", icon: Sparkles },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as HadithiTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? "border-[#C4871A] text-[#C4871A]"
                : "border-transparent text-white/40 hover:text-white/60"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {/* READ TAB */}
        {activeTab === "read" && (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-2 px-4">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white/80 text-sm placeholder-white/30 focus:outline-none focus:border-[#C4871A]/50"
              />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="bg-[#0F3D34] border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C4871A]/50 min-w-[140px]"
                style={{ backgroundColor: "#0F3D34", color: "white" }}
              >
                <option value="" style={{ backgroundColor: "#0F3D34", color: "white" }}>All types</option>
                {abuseTypes.map(t => (
                  <option key={t} value={t} style={{ backgroundColor: "#0F3D34", color: "white" }}>{t}</option>
                ))}
              </select>
            </div>

            {/* Stories List */}
            {loading ? (
              <div className="text-center py-8 text-white/40">Loading...</div>
            ) : filteredStories.length === 0 ? (
              <div className="text-center py-8 text-white/40">No stories yet</div>
            ) : (
              filteredStories.map(story => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-4 mb-4 p-5 rounded-2xl bg-white/5 border border-white/10"
                >
                  {story.source === "hadithi_ai" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
                      <Sparkles className="h-3 w-3" /> AI generated
                    </span>
                  )}
                  
                  <h3 className="font-display text-white font-semibold mb-2">{story.title || "Untitled"}</h3>
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-4">{story.text}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-white/30 capitalize">{story.abuse_type || "Other"}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResonance(story.id)}
                        className="flex items-center gap-1 text-xs text-white/40 hover:text-[#C4871A] transition-colors"
                      >
                        <Heart className="h-3 w-3" />
                        {story.resonance_count || 0}
                      </button>
                      <button
                        onClick={() => setExpandedStory(story)}
                        className="text-xs text-[#C4871A]/70 hover:text-[#C4871A]"
                      >
                        Read more
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* SHARE TAB */}
        {activeTab === "share" && (
          <div className="p-4 space-y-4 max-w-lg mx-auto">
            <p className="text-white/50 text-sm text-center">
              Share anonymously. Only the text you submit will be stored. No account needed.
            </p>

            <select
              value={shareAbuseType}
              onChange={e => setShareAbuseType(e.target.value)}
              className="w-full bg-[#0F3D34] border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C4871A]/50"
              style={{ backgroundColor: "#0F3D34", color: "white" }}
            >
              <option value="" style={{ backgroundColor: "#0F3D34", color: "white" }}>Type of abuse (required)</option>
              {abuseTypes.map(t => (
                <option key={t} value={t} style={{ backgroundColor: "#0F3D34", color: "white" }}>{t}</option>
              ))}
            </select>

            <textarea
              value={shareText}
              onChange={e => setShareText(e.target.value)}
              placeholder="Share your experience. You can use any name or no name at all."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white/80 text-sm resize-none h-48 focus:outline-none focus:border-[#C4871A]/50 placeholder-white/20"
            />

            <button
              onClick={handleShareStory}
              disabled={!shareText.trim() || !shareAbuseType || sharing}
              className="w-full bg-[#C4871A] text-[#091F1A] font-semibold rounded-xl py-3 disabled:opacity-40 transition-all active:scale-95"
            >
              {sharing ? "Submitting..." : "Submit anonymously"}
            </button>

            {shareSubmitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-green-400/70 italic"
              >
                Thank you. Your story has been received and will be reviewed before publishing.
              </motion.p>
            )}
          </div>
        )}

        {/* GENERATE TAB */}
        {activeTab === "generate" && (
          <div className="p-4 space-y-4 max-w-lg mx-auto">
            <p className="text-white/50 text-sm">
              Ask AI to generate a multimedia awareness story. The story is fictional — it helps you recognise abuse without having to name it directly.
            </p>

            <select
              value={generateAbuseType}
              onChange={e => setGenerateAbuseType(e.target.value)}
              className="w-full bg-[#0F3D34] border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C4871A]/50"
              style={{ backgroundColor: "#0F3D34", color: "white" }}
            >
              <option value="" style={{ backgroundColor: "#0F3D34", color: "white" }}>Select type of abuse (required)</option>
              {abuseTypes.map(t => (
                <option key={t} value={t} style={{ backgroundColor: "#0F3D34", color: "white" }}>{t}</option>
              ))}
            </select>

            <Textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe a scenario or type 'begin' to generate a story"
              className="min-h-[100px] border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-[#C4871A]/50"
            />

            <div className="flex gap-2">
              {([
                { id: "text" as const, label: "Text only", desc: "Fast" },
                { id: "illustrated" as const, label: "Illustrated", desc: "With images" },
              ]).map(f => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  disabled={generating}
                  className={`flex-1 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    format === f.id
                      ? "bg-[#C4871A] text-[#091F1A]"
                      : "bg-white/10 text-white/60 hover:bg-white/15 disabled:opacity-40"
                  }`}
                >
                  <span className="block font-medium">{f.label}</span>
                  <span className="block text-xs opacity-70">{f.desc}</span>
                </button>
              ))}
            </div>

            <button
              onClick={startGeneration}
              disabled={!prompt.trim() || !generateAbuseType || generating}
              className="w-full bg-[#C4871A] text-[#091F1A] font-semibold rounded-xl py-3 disabled:opacity-40 transition-all active:scale-95"
            >
              {generating ? "Generating..." : "Generate Story"}
            </button>

            <p className="text-xs text-white/30 text-center">Stories are fictional and for awareness only</p>

            {/* Generated Story Display */}
            <div className="space-y-4 pt-4">
              {blocks.map(block => (
                <StoryBlock key={block.id} block={block} />
              ))}
              {generating && (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C4871A] animate-pulse" />
                  <span className="text-sm text-white/50">Generating...</span>
                </div>
              )}
            </div>

            {/* Post-generation CTAs */}
            {done && blocks.length > 0 && (
              <div className="space-y-3 mt-6 border-t border-white/10 pt-6">
                {!storyPublished ? (
                  <>
                    <p className="text-white/50 text-sm italic text-center">
                      Would you like to share this story with the community?
                    </p>
                    <button
                      onClick={async () => {
                        const text = blocks.filter(b => b.type === "text").map(b => b.content).join("\n\n");
                        const meta = storyMetaRef.current;
                        if (text) {
                          await supabase.from("stories").insert({
                            text,
                            title: meta.protagonist ? `${meta.protagonist}'s Story` : "Untitled",
                            language: "English",
                            status: "approved",
                            source: "hadithi_ai",
                            abuse_type: meta.abuseType || generateAbuseType || null,
                            tags: ["ai-story", ...(meta.abuseType ? [meta.abuseType.split(" ")[0]] : [])],
                          });
                          setStoryPublished(true);
                        }
                      }}
                      className="w-full bg-safe text-white font-semibold rounded-xl py-3 transition-all active:scale-95"
                    >
                      Share anonymously to library
                    </button>
                    <p className="text-xs text-white/30 text-center">
                      🔒 Stories are shared anonymously — no personal data is attached
                    </p>
                  </>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-green-400/70 italic"
                  >
                    ✅ Story shared anonymously with the community
                  </motion.p>
                )}

                <div className="pt-2 space-y-2">
                  <p className="text-white/50 text-sm italic text-center">
                    If this story touches you, you don't have to go through this alone.
                  </p>
                  <button
                    onClick={() => navigate("/sauti")}
                    className="w-full bg-[#C4871A] text-[#091F1A] font-semibold rounded-xl py-3"
                  >
                    Talk to Sauti
                  </button>
                  <button
                    onClick={() => { setBlocks([]); setDone(false); setPrompt(""); setStoryPublished(false); setGenerateAbuseType(""); }}
                    className="w-full bg-white/10 text-white/60 rounded-xl py-3 text-sm"
                  >
                    Generate another story
                  </button>
                  <button
                    onClick={() => { setBlocks([]); setDone(false); setPrompt(""); setStoryPublished(false); setActiveTab("read"); }}
                    className="w-full bg-white/5 text-white/40 rounded-xl py-3 text-sm"
                  >
                    Read community stories
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expanded Story Modal */}
      <AnimatePresence>
        {expandedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
            onClick={() => setExpandedStory(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-lg rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
              style={{ backgroundColor: "#0F3D34" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-display text-xl font-semibold text-white">{expandedStory.title || "Untitled"}</h2>
                <button onClick={() => setExpandedStory(null)} className="text-white/40">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{expandedStory.text}</p>
              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => navigate("/signal")}
                  className="w-full bg-[#C4871A] text-[#091F1A] font-semibold rounded-xl py-3"
                >
                  I need help
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hadithi;
