import { useState, useRef, useCallback } from "react";
import { Copy, CheckCircle2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

type Lang = "en" | "sw";
type StoryBlock =
  | { type: "text"; content: string }
  | { type: "image_url"; url: string; alt: string }
  | { type: "audio_b64"; data: string; mimeType: string };

const labels: Record<string, Record<Lang, string>> = {
  title: { en: "Hadithi — Awareness Stories", sw: "Hadithi — Hadithi za Ufahamu" },
  placeholder: {
    en: "Describe a scenario or type 'begin' to hear a story about recognising coercive control",
    sw: "Elezea hali au andika 'anza' kusikia hadithi",
  },
  tellStory: { en: "Tell the story", sw: "Simulia hadithi" },
  crafting: { en: "Crafting your story...", sw: "Inaandaa hadithi yako..." },
  share: { en: "Share awareness", sw: "Shiriki ufahamu" },
  copied: { en: "Copied!", sw: "Imenakiliwa!" },
  disclaimer: {
    en: "Stories are fictional and for awareness only",
    sw: "Hadithi ni za kufanya ufahamu tu",
  },
};

const Hadithi = () => {
  const [lang, setLang] = useState<Lang>("en");
  const [prompt, setPrompt] = useState("");
  const [blocks, setBlocks] = useState<StoryBlock[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const t = useCallback((key: string) => labels[key]?.[lang] ?? key, [lang]);

  const startStory = async () => {
    if (!prompt.trim() || streaming) return;
    setBlocks([]);
    setDone(false);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

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
        body: JSON.stringify({ prompt: prompt.trim(), language: lang }),
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
            } else if (event.type === "text") {
              setBlocks((prev) => [...prev, { type: "text", content: event.content }]);
            } else if (event.type === "image_url") {
              setBlocks((prev) => [...prev, { type: "image_url", url: event.url, alt: event.alt }]);
            } else if (event.type === "audio_b64") {
              setBlocks((prev) => [
                ...prev,
                { type: "audio_b64", data: event.data, mimeType: event.mimeType },
              ]);
            }
          } catch {
            // malformed event, skip
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Hadithi stream error:", err);
      }
    } finally {
      setStreaming(false);
      setDone(true);
    }
  };

  const copyText = () => {
    const text = blocks
      .filter((b): b is StoryBlock & { type: "text" } => b.type === "text")
      .map((b) => b.content)
      .join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#091F1A" }}>
      {/* Language toggle */}
      <div className="fixed top-3 left-3 z-50 flex gap-1">
        {(["en", "sw"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`rounded px-2.5 py-1 font-mono text-xs font-semibold uppercase transition-colors ${
              lang === l
                ? "bg-[#C4871A] text-[#091F1A]"
                : "bg-white/10 text-white/50 hover:text-white/80"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 md:flex md:gap-8">
        {/* Input panel */}
        <div className="mb-8 md:mb-0 md:w-[380px] md:shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5" style={{ color: "#C4871A" }} />
            <h1 className="font-display text-xl font-semibold text-white">{t("title")}</h1>
          </div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t("placeholder")}
            className="mb-3 min-h-[120px] border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-[#C4871A]/50"
          />

          <button
            onClick={startStory}
            disabled={!prompt.trim() || streaming}
            className="w-full rounded-xl px-6 py-3 font-semibold transition-all active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: "#C4871A", color: "#091F1A" }}
          >
            {streaming ? t("crafting") : t("tellStory")}
          </button>

          <p className="mt-3 text-center font-sans text-xs text-white/30">{t("disclaimer")}</p>
        </div>

        {/* Story panel */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-[calc(100vh-160px)] md:h-[calc(100vh-120px)]">
            <div className="space-y-6 pr-2">
              <AnimatePresence mode="popLayout">
                {blocks.map((block, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                  >
                    {block.type === "text" && (
                      <p className="font-serif text-base italic leading-relaxed text-white/80">
                        {block.content}
                      </p>
                    )}
                    {block.type === "image_url" && (
                      <motion.img
                        src={block.url}
                        alt={block.alt}
                        className="w-full rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        loading="lazy"
                      />
                    )}
                    {block.type === "audio_b64" && (
                      <AudioBlock data={block.data} mimeType={block.mimeType} />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Streaming indicator */}
              {streaming && (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C4871A] animate-pulse" />
                  <span className="font-sans text-sm text-white/50">{t("crafting")}</span>
                </div>
              )}

              {/* Share button */}
              {done && blocks.length > 0 && !streaming && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-4"
                >
                  <button
                    onClick={copyText}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 font-sans text-sm text-white/70 transition-colors hover:bg-white/15"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-safe" />
                        {t("copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        {t("share")}
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

/** Auto-playing audio block */
const AudioBlock = ({ data, mimeType }: { data: string; mimeType: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const blobUrl = useRef<string>("");

  if (!blobUrl.current) {
    const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: mimeType });
    blobUrl.current = URL.createObjectURL(blob);
  }

  return (
    <audio
      ref={audioRef}
      src={blobUrl.current}
      autoPlay
      controls
      className="w-full opacity-60"
    />
  );
};

export default Hadithi;
