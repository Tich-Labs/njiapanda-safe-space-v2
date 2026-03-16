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
  financial: "financial abuse and economic control",
  psychological: "psychological abuse and manipulation",
  humiliation: "public humiliation and shaming",
  child: "child marriage and forced unions",
};

function detectAbuseType(prompt: string): string {
  const lower = prompt.toLowerCase();
  for (const [key, value] of Object.entries(ABUSE_TYPE_MAP)) {
    if (lower.includes(key)) return value;
  }
  const types = Object.values(ABUSE_TYPE_MAP);
  return types[Math.floor(Math.random() * types.length)];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, language, format = "illustrated" } = await req.json();
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableKey) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const includeImages = format === "illustrated";

    // Generate diverse character details
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
      ? ` Every two paragraphs, on its own line write exactly: [IMAGE: brief visual description of the emotional mood]. Keep image descriptions under 20 words.`
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

    // Use Lovable AI gateway for text generation (streaming)
    const geminiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          stream: true,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const err = await geminiResponse.text();
      const status = geminiResponse.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Service is busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "AI gateway error", detail: err }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encode = (obj: object) =>
          new TextEncoder().encode(`data: ${JSON.stringify(obj)}\n\n`);

        // Send metadata
        controller.enqueue(encode({
          type: "meta",
          abuseType,
          protagonist,
          location,
        }));

        const reader = geminiResponse.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let paraBuffer = "";

        const generateImage = async (description: string): Promise<string | null> => {
          // Use Lovable AI gateway for image generation
          if (!lovableKey) {
            console.error("LOVABLE_API_KEY not set, skipping image generation");
            return null;
          }

          try {
            const imagePrompt = `A soft watercolour illustration: ${description}. East African context, muted emotional tones, gentle and dignified. No text or words in the image.`;

            const imageResponse = await fetch(
              "https://ai.gateway.lovable.dev/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${lovableKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "google/gemini-3.1-flash-image-preview",
                  messages: [
                    { role: "user", content: imagePrompt },
                  ],
                }),
              }
            );

            if (!imageResponse.ok) {
              console.error("Image generation failed:", imageResponse.status);
              return null;
            }

            const data = await imageResponse.json();
            // Check for inline image in the response
            const content = data?.choices?.[0]?.message?.content;

            // The Lovable AI gateway may return images as markdown or base64
            // Check for base64 image in parts
            const parts = data?.choices?.[0]?.message?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.inline_data?.mime_type?.includes("image")) {
                  return `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`;
                }
              }
            }

            // Check if content contains a markdown image
            if (content) {
              const mdMatch = content.match(/!\[.*?\]\((data:image\/[^)]+)\)/);
              if (mdMatch) return mdMatch[1];

              // Check for base64 data URI in content
              const b64Match = content.match(/(data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+)/);
              if (b64Match) return b64Match[1];
            }

            console.error("No image found in response");
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
            const description = imageMatch[1];
            // Emit a placeholder while generating
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
              const text = parsed.choices?.[0]?.delta?.content ?? "";
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
