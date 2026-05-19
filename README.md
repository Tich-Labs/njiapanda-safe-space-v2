# Njiapanda — Paths to Safety

**A community-led GBV survivor support platform for Kenya, powered by Google Gemini Live AI**

*Njiapanda* is Swahili for **crossroads** — the moment a person stops and asks:
*is this normal? Is this love? Or is this something I need to name?*

[![License: MIT](https://img.shields.io/badge/License-MIT-2D8A77.svg)](LICENSE)
[![Live Platform](https://img.shields.io/badge/Platform-Live-C4871A.svg)](https://njiapanda-v2.web.app)
[![Hosted on Firebase](https://img.shields.io/badge/Hosted-Firebase-FFCA28.svg)](https://firebase.google.com)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%20Live-4285F4.svg)](https://ai.google.dev)
[![Google Cloud](https://img.shields.io/badge/Cloud-Google%20Cloud-4285F4.svg)](https://cloud.google.com)
[![DPG Aligned](https://img.shields.io/badge/DPG-Aligned-0F3D34.svg)](https://digitalpublicgoods.net)

[🌍 Live Platform](https://njiapanda-v2.web.app) · [📖 Why Njiapanda](https://njiapanda-v2.web.app/why) · [🤝 Join the Network](https://njiapanda-v2.web.app/join) · [💬 LinkedIn](https://www.linkedin.com/in/naijeriatoweett/)

---

## The Problem

Most of the services GBV survivors need already exist in Kenya.
Shelters. Legal aid. Crisis hotlines. Counselling.

**The gap was never the absence of help. It was the distance between a person and the moment they could reach it.**

And before that distance — there is another one. Abuse does not announce itself. It settles in slowly, quietly, until it starts to feel like normal. No hotline reaches a person at that moment.

Njiapanda does.

---

## What Njiapanda Is

> **Not another app. A layer on top of what already exists.**

Njiapanda is a coordination layer — connecting survivors to trained community responders, verified organisations, and safe houses through three interlocking journeys:

| Journey | Who | What they do |
|---|---|---|
| 🟢 **Survivor** | Anonymous visitor | Journeys through an emotional progression: recognition (self-check) → connection (stories) → exploration (write/safety/resources) → support (helpline/signal). No account. No trace. |
| 🟡 **Conductor** | Trained community responder | Receives signals, assesses risk with AI support, coordinates safe house placement and referrals. |
| 🔵 **Admin** | Platform manager | Manages conductors, moderates stories, monitors escalation alerts, reviews metrics. |

---

## Features & Functionalities

### 📡 Quiet Help Signal
Anonymous, no-login distress signal with:
- **3-level urgency** — Emergency (in danger now), Urgent (need help soon), Information
- **Resource selection** — safe place, legal help, counselling, transport, medical
- **Zone targeting** — Nairobi, Mombasa, Kisumu, Nakuru, Eldoret
- **Consent toggle** — explicit opt-in for follow-up
- **Calm confirmation** — reassuring screen after submission
- **Emergency exit** — instant safe close to weather.com

### 🛡️ Safety Planning
Interactive 6-step safety plan checklist:
- **Actionable steps** — identify safe person, pack emergency bag, save disguised contacts, know nearest safe house, set code word, clear browser history
- **Progress tracking** — checkbox completion
- **Offline available** — works without internet via service worker caching
- **No data stored** — checklist state is local only

### 🗺️ Resource Directory
Verified support organisations with geographic mapping:
- **Leaflet + OpenStreetMap** — interactive map with zone centres
- **Search & filter** — by type (Legal Aid, Medical, Counselling, Shelter, Helpline) and zone
- **Low-bandwidth mode** — text-only fallback when map is too heavy
- **Verified badge** — only confirmed organisations shown
- **Contact details** — phone, hours, type at a glance

### 📞 Emergency Helplines
One-tap access to Kenya's emergency numbers:
- **GBV Hotline (1195)** — 24/7
- **Childline Kenya (116)** — 24/7
- **Kenya Red Cross (1199)** — 24/7
- **Police Emergency (999)** — 24/7
- **FIDA Kenya** — legal aid
- **Tap-to-call** — direct phone integration

### 🟡 Conductor Dashboard
Zone-filtered case management for trained responders:
- **Real-time signal notifications** — Supabase Realtime alerts for new signals
- **AI risk briefs** — Gemini-powered structured risk assessment (risk level, detected abuse types, suggested resources, immediate safety concern)
- **Case management** — accept signals, add notes, track status
- **Safe house panel** — real-time capacity status across zones
- **Voice source filter** — filter for voice-submitted signals
- **Zone-scoped** — conductors only see their assigned zone's data

### 📖 Hadithi — AI-Powered Multimodal Storytelling
Interactive storytelling engine combining **three sources** for GBV awareness:
- **Sourced survivor stories** — real personal narratives curated from organisations (UNFPA, UNHCR, SafeAndEqual) via web search or manual URL submission
- **User-submitted stories** — anonymous survivor testimonies shared via text or voice
- **AI-generated awareness stories** — fictional illustrated narratives for education

#### Read Stories
- Browse survivor stories from all three sources in one feed
- Search and filter by abuse type
- **Sourced stories** with full attribution: organisation, location, and link to original
- User stories with "This sounds familiar" resonance button (anonymous)
- AI-generated stories clearly labelled
- **No news articles** — only personal survivor narratives
- **Submit a story link** — paste any survivor story URL to fetch and add it
- URL verification ensures no broken links in the feed

#### Share Your Story (Chat-Style)
- **ChatGPT-like conversational interface** — select abuse type, then type or record messages
- **AI-assisted story deepening** — Hadithi AI asks follow-up questions to help survivors articulate their experience
- **Voice input** — record audio, auto-transcribed via Gemini, added to conversation
- **Full conversation submitted** — all user messages collected and saved anonymously
- **AI content moderation** — automatic safety screening on submission

#### Generate Awareness Stories
- **AI-generated illustrated narratives** — Gemini 2.5 Flash creates culturally-specific stories
- **Two formats:** Text-only (fast) or Illustrated (with AI-generated watercolour images)
- **Image generation** — Gemini 3.1 Flash Image Preview creates contextual illustrations via Firebase Cloud Functions
- **SSE streaming** — stories appear progressively as they're generated
- **Diverse characters** — randomised Kenyan names, locations, settings, perspectives, and abuse types
- **Simple English** — prompts enforce everyday language; no advanced words or forced Swahili
- **Disclaimer** — clear labelling that stories are fictional and for awareness only

**Tech:** Gemini 2.5 Flash (text), Gemini 3.1 Flash Image Preview (images), Firebase Cloud Functions, SSE streaming.

### 🌐 Sourced Survivor Stories — Agent-Powered Curation
AI-driven curation of real survivor stories from reputable organisations, integrated directly into the Read Stories experience:

- **Agent-powered discovery** — Gemini searches the web for personal survivor narratives from UNFPA, UNHCR, SafeAndEqual, and similar organisations
- **URL verification** — every link is checked (HEAD request) before storage; broken URLs are automatically skipped
- **Manual URL submission** — users can paste any survivor story URL to fetch and extract the narrative via the `/ingest-url` endpoint
- **MongoDB Atlas storage** — curated stories stored with full-text search, abuse type + location indexing
- **Full attribution** — every story shows organisation name, location, and a link to the original
- **Filterable** — By abuse type and keyword search, alongside other story types
- **No news articles** — only first-person survivor narratives and personal journey features
- **Trigger on demand** — Users click the "Discover" button to trigger the agent, or paste a link manually

**Tech:** Gemini 2.5 Flash (search + parsing), MongoDB Atlas (storage + retrieval), GCP Cloud Run (API + agent host), `requests` + `BeautifulSoup` (URL fetch + page parsing).

### 🔵 Admin Portal
Full platform management with 12 tabs:
- **Overview** — platform metrics and analytics
- **Signals** — all incoming help signals
- **Conductors** — manage responder network
- **User Roles** — role assignment (admin, conductor, user)
- **Stories** — moderation queue with approve/flag/reject
- **Create Story** — CMS for editorial awareness content
- **Feedback** — user feedback and bug reports
- **Partners** — partner expression of interest management
- **Resources** — manage verified organisations
- **Safe Houses** — capacity and status management
- **Alerts** — escalation monitoring
- **Audit Log** — action history for accountability

### 💰 Contribute
Tiered contribution system:
- **Sustain the Platform** — KES 500/month subscription
- **Fund a Conductor Training** — KES 2,000 one-time
- **Fund a Safe House Night** — KES 3,000 one-time
- **M-Pesa** — direct mobile money (Paybill/Till Number)
- **Stripe** — card payments with checkout
- **PayPal** — international contributions

### 💬 Share Your Story (Standalone)
Anonymous survivor story submission page at `/share`:
- **Text or voice** — write or record audio (transcribed via Gemini AI)
- **Abuse type tagging** — Physical, Sexual, Emotional, Economic, Financial Abuse, Digital Surveillance, Isolation, Coercive Control, and more
- **Language selection** — English, Kiswahili, Sheng
- **AI moderation** — automatic content safety screening via Gemini (flags PII, unsafe advice, gratuitous content)
- **No account needed** — fully anonymous

### 🤝 Join the Network
Onboarding for three partner types:
- **Become a Conductor** — individual responder application
- **Register Organisation** — shelter, legal aid, counselling, medical, psychosocial
- **System Integration** — connect existing tools (DHIS2, Kobo, CommCare, Salesforce)

### ♿ Accessibility & Safety
- **Emergency exit button** — every page, clears session, replaces history, redirects to weather.com
- **Escape key** — global keyboard shortcut for emergency exit
- **Skip link** — jump to main content
- **High contrast toggle** — accessibility toolbar
- **Low bandwidth mode** — text-only fallback for slow connections
- **Simple language toggle** — plain language variants
- **48px+ tap targets** — mobile-friendly
- **ARIA labels** — full screen reader support
- **Focus-visible outlines** — keyboard navigation
- **Idle timeout** — auto-clear session after inactivity (for logged-in users)
- **Trauma-informed UX** — calm confirmations, no countdowns, gentle error messages

---

## Three User Journeys

### 🟢 Journey 1: Survivor — The Emotional Progression

The homepage is designed as a guided emotional journey, not a service menu. Each section builds on the one before it — recognition comes before action.

```
Homepage (Emotional Journey)
    │
    ├──▶ 🖼️ Hero Image
    │     (Quiet visual — no distracting text)
    │
    ├──▶ 🔒 Reassurance
    │     "You are safe here. You are anonymous."
    │
    ├──▶ 🤔 Recognition (Primary)
    │     "Something feels wrong?"
    │     └──▶ Take a gentle self-check
    │            │
    │            ├──▶ "Explore your options" ──▶ Back to homepage
    │            └──▶ "Read stories from others" ──▶ Hadithi
    │
    ├──▶ 📖 Connection
    │     "Hear from others like you"
    │     └──▶ Read quiet stories ──▶ Hadithi
    │            │
    │            ├──▶ Read tab ──▶ Browse survivor stories
    │            ├──▶ Share tab ──▶ Type or record your story
    │            └──▶ Generate tab ──▶ AI-illustrated awareness stories
    │
    ├──▶ 🔍 Exploration (Progressive disclosure)
    │     "Explore your options when you're ready"
    │     └──▶ Expand to reveal:
    │            ├──▶ ✏️ Write what happened ──▶ /share
    │            ├──▶ 🛡️ Plan for your safety ──▶ /safety
    │            └──▶ 🗺️ Find help near you ──▶ /resources
    │
    ├──▶ 🤲 Support (Collapsed by default)
    │     "When you need support"
    │     └──▶ Expand to reveal:
    │            ├──▶ 📞 Talk to someone who can help ──▶ /helpline
    │            └──▶ 📡 Send a quiet signal for help ──▶ /signal
    │
    └──▶ 🔒 Trust banner
          "No one will know you visited. You can leave at any time."


   🚪 Emergency Exit (always present on every page) ──▶ weather.com
```

**Emotional flow:**
1. **Recognition** ("Something feels wrong?") — Self-check as the primary CTA. No pressure to name it yet.
2. **Connection** ("Hear from others") — Stories before action. Normalise the experience through others' voices.
3. **Exploration** (Progressive disclosure) — Options revealed only when the user asks. Low cognitive load.
4. **Support** (Collapsed by default) — Help is available but not forced. User chooses when to engage.
5. **Exit** — Emergency escape is never more than one tap away.

**Key principle:** No account. No trace. Recognition before action. Progressive disclosure at every step.

### 🟡 Journey 2: Conductor (Community Responder)

```
Login ──▶ Dashboard (zone-filtered)
              │
              ├──▶ 📡 New Signal Alert (real-time)
              │         │
              │         └──▶ Accept ──▶ Create Case
              │                          │
              │                          ├──▶ 🤖 AI Risk Brief (Gemini)
              │                          │     Risk level, abuse types,
              │                          │     suggested resources,
              │                          │     immediate safety concern
              │                          │
              │                          ├──▶ 📝 Add case notes
              │                          │
              │                          └──▶ 🏠 Safe House referral
              │                                (capacity status visible)
              │
              └──▶ 📊 Overview ──▶ Zone metrics, active cases
```

**Key principle:** See only your zone. AI assists, never decides.

### 🔵 Journey 3: Admin

```
Admin Login ──▶ Admin Portal
                    │
                    ├──▶ 📊 Overview ──▶ Platform-wide metrics
                    ├──▶ 📡 Signals ──▶ All signals across zones
                    ├──▶ 👥 Conductors ──▶ Activate/deactivate responders
                    ├──▶ 🔑 User Roles ──▶ Assign admin/conductor/user
                    ├──▶ 📖 Stories ──▶ Moderate submissions (approve/flag/reject)
                    ├──▶ ✍️ Create Story ──▶ Editorial CMS for awareness content
                    ├──▶ 💬 Feedback ──▶ Resolve user reports
                    ├──▶ 🤝 Partners ──▶ Review partnership applications
                    ├──▶ 🗺️ Resources ──▶ Manage verified organisations
                    ├──▶ 🏠 Safe Houses ──▶ Update capacity status
                    ├──▶ 🔔 Alerts ──▶ Monitor escalation triggers
                    └──▶ 📋 Audit Log ──▶ Full action history
```

**Key principle:** Full visibility. Full accountability.

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| **AI Storytelling** | [Google Gemini 2.5 Flash](https://ai.google.dev) via Firebase Cloud Functions | Hadithi awareness story generation with SSE streaming |
| **AI Image Generation** | [Google Gemini 3.1 Flash Image Preview](https://ai.google.dev) via Firebase Cloud Functions | Watercolour illustrations for awareness stories |
| **AI Story Deepening** | [Google Gemini](https://ai.google.dev) via Firebase Cloud Functions | Chat-style follow-up questions to help survivors articulate stories |
| **AI Moderation** | [Google Gemini 2.5 Flash Lite](https://ai.google.dev) via Firebase Cloud Functions | Content safety screening for story submissions |
| **AI Risk Assessment** | [Google Gemini 3 Flash Preview](https://ai.google.dev) via Firebase Cloud Functions | Structured risk briefs for conductors (tool calling) |
| **AI Transcription** | [Google Gemini 2.5 Flash](https://ai.google.dev) via Firebase Cloud Functions | Voice recording → text transcription |
| Frontend | React + Vite + Tailwind CSS | Mobile-first, trauma-informed UI |
| Hosting | [Firebase Hosting](https://firebase.google.com) | Global CDN, SSL, custom domains |
| Database + Auth | [Firebase Firestore](https://firebase.google.com/firestore) + Firebase Auth | NoSQL database, user authentication, Realtime |
| Serverless Functions | Firebase Cloud Functions | AI processing, payments, notifications |
| Cloud Run Agent | Python + FastAPI + Google ADK | Hadithi agent with triage + service lookup tools (GCP) |
| Interoperability | [OpenFN](https://openfn.org) | Bridge to DHIS2, Kobo, CommCare, Salesforce NPSP |
| Maps | [Leaflet](https://leafletjs.com) + [OpenStreetMap](https://openstreetmap.org) | 100% open source, zone-level only |
| Payments | Stripe + M-Pesa + PayPal | M-Pesa from day one — built for Kenya |
| SMS (planned) | [Africa's Talking](https://africastalking.com) | Low-data and feature phone access |
| **MCP Integration** | [MongoDB MCP Server](https://www.mongodb.com/docs/mcp-server/) | Agent-powered story curation: web search → Gemini parse → URL verify → store in MongoDB |
| Article Store | [MongoDB Atlas](https://mongodb.com/atlas) (free tier) | Curated survivor stories with full-text search, abuse type + location indexing |

### Google Cloud / Gemini Models Used

| Service | Model | Usage |
|---|---|---|
| **Gemini 2.5 Flash** | `google/gemini-2.5-flash` | Hadithi awareness storytelling (SSE streaming via Firebase) |
| **Gemini 2.5 Flash** | `google/gemini-2.5-flash` | Audio transcription for voice stories |
| **Gemini 2.5 Flash** | `google/gemini-2.5-flash` | Story deepening chat (follow-up questions) |
| **Gemini 2.5 Flash Lite** | `google/gemini-2.5-flash-lite` | Story content moderation |
| **Gemini 3 Flash Preview** | `google/gemini-3-flash-preview` | AI risk assessment briefs for conductors |
| **Gemini 3.1 Flash Image Preview** | `google/gemini-3.1-flash-image-preview` | AI-generated watercolour illustrations for stories |
| **Google AI Studio** | — | API key authentication for Gemini |
| **Firebase Cloud Functions** | — | Serverless AI functions (hadithi-stream) |
| **Vertex AI** (fallback) | — | Alternative auth path via service account |
| **Cloud Run** | — | Hadithi ADK Agent backend (FastAPI + Google ADK) |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        USER (Browser)                        │
│  React + Vite + Tailwind CSS + Framer Motion                │
│  Mobile-first PWA · Emergency exit · Accessibility toolbar  │
└────────────────────────────┬─────────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │     Firebase Hosting        │
              │  (Static assets, PWA)      │
              └──────────────┬──────────────┘
                             │
       ┌─────────────────────▼─────────────────────┐
       │     Firebase Cloud Functions               │
       │                                             │
        │ • hadithi-stream (story generation)       │
        │ • transcribe-audio (voice transcription) │
        │ • moderate-story (content safety)         │
        │ • ai-brief (risk assessment)             │
        │ • create-checkout (Stripe)                │
        │ • stripe-webhook (payments)               │
        │
        ├── GCP Cloud Run (article-sourcing agent) ──┐
       │    ├── GET /articles (article API)          │
       │    ├── POST /search-and-ingest (agent)      │
       │    └── GET /health                          │
       │                                             │
       └────────────┬───────────┬────────────────────┘
                    │           │
       ┌────────────▼────┐ ┌───▼──────────────────────┐
       │  Google Gemini  │ │  MongoDB MCP Server       │
       │  API            │ │  (agent tool layer)       │
       │                 │ │                            │
       │ • gemini-2.5-   │ │ • insertMany (store       │
       │   flash (source)│ │   sourced articles)        │
       │ • gemini-2.5-   │ │ • find / aggregate        │
       │   flash-lite    │ │   (retrieve & filter)     │
       │ • gemini-3-     │ │ • createIndex (text/      │
       │   flash-preview │ │   vector search)          │
       └─────────────────┘ └───────────┬────────────────┘
                                       │
                             ┌─────────▼─────────┐
                             │  MongoDB Atlas     │
                             │  (free tier)       │
                             │                    │
                             │ • sourced_articles │
                             │   collection       │
                             └────────────────────┘
                           │
       ┌────────────────────▼──────────────────────┐
       │     Firebase Firestore                   │
       │                                           │
       │ • stories      • signals   • cases      │
       │ • conductors   • resources  • safe_houses│
       │ • profiles    • user_roles • feedback   │
       │ • audit_log   • contributions           │
       │ • partner_expressions                    │
       │                                           │
       │ Realtime: signal alerts                  │
       └───────────────────────────────────────────┘
                           │
       ┌────────────────────▼──────────────────────┐
       │     OpenFN (Webhooks)                     │
       │                                           │
       │ • DHIS2 health reporting                 │
       │ • Kobo case management                   │
       │ • CommCare workflows                     │
       │ • Salesforce NPSP CRM                   │
       └───────────────────────────────────────────┘
```

An interactive architecture diagram with PNG export is available at [`/architecture`](https://njiapanda-v2.web.app/architecture).
     │ • stories     • signals   │
     │ • cases       • conductors│
     │ • resources   • safe_houses│
     │ • profiles    • user_roles│
     │ • feedback    • audit_log │
     │ • contributions           │
     │ • partner_expressions     │
     │ • platform_config         │
     │                           │
     │ RLS: role + zone scoped   │
     │ Realtime: signal alerts   │
     └───────────┬───────────────┘
                 │
     ┌───────────▼───────────────┐
     │     OpenFN (Webhooks)     │
     │                           │
     │ • DHIS2 health reporting  │
     │ • Kobo case management    │
     │ • CommCare workflows      │
     │ • Salesforce NPSP CRM     │
     └───────────────────────────┘
```

An interactive architecture diagram with PNG export is available at [`/architecture`](https://njiapanda-v2.web.app/architecture).

---

## Edge Functions

| Function | Platform | Purpose | AI Model |
|---|---|---|---|
| `hadithi-stream` | Firebase Cloud Functions | SSE streaming awareness story generation | Gemini 2.5 Flash |
| `story-deepen` | Firebase Cloud Functions | Chat-style AI follow-up questions to help survivors expand stories | Gemini 2.5 Flash |
| `transcribe-audio` | Firebase Cloud Functions | Voice recording → text transcription | Gemini 2.5 Flash |
| `moderate-story` | Firebase Cloud Functions | AI content safety screening for submissions | Gemini 2.5 Flash Lite |
| `ai-brief` | Firebase Cloud Functions | Structured risk assessment for conductors | Gemini 3 Flash Preview |
| `forward-signal` | Firebase Cloud Functions | Webhook relay to OpenFN for external integrations | — |
| `notify-feedback` | Firebase Cloud Functions | Feedback notification routing | — |
| `create-checkout` | Firebase Cloud Functions | Stripe checkout session creation | — |
| `stripe-webhook` | Firebase Cloud Functions | Stripe payment confirmation handling | — |
| `article-sourcing` | GCP Cloud Run | Agentic article sourcing agent: search, parse, store via MongoDB MCP + REST API (list, get, ingest) | Gemini 2.5 Flash |

### GCP Cloud Run (Story Sourcing Agent)

| Function | Purpose | Tech |
|---|---|---|
| `hadithi-gateway` | Python FastAPI backend for story generation with ADK tools | Python + FastAPI + Google ADK |
| `article-sourcing` | Python FastAPI agent for survivor story search, URL ingestion, Gemini parsing, URL validation, MongoDB storage | Python + FastAPI + google-generativeai + pymongo + requests + BeautifulSoup |

---

## Data Model

```
stories          signals          cases
───────         ────────         ────────
id               id               id
title            urgency          signal_id → signals
text             zone             conductor_id → conductors
swahili_text     resource_needed  status
english_simple   consent          risk_level
swahili_simple   language         notes
abuse_type       source           zone
message          created_at       updated_at
tags
status
resonance_count
language
source

conductors       resources        safe_houses
───────         ────────         ────────
id               id               id
name             name             zone
zone             type             capacity_status
role             zone             type
active           contact          updated_at
                 hours
                 verified

profiles         user_roles       feedback
───────         ────────         ────────
id               id               id
full_name        user_id          type (bug/contact/suggestion/other)
zone             role (admin/     message
created_at       conductor/user)  email
                                  page_url
                                  status
                                  resolved_at / resolved_by

partner_expressions    contributions    platform_config    audit_log
───────               ────────         ────────           ────────
id                     id               key                id
name                   total_amount     value (JSON)       action
type                   contribution_    updated_at         entity_type
organisation           count            updated_by         entity_id
role                   updated_at                          actor_id
zone                                                      details (JSON)
contact_email/phone                                        created_at
message
status
extra (JSON)

Firebase Firestore (Voice Session Signals)
───────────────
signals (collection)
├── urgency
├── zone
├── resource_needed
├── source: 'sauti_voice'
├── language
├── consent
├── sessionId
└── createdAt
```
stories          signals          cases
────────         ────────         ────────
id               id               id
title            urgency          signal_id → signals
text             zone             conductor_id → conductors
swahili_text     resource_needed  status
english_simple   consent          risk_level
swahili_simple   language         notes
abuse_type       source           zone
message          created_at       updated_at
tags
status
resonance_count
language
source

conductors       resources        safe_houses
────────         ────────         ────────
id               id               id
name             name             zone
zone             type             capacity_status
role             zone             type
active           contact          updated_at
                 hours
                 verified

profiles         user_roles       feedback
────────         ────────         ────────
id               id               id
full_name        user_id          type (bug/contact/suggestion/other)
zone             role (admin/     message
created_at       conductor/user)  email
                                  page_url
                                  status
                                  resolved_at / resolved_by

partner_expressions    contributions    platform_config    audit_log
────────               ────────         ────────           ────────
id                     id               key                id
name                   total_amount     value (JSON)       action
type                   contribution_    updated_at         entity_type
organisation           count            updated_by         entity_id
role                   updated_at                          actor_id
zone                                                      details (JSON)
contact_email/phone                                        created_at
message
status
extra (JSON)
```

---

## Security & Safety Design

Every decision on this platform is a safety decision.

- 🚪 **Emergency exit button** on every page — clears session, replaces browser history, redirects to weather.com instantly
- ⌨️ **Escape key** — global keyboard shortcut triggers emergency exit
- 👤 **Survivors never create accounts** — all public routes work without login
- 🔐 **Row Level Security** enforced at the database level — conductors see only their zone's cases
- 🤖 **AI output is session-only** — risk briefs are never stored
- 🎙️ **No audio recorded** — voice input is transcribed in real-time, no recordings saved
- 📍 **Zone-level display only** — exact safe house addresses never surface in the UI
- 🗑️ **Minimal data collection** — only what is necessary for the referral
- ⏱️ **Idle timeout** — auto-clear session after inactivity for logged-in users
- 🔍 **AI moderation** — automatic PII detection and content safety screening on story submissions
- 🔑 **Multi-auth Gemini** — supports API key, Vertex AI (service account), or ADK agent

---

## Setup & Development

### Prerequisites

- Node.js 22.22.3 or Bun
- Firebase project (for Hosting, Firestore, Auth, Cloud Functions)
- Google AI Studio API key (for Gemini)
- MongoDB Atlas account (free tier) — required for MCP article sourcing feature ([setup guide](MCP_SETUP.md))

### Environment Variables

```bash
# Firebase (auto-provisioned via Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini API
GOOGLE_AI_STUDIO_API_KEY=your_key         # For Gemini

# GCP Cloud Run (optional - for ADK agent)
VITE_GCP_FUNCTION_URL=https://hadithi-gateway-xxxx-uc.a.run.app

# OpenFN integration
OPENFN_WEBHOOK_URL=your_webhook           # OpenFN integration

# MongoDB (for story sourcing — see MCP_SETUP.md)
MONGODB_CONNECTION_STRING=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/njiapanda
MONGODB_DB_NAME=njiapanda
MONGODB_COLLECTION_STORIES=sourced_articles
```

### Run Locally

```bash
# Clone the repo
git clone https://github.com/nashthecoder/njiapanda-support-kenya.git

# Install dependencies
cd njiapanda-support-kenya
npm install

# Run locally
npm run dev
```

### Deploy

The frontend is deployed via [Firebase Hosting](https://firebase.google.com/docs/hosting). Cloud Functions deploy automatically via Firebase CLI.

#### Option 1: Firebase Hosting + Cloud Functions

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy hosting + functions
firebase deploy
```

#### Option 2: GCP Cloud Run (Hadithi Agent)

```bash
cd gcp-functions/sauti-session
gcloud run deploy sauti-agent \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT_ID=njiapanda-safe-space
```

#### Option 3: GCP Cloud Run (Story Sourcing Agent)

```bash
cd gcp-functions/article-sourcing

gcloud run deploy article-sourcing \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_CONNECTION_STRING=$MONGODB_CONNECTION_STRING,GEMINI_API_KEY=$GEMINI_API_KEY,MONGODB_DB_NAME=njiapanda,MONGODB_COLLECTION_STORIES=sourced_articles"

# After deploy, set your URL in .env:
# VITE_ARTICLE_SOURCING_URL=https://article-sourcing-xxxx-uc.a.run.app
```

For detailed GCP deployment instructions, see [GCP_DEPLOY.md](GCP_DEPLOY.md).

## Reproducible Testing Instructions

Judges can test all features of Njiapanda using the live deployment at https://njiapanda-v2.web.app or by running locally. Follow these steps to verify functionality:

### 🟢 Survivor Journey Testing (Anonymous, No Account Required)

1. **Visit the Live Platform**
   - Open https://njiapanda-v2.web.app in any modern browser
   - Verify the hero image loads, followed by the reassurance banner
   - Confirm the emotional journey flows: Recognition → Connection → Exploration → Support

2. **Test Hadithi Storytelling Features**
   - Navigate to `/hadithi` or click "Hadithi (Stories + AI)" 
   - **Read Stories**: Browse approved stories, use search/filter by abuse type
   - **Share Your Story (Standalone)**: Go to `/share` directly or via Hadithi
     - Enter text or record audio (transcribed via Gemini AI)
     - Select abuse type and language
     - Submit anonymously - verify success toast appears
   - **Generate Awareness Stories**: 
     - Click "Generate" in Hadithi section
     - Choose text-only or illustrated format
     - Verify story streams with text and (if illustrated) watercolour images
     - Check for disclaimer: "This story is fictional and created for awareness purposes only"

3. **Test Quiet Help Signal**
   - Navigate to `/signal` or click "Quiet Signal" in navigation
   - Select urgency level (Emergency/Urgent/Information)
   - Choose resource needed (safe place, legal help, etc.)
   - Select zone (Nairobi, Mombasa, etc.)
   - Toggle consent for follow-up
   - Submit signal - verify confirmation screen appears
   - Test emergency exit button (instant redirect to weather.com)

4. **Test Safety Planning**
   - Navigate to `/safety` or click "Safety Plan"
   - Complete the 6-step interactive checklist:
     - Identify safe person
     - Pack emergency bag
     - Save disguised contacts
     - Know nearest safe house
     - Set code word
     - Clear browser history
   - Verify progress tracking works
   - Test offline capability by disabling network (service worker caching)

5. **Test Resource Directory**
   - Navigate to `/resources` or click "Resources"
   - Verify Leaflet + OpenStreetMap loads with zone centres
   - Search/filter by organisation type (Legal Aid, Medical, etc.) and zone
   - Test low-bandwidth mode toggle
   - Click organisation cards to view contact details, hours, type

6. **Test Emergency Helplines**
   - Navigate to `/helpline` or click "Helpline"
   - Verify one-tap access to Kenya emergency numbers:
     - GBV Hotline (1195)
     - Childline Kenya (116)
     - Kenya Red Cross (1199)
     - Police Emergency (999)
     - FIDA Kenya
   - Test tap-to-call functionality (on mobile devices)

7. **Test Accessibility & Safety Features**
   - Verify emergency exit button is present on every page
   - Test Escape key triggers emergency exit globally
   - Check for skip link (jump to main content)
   - Verify high contrast toggle in accessibility toolbar
   - Confirm 48px+ tap targets on mobile view
   - Test simple language toggle

### 🟡 Conductor Journey Testing (Requires Test Credentials)

*Note: For judging purposes, use these test conductor credentials:*
- **Email**: `conductor@njiapanda.test`
- **Password**: `TestConductor123!`

1. **Conductor Login**
   - Navigate to `/login` or click "Login" → "Conductor Login"
   - Enter test credentials above
   - Verify successful login redirects to `/dashboard`

2. **Conductor Dashboard**
   - Verify zone-filtered interface (conductors see only their assigned zone)
   - Check for real-time signal alerts (simulate by submitting a signal as survivor)
   - Accept a test signal to create a case
   - Verify AI risk brief generation (structured assessment with risk level, abuse types, suggested resources)
   - Test adding case notes
   - Verify safe house referral with capacity status
   - Check zone metrics and active cases overview

### 🔵 Admin Journey Testing (Requires Test Credentials)

*Note: For judging purposes, use these test admin credentials:*
- **Email**: `admin@njiapanda.test`
- **Password**: `TestAdmin123!`

1. **Admin Login**
   - Navigate to `/admin/login` or use conductor login then navigate to admin
   - Enter test admin credentials above
   - Verify successful login redirects to admin portal

2. **Admin Portal (12 Tabs)**
   Test each tab briefly:
   - **Overview**: Platform metrics and analytics
   - **Signals**: View all incoming help signals across zones
   - **Conductors**: Activate/deactivate responders, view zone assignments
   - **User Roles**: Assign admin/conductor/user roles
   - **Stories**: Moderation queue - approve/flag/reject story submissions
   - **Create Story**: CMS for editorial awareness content
   - **Feedback**: Resolve user reports and bug reports
   - **Partners**: Review partnership applications
   - **Resources**: Manage verified organisations (add/edit/remove)
   - **Safe Houses**: Update capacity status per zone
   - **Alerts**: Monitor escalation triggers
   - **Audit Log**: Full action history for accountability

### 🔧 Technical Verification

1. **API Connectivity**
   - Open browser dev tools → Network tab
   - Verify Firebase Firestore calls succeed (look for `googleapis.com` requests)
   - Verify Google Gemini API calls succeed for AI features
   - Check for proper error handling and fallback behavior

2. **Performance Checks**
   - Verify PWA functionality works (installable via browser)
   - Check service worker registration (Application tab in dev tools)
   - Verify offline functionality for safety plan and core features
   - Test responsiveness across mobile/tablet/desktop viewports

3. **Security Verification**
   - Confirm no sensitive data is stored in localStorage or visible in dev tools
   - Verify emergency exit properly clears session and replaces history
   - Check that abuse type selections and story content are not logged insecurely
   - Verify Row Level Security concepts (conductors only see their zone data)

### 📱 Device Compatibility Testing

Test on multiple devices if possible:
- **Mobile**: iOS Safari, Android Chrome
- **Tablet**: iPad Chrome/Safari
- **Desktop**: Chrome, Firefox, Safari, Edge

### Expected Outcomes

All tests should pass with:
- No JavaScript errors in console
- Successful form submissions with appropriate feedback
- AI-generated content appearing within expected timeframes
- Offline functionality working for designated features
- Emergency exit functioning immediately on all pages
- Responsive layout adapting to screen sizes
- Accessible navigation via keyboard and screen readers

Judges encountering issues should check:
1. Network connectivity
2. Browser compatibility (modern browsers recommended)
3. Console errors for debugging
4. Service worker status for PWA features

The platform is designed to be resilient with graceful degradation for non-critical features.

---

## Why OpenFN & Interoperability

> *"A coordination layer that cannot talk to existing systems is just another silo."*

Kenya has shelters, legal aid organisations, and crisis hotlines. The problem is fragmentation — none of them connected, all of them working harder than they should have to.

OpenFN connects Njiapanda to the systems NGOs already use:

```
Njiapanda Case Update
        │
        ├──▶ DHIS2 (health reporting)
        ├──▶ Kobo Toolbox (NGO case management)
        ├──▶ CommCare (community health workflows)
        └──▶ Salesforce NPSP (fundraising + CRM)

De-identified · Event-driven · Open standard · No lock-in
```

If Njiapanda ends tomorrow, every organisation keeps their data, their tools, their workflows.

---

## Digital Public Goods Alignment

Njiapanda is designed to meet the [DPG Standard](https://digitalpublicgoods.net/standard/):

| Criterion | Status |
|---|---|
| ✅ Open source licence | MIT — see [LICENSE](LICENSE) |
| ✅ Clear ownership | Maintained by [@nashthecoder](https://github.com/nashthecoder) |
| ✅ Platform independence | Deployable on any Supabase + hosting stack |
| ✅ Privacy & data protection | Minimal collection, RLS, no PII in AI layer |
| ✅ Do no harm | Trauma-informed design, survivor consent throughout |
| ✅ Adherence to standards | OpenFN open standard, OpenStreetMap, open APIs |
| 🔄 DPG Nomination | Planned after pilot evaluation |

---

## Live Routes

| Route | Description | Access |
|---|---|---|
| `/` | Home — emotional journey: recognition, connection, exploration, support | 🌍 Public |
| `/self-check` | Gentle self-check — recognise abuse without pressure | 🌍 Public |
| `/hadithi` | **Hadithi** — AI storytelling (Read, Share chat, Generate illustrated) | 🌍 Public |
| `/share` | Share Your Story — text or voice submission, AI moderated | 🌍 Anonymous |
| `/signal` | Quiet help signal — anonymous, 3 fields only | 🌍 Anonymous |
| `/safety` | Interactive 6-step safety plan checklist (works offline) | 🌍 Public |
| `/resources` | Verified resource directory — Leaflet map + text fallback | 🌍 Public |
| `/helpline` | Emergency helplines — tap-to-call | 🌍 Public |
| `/contribute` | Contributions — Stripe / M-Pesa / PayPal | 🌍 Public |
| `/why` | Why Njiapanda — the personal narrative | 🌍 Public |
| `/join` | Join the network — conductors, orgs, integrations | 🌍 Public |
| `/login` | Conductor login | 🔒 |
| `/dashboard` | Conductor dashboard — zone-filtered cases, AI briefs | 🔒 Conductor |
| `/admin` | Admin portal — 12 tabs of platform management | 🔒 Admin |
| `/architecture` | System architecture diagram (exportable as PNG) | 🌍 Public |
| `POST /search-and-ingest` | Agentic survivor story search + ingest via Gemini + MongoDB (Cloud Run) | 🔒 Backend |
| `POST /ingest-url` | Ingest a specific survivor story URL — fetches page, extracts narrative (Cloud Run) | 🔒 Backend |
| `GET /articles` | Sourced story listing with filters (Cloud Run) | 🌍 Public API |
| `https://article-sourcing-1095070235711.us-central1.run.app` | Deployed Cloud Run story-sourcing service | 🌍 Public |

---

## Pilot

**Locations:** Nairobi & Limuru, Kenya
**Status:** Live — seeking conductor partners and NGO integrations

The pilot tests whether a hybrid community + digital support system can:
- Help survivors recognise abuse earlier
- Provide clear pathways to support via AI storytelling
- Enable fast, discreet connection to help
- Coordinate existing resources effectively

---

## Fork This for Your Country

This model should work in Kampala, Dar es Salaam, Kigali, and Johannesburg — without starting from scratch.

```bash
# Clone the repo
git clone https://github.com/nashthecoder/njiapanda-support-kenya.git

# Install dependencies
cd njiapanda-support-kenya
npm install

# Run locally
npm run dev
```

**To localise for your country:**
- Replace seed stories with local scenarios in your language
- Update resource directory with local verified organisations
- Update zone names to match your geography
- Adjust mobile money integration for your local provider
- Update Hadithi system prompts for local language

---

## Contributing

Contributions welcome — especially from people with lived experience, GBV practitioners, and developers in East Africa.

| Type | How |
|---|---|
| 🐛 Bug report | Open an issue with label `bug` |
| 💡 Feature idea | Open an issue with label `enhancement` |
| 🌍 Localisation | Open a PR with translated story content |
| 🏥 Add an organisation | Submit via [/join](https://njiapanda-v2.web.app/join) |
| 🤝 Become a conductor | Apply via [/join](https://njiapanda-v2.web.app/join) |
| 🔌 System integration | Book a call via [/join](https://njiapanda-v2.web.app/join) |

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.
All contributors must agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Acknowledgements

Built on International Women's Day, 8 March 2026, during the Google Gemini Live Agent Challenge.
Enhanced for the Google Gemini Live Agent Challenge with multimodal AI storytelling, AI-generated illustrated narratives, and chat-style survivor support.

Thanks to the organisations already doing this work in Kenya every day — FIDA Kenya, COVAW, Gender Violence Recovery Centre, and every community health worker, social worker, and trusted neighbour who has ever opened their door.

---

## Gemini Live Agent Challenge — Judging Criteria Compliance

### Innovation & Multimodal User Experience (40%)

| Criterion | Evidence |
|---|---|
| **Beyond Text Factor** | Hadithi breaks the text box paradigm — generates interleaved text + AI watercolour illustrations in a single SSE stream. |
| **Natural, Immersive Interaction** | Hadithi streams content progressively as it's generated. |
| **Agent "See, Hear, Speak"** | Gemini multimodal models process text, images, and audio inputs for storytelling. |
| **Category Execution** | Hadithi weaves text + images seamlessly. Stories arrive as cohesive narrative with illustrations appearing at emotional peaks. |

### Technical Implementation & Agent Architecture (30%)

| Criterion | Evidence |
|---|---|
| **Google Cloud Native** | Backend on Cloud Run, Vertex AI for Gemini API, Firebase Hosting + Firestore. All edge functions use Firebase Cloud Functions calling Gemini API directly. |
| **System Design** | Agent logic handles errors gracefully. Story generation pipeline coordinates text + image calls. Voice agent manages WebSocket connections with reconnection logic. |
| **Robustness** | System prompts for trauma-informed responses. Content moderation on all user inputs. Error handling with graceful fallbacks. |

### Demo & Presentation (30%)

| Criterion | Evidence |
|---|---|
| **The Story** | Demo video clearly defines the problem (GBV survivors can't access help at recognition) and presents the solution (multimodal storytelling + community network). |
| **The Proof** | Interactive architecture diagram at `/architecture` with PNG export. Code proof in `sauti-agent/` showing Vertex AI integration. GCP deployment proof in GCP_DEPLOY.md. |
| **The Live Factor** | Demo video shows actual software working — streaming story generation, not mockups. |

### Optional Bonus Contributions

| Bonus | Evidence |
|---|---|
| **Content Creation** | Dev.to article documenting build process with #GeminiLiveAgentChallenge hashtag |
| **Automated Deployment** | Dockerfile for Cloud Run, Firebase Hosting + Cloud Functions auto-deploy |
| **GDG Membership** | GDG Nairobi community member |

---

## Licence

MIT — fork it, localise it, deploy it.
See [LICENSE](LICENSE) for details.

---

**Njiapanda is a pilot. The network grows one conductor, one organisation, one conversation at a time.**

[🌍 njiapanda-v2.web.app](https://njiapanda-v2.web.app)

*Built with purpose · Open source · Powered by Google Gemini · Made in Kenya*
