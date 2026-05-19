const functions = require("firebase-functions");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { GoogleGenerativeAI } = require("@google/generative-ai");

let client = null;
let db = null;

const getDb = async () => {
  if (db) return db;
  const uri = process.env.MONGODB_CONNECTION_STRING;
  if (!uri) throw new Error("MONGODB_CONNECTION_STRING not set");

  client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME || "njiapanda");
  return db;
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, content-type",
};

const handleOptions = (req, res) => {
  if (req.method === "OPTIONS") {
    res.status(200).set(CORS_HEADERS).send("ok");
    return true;
  }
  return false;
};

const VALID_ABUSE_TYPES = [
  "physical", "sexual", "emotional", "economic", "financial abuse",
  "digital surveillance", "isolation", "coercive control", "stalking",
  "psychological abuse", "reproductive coercion", "workplace abuse", "other",
];

const sanitizeString = (s) => (typeof s === "string" ? s.trim().slice(0, 3000) : "");
const sanitizeArray = (a) => (Array.isArray(a) ? a.map(sanitizeString).filter(Boolean) : []);

// GET /articles — list sourced articles with optional filters
exports.listArticles = functions.https.onRequest(async (req, res) => {
  if (handleOptions(req, res)) return;
  try {
    const database = await getDb();
    const collection = database.collection(process.env.MONGODB_COLLECTION_ARTICLES || "sourced_articles");

    const filter = {};
    if (req.query.abuse_type) {
      filter.abuse_type = { $regex: sanitizeString(req.query.abuse_type), $options: "i" };
    }
    if (req.query.location) {
      filter.location = { $regex: sanitizeString(req.query.location), $options: "i" };
    }
    if (req.query.search) {
      const search = sanitizeString(req.query.search);
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { text: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const articles = await collection
      .find(filter)
      .project({ text: 0 }) // omit full text in list view for bandwidth
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();

    res.set(CORS_HEADERS).json(articles);
  } catch (err) {
    console.error("listArticles error:", err);
    res.status(500).set(CORS_HEADERS).json({ error: "Failed to fetch articles" });
  }
});

// GET /articles/:id — get single article (with full text)
exports.getArticle = functions.https.onRequest(async (req, res) => {
  if (handleOptions(req, res)) return;
  try {
    const database = await getDb();
    const collection = database.collection(process.env.MONGODB_COLLECTION_ARTICLES || "sourced_articles");

    const { ObjectId } = require("mongodb");
    let objectId;
    try {
      objectId = new ObjectId(sanitizeString(req.params.id));
    } catch {
      return res.status(400).set(CORS_HEADERS).json({ error: "Invalid article ID" });
    }

    const article = await collection.findOne({ _id: objectId });
    if (!article) {
      return res.status(404).set(CORS_HEADERS).json({ error: "Article not found" });
    }

    res.set(CORS_HEADERS).json(article);
  } catch (err) {
    console.error("getArticle error:", err);
    res.status(500).set(CORS_HEADERS).json({ error: "Failed to fetch article" });
  }
});

// POST /search-and-ingest — agentic: search + parse + store articles via Gemini + MongoDB
exports.searchAndIngest = functions.https.onRequest(async (req, res) => {
  if (handleOptions(req, res)) return;

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return res.status(500).set(CORS_HEADERS).json({ error: "GEMINI_API_KEY not set" });
  }

  const query = sanitizeString(req.body.query) || "SGBV Africa technology gender-based violence";
  const abuseTypeFilter = sanitizeString(req.body.abuse_type || "");
  const locationFilter = sanitizeString(req.body.location || "");

  try {
    const database = await getDb();
    const collection = database.collection(process.env.MONGODB_COLLECTION_ARTICLES || "sourced_articles");

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Step 1: Agent uses Gemini to search and discover relevant articles
    const searchPrompt = `You are a journalist researching gender-based violence (GBV), SGBV, and technology-facilitated GBV in Africa.
Search the web for real, published articles about:

Topic: ${query}
${abuseTypeFilter ? `\nAbuse type: ${abuseTypeFilter}` : ""}
${locationFilter ? `\nLocation: ${locationFilter}` : ""}

For each article found, return a JSON array of objects with EXACTLY these fields:
{
  "title": "Full article title",
  "source_url": "Full URL to the article",
  "source_name": "Publication name (e.g. 'The Standard', 'BBC News', 'Al Jazeera')",
  "location": "Specific location in Africa the article is about (e.g. 'Nairobi, Kenya', 'Lagos, Nigeria')",
  "summary": "2-3 sentence summary of what the article covers",
  "abuse_type": "The type of abuse: Physical, Sexual, Emotional, Economic, Financial Abuse, Digital Surveillance, Isolation, Coercive Control, Stalking, Psychological Abuse, Reproductive Coercion, Workplace Abuse, or Other",
  "tags": ["up to", "5", "relevant", "topic", "tags"]
}

Return a valid JSON array only, no markdown, no explanation. Minimum 3 articles if possible.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: searchPrompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
    });

    const responseText = result.response.text();
    let articles;
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON array found in response");
      articles = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      return res.status(500).set(CORS_HEADERS).json({
        error: "Failed to parse AI response",
        raw: responseText.slice(0, 500),
      });
    }

    // Validate and sanitize each article
    const validated = articles
      .filter((a) => a.title && a.source_url)
      .map((a) => ({
        title: sanitizeString(a.title),
        summary: sanitizeString(a.summary),
        text: sanitizeString(a.summary), // full text requires scraping; summary used here
        source_url: sanitizeString(a.source_url),
        source_name: sanitizeString(a.source_name) || "Unknown",
        location: sanitizeString(a.location) || "Africa",
        abuse_type: VALID_ABUSE_TYPES.includes((a.abuse_type || "").toLowerCase())
          ? a.abuse_type
          : "Other",
        tags: sanitizeArray(a.tags),
        language: "en",
        source: "sourced_article",
        source_type: "sourced_article",
        resonance_count: 0,
        created_at: new Date().toISOString(),
      }));

    if (validated.length === 0) {
      return res.status(200).set(CORS_HEADERS).json({ success: true, articles_count: 0 });
    }

    // Step 2: Agent stores articles via MongoDB MCP tools
    // In production, this uses the MongoDB MCP server's insertMany tool.
    // Here we use the driver directly — see MCP_PROTOCOL.md for MCP agent demo.
    await collection.insertMany(validated);

    return res.status(200).set(CORS_HEADERS).json({
      success: true,
      articles_count: validated.length,
    });
  } catch (err) {
    console.error("searchAndIngest error:", err);
    return res.status(500).set(CORS_HEADERS).json({ error: String(err) });
  }
});
