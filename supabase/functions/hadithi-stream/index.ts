import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Diversity pools for story variety
const NAMES_FEMALE = ["Wanjiku", "Akinyi", "Fatuma", "Njeri", "Atieno", "Rehema", "Zawadi", "Nyambura", "Halima", "Zuri", "Makena", "Nyokabi", "Sifa", "Baraka", "Neema"];
const NAMES_MALE = ["Otieno", "Kamau", "Juma", "Ochieng", "Mwangi", "Hassan", "Kipchoge", "Barasa", "Mutua", "Ndung'u", "Abdi", "Wekesa", "Karanja", "Ruto", "Abubakar"];
const LOCATIONS = ["Kisumu", "Mombasa", "Nakuru", "Nairobi's Eastlands", "Eldoret", "Malindi", "Nyeri", "Machakos", "Kilifi", "Garissa", "Thika", "Kitale", "Kakamega", "Lamu", "Nanyuki"];
const RELATIONSHIPS = ["partner", "husband", "boyfriend", "uncle", "employer", "in-law", "neighbour", "colleague", "elder", "family friend"];
const PERSPECTIVES = ["first-person", "third-person"];
const SETTINGS = ["rural village", "urban apartment", "market stall", "school compound", "small business", "church community", "hospital ward", "fishing village", "tea plantation", "matatu route"];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const ABUSE_TYPE_MAP: Record<string, string> = {
  emotional: "emotional abuse and psychological manipulation",
  economic: "economic abuse and financial control",
  physical: "physical violence",
  sexual: "sexual coercion",
  isolation: "social isolation and control",
  digital: "digital surveillance and technology-facilitated abuse",
  coercive: "coercive control patterns",
  stalking: "stalking and harassment",
  spiritual: "spiritual abuse and religious manipulation",
  reproductive: "reproductive coercion",
  workplace: "workplace harassment and abuse of power",
  elder: "elder abuse",
};

function detectAbuseType(prompt: string): string {
  const lower = prompt.toLowerCase();
  for (const [key, value] of Object.entries(ABUSE_TYPE_MAP)) {
    if (lower.includes(key)) return value;
  }
  // Random if no match
  const types = Object.values(ABUSE_TYPE_MAP);
  return types[Math.floor(Math.random() * types.length)];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, language, format = "multimedia" } = await req.json();
    const apiKey = Deno.env.get("GOOGLE_AI_STUDIO_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GOOGLE_AI_STUDIO_API_KEY not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const includeImages = format === "image_text" || format === "multimedia";
    const includeAudio = format === "multimedia";

    // Generate diverse character details for each story
    const protagonist = pick(NAMES_FEMALE);
    const abuser = pick(NAMES_MALE);
    const location = pick(LOCATIONS);
    const relationship = pick(RELATIONSHIPS);
    const perspective = pick(PERSPECTIVES);
    const setting = pick(SETTINGS);
    const abuseType = detectAbuseType(prompt);

    const perspectiveInstruction = perspective === "first-person"
      ? `Write in first person as ${protagonist}.`
      : `Write in third person about ${protagonist}.`;

    const imageInstruction = includeImages
      ? ` Every two paragraphs, on its own line write: [IMAGE: brief description of a soft watercolour illustration showing the emotional mood of that moment].`
      : "";

    const systemPrompt = `You are a trauma-informed awareness storyteller about gender-based violence in East Africa.

IMPORTANT RULES:
- Use these EXACT character details: protagonist is ${protagonist}, the abuser is ${relationship} named ${abuser}, set in ${location} near a ${setting}.
- ${perspectiveInstruction}
- The story must focus on: ${abuseType}.
- Write 6-8 paragraphs. Show how the abuse develops gradually — the early "good days", then the slow shift.
- End by gently naming what happened and showing a moment of recognition or small act of courage.
- Use culturally specific details (food, transport, language, social dynamics).
- Do NOT always use the same story arc. Vary the ending: sometimes hope, sometimes ambiguity, sometimes a community response.
- Avoid clinical or medical language. Be gentle and dignified.${imageInstruction}
- At the very end, add on its own line: "⚠️ This story is fictional and created for awareness purposes only."
- Respond with the story only.`;

    const isGenericStart = prompt === "begin" || prompt === "anza" || prompt.trim().length < 10;
    const userPrompt = isGenericStart
      ? (language === "sw"
        ? `Niandikia hadithi kuhusu ${abuseType} inayotokea ${location}`
        : `Tell me a story about ${abuseType} set in ${location}`)
      : prompt;

    // Use Google AI Studio API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 1.0,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const err = await geminiResponse.text();
      return new Response(
        JSON.stringify({ error: "Gemini API error", detail: err }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encode = (obj: object) =>
          new TextEncoder().encode(`data: ${JSON.stringify(obj)}\n\n`);

        // Send metadata about the generated story so the client can tag it
        controller.enqueue(encode({
          type: "meta",
          abuseType: abuseType,
          protagonist,
          location,
        }));

        const reader = geminiResponse.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let paraBuffer = "";

        const generateImage = async (description: string): Promise<string | null> => {
          try {
            const imageResponse = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: `Generate a soft watercolour illustration: ${description}` }] }],
                  generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
                }),
              }
            );
            
            if (imageResponse.ok) {
              const data = await imageResponse.json();
              const inlineData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
              if (inlineData?.data) {
                return `data:${inlineData.mimeType};base64,${inlineData.data}`;
              }
            }
            console.error("Image generation failed:", await imageResponse.text());
            return null;
          } catch (e) {
            console.error("Image error:", e);
            return null;
          }
        };

        const emitParagraph = async (text: string) => {
          const trimmed = text.trim();
          if (!trimmed) return;

          const imageMatch = trimmed.match(/^\[IMAGE:\s*(.+)\]$/i);
          if (imageMatch && includeImages) {
            const description = imageMatch[1] + ", soft watercolour style, muted emotional tones, East African context";
            controller.enqueue(encode({ type: "text", content: " " }));
            
            const imageUrl = await generateImage(description);
            if (imageUrl) {
              controller.enqueue(encode({
                type: "image",
                url: imageUrl,
                alt: description,
              }));
            }
            return;
          }

          controller.enqueue(encode({ type: "text", content: trimmed }));

          if (!includeAudio) return;

          try {
            const ttsResponse = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ role: "user", parts: [{ text: `Read this aloud naturally: ${trimmed}` }] }],
                  generationConfig: {
                    responseModalities: ["AUDIO"],
                    speech_config: {
                      voice_config: {
                        prebuilt_voice_config: { voice_name: "Aoede" },
                      },
                    },
                  },
                }),
              }
            );

            if (ttsResponse.ok) {
              const ttsData = await ttsResponse.json();
              const audioPart = ttsData?.candidates?.[0]?.content?.parts?.find(
                (p: any) => p.inlineData?.mimeType?.includes("audio")
              );
              if (audioPart?.inlineData) {
                controller.enqueue(encode({
                  type: "audio",
                  data: audioPart.inlineData.data,
                  mimeType: audioPart.inlineData.mimeType,
                }));
              }
            }
          } catch {
            // Audio generation failed silently
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw || raw === "[DONE]") continue;

            try {
              const parsed = JSON.parse(raw);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
              if (!text) continue;

              paraBuffer += text;

              while (paraBuffer.includes("\n\n")) {
                const idx = paraBuffer.indexOf("\n\n");
                const para = paraBuffer.slice(0, idx).trim();
                paraBuffer = paraBuffer.slice(idx + 2);
                if (para) await emitParagraph(para);
              }

              const singleLines = paraBuffer.split("\n");
              for (let i = 0; i < singleLines.length - 1; i++) {
                if (singleLines[i].trim().match(/^\[IMAGE:/i)) {
                  await emitParagraph(singleLines[i].trim());
                  singleLines.splice(i, 1);
                  i--;
                }
              }
              paraBuffer = singleLines.join("\n");

            } catch { /* skip malformed */ }
          }
        }

        if (paraBuffer.trim()) await emitParagraph(paraBuffer.trim());

        controller.enqueue(encode({ type: "done" }));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
