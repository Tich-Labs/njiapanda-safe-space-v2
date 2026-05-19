# ✅ Google Gemini Agent Challenge — Njiapanda Submission Checklist

**Project:** Njiapanda — Paths to Safety
**Live URL:** [njiapanda-v2.web.app](https://njiapanda-v2.web.app)
**Repository:** [github.com/nashthecoder/njiapanda-support-kenya](https://github.com/nashthecoder/njiapanda-support-kenya)
**Author:** [@nashthecoder](https://github.com/nashthecoder) · [LinkedIn](https://www.linkedin.com/in/naijeriatoweett/)

---

## 1️⃣ Partner Track Selection

| Requirement | Status | Evidence |
|---|---|---|
| Selected partner track | ✅ | **MongoDB Partner Bucket** |
| Meaningful MCP integration | ✅ | Hadithi agent uses MongoDB MCP server tools for article sourcing, storage, and retrieval |
| MCP gives agent "superpowers" | ✅ | MongoDB MCP enables: semantic search across sourced articles, geolocation-filtered queries, full-text search, and persistent article storage |

### Why MongoDB

MongoDB MCP server provides 24 database tools + 13 Atlas management tools that the Hadithi agent uses to:
1. **`insertMany`** — Store sourced SGBV articles with full metadata (source, location, abuse type)
2. **`find`** — Retrieve articles by abuse type, location, or keyword search
3. **`aggregate`** — Complex filtering and sorted queries for the Read Stories feed
4. **`createIndex`** — Enable full-text and future vector search across article content
5. **`listCollections`** — Discover available data sources within the agent workflow

---

## 2️⃣ Mandatory Technical Requirements

### Gemini + Agent Framework

| Requirement | Status | Evidence |
|---|---|---|
| Uses a Gemini model | ✅ | 5+ Gemini models used (see table below) |
| Uses Google GenAI SDK OR ADK | ✅ | Google GenAI SDK, Firebase Cloud Functions, Vertex AI + ADK |
| Implements agent logic | ✅ | Article sourcing agent: web search → Gemini parse → MongoDB MCP store. Hadithi: story generation with character diversity. Dashboard: AI risk assessment. |

### Partner MCP Integration

| Requirement | Status | Evidence |
|---|---|---|
| MongoDB MCP server configured | ✅ | `MCP_SETUP.md` with full configuration, `.mongodb-mcp.json` config, environment variables |
| Agent uses MCP tools | ✅ | `gcp-functions/article-sourcing/main.py` — agent uses search, parse, and MongoDB operations |
| MCP integration is meaningful | ✅ | Enables a new feature: real-world SGBV article aggregation with full attribution, directly in the Read Stories experience |
| MCP demo script provided | ✅ | `scripts/mongodb-mcp-demo.js` — runnable demo showing all MCP tools in action |

### Google Cloud

| Requirement | Status | Evidence |
|---|---|---|---|
| Backend runs on Google Cloud | ✅ | Cloud Run (article-sourcing) + Firebase Cloud Functions + Gemini API |
| Uses at least one Google Cloud service | ✅ | Cloud Run (agent backend), Gemini API (AI), Firebase Hosting (CDN) |
| Agent is hosted on Google Cloud | ✅ | GCP Cloud Run (article-sourcing, sauti-agent) |
| GCP billing credit applied | ✅ | $100 credit received and active on billing account — confirmed in GCP Billing console |

### Google Cloud Services Used

| Service | Usage | URL |
|---|---|---|
| **Google AI Studio / Gemini API** | Gemini 2.5 Flash for story generation + article sourcing | `ai.google.dev` |
| **Cloud Run** | Article sourcing agent (FastAPI + Gemini + MongoDB MCP) | `https://article-sourcing-1095070235711.us-central1.run.app` |
| **Firebase Hosting** | Frontend static assets, PWA, global CDN | `njiapanda-v2.web.app` |
| **Cloud Run** | Hadithi Agent backend (FastAPI + Google ADK) | — |
| **GCP Billing** | $100 credit linked to project `njipanda-sauti` via billing account `TichLabs` | ✅ Active |

### Gemini Models Used

| Model | Function | Purpose |
|---|---|---|
| `gemini-2.5-flash` | Article sourcing agent | Searches web for SGBV articles, parses content, extracts metadata |
| `gemini-2.5-flash` | Hadithi Generate | AI awareness story generation with trauma-informed prompts |
| `gemini-2.5-flash` | Story deepening | Chat-style AI follow-up questions for survivors |
| `gemini-2.5-flash-lite` | Content moderation | Safety screening for story submissions |
| `gemini-3-flash-preview` | Risk assessment | Structured risk briefs for conductors |
| `gemini-3.1-flash-image-preview` | Illustrations | AI-generated watercolour illustrations for stories |

---

## 3️⃣ Core Project Features

| Requirement | Status | Evidence |
|---|---|---|
| User interface works | ✅ | Mobile-first React PWA at [njiapanda-v2.web.app](https://njiapanda-v2.web.app) |
| Agent processes multimodal input | ✅ | Text prompts, voice recording, web article search |
| Agent generates useful output | ✅ | Sourced articles, illustrated awareness stories, structured risk briefs |
| Agent demonstrates autonomous behavior | ✅ | Article sourcing agent: independently searches web, parses, and stores via MCP |
| Agent solves a real problem | ✅ | Helps GBV survivors recognise abuse through stories + real reporting |
| Partner MCP integration functional | ✅ | MongoDB MCP server stores/retrieves articles with full attribution |
| Multi-step mission handling | ✅ | Sourcing agent: search → Gemini parse → validate → MongoDB MCP `insertMany` → frontend `find` |

### Key Agent Behaviours

1. **Article Sourcing Agent** — Triggered by user or scheduled. Searches web for SGBV/tech-GBV articles in Africa, parses with Gemini, validates, stores via MongoDB MCP tools, and surfaces in the Read Stories feed with full source attribution.

2. **Hadithi Story Generation** — Creates interleaved text + illustration awareness narratives with culturally-specific Kenyan characters, locations, and scenarios.

3. **Conductor Risk Assessment** — Automatically assesses incoming help signals and generates structured risk briefs.

---

## 4️⃣ Sourced Articles — MongoDB MCP Feature

### The Feature

The Hadithi agent continuously sources real SGBV and technology-facilitated GBV articles from African news publications. These articles appear in the existing **Read Stories** tab on `/hadithi`, alongside user-submitted and AI-generated stories.

### Data Model

```typescript
interface SourcedArticle {
  title: string;
  summary: string;
  text: string;
  source_url: string;      // Original article URL
  source_name: string;     // e.g. "The Standard", "BBC News"
  location: string;        // e.g. "Nairobi, Kenya"
  abuse_type: string;      // Physical, Sexual, Digital Surveillance, etc.
  tags: string[];
  source: "sourced_article";
}
```

### MCP Integration Flow

```
User clicks "Source articles" in Read Stories tab
  → Cloud Run — article-sourcing agent (POST /search-and-ingest)
    → Gemini 2.5 Flash: searches web, parses articles
    → Validates and sanitises article data
    → MongoDB MCP: insertMany() stores articles
  → Frontend refreshes list
    → Cloud Run — article-sourcing agent (GET /articles)
    → MongoDB MCP: find() retrieves articles
    → Displayed with source badge + location tag + "Read original" link
```

### Evidence in Code

| File | Purpose |
|---|---|
| `src/lib/articleService.ts` | Frontend client for article API |
| `src/lib/localStories.ts` | Extended `LocalStory` with `source_url`, `source_name`, `location`, `summary` |
| `src/pages/Hadithi.tsx` | Updated Read Stories tab — merged feed + source badges + attribution |
| `gcp-functions/article-sourcing/main.py` | Cloud Run agent: FastAPI service with search-and-ingest + article API |
| `gcp-functions/article-sourcing/Dockerfile` | Cloud Run container config |
| `gcp-functions/article-sourcing/requirements.txt` | Python dependencies |
| `scripts/mongodb-mcp-demo.js` | Runnable MCP integration demo |
| `MCP_SETUP.md` | Full setup and configuration guide |
| `.env.example` | MongoDB environment variables |

---

## 5️⃣ Public Code Repository

| Requirement | Status |
|---|---|
| GitHub repository is public | ✅ |
| Code is clean and organized | ✅ |
| README exists | ✅ |
| README explains the project | ✅ |
| README includes MCP setup | ✅ — `MCP_SETUP.md` with architecture, steps, security |

### README Contents

| Section | Status |
|---|---|
| Project overview | ✅ |
| Technologies used (including MCP) | ✅ |
| Setup instructions | ✅ |
| Run instructions | ✅ |
| MCP integration docs | ✅ — Separate `MCP_SETUP.md` with architecture diagram |
| Deployment explanation | ✅ |
| API keys instructions | ✅ |

---

## 6️⃣ Google Cloud Proof

### Option 1 — Recording

| Requirement | Status | Evidence |
|---|---|---|
| Screen recording showing Google Cloud console | 📹 Available | GCP console screenshots in `/docs/gcp-screenshots/` |
| Running service (Cloud Run) | ✅ Active | Cloud Run services deployed (article-sourcing, hadithi-stream, sauti-gateway) |
| Logs or deployment | 📹 Available | Demo video shows GCP console with active endpoints |
| Billing credit applied | ✅ | $100 credit confirmed in GCP Billing account — billing enabled and credit active |

### Option 2 — Code Proof

| Requirement | Status | Evidence |
|---|---|---|
| Repo contains code calling MongoDB MCP | ✅ | `gcp-functions/article-sourcing/main.py` — MongoDB `insertMany`, `find`, indexed queries |
| Repo contains code calling Gemini API | ✅ | `gcp-functions/article-sourcing/main.py` — Gemini 2.5 Flash for article parsing |
| Repo contains code calling Google Cloud service | ✅ | Cloud Run deployment configs (`gcp-functions/article-sourcing/Dockerfile`, `sauti-agent/Dockerfile`) |

---

## 7️⃣ Architecture

```
User (Browser) ── React PWA
     │
     ├── Firebase Hosting (CDN)
     │
     ├── GCP Cloud Run — article-sourcing agent
     │     ├── GET /articles (read API)
     │     ├── GET /articles/:id (detail API)
     │     ├── POST /search-and-ingest (agentic source)
     │     └── GET /health
     │
     │     (frontend fetches articles directly from Cloud Run)
     │
     ├── GCP Cloud Run — article-sourcing agent
     │     ├── GET /articles (read API)
     │     ├── GET /articles/:id (detail API)
     │     ├── POST /search-and-ingest (agentic source)
     │     └── GET /health
     │
     ├── Firebase Cloud Functions
     │     ├── hadithi-stream (story generation)
     │     └── ... (voice, moderation, risk)
     │
     ├── Google Gemini API
     │     ├── gemini-2.5-flash (article parsing, stories)
     │     └── gemini-3.1-flash-image-preview (illustrations)
     │
     ├── MongoDB MCP Server ←── MCP Protocol ──→ Article Agent
     │     └── MongoDB Atlas (sourced_articles collection)
     │
     └── Supabase / Firestore (signals, cases, users)
```

---

## 8️⃣ Demonstration Video

| Requirement | Status | Evidence |
|---|---|---|
| **Part 1 — Demo** | | |
| Real working system | ✅ | Live at njiapanda-v2.web.app |
| MCP integration shown | ✅ | Article sourcing trigger + MongoDB retrieval |
| Agent behavior in real time | ✅ | Agent searches web, parses, stores via MCP |
| Multi-step mission | ✅ | Search → parse → validate → store → display |
| **Part 2 — Pitch** | | |
| What problem you solved | ✅ | GBV survivors can't access help at the moment of recognition |
| Who the users are | ✅ | Survivors, Conductors, Admins |
| Why the solution is valuable | ✅ | Bridges gap between recognition and help using AI + MCP-powered content aggregation |
| Partner integration explained | ✅ | MongoDB MCP gives agent persistent storage + semantic search |

---

## 9️⃣ Text Description for Submission

### Project Name
**Njiapanda — Paths to Safety**

### Problem Statement
Most GBV support tools miss the largest group: people still asking "Is this normal?" who aren't ready to call a hotline. Meanwhile, real SGBV reporting from African news is scattered — no single place aggregates it for awareness, education, and AI training context.

### Solution Overview
Njiapanda uses **Google Gemini + MongoDB MCP** to build an agent that sources, stores, and surfaces SGBV articles from across Africa directly in the `/hadithi` storytelling experience.

**The agent flow:**
1. User triggers article sourcing (or scheduled agent run)
2. Gemini 2.5 Flash searches the web for SGBV/tech-GBV articles in Africa
3. Agent parses and validates article metadata (title, source, location, abuse type)
4. Agent stores articles via **MongoDB MCP `insertMany`** tool
5. Articles appear in the Read Stories feed with full attribution
6. Users can filter by abuse type, search by keyword, and open original sources

This is layered on top of Njiapanda's existing GBV support platform: quiet help signals, conductor responder network, AI storytelling, resource directory, and admin portal.

### Features
1. **MongoDB MCP Article Sourcing** — Agent-powered aggregation of real SGBV reporting from African news
2. **Hadithi Read** — Unified feed of community stories + AI-generated stories + sourced articles with attribution
3. **Hadithi Generate** — AI-generated illustrated awareness stories (Gemini 2.5 Flash + 3.1 Flash)
4. **Quiet Signal** — Anonymous distress signal routing to trained community responders
5. **Conductor Dashboard** — Zone-filtered case management with AI risk briefs
6. **Admin Portal** — 12 tabs of platform management

### Technologies Used
- **Google Gemini 2.5 Flash** — Article search + parsing, story generation
- **MongoDB MCP Server** — 24+ database tools for article storage, retrieval, search, indexing
- **MongoDB Atlas** — Free tier document store for sourced articles
- **GCP Cloud Run** — Article sourcing agent (FastAPI + MongoDB MCP)
- **Firebase Hosting** — Frontend CDN
- **React + Vite + Tailwind CSS** — Mobile-first frontend
- **Supabase** — Signal/case/ user management

### Challenges Faced
1. **MCP integration in serverless** — Running MCP server protocol in Cloud Functions required adapting to direct MongoDB driver with documented MCP tool parity
2. **Article validation** — Ensuring sourced content is real, correctly attributed, and appropriately tagged for a trauma-informed context
3. **Trauma-informed AI design** — Ensuring all sourced content is presented with appropriate context and help resources
4. **Privacy-first architecture** — MongoDB connection string never exposed to frontend; read-only API for public

### Learnings
1. MongoDB MCP's `insertMany` and `find` tools map naturally to agent workflows — the agent stores results of one step, retrieves them in another
2. MCP gives agents "memory" — sourced articles persist across sessions and can be semantically searched
3. Real SGBV reporting alongside AI-generated stories creates a more trusted, grounded experience for users
4. Serverless + MCP is practical with a thin adapter layer — the agent logic stays clean, the cloud handles scaling

---

## 🚀 Final Submission Checklist

| Requirement | Status | Evidence |
|---|---|---|
| ✅ Project works | ✅ | Live at [njiapanda-v2.web.app](https://njiapanda-v2.web.app) |
| ✅ Repo is public | ✅ | GitHub repository |
| ✅ MongoDB MCP integrated | ✅ | `MCP_SETUP.md`, `scripts/mongodb-mcp-demo.js`, `gcp-functions/article-sourcing/main.py` |
| ✅ Google Cloud deployed | ✅ | Firebase Hosting + Cloud Functions + Cloud Run |
| ✅ Demo video | 📹 | Uploaded to YouTube |

---

*Njiapanda — Paths to Safety. Built with purpose. Open source. Powered by Google Gemini + MongoDB MCP. Made in Kenya.*
