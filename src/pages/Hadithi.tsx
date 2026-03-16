import { useState, useEffect, useRef } from "react";
import { BookOpen, PenLine, Sparkles, Heart, ArrowLeft, X, Mic, Type, Loader2, SendHorizonal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getStories, addStory, incrementResonance } from "@/lib/localStories";
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
  const [shareInputMode, setShareInputMode] = useState<"text" | "audio">("text");
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  
  // Generate tab state
  const [prompt, setPrompt] = useState("");
  const [generateAbuseType, setGenerateAbuseType] = useState("");
  const [format, setFormat] = useState<StoryFormat>("text");
  const [blocks, setBlocks] = useState<StoryBlockType[]>([]);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const promptRef = useRef("");
  const storyMetaRef = useRef<{ abuseType?: string; protagonist?: string; location?: string }>({});


  // Fetch stories — prioritize matching abuse type if user recently generated one
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      
      // Use local storage for stories (no backend needed)
      let sorted = getStories("approved");
      
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
    incrementResonance(storyId);
    setStories(prev => prev.map(s => 
      s.id === storyId ? { ...s, resonance_count: (s.resonance_count || 0) + 1 } : s
    ));
  };

  // Handle share
  const handleShareStory = async () => {
    // Collect full story from all user messages in chat
    const allUserText = chatMessages
      .filter(m => m.role === "user")
      .map(m => m.content)
      .join("\n\n");
    const fullText = allUserText || shareText.trim();
    if (!fullText || !shareAbuseType || sharing) return;
    setSharing(true);
    try {
      await addStory({
        title: fullText.split(".")[0].slice(0, 60) || "Anonymous",
        text: fullText,
        abuse_type: shareAbuseType || "other",
        language: "en",
        source: "user_submission",
        status: "pending",
        tags: [],
      });
      setShareSubmitted(true);
      setShareText("");
      setChatMessages([]);
    } catch (err) {
      console.error(err);
    } finally {
      setSharing(false);
    }
  };

  // Ask AI for follow-up context (chat-style) - disabled for now
  const askForMoreContext = async (text: string) => {
    // Chat follow-up disabled - simple submit only
    toast.info("Submit your story and we'll review it soon.");
  };

  // Handle audio transcription result
  const handleAudioTranscript = (text: string) => {
    setChatMessages(prev => [...prev, { role: "user" as const, content: text }]);
    setShareInputMode("text");
    toast.success("Audio transcribed and added to your story!");
  };

  const [retryAfter, setRetryAfter] = useState<number>(0);

  // Handle AI generation
  const startGeneration = async () => {
    if (!prompt.trim() || !generateAbuseType || generating) return;
    if (retryAfter > 0) {
      toast.error(`Please wait ${retryAfter}s before trying again`);
      return;
    }
    setBlocks([]);
    setDone(false);
    setGenerating(true);
    promptRef.current = prompt.trim();

    const controller = new AbortController();

    try {
      const googleApiKey = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY;
      if (!googleApiKey) {
        throw new Error("Google AI API key not configured");
      }

      // Initialize Google GenAI SDK - use gemini-2.5-flash for multimodal
      const genAI = new GoogleGenerativeAI(googleApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const protagonist = ["Wanjiku", "Akinyi", "Fatuma", "Njeri", "Atieno", "Rehema", "Zawadi", "Nyambura", "Halima", "Zuri", "Makena", "Nyokabi", "Sifa"][Math.floor(Math.random() * 13)];
      const abuser = ["Otieno", "Kamau", "Juma", "Ochieng", "Mwangi", "Hassan", "Kipchoge", "Barasa", "Mutua", "Ndung'u"][Math.floor(Math.random() * 10)];
      const location = ["Kisumu", "Mombasa", "Nakuru", "Nairobi's Eastlands", "Eldoret", "Malindi", "Nyeri", "Machakos", "Kilifi", "Thika"][Math.floor(Math.random() * 10)];
      const relationship = ["partner", "husband", "boyfriend", "uncle", "employer", "in-law", "neighbour", "colleague"][Math.floor(Math.random() * 8)];
      const setting = ["rural village", "urban apartment", "market stall", "school compound", "small business"][Math.floor(Math.random() * 5)];
      const perspective = Math.random() > 0.5 ? "first-person" : "third-person";

      const useImages = format === "illustrated";
      
      const systemPrompt = `You are a trauma-informed awareness storyteller about gender-based violence in East Africa.

IMPORTANT RULES:
- Use these EXACT character details: protagonist is ${protagonist}, the abuser is ${relationship} named ${abuser}, set in ${location} near a ${setting}.
- ${perspective === "first-person" ? `Write in first person as ${protagonist}.` : `Write in third person about ${protagonist}.`}
- The story must focus on: ${generateAbuseType}.
- Write 6-8 paragraphs. Show how the abuse develops gradually.
- End by gently naming what happened and showing courage.
- Use culturally specific East African details.
- At the very end, add: "⚠️ This story is fictional and created for awareness purposes only."`;

      const isGenericStart = prompt.trim().length < 10;
      const userPrompt = isGenericStart 
        ? `Tell me a story about ${generateAbuseType} set in ${location}`
        : `${generateAbuseType}: ${prompt.trim()}`;

      // Generate content with multimodal support
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { role: "user", parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      });

      // Store metadata
      storyMetaRef.current = { abuseType: generateAbuseType, protagonist, location };

      // Process response - handle both text and inline images
      const response = result.response;
      
      // Get text content
      let storyText = "";
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            storyText += part.text;
          }
          // Check for inline image data
          if (part.inlineData) {
            const imgUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            setBlocks(prev => [...prev, { 
              id: crypto.randomUUID(), 
              type: "image", 
              url: imgUrl, 
              alt: "Story illustration" 
            }]);
          }
        }
      }
      
      if (!storyText) storyText = response.text() || "";

      // Split into paragraphs
      const paragraphs = storyText.split(/\n\n+/).filter(p => p.trim());
      
      for (const para of paragraphs) {
        setBlocks(prev => [...prev, { id: crypto.randomUUID(), type: "text", content: para.trim() }]);
      }

      setDone(true);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("AI stream error:", err);
        
        // Handle quota errors
        if (err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED")) {
          toast.error("AI quota exceeded. Please wait a moment or upgrade your plan.");
          // Set retry delay
          setRetryAfter(20);
          const interval = setInterval(() => {
            setRetryAfter(prev => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          toast.error(err.message || "Failed to generate story");
        }
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
      <div className="flex justify-center border-b border-white/10 px-4 gap-1 sticky top-0 z-10" style={{ backgroundColor: "#091F1A" }}>
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

      {/* Tab Content - centered in middle columns */}
      <div className="pt-4 max-w-2xl mx-auto px-4">
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

        {/* SHARE TAB — ChatGPT-like layout */}
        {activeTab === "share" && (
          <div className="flex flex-col max-w-lg mx-auto" style={{ height: "calc(100vh - 160px)" }}>
            {/* Top: abuse type selector (only shown if not yet selected) */}
            {!shareAbuseType ? (
              <div className="p-4 space-y-4 flex-1 flex flex-col items-center justify-center">
                <p className="text-white/50 text-sm text-center">
                  Share anonymously. Only the text you submit will be stored.
                </p>
                <select
                  value={shareAbuseType}
                  onChange={e => setShareAbuseType(e.target.value)}
                  className="w-full bg-[#0F3D34] border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C4871A]/50"
                  style={{ backgroundColor: "#0F3D34", color: "white" }}
                >
                  <option value="" style={{ backgroundColor: "#0F3D34", color: "white" }}>Select type of abuse to begin</option>
                  {abuseTypes.map(t => (
                    <option key={t} value={t} style={{ backgroundColor: "#0F3D34", color: "white" }}>{t}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                {/* Abuse type badge + change */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                  <span className="text-xs text-white/40">
                    Topic: <span className="text-[#C4871A]">{shareAbuseType}</span>
                  </span>
                  <button
                    onClick={() => { setShareAbuseType(""); setChatMessages([]); setShareText(""); }}
                    className="text-xs text-white/30 hover:text-white/60"
                  >
                    Change
                  </button>
                </div>

                {/* Conversation area — scrollable */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {chatMessages.length === 0 && !shareText && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <PenLine className="h-8 w-8 text-white/20 mb-3" />
                      <p className="text-white/40 text-sm">
                        Tell us what happened. Type or record below.
                      </p>
                      <p className="text-white/25 text-xs mt-1">
                        AI can help you expand your story after you share.
                      </p>
                    </div>
                  )}

                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-white/10 text-white/80 ml-auto"
                          : "bg-[#C4871A]/10 border border-[#C4871A]/20 text-white/70 mr-auto"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <span className="block text-[10px] uppercase tracking-wider text-[#C4871A]/60 mb-1">Hadithi</span>
                      )}
                      {msg.content}
                    </motion.div>
                  ))}

                  {aiLoading && (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#C4871A]" />
                      <span className="text-sm text-white/50">Thinking…</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Success message */}
                {shareSubmitted && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-green-400/70 italic px-4 py-2"
                  >
                    Thank you. Your story has been received and will be reviewed before publishing. 💚
                  </motion.p>
                )}

                {/* Bottom input area — pinned */}
                <div className="border-t border-white/10 px-4 py-3 space-y-2" style={{ backgroundColor: "#091F1A" }}>
                  {/* Input mode toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShareInputMode("text")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                        shareInputMode === "text"
                          ? "bg-[#C4871A] text-[#091F1A]"
                          : "bg-white/10 text-white/50 hover:bg-white/15"
                      }`}
                    >
                      <Type className="h-3 w-3" />
                      Type
                    </button>
                    {/* Record button commented out - voice input disabled
                    <button
                      onClick={() => setShareInputMode("audio")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                        shareInputMode === "audio"
                          ? "bg-[#C4871A] text-[#091F1A]"
                          : "bg-white/10 text-white/50 hover:bg-white/15"
                      }`}
                    >
                      <Mic className="h-3 w-3" />
                      Record
                    </button>
                    */}
                    <div className="flex-1" />
                    {/* Submit button */}
                    <button
                      onClick={handleShareStory}
                      disabled={(!shareText.trim() && chatMessages.length === 0) || sharing}
                      className="bg-[#C4871A] text-[#091F1A] font-semibold rounded-lg px-4 py-1.5 text-xs disabled:opacity-40 transition-all active:scale-95"
                    >
                      {sharing ? "…" : "Submit"}
                    </button>
                  </div>

                  {/* Audio recorder */}
                  {shareInputMode === "audio" && (
                    <AudioRecorder onTranscript={handleAudioTranscript} />
                  )}

                  {/* Text input */}
                  {shareInputMode === "text" && (
                    <div className="flex gap-2">
                      <textarea
                        value={shareText}
                        onChange={e => setShareText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && !e.shiftKey && shareText.trim()) {
                            e.preventDefault();
                            askForMoreContext(shareText);
                            setShareText("");
                          }
                        }}
                        placeholder="Tell us what happened…"
                        rows={2}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm resize-none focus:outline-none focus:border-[#C4871A]/50 placeholder-white/20"
                      />
                      <button
                        onClick={() => {
                          if (shareText.trim()) {
                            askForMoreContext(shareText);
                            setShareText("");
                          }
                        }}
                        disabled={!shareText.trim() || aiLoading}
                        className="self-end bg-[#C4871A] hover:bg-[#C4871A]/80 text-[#091F1A] rounded-xl p-3 disabled:opacity-30 transition-colors"
                        aria-label="Send message"
                      >
                        <SendHorizonal className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* GENERATE TAB */}
        {activeTab === "generate" && (
          <div className="p-4 space-y-4 max-w-lg mx-auto">
            {/* Generated Story Display - shown FIRST like chat UI */}
            <div className="space-y-4">
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

            {/* Input Controls - shown BELOW the story */}
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
                { id: "text" as const, label: "Text only", desc: "Story only" },
                { id: "illustrated" as const, label: "With Images", desc: "Story + illustrations" },
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
              disabled={!prompt.trim() || !generateAbuseType || generating || retryAfter > 0}
              className="w-full bg-[#C4871A] text-[#091F1A] font-semibold rounded-xl py-3 disabled:opacity-40 transition-all active:scale-95"
            >
              {generating ? "Generating..." : retryAfter > 0 ? `Wait ${retryAfter}s...` : "Generate Story"}
            </button>

            <p className="text-xs text-white/30 text-center">Stories are fictional and for awareness only</p>

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
                          await addStory({
                            text,
                            title: meta.protagonist ? `${meta.protagonist}'s Story` : "Untitled",
                            language: "English",
                            status: "approved",
                            source: "hadithi_ai",
                            abuse_type: meta.abuseType || generateAbuseType || undefined,
                            tags: ["ai-story", ...(meta.abuseType ? [meta.abuseType.split(" ")[0]] : [])],
                          });
                          setStoryPublished(true);
                          toast.success("Story shared to community library!");
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
                  {/* Sauti hidden for submission - voice feature coming soon */}
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
