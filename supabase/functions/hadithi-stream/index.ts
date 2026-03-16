import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const systemPrompt = includeImages
      ? `You are an awareness storyteller about gender-based violence in Kenya. Write a short first-person story (6-8 paragraphs) about a fictional character experiencing abuse — economic control, emotional control, or physical abuse. Use Kenyan names and locations. Show slowly how abuse develops. End by gently naming what happened. Every two paragraphs, on its own line write: [IMAGE: brief description of a soft watercolour illustration showing the emotional mood of that moment]. Respond with the story only.`
      : `You are an awareness storyteller about gender-based violence in Kenya. Write a short first-person story (6-8 paragraphs) about a fictional character experiencing abuse — economic control, emotional control, or physical abuse. Use Kenyan names and locations. Show slowly how abuse develops. End by gently naming what happened. Respond with the story only.`;

    const userPrompt = (prompt === "begin" || prompt === "anza")
      ? (language === "sw" ? "Niandikia hadithi kuhusu udhibiti wa kiuchumi" : "Tell me a story about coercive control in a relationship")
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
            temperature: 0.9,
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
            const description = imageMatch[1] + ", soft watercolour style, muted emotional tones, Kenyan context";
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
