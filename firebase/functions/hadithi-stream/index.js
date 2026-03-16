const functions = require('firebase-functions');
const { TextEncoder, TextDecoder } = require('util');
const stream = require('stream');

const NAMES_FEMALE = ["Wanjiku", "Akinyi", "Fatuma", "Njeri", "Atieno", "Rehema", "Zawadi", "Nyambura", "Halima", "Zuri", "Makena", "Nyokabi", "Sifa", "Baraka", "Neema"];
const NAMES_MALE = ["Otieno", "Kamau", "Juma", "Ochieng", "Mwangi", "Hassan", "Kipchoge", "Barasa", "Mutua", "Ndung'u", "Abdi", "Wekesa", "Karanja", "Ruto", "Abubakar"];
const LOCATIONS = ["Kisumu", "Mombasa", "Nakuru", "Nairobi's Eastlands", "Eldoret", "Malindi", "Nyeri", "Machakos", "Kilifi", "Garissa", "Thika", "Kitale", "Kakamega", "Lamu", "Nanyuki"];
const RELATIONSHIPS = ["partner", "husband", "boyfriend", "uncle", "employer", "in-law", "neighbour", "colleague", "elder", "family friend"];
const PERSPECTIVES = ["first-person", "third-person"];
const SETTINGS = ["rural village", "urban apartment", "market stall", "school compound", "small business", "church community", "hospital ward", "fishing village", "tea plantation", "matatu route"];

const ABUSE_TYPE_MAP = {
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

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const detectAbuseType = (prompt) => {
  const lower = prompt.toLowerCase();
  for (const [key, value] of Object.entries(ABUSE_TYPE_MAP)) {
    if (lower.includes(key)) return value;
  }
  return Object.values(ABUSE_TYPE_MAP)[Math.floor(Math.random() * Object.values(ABUSE_TYPE_MAP).length)];
};

exports.hadithiStream = functions.https.onRequest(async (req, res) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, content-type',
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).send('ok');
  }

  try {
    const { prompt, language, format = 'illustrated' } = req.body;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return res.status(500).set({ ...corsHeaders, 'Content-Type': 'application/json' })
        .json({ error: 'GEMINI_API_KEY not set' });
    }

    const protagonist = pick(NAMES_FEMALE);
    const abuser = pick(NAMES_MALE);
    const location = pick(LOCATIONS);
    const relationship = pick(RELATIONSHIPS);
    const perspective = pick(PERSPECTIVES);
    const setting = pick(SETTINGS);
    const abuseType = detectAbuseType(prompt);

    const perspectiveInstruction = perspective === 'first-person'
      ? `Write in first person as ${protagonist}.`
      : `Write in third person about ${protagonist}.`;

    const imageInstruction = format === 'illustrated'
      ? ' Every two paragraphs, on its own line write exactly: [IMAGE: brief visual description of the emotional mood]. Keep image descriptions under 20 words.'
      : '';

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

    const isGenericStart = prompt === 'begin' || prompt === 'anza' || prompt.trim().length < 10;
    const userPrompt = isGenericStart
      ? (language === 'sw'
        ? `Niandikia hadithi kuhusu ${abuseType} inayotokea ${location}`
        : `Tell me a story about ${abuseType} set in ${location}`)
      : prompt;

    // Use Gemini API directly
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const err = await geminiResponse.text();
      return res.status(500).set({ ...corsHeaders, 'Content-Type': 'application/json' })
        .json({ error: 'AI gateway error', detail: err });
    }

    // For now, just get non-streaming response and transform to SSE
    const data = await geminiResponse.json();
    
    // Send metadata first
    res.set({ ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
    
    res.write(`data: ${JSON.stringify({ type: 'meta', abuseType, protagonist, location })}\n\n`);
    
    if (data.candidates && data.candidates[0]?.content?.parts) {
      const text = data.candidates[0].content.parts.map(p => p.text).join('');
      res.write(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`);
    }
    
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (err) {
    return res.status(500).set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .json({ error: String(err) });
  }
});