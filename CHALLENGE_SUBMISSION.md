# ✅ Gemini Live Agent Challenge — Njiapanda Submission Checklist

**Project:** Njiapanda — Paths to Safety
**Live URL:** [njiapanda-safetyapp.lovable.app](https://njiapanda-safetyapp.lovable.app)
**Repository:** [github.com/nashthecoder/njiapanda-support-kenya](https://github.com/nashthecoder/njiapanda-support-kenya)
**Author:** [@nashthecoder](https://github.com/nashthecoder) · [LinkedIn](https://www.linkedin.com/in/naijeriatoweett/)

---

## 1️⃣ Category Selection

| Requirement | Status | Evidence |
|---|---|---|
| Selected one category | ✅ | **Live Agents** (primary) + **Creative Storyteller** (secondary) |
| Project fits the category's focus | ✅ | Sauti = Live Agent (real-time voice/vision); Hadithi = Creative Storyteller (text + AI images) |
| Project uses multimodal inputs or outputs | ✅ | Audio input/output (Sauti), vision input (camera), text + image output (Hadithi), voice-to-text (transcription) |

### Categories Covered

- **✅ Live Agents (real-time audio/vision)** — Sauti voice companion uses Gemini 2.0 Flash Live API with real-time audio + optional camera vision input
- **✅ Creative Storyteller (multimodal mixed outputs)** — Hadithi generates interleaved text + AI-generated watercolour illustrations using Gemini 2.5 Flash + Gemini 3.1 Flash Image Preview

---

## 2️⃣ Mandatory Technical Requirements

### Gemini + Agent Framework

| Requirement | Status | Evidence |
|---|---|---|
| Uses a Gemini model | ✅ | 7 different Gemini models used (see table below) |
| Uses Google GenAI SDK OR ADK | ✅ | Google GenAI SDK (Sauti WebSocket), Google ADK (Cloud Run agent), Lovable AI Gateway (OpenAI-compatible proxy to Gemini) |
| Implements agent logic | ✅ | Sauti: real-time voice agent with trauma-informed system prompt, turn-taking, vision input, emergency detection. Hadithi: story generation agent with character diversity, abuse type detection, image generation pipeline. Dashboard: AI risk assessment with structured tool calling. |

### Google Cloud

| Requirement | Status | Evidence |
|---|---|---|
| Backend runs on Google Cloud | ✅ | Sauti ADK Agent on Cloud Run; Gemini API via Google AI Studio + Vertex AI |
| Uses at least one Google Cloud service | ✅ | See list below |
| Agent is hosted on Google Cloud | ✅ | Cloud Run (Sauti ADK Agent) + Gemini API (all AI features) |

### Google Cloud Services Used

| Service | Usage |
|---|---|
| **Vertex AI / Google AI Studio** | Gemini 2.0 Flash Live API for real-time voice agent (Sauti) |
| **Cloud Run** | Sauti ADK Agent backend (FastAPI + Google ADK) — `sauti-agent/` directory |
| **Gemini API** (via Lovable AI Gateway) | 6 edge functions calling Gemini models for storytelling, moderation, transcription, risk assessment, image generation |
| **Firebase Hosting** | Configured for deployment (see `firebase.json`, `.firebaserc`) |

### Gemini Models Used

| Model | Function | Purpose |
|---|---|---|
| `gemini-2.0-flash-live-001` | Sauti voice agent | Real-time multimodal conversation (WebSocket BidiGenerateContent) |
| `google/gemini-2.5-flash` | `hadithi-stream` | AI awareness story generation (SSE streaming) |
| `google/gemini-2.5-flash` | `transcribe-audio` | Voice recording → text transcription |
| `google/gemini-2.5-flash` | `story-deepen` | Chat-style AI follow-up questions for survivors |
| `google/gemini-2.5-flash-lite` | `moderate-story` | Content safety screening for story submissions |
| `google/gemini-3-flash-preview` | `ai-brief` | Structured risk assessment briefs for conductors |
| `google/gemini-3.1-flash-image-preview` | `hadithi-stream` | AI-generated watercolour illustrations for stories |

---

## 3️⃣ Category-Specific Requirements

### ✅ Live Agents

| Requirement | Status | Evidence |
|---|---|---|
| Uses Gemini Live API | ✅ | `gemini-2.0-flash-live-001` via WebSocket BidiGenerateContent |
| Supports real-time conversation | ✅ | Streaming audio in/out with PCM16 at 16kHz |
| User can interrupt the agent | ✅ | Turn-complete signal handling in `src/pages/Sauti.tsx` |
| Uses audio inputs | ✅ | Microphone capture → PCM16 → Gemini WebSocket |
| Uses vision inputs | ✅ | Optional camera toggle sends snapshots every 3 seconds to Gemini |
| Streaming responses | ✅ | Real-time audio playback with waveform visualiser |

**Code evidence:**
- `src/pages/Sauti.tsx` — Full Gemini Live WebSocket client with audio/vision
- `supabase/functions/sauti-session/index.ts` — Session provisioning
- `sauti-agent/main.py` — Cloud Run ADK agent with triage + service lookup tools

### ✅ Creative Storyteller

| Requirement | Status | Evidence |
|---|---|---|
| Uses Gemini interleaved / mixed output | ✅ | `hadithi-stream` generates text + image blocks in a single SSE stream |
| Produces multiple media types together | ✅ | Text paragraphs + AI-generated watercolour illustrations |
| Text + images | ✅ | Stories include narrative text interleaved with contextual illustrations |
| Story + generated illustrations | ✅ | Gemini 2.5 Flash (text) + Gemini 3.1 Flash Image Preview (images) |

**Code evidence:**
- `supabase/functions/hadithi-stream/index.ts` — SSE streaming with image generation pipeline
- `src/pages/Hadithi.tsx` — Three-tab interface (Read, Share chat, Generate illustrated)
- `src/components/hadithi/StoryBlock.tsx` — Renders text, image, and audio blocks

---

## 4️⃣ Core Project Features

| Requirement | Status | Evidence |
|---|---|---|
| User interface works | ✅ | Mobile-first React PWA at [njiapanda-safetyapp.lovable.app](https://njiapanda-safetyapp.lovable.app) |
| Agent processes multimodal input | ✅ | Sauti: audio + vision; Hadithi Share: text + voice recording; Share Story: text + audio transcription |
| Agent generates useful output | ✅ | Sauti: spoken trauma-informed responses; Hadithi: illustrated awareness stories; Dashboard: structured risk briefs |
| Agent demonstrates autonomous behavior | ✅ | Sauti: emergency detection + escalation; Hadithi: character diversity + abuse type detection; AI brief: autonomous risk level assessment with resource recommendations |
| Agent solves a real problem | ✅ | Helps GBV survivors in Kenya recognise abuse, articulate experiences, and connect to verified support services |

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
| Deployment explanation | ✅ — Lovable auto-deploy + Cloud Run `gcloud run deploy` command |
| API keys instructions | ✅ — Environment variables section with all required secrets |

---

## 6️⃣ Google Cloud Proof

### Option 1 — Recording
| Requirement | Status |
|---|---|
| Screen recording showing Google Cloud console | 🔄 To be recorded |
| Running service (Cloud Run / Vertex / etc) | 🔄 To be recorded |
| Logs or deployment | 🔄 To be recorded |

### Option 2 — Code Proof
| Requirement | Status | Evidence |
|---|---|---|
| Repo contains code calling Vertex AI | ✅ | `sauti-agent/main.py` — `vertexai.init()`, `agent_models.AgentModel()` |
| Repo contains code calling Gemini API | ✅ | `supabase/functions/hadithi-stream/index.ts` — Lovable AI Gateway → Gemini |
| Repo contains code calling Google Cloud service | ✅ | Cloud Run deployment via `sauti-agent/Dockerfile` |

**Key files:**
- `sauti-agent/main.py` — Vertex AI init, Gemini Live session creation, ADK agent
- `sauti-agent/Dockerfile` — Cloud Run container config
- `supabase/functions/hadithi-stream/index.ts` — Gemini 2.5 Flash + 3.1 Flash Image Preview
- `supabase/functions/sauti-session/index.ts` — Gemini Live WebSocket provisioning
- `supabase/functions/ai-brief/index.ts` — Gemini 3 Flash Preview risk assessment
- `supabase/functions/moderate-story/index.ts` — Gemini 2.5 Flash Lite moderation
- `supabase/functions/transcribe-audio/index.ts` — Gemini 2.5 Flash transcription
- `supabase/functions/story-deepen/index.ts` — Gemini story deepening chat

---

## 7️⃣ Architecture Diagram

| Requirement | Status | Evidence |
|---|---|---|
| Includes Frontend | ✅ | React + Vite + Tailwind (PWA) |
| Includes Backend | ✅ | Supabase Edge Functions (Deno) + Cloud Run (FastAPI) |
| Includes Gemini API | ✅ | Gemini Live (WebSocket) + Lovable AI Gateway (REST) |
| Includes Google Cloud services | ✅ | Cloud Run, Vertex AI, Firebase Hosting |
| Includes Database | ✅ | Supabase Postgres (13 tables, RLS) |
| Export as PNG/JPG | ✅ | Interactive diagram at `/architecture` with PNG export button |
| Easy to understand | ✅ | Clear flow: User → Frontend → Edge Functions/Cloud Run → Gemini → Database → OpenFN |

**Architecture diagram available at:** [njiapanda-safetyapp.lovable.app/architecture](https://njiapanda-safetyapp.lovable.app/architecture)

```
User (Browser)
     │
     ├──▶ Supabase Edge Functions (Deno) ──▶ Lovable AI Gateway ──▶ Gemini Models
     │         │                                                        • 2.5 Flash (stories, transcription)
     │         │                                                        • 2.5 Flash Lite (moderation)
     │         │                                                        • 3 Flash Preview (risk briefs)
     │         │                                                        • 3.1 Flash Image Preview (illustrations)
     │         │
     ├──▶ WebSocket Direct ──▶ Gemini 2.0 Flash Live API (Sauti voice agent)
     │
     ├──▶ Cloud Run (Sauti ADK Agent) ──▶ Vertex AI + Google ADK
     │
     └──▶ Supabase Postgres (13 tables, RLS by role + zone)
              │
              └──▶ OpenFN Webhooks ──▶ DHIS2 / Kobo / CommCare / Salesforce
```

---

## 8️⃣ Demonstration Video (< 4 minutes)

| Requirement | Status |
|---|---|
| **Part 1 — Demo** | |
| Real working system | 🔄 To be recorded |
| Multimodal features shown | 🔄 Sauti voice + vision, Hadithi text + images, voice transcription |
| Agent behavior in real time | 🔄 Sauti real-time conversation, Hadithi SSE streaming |
| **Part 2 — Pitch** | |
| What problem you solved | 🔄 GBV survivors in Kenya can't access help at the moment of recognition |
| Who the users are | 🔄 Survivors (anonymous), Conductors (responders), Admins |
| Why the solution is valuable | 🔄 Bridges gap between recognition and help using AI + community network |
| Total length under 4 minutes | 🔄 |

---

## 9️⃣ Text Description for Submission

### Project Name
**Njiapanda — Paths to Safety**

### Problem Statement
Gender-based violence affects 45% of Kenyan women. Support services exist but survivors can't access them at the critical moment of recognition — when abuse is still unnamed, when shame is louder than help, when the path to safety feels invisible. No hotline reaches someone at the moment they first wonder: *"Is this normal?"*

### Solution Overview
Njiapanda is a community-led coordination platform that uses **Google Gemini Live AI** to create multiple pathways from recognition to safety. It combines a real-time AI voice companion (Sauti), AI-powered awareness storytelling (Hadithi), anonymous distress signals, and a trained community responder network (Conductors) — all layered on top of Kenya's existing support infrastructure.

### Features
1. **Sauti** — Real-time AI voice companion (Gemini 2.0 Flash Live) with audio + camera vision input
2. **Hadithi** — AI-powered storytelling with three modes: Read stories, Share yours (chat-style with AI deepening), Generate illustrated awareness narratives
3. **Quiet Signal** — Anonymous distress signal routing to trained community responders
4. **Conductor Dashboard** — Zone-filtered case management with AI risk assessment briefs
5. **Resource Directory** — Verified organisations on interactive map
6. **Safety Planning** — Offline-capable 6-step safety checklist
7. **Emergency Helplines** — One-tap calling
8. **Admin Portal** — Full platform management (12 tabs)

### Technologies Used
- **Google Gemini 2.0 Flash Live API** — Real-time multimodal voice agent (WebSocket)
- **Google Gemini 2.5 Flash** — Story generation, transcription, story deepening
- **Google Gemini 2.5 Flash Lite** — Content moderation
- **Google Gemini 3 Flash Preview** — Risk assessment briefs
- **Google Gemini 3.1 Flash Image Preview** — AI-generated illustrations
- **Google Cloud Run** — Sauti ADK Agent backend
- **Google ADK (Agent Development Kit)** — Agent framework for Sauti
- **Vertex AI** — Model hosting and authentication
- **Firebase** — Hosting configuration
- **React + Vite + Tailwind CSS** — Mobile-first frontend
- **Supabase** — Postgres database, Row Level Security, Realtime, Edge Functions
- **OpenFN** — Interoperability with DHIS2, Kobo, CommCare, Salesforce
- **Leaflet + OpenStreetMap** — Resource mapping
- **Stripe + M-Pesa + PayPal** — Payments

### Data Sources
- Kenya GBV service directories (verified organisations)
- OpenStreetMap for geographic mapping
- Community-submitted stories (anonymised, AI-moderated)
- AI-generated awareness narratives (clearly labelled as fictional)

### Challenges Faced
1. **Trauma-informed AI design** — Ensuring Gemini responses are empathetic, non-judgmental, and never re-traumatising
2. **Privacy-first architecture** — No audio recordings saved, no accounts required for survivors, minimal data collection
3. **Multimodal streaming** — Coordinating text generation (Gemini 2.5 Flash) with image generation (Gemini 3.1 Flash Image Preview) in a single SSE stream
4. **Real-time voice** — Implementing WebSocket-based Gemini Live with turn-taking, interruption handling, and vision input
5. **Cultural sensitivity** — Creating diverse, culturally-specific characters and scenarios for Kenyan contexts
6. **Quota management** — Migrating from direct Google AI Studio API to Lovable AI Gateway for reliable access

### Learnings
1. AI can reach survivors at the moment of recognition — before they're ready to call a hotline
2. Voice is more accessible than text for many survivors, especially in multilingual contexts
3. AI-generated stories help survivors name what happened to them without having to tell their own story first
4. Community responder networks (Conductors) are essential — AI assists but humans decide
5. Interoperability (OpenFN) prevents platform lock-in and connects to existing NGO systems
6. Trauma-informed design is not just about content — it's about every interaction, every error message, every loading state

---

## 🔟 Optional Bonus Points

### Content Creation

| Requirement | Status |
|---|---|
| Blog/video/podcast about how you built it | 🔄 Planned |
| Mention Gemini Live Agent Challenge | 🔄 Will include |
| Use hashtag #GeminiLiveAgentChallenge | 🔄 Will include |

### Automated Deployment

| Requirement | Status | Evidence |
|---|---|---|
| Infrastructure-as-Code used | ✅ | `sauti-agent/Dockerfile` for Cloud Run, `firebase.json` for Firebase Hosting |
| Deployment scripts | ✅ | Lovable auto-deploy for frontend + edge functions |

### Google Developer Group

| Requirement | Status |
|---|---|
| Joined a GDG | 🔄 To confirm |
| Added GDG profile link | 🔄 To add |

---

## 🚀 Final Submission Checklist

| Requirement | Status |
|---|---|
| ✅ Project works | ✅ — Live at [njiapanda-safetyapp.lovable.app](https://njiapanda-safetyapp.lovable.app) |
| ✅ Repo is public | ✅ — GitHub connected via Lovable |
| ✅ README complete | ✅ — Full README with setup, tech stack, architecture |
| ✅ Architecture diagram ready | ✅ — Interactive at `/architecture` with PNG export |
| 🔄 Demo video ready | 🔄 — To be recorded (< 4 minutes) |
| ✅ Cloud proof ready | ✅ — Code proof in `sauti-agent/`, edge functions, Firebase config |
| ✅ Text description written | ✅ — See Section 9 above |

---

*Njiapanda — Paths to Safety. Built with purpose. Open source. Powered by Google Gemini. Made in Kenya.*
