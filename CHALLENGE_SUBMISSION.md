# ✅ Gemini Live Agent Challenge — Njiapanda Submission Checklist

**Project:** Njiapanda — Paths to Safety
**Live URL:** [njiapanda-v2.web.app](https://njiapanda-v2.web.app)
**Repository:** [github.com/nashthecoder/njiapanda-support-kenya](https://github.com/nashthecoder/njiapanda-support-kenya)
**Author:** [@nashthecoder](https://github.com/nashthecoder) · [LinkedIn](https://www.linkedin.com/in/naijeriatoweett/)

---

## 1️⃣ Category Selection

| Requirement | Status | Evidence |
|---|---|---|
| Selected one category | ✅ | **Creative Storyteller** (primary) — Hadithi multimodal storytelling |
| Project fits the category's focus | ✅ | Hadithi generates interleaved text + AI-generated illustrations as awareness narratives |
| Project uses multimodal inputs or outputs | ✅ | Text + image output (Hadithi Generate), text + audio input (Hadithi Share/ShareStory) |

### Categories Covered

- **✅ Creative Storyteller (primary)** — Hadithi generates first-person awareness narratives that weave together text and AI-generated watercolour illustrations using Gemini 2.5 Flash + Gemini 3.1 Flash Image Preview

---

## 2️⃣ Mandatory Technical Requirements

### Gemini + Agent Framework

| Requirement | Status | Evidence |
|---|---|---|
| Uses a Gemini model | ✅ | 7 different Gemini models used (see table below) |
| Uses Google GenAI SDK OR ADK | ✅ | Google GenAI SDK (Hadithi Generate), Firebase Cloud Functions, Vertex AI + ADK |
| Implements agent logic | ✅ | Hadithi: story generation with character diversity, abuse type detection, culturally-specific narratives. Dashboard: AI risk assessment. |

### Google Cloud

| Requirement | Status | Evidence |
|---|---|---|
| Backend runs on Google Cloud | ✅ | Gemini API via Google AI Studio|
| Uses at least one Google Cloud service | ✅ | See list below |
| Agent is hosted on Google Cloud | ✅  Gemini API (all AI features) |

### Google Cloud Services Used

| Service | Usage |
|---|---|
| ** Google AI Studio** | Gemini 2.5 Flash for story generation, Gemini 3.1 Flash Image Preview for illustrations |
| **Cloud Run** | Hadithi Agent backend (FastAPI + Google ADK) |
| **Gemini API** (via Firebase Cloud Functions) | 6 Firebase Cloud Functions calling Gemini models for storytelling, moderation, transcription, risk assessment, image generation |

### Gemini Models Used

| Model | Function | Purpose |
|---|---|---|
| `google/gemini-2.5-flash` | Hadithi Generate | AI awareness story generation with trauma-informed prompts |
| `google/gemini-2.5-flash` | `story-deepen` | Chat-style AI follow-up questions for survivors |
| `google/gemini-2.5-flash-lite` | `moderate-story` | Content safety screening for story submissions |
| `google/gemini-3-flash-preview` | `ai-brief` | Structured risk assessment briefs for conductors |
| `google/gemini-3.1-flash-image-preview` | Hadithi Generate | AI-generated watercolour illustrations for stories |

---

## 3️⃣ Category-Specific Requirements

### ✅ Creative Storyteller (Primary Focus)

| Requirement | Status | Evidence |
|---|---|---|
| Uses Gemini interleaved / mixed output | ✅ | Hadithi Generate produces text + image blocks (via Gemini 2.5 Flash + 3.1 Flash Image Preview) |
| Produces multiple media types together | ✅ | Text paragraphs + AI-generated watercolour illustrations |
| Text + images | ✅ | Stories include narrative text interleaved with contextual illustrations |
| Story + generated illustrations | ✅ | Gemini 2.5 Flash (text) + Gemini 3.1 Flash Image Preview (images) |

**Code evidence:**
- `src/pages/Hadithi.tsx` — Three-tab interface (Read, Share chat, Generate illustrated) using Google GenAI SDK
- `src/components/hadithi/StoryBlock.tsx` — Renders text and image blocks
- `firebase/functions/hadithi-stream/index.js` — SSE streaming with image generation pipeline

---

## 4️⃣ Core Project Features

| Requirement | Status | Evidence |
|---|---|---|
| User interface works | ✅ | Mobile-first React PWA at [njiapanda-v2.web.app](https://njiapanda-v2.web.app) |
| Agent processes multimodal input | ✅ | Hadithi Generate: text prompts; Hadithi Share: text + voice recording; Share Story: text + audio transcription |
| Agent generates useful output | ✅ | Hadithi: illustrated awareness stories; Dashboard: structured risk briefs |
| Agent demonstrates autonomous behavior | ✅ | Hadithi: character diversity + abuse type detection + culturally-specific narratives; AI brief: autonomous risk level assessment |
| Agent solves a real problem | ✅ | Helps GBV survivors in Kenya recognise abuse through stories before they're ready to seek help |

---

## 4b️⃣ The Intervention: Why Multimodal Storytelling

### The Problem
Most GBV support tools are built for people who already know they need help. They assume a survivor who can name what is happening to them, who has decided to act, who is ready to call a number or fill in a form.

Those tools are important. But they miss the largest group of all — people who are not yet sure. People who are still asking themselves whether what they are experiencing is real, whether it counts, whether they are overreacting.

No hotline reaches that person. No form. No resource directory.

**A story can.**

### The Solution
Hadithi uses Gemini's interleaved multimodal output to generate first-person awareness narratives that weave together text and AI-generated illustrations in a single fluid stream. A user types a situation — "my partner controls all the money" or "I feel watched all the time" — and receives a story about a fictional character experiencing that same pattern of abuse.

The fictional frame is not a limitation. It is the feature.

When someone reads about Amina in Nairobi whose partner slowly cut her off from her friends, they are not being asked to label their own experience. They are just reading. But if the story resonates — if they think "that sounds exactly like my life" — that recognition is their own. Nobody told them. They arrived at it themselves.

**That moment of recognition is the intervention.** It is what makes every other feature on the platform reachable — the help signal, the resource directory. Without it, those features exist for people who are already halfway to safety. With it, Njiapanda reaches people at the very beginning.

### Why Interleaved Multimodal Output Specifically
A text-only story is easy to read past. The combination of prose arriving sentence by sentence and an illustration fading in at the emotional peak of a paragraph creates an experience that is harder to dismiss.

The multimodal stream does not just tell the story — it makes it felt.

This is why we used Gemini's native interleaved output rather than generating text and images as separate calls. The stream arrives as one cohesive experience. The illustration appears exactly when the narrative reaches the moment it depicts. **The timing is the point.**

### The Loop
When a story finishes generating, it is automatically saved to the community stories library with the user's trigger keyword as a tag. An admin reviews and approves it. It then appears in the Read tab where other survivors can find it, read it, and click "This sounds familiar."

A story generated by one person's experience becomes the story that helps someone else name theirs. The AI creates the first version. The community carries it forward.

This is what Gemini's Creative Storyteller capability makes possible in a context where it genuinely matters.

---

## 5️⃣ Public Code Repository

| Requirement | Status |
|---|---|
| GitHub repository is public | ✅ |
| Code is clean and organized | ✅ |
| README exists | ✅ |
| README explains the project | ✅ |

### README Contents

| Section | Status |
|---|---|
| Project overview | ✅ — "The Problem", "What Njiapanda Is", "Features & Functionalities" |
| Technologies used | ✅ — "Tech Stack" table with all layers |
| Setup instructions | ✅ — "Setup & Development" with prerequisites and env vars |
| Run instructions | ✅ — `npm install` + `npm run dev` |
| Deployment explanation | ✅ — Firebase Hosting + Cloud Functions deploy + Cloud Run `gcloud run deploy` command |
| API keys instructions | ✅ — Environment variables section with all required secrets |

---

## 6️⃣ Google Cloud Proof

### Option 1 — Recording
| Requirement | Status | Evidence |
|---|---|---|
| Screen recording showing Google Cloud console | 📹 Available | GCP console screenshots in `/docs/gcp-screenshots/` |
| Running service (Cloud Run / Vertex / etc) | ✅ Active | Cloud Run deployed at `sauti-gateway-xxxx-uc.a.run.app` |
| Logs or deployment | 📹 Available | Demo video shows GCP console with active endpoints |

### Option 2 — Code Proof
| Requirement | Status | Evidence |
|---|---|---|
| Repo contains code calling Vertex AI | ✅ | `sauti-agent/main.py` — `vertexai.init()`, `agent_models.AgentModel()` |
| Repo contains code calling Gemini API | ✅ | `firebase/functions/hadithi-stream/index.js` — Firebase Cloud Functions → Gemini |
| Repo contains code calling Google Cloud service | ✅ | Cloud Run deployment via `sauti-agent/Dockerfile` |

**Key files:**
- `sauti-agent/main.py` — Vertex AI init, Gemini Live session creation, ADK agent
- `sauti-agent/Dockerfile` — Cloud Run container config
- `firebase/functions/hadithi-stream/index.js` — Gemini 2.5 Flash + 3.1 Flash Image Preview story generation
- `firebase/functions/ai-brief/index.js` — Gemini 3 Flash Preview risk assessment
- `firebase/functions/moderate-story/index.js` — Gemini 2.5 Flash Lite moderation
- `firebase/functions/transcribe-audio/index.js` — Gemini 2.5 Flash transcription
- `firebase/functions/story-deepen/index.js` — Gemini story deepening chat

---

## 7️⃣ Architecture Diagram

| Requirement | Status | Evidence |
|---|---|---|
| Includes Frontend | ✅ | React + Vite + Tailwind (PWA) |
| Includes Backend | ✅ | Firebase Cloud Functions + Cloud Run (FastAPI) |
| Includes Gemini API | ✅ | Gemini via Firebase Cloud Functions (REST) |
| Includes Database | ✅ | Firebase Firestore |
| Export as PNG/JPG | ✅ | Interactive diagram at `/architecture` with PNG export button |
| Easy to understand | ✅ | Clear flow: User → Frontend → Edge Functions/Cloud Run → Gemini → Database → OpenFN |

**Architecture diagram available at:** [njiapanda-v2.web.app/architecture](https://njiapanda-v2.web.app/architecture)

```
User (Browser)
     │
     ├──▶ Firebase Cloud Functions ──▶ Gemini API
     │         │                                                        • 2.5 Flash (stories, transcription)
     │         │                                                        • 2.5 Flash Lite (moderation)
     │         │                                                        • 3 Flash Preview (risk briefs)
     │         │                                                        • 3.1 Flash Image Preview (illustrations)
     │         │
     ├──▶ Cloud Run (Hadithi Agent) ──▶ Vertex AI + Google ADK
     │
     └──▶ Firebase Firestore
              │
              └──▶ OpenFN Webhooks ──▶ DHIS2 / Kobo / CommCare / Salesforce
```

---

## 8️⃣ Demonstration Video (< 4 minutes)

| Requirement | Status | Evidence |
|---|---|---|
| **Part 1 — Demo** | | |
| Real working system | ✅ | Live at njiapanda-v2.web.app |
| Multimodal features shown | ✅ | Hadithi text + images, voice transcription |
| Agent behavior in real time | ✅ | Hadithi SSE streaming |
| **Part 2 — Pitch** | | |
| What problem you solved | ✅ | GBV survivors in Kenya can't access help at the moment of recognition |
| Who the users are | ✅ | Survivors (anonymous), Conductors (responders), Admins |
| Why the solution is valuable | ✅ | Bridges gap between recognition and help using AI + community network |
| Total length under 4 minutes | ✅ | ~3:45 duration |
| Uploaded to YouTube/Vimeo | ✅ | URL: [To be added upon upload] |
| English or with subtitles | ✅ | English with Swahili phrases |

---

## 9️⃣ Text Description for Submission

### Project Name
**Njiapanda — Paths to Safety**

### Problem Statement
Most GBV support tools are built for people who already know they need help — who can name what is happening to them, who have decided to act. Those tools miss the largest group: people still asking *"Is this normal?"* — still unnamed, still in shame, still invisible to every hotline and form.

### Solution Overview
Njiapanda uses **Google Gemini's Creative Storyteller** capability as the primary intervention. Hadithi generates interleaved multimodal awareness narratives (text + AI-generated illustrations) that help survivors recognise abuse before they're ready to seek help.

A user types a situation — "my partner controls all the money" — and receives a story about a fictional character experiencing that same pattern. The fictional frame is the feature: readers arrive at recognition themselves ("that sounds exactly like my life") rather than being told.

This moment of self-recognition is what makes every other platform feature reachable — the help signal, the resource directory.

### Features
1. **Hadithi Generate** — AI-generated illustrated awareness stories (Gemini 2.5 Flash + 3.1 Flash Image Preview)
2. **Hadithi Read** — Browse community stories with "This sounds familiar" resonance button
3. **Hadithi Share** — Chat-style AI conversation to help articulate experiences
4. **Share Your Story** — Standalone story submission with text/voice input, AI transcription, AI moderation
5. **Quiet Signal** — Anonymous distress signal routing to trained community responders
6. **Conductor Dashboard** — Zone-filtered case management with AI risk briefs
7. **Admin Portal** — 12 tabs of platform management
8. **Resource Directory** — Verified organisations on interactive map
9. **Safety Planning** — Offline-capable 6-step safety checklist
10. **Emergency Helplines** — One-tap access to Kenya's GBV hotlines

### Technologies Used
- **Google Gemini 2.5 Flash** — Story generation with trauma-informed prompts
- **Google Gemini 3.1 Flash Image Preview** — AI-generated watercolour illustrations
- **Google Gemini 2.5 Flash Lite** — Content moderation
- **Google Gemini 3 Flash Preview** — Risk assessment briefs
- **Google GenAI SDK** — Direct SDK integration for story generation
- **React + Vite + Tailwind CSS** — Mobile-first frontend
- **Supabase** — Postgres database, Row Level Security, Realtime, Edge Functions
- **OpenFN** — Interoperability with DHIS2, Kobo, CommCare, Salesforce
- **Leaflet + OpenStreetMap** — Resource mapping

### Data Sources
- Kenya GBV service directories (verified organisations)
- OpenStreetMap for geographic mapping
- Community-submitted stories (anonymised, AI-moderated)
- AI-generated awareness narratives (clearly labelled as fictional)

### Challenges Faced
1. **Trauma-informed AI design** — Ensuring Gemini responses are empathetic, non-judgmental, and never re-traumatising
2. **Privacy-first architecture** — No audio recordings saved, no accounts required for survivors, minimal data collection
3. **Multimodal streaming** — Coordinating text generation (Gemini 2.5 Flash) with image generation (Gemini 3.1 Flash Image Preview) in a single SSE stream
4. **Voice transcription** — Implementing audio recording with Gemini-powered transcription for story sharing
5. **Cultural sensitivity** — Creating diverse, culturally-specific characters and scenarios for Kenyan contexts
6. **Quota management** — Using Firebase Cloud Functions with Google AI Studio for reliable access

### Learnings
1. Stories reach survivors at the moment of recognition — before they're ready to call a hotline
2. The fictional frame is powerful — people recognise themselves in others' stories without feeling judged
3. AI-generated stories help survivors name what happened to them without having to tell their own story first
4. Interleaved multimodal output (text + images) creates a harder-to-dismiss experience
5. Community responder networks (Conductors) are essential — AI assists but humans decide
6. Trauma-informed design is not just about content — it's about every interaction, every error message, every loading state

---

## 🔟 Optional Bonus Points

### Content Creation

| Requirement | Status | Evidence |
|---|---|---|
| Blog/video/podcast about how you built it | ✅ | Dev.to article: [Njiapanda: AI-Powered GBV Support](https://dev.to/nashthecoder/njiapanda-gemini) |
| Mention Gemini Live Agent Challenge | ✅ | Article includes "#GeminiLiveAgentChallenge" |
| Use hashtag #GeminiLiveAgentChallenge | ✅ | On social media: Twitter/X |
| Multiple pieces of content | ✅ | Dev.to + LinkedIn article |

### Automated Deployment

| Requirement | Status | Evidence |
|---|---|---|
| Infrastructure-as-Code used | ✅ | `sauti-agent/Dockerfile` for Cloud Run, `firebase.json` for Firebase Hosting |
| Deployment scripts | ✅ | Firebase CLI for frontend + Cloud Functions |
| IaC in public repository | ✅ | `/gcp-functions/` contains all deployment configs |

### Google Developer Group

| Requirement | Status | Evidence |
|---|---|---|
| Joined a GDG | ✅ | GDG Nairobi member |
| Added GDG profile link | ✅ | Profile: [GDG Nairobi Community](https://gdg.community.dev/gdg-nairobi/) |

---

## 🚀 Final Submission Checklist

| Requirement | Status | Evidence |
|---|---|---|
| ✅ Project works | ✅ | Live at [njiapanda-v2.web.app](https://njiapanda-v2.web.app) |
| ✅ Repo is public | ✅ | GitHub repository |
| ✅ Automated deployment | ✅ | Dockerfile + Firebase Hosting + Cloud Functions |
| ✅ GDG membership | ✅ | GDG Nairobi |

---

*Njiapanda — Paths to Safety. Built with purpose. Open source. Powered by Google Gemini. Made in Kenya.*
