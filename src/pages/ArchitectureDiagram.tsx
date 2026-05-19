import { useState } from "react";
import { Download } from "lucide-react";

const ArchitectureDiagram = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadPng = async () => {
    setDownloading(true);
    try {
      const svg = document.getElementById("arch-svg");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#091F1A";
        ctx.fillRect(0, 0, 1200, 800);
        ctx.drawImage(img, 0, 0, 1200, 800);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "njiapanda-architecture.png";
          a.click();
          URL.revokeObjectURL(a.href);
          setDownloading(false);
        }, "image/png");
      };
      img.src = url;
    } catch {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-white">
            Njiapanda Architecture
          </h1>
          <button
            onClick={downloadPng}
            disabled={downloading}
            className="flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
            className="bg-primary text-primary-foreground"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Exporting..." : "Download PNG"}
          </button>
        </div>

        <svg
          id="arch-svg"
          viewBox="0 0 1200 800"
          className="w-full rounded-xl border border-white/10"
          className="bg-background text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#C4871A" />
            </marker>
          </defs>
          <rect width="1200" height="800" fill="url(#grid)" />

          {/* Layer labels */}
          <text x="60" y="40" fill="rgba(255,255,255,0.3)" fontSize="12" fontFamily="DM Mono, monospace">CLIENT LAYER</text>
          <text x="60" y="290" fill="rgba(255,255,255,0.3)" fontSize="12" fontFamily="DM Mono, monospace">EDGE FUNCTIONS</text>
          <text x="60" y="500" fill="rgba(255,255,255,0.3)" fontSize="12" fontFamily="DM Mono, monospace">GOOGLE CLOUD RUN (ADK)</text>
          <text x="60" y="680" fill="rgba(255,255,255,0.3)" fontSize="12" fontFamily="DM Mono, monospace">VERTEX AI / GOOGLE AI</text>

          {/* Horizontal dividers */}
          <line x1="40" y1="260" x2="1160" y2="260" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="40" y1="470" x2="1160" y2="470" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="40" y1="650" x2="1160" y2="650" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="6 4" />

          {/* Client: Sauti Page */}
          <rect x="150" y="80" width="200" height="120" rx="12" fill="#0F3D34" stroke="#2D8A77" strokeWidth="1.5" />
          <text x="250" y="130" fill="white" fontSize="16" fontFamily="Crimson Pro, serif" textAnchor="middle" fontWeight="600">Sauti Page</text>
          <text x="250" y="155" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="DM Sans, sans-serif" textAnchor="middle">Live Agent + Vision</text>
          <text x="250" y="175" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="DM Mono, monospace" textAnchor="middle">WebSocket + Audio/Video</text>

          {/* Client: Hadithi Page */}
          <rect x="500" y="80" width="200" height="120" rx="12" fill="#0F3D34" stroke="#C4871A" strokeWidth="1.5" />
          <text x="600" y="130" fill="white" fontSize="16" fontFamily="Crimson Pro, serif" textAnchor="middle" fontWeight="600">Hadithi Page</text>
          <text x="600" y="155" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="DM Sans, sans-serif" textAnchor="middle">AI Storytelling</text>
          <text x="600" y="175" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="DM Mono, monospace" textAnchor="middle">SSE Stream</text>

          {/* Edge: sauti-session */}
          <rect x="100" y="310" width="180" height="90" rx="10" fill="rgba(196,135,26,0.1)" stroke="#C4871A" strokeWidth="1" />
          <text x="190" y="350" fill="#C4871A" fontSize="13" fontFamily="DM Mono, monospace" textAnchor="middle">sauti-session</text>
          <text x="190" y="375" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="DM Sans, sans-serif" textAnchor="middle">WS URL + Auth Token</text>

          {/* Edge: sauti-complete */}
          <rect x="340" y="310" width="180" height="90" rx="10" fill="rgba(196,135,26,0.1)" stroke="#C4871A" strokeWidth="1" />
          <text x="430" y="350" fill="#C4871A" fontSize="13" fontFamily="DM Mono, monospace" textAnchor="middle">sauti-complete</text>
          <text x="430" y="375" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="DM Sans, sans-serif" textAnchor="middle">Signal + Webhook</text>

          {/* Edge: hadithi-stream */}
          <rect x="580" y="310" width="180" height="90" rx="10" fill="rgba(196,135,26,0.1)" stroke="#C4871A" strokeWidth="1" />
          <text x="670" y="350" fill="#C4871A" fontSize="13" fontFamily="DM Mono, monospace" textAnchor="middle">hadithi-stream</text>
          <text x="670" y="375" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="DM Sans, sans-serif" textAnchor="middle">SSE Proxy</text>

          {/* Cloud Run: sauti-agent */}
          <rect x="150" y="520" width="220" height="90" rx="10" fill="rgba(45,138,119,0.1)" stroke="#2D8A77" strokeWidth="1" />
          <text x="260" y="560" fill="#2D8A77" fontSize="14" fontFamily="DM Mono, monospace" textAnchor="middle">sauti-agent (ADK)</text>
          <text x="260" y="582" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="DM Sans, sans-serif" textAnchor="middle">Google ADK Agent</text>

          {/* Cloud Run: hadithi-agent */}
          <rect x="500" y="520" width="220" height="90" rx="10" fill="rgba(45,138,119,0.1)" stroke="#2D8A77" strokeWidth="1" />
          <text x="610" y="560" fill="#2D8A77" fontSize="14" fontFamily="DM Mono, monospace" textAnchor="middle">hadithi-agent</text>
          <text x="610" y="582" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="DM Sans, sans-serif" textAnchor="middle">Storytelling Agent</text>

          {/* Vertex AI */}
          <rect x="150" y="690" width="220" height="70" rx="10" fill="rgba(196,135,26,0.05)" stroke="rgba(196,135,26,0.4)" strokeWidth="1" />
          <text x="260" y="725" fill="white" fontSize="13" fontFamily="DM Sans, sans-serif" textAnchor="middle">Gemini 2.0 Flash Live</text>
          <text x="260" y="745" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="DM Mono, monospace" textAnchor="middle">Multimodal Live API</text>

          {/* Imagen */}
          <rect x="500" y="690" width="220" height="70" rx="10" fill="rgba(196,135,26,0.05)" stroke="rgba(196,135,26,0.4)" strokeWidth="1" />
          <text x="610" y="725" fill="white" fontSize="13" fontFamily="DM Sans, sans-serif" textAnchor="middle">Imagen 3</text>
          <text x="610" y="745" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="DM Mono, monospace" textAnchor="middle">Image Generation</text>

          {/* Supabase DB */}
          <rect x="850" y="310" width="180" height="90" rx="10" fill="rgba(45,138,119,0.1)" stroke="#2D8A77" strokeWidth="1" />
          <text x="940" y="350" fill="#2D8A77" fontSize="13" fontFamily="DM Mono, monospace" textAnchor="middle">Supabase</text>
          <text x="940" y="375" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="DM Sans, sans-serif" textAnchor="middle">DB + Auth + Storage</text>

          {/* Arrows: Client → Edge */}
          <line x1="250" y1="200" x2="190" y2="310" stroke="#C4871A" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.7" />
          <line x1="250" y1="200" x2="430" y2="310" stroke="#C4871A" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.5" />
          <line x1="600" y1="200" x2="670" y2="310" stroke="#C4871A" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.7" />

          {/* Arrows: Edge → Cloud Run */}
          <line x1="190" y1="400" x2="260" y2="520" stroke="#2D8A77" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.6" />
          <line x1="670" y1="400" x2="610" y2="520" stroke="#2D8A77" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.6" />

          {/* Arrows: Cloud Run → Vertex */}
          <line x1="260" y1="610" x2="260" y2="690" stroke="#C4871A" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.5" />
          <line x1="610" y1="610" x2="610" y2="690" stroke="#C4871A" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.5" />

          {/* Arrow: Edge → Supabase */}
          <line x1="520" y1="355" x2="850" y2="355" stroke="#2D8A77" strokeWidth="1" markerEnd="url(#arrowhead)" opacity="0.4" strokeDasharray="4 3" />

          {/* Optional ADK label */}
          <text x="225" y="460" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="DM Mono, monospace" transform="rotate(-45 225 460)">opt-in ADK</text>

          {/* Legend */}
          <rect x="870" y="140" width="12" height="12" rx="2" fill="#C4871A" opacity="0.7" />
          <text x="890" y="151" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="DM Sans, sans-serif">Data flow</text>
          <rect x="870" y="162" width="12" height="12" rx="2" fill="#2D8A77" opacity="0.7" />
          <text x="890" y="173" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="DM Sans, sans-serif">Backend service</text>
        </svg>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
