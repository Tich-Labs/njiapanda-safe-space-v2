#!/usr/bin/env node
/**
 * MongoDB MCP Integration Demo
 * 
 * Demonstrates the Hadithi agent using MongoDB MCP server tools
 * to store and retrieve sourced SGBV articles.
 * 
 * Prerequisites:
 *   1. MongoDB Atlas free cluster (https://mongodb.com/atlas)
 *   2. MongoDB MCP server configured (see MCP_SETUP.md)
 *   3. .env file with MONGODB_CONNECTION_STRING
 * 
 * Usage: node scripts/mongodb-mcp-demo.js
 * 
 * This script simulates how the Gemini agent uses MongoDB MCP tools:
 *   - connect → list collections → insert articles → vector search → retrieve
 */

const { MongoClient, ServerApiVersion } = require("mongodb");

// Load env vars
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const DB_NAME = process.env.MONGODB_DB_NAME || "njiapanda";
const COLLECTION = process.env.MONGODB_COLLECTION_ARTICLES || "sourced_articles";

if (!CONNECTION_STRING) {
  console.error("❌ MONGODB_CONNECTION_STRING not set in .env");
  console.error("   Get yours from MongoDB Atlas → Connect → Drivers");
  process.exit(1);
}

async function run() {
  console.log("\n🧪 MongoDB MCP Integration Demo");
  console.log("═".repeat(50));
  console.log("Simulating Hadithi agent using MongoDB MCP tools...\n");

  const client = new MongoClient(CONNECTION_STRING, {
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // ─── Step 1: MCP tool — listCollections ───
    console.log("📋 MCP Tool: listCollections");
    const collections = await db.listCollections().toArray();
    console.log(`   Found ${collections.length} collections`);
    collections.forEach((c) => console.log(`   • ${c.name}`));
    console.log();

    // ─── Step 2: MCP tool — insertMany ───
    console.log("📝 MCP Tool: insertMany (store sourced articles)");
    const articles = [
      {
        title: "Digital stalking on the rise among Nairobi youth",
        summary: "A new report shows 1 in 3 young women in Nairobi have experienced digital surveillance by partners.",
        text: "Full article text here...",
        source_url: "https://example.com/digital-stalking-nairobi",
        source_name: "The Standard",
        location: "Nairobi, Kenya",
        abuse_type: "Digital Surveillance",
        tags: ["digital", "stalking", "youth", "nairobi"],
        language: "en",
        source: "sourced_article",
        source_type: "sourced_article",
        resonance_count: 0,
        created_at: new Date().toISOString(),
      },
      {
        title: "Tech-enabled GBV: How apps are being used to control partners",
        summary: "Advocates warn that tracking apps and shared passwords are being weaponized in relationships across Kenya.",
        source_url: "https://example.com/tech-gbv-kenya",
        source_name: "BBC News",
        location: "Mombasa, Kenya",
        abuse_type: "Digital Surveillance",
        tags: ["tech-gbv", "tracking", "control"],
        language: "en",
        source: "sourced_article",
        source_type: "sourced_article",
        resonance_count: 0,
        created_at: new Date().toISOString(),
      },
      {
        title: "Safe houses in Kisumu see increased demand",
        summary: "Kisumu County reports a 40% increase in shelter requests as economic abuse survivors seek refuge.",
        source_url: "https://example.com/kisumu-safe-houses",
        source_name: "Nation Africa",
        location: "Kisumu, Kenya",
        abuse_type: "Economic",
        tags: ["economic", "shelter", "kisumu"],
        language: "en",
        source: "sourced_article",
        source_type: "sourced_article",
        resonance_count: 0,
        created_at: new Date().toISOString(),
      },
    ];

    const result = await collection.insertMany(articles);
    console.log(`   ✅ Inserted ${result.insertedCount} articles`);
    console.log();

    // ─── Step 3: MCP tool — find (with filter) ───
    console.log("🔍 MCP Tool: find (query by abuse_type)");
    const digitalArticles = await collection
      .find({ abuse_type: "Digital Surveillance" })
      .project({ text: 0 })
      .sort({ created_at: -1 })
      .toArray();
    console.log(`   Found ${digitalArticles.length} articles about Digital Surveillance:`);
    digitalArticles.forEach((a) => console.log(`   • ${a.title} (${a.location})`));
    console.log();

    // ─── Step 4: MCP tool — find (with text search) ───
    console.log("🔍 MCP Tool: find (search by keyword)");
    const searchResults = await collection
      .find({ $text: { $search: "Kisumu shelter economic" } })
      .project({ text: 0 })
      .sort({ created_at: -1 })
      .toArray()
      .catch(() => []); // text index may not exist

    if (searchResults.length > 0) {
      searchResults.forEach((a) => console.log(`   • ${a.title} (${a.location})`));
    } else {
      console.log("   (text index not created — run createIndex below to enable)");

      // Create text index for search
      console.log("   ⚡ Creating text index for search...");
      await collection.createIndex({ title: "text", summary: "text", tags: "text" });
      console.log("   ✅ Text index created. Re-run for full-text search.");
    }
    console.log();

    // ─── Step 5: Cleanup — remove demo articles ───
    console.log("🧹 Cleanup: removing demo articles");
    const deleteResult = await collection.deleteMany({
      _id: { $in: Object.values(result.insertedIds) },
    });
    console.log(`   Removed ${deleteResult.deletedCount} demo articles`);
    console.log();

    console.log("✅ MCP integration demo complete!");
    console.log("   The Hadithi agent used 5 MongoDB MCP tools:");
    console.log("   1. listCollections — discover available data sources");
    console.log("   2. insertMany — store sourced articles");
    console.log("   3. find (filter) — retrieve by abuse type");
    console.log("   4. find (search) — keyword search across articles");
    console.log("   5. createIndex — enable full-text search");
    console.log("\n📖 See MCP_SETUP.md for production configuration.");
  } catch (err) {
    console.error("❌ Demo failed:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
