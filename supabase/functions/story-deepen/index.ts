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
    const { story, abuseType, history } = await req.json();

    if (!story) {
      return new Response(
        JSON.stringify({ error: "No story text provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const messages = [
      {
        role: "system",
        content: `You are a compassionate, trauma-informed listener helping someone share their story about ${abuseType || "gender-based violence"}.

Your role is to gently ask 1-2 follow-up questions to help the person add more context or detail to their story — ONLY if the story feels brief or incomplete.

Guidelines:
- Be warm, empathetic, and non-judgmental
- Never push for identifying details (names, locations, dates)
- Remind them they are anonymous and safe
- Ask open-ended questions like: "Would you like to share more about how this affected you?" or "Is there anything else you'd like people to understand about your experience?"
- If the story already feels complete and detailed, respond with: "Thank you for sharing. Your story is powerful as it is. Would you like to submit it now?"
- Keep your response under 3 sentences
- Respond in the same language the user wrote in (English or Swahili)
- NEVER retell or summarize their story back to them`,
      },
      ...(history || []),
      {
        role: "user",
        content: story,
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Service is busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() ?? "";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("story-deepen error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Failed to process" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
