import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, language } = await req.json();
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lang = language === "sw" ? "Swahili" : "English";

    const systemPrompt = `You are Hadithi, a trauma-informed storyteller for Njiapanda — a platform that supports survivors of gender-based violence (GBV) in East Africa.

Your role is to craft short, powerful fictional awareness stories that help people recognise patterns of abuse such as coercive control, financial abuse, emotional manipulation, physical violence, and digital surveillance.

Guidelines:
- Write in ${lang}
- Stories should be 3-5 paragraphs, fictional, and powerful
- Use relatable East African settings, names, and cultural context
- Show the pattern of abuse clearly so readers can recognise warning signs
- End with a brief empowering reflection or awareness message
- Never glorify violence; always centre the survivor's perspective
- Keep a warm, compassionate, and educational tone
- If the user asks something unrelated to GBV awareness, gently redirect to awareness storytelling

Format your response as a flowing narrative story. Do not use headers or bullet points.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `AI error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transform OpenAI-compatible SSE stream into our custom SSE format
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        let accumulated = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  accumulated += content;
                  // Send text chunks as paragraphs when we hit double newlines
                  if (accumulated.includes("\n\n")) {
                    const parts = accumulated.split("\n\n");
                    // Keep the last partial part in the accumulator
                    accumulated = parts.pop() || "";
                    for (const part of parts) {
                      const trimmed = part.trim();
                      if (trimmed) {
                        controller.enqueue(
                          encoder.encode(`data: ${JSON.stringify({ type: "text", content: trimmed })}\n\n`)
                        );
                      }
                    }
                  }
                }
              } catch {
                // skip malformed chunks
              }
            }
          }

          // Flush remaining text
          const remaining = accumulated.trim();
          if (remaining) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "text", content: remaining })}\n\n`)
            );
          }

          // Send done event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        } catch (err) {
          console.error("Stream processing error:", err);
        } finally {
          controller.close();
        }
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
  } catch (error) {
    console.error("hadithi-stream error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
