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

    const agentUrl = Deno.env.get("HADITHI_AGENT_URL");
    const agentToken = Deno.env.get("HADITHI_AGENT_TOKEN");

    if (!agentUrl) {
      return new Response(
        JSON.stringify({ error: "HADITHI_AGENT_URL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (agentToken) {
      headers["Authorization"] = `Bearer ${agentToken}`;
    }

    const upstreamResponse = await fetch(agentUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ prompt, language: language || "en" }),
    });

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      const errorText = await upstreamResponse.text().catch(() => "Unknown error");
      return new Response(
        JSON.stringify({ error: `Upstream error: ${upstreamResponse.status} — ${errorText}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Pipe SSE stream back to client
    return new Response(upstreamResponse.body, {
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
