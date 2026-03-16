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
| 🟢 **Survivor** | Anonymous visitor | Reads a story, recognises abuse, speaks to Hadithi (AI companion), submits a quiet signal, finds real organisations nearby, taps to call. No account. No trace. |
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
Interactive storytelling engine combining **three modes** for GBV awareness education:

#### Read Stories
- Browse approved community and AI-generated stories
- Search and filter by abuse type
- "This sounds familiar" resonance button (anonymous)
- AI-generated stories clearly labelled

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
- **Bilingual** — English and Kiswahili
- **Disclaimer** — clear labelling that stories are fictional and for awareness only

**Tech:** Gemini 2.5 Flash (text), Gemini 3.1 Flash Image Preview (images), Firebase Cloud Functions, SSE streaming.

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

### 🟢 Journey 1: Survivor

```
Landing Page
    │
    ├──▶ 📖 Hadithi (Stories + AI)
    │         │
    │         ├──▶ Read stories ──▶ "This sounds familiar" ──▶ Recognise abuse
    │         │
    │         ├──▶ Share yours ──▶ Chat-style AI conversation
    │         │         │          Type or record voice
    │         │         │          AI deepening follow-ups
    │         │         └──▶ Submit anonymously
    │         │
    │         └──▶ Generate ──▶ AI-illustrated awareness stories
    │                          Text + watercolour images
    │
    ├──▶ 📡 Quiet Signal ──▶ Select urgency + resources
    │         │                No login, no trace
    │         └──▶ Confirmed ──▶ Conductor notified
    │
    ├──▶ 🛡️ Safety Plan ──▶ 6-step checklist (works offline)
    │
    ├──▶ 🗺️ Resources ──▶ Map + directory of verified orgs
    │
    ├──▶ 📞 Helpline ──▶ Tap-to-call emergency numbers
    │
    └──▶ 🚪 Emergency Exit (any time) ──▶ weather.com
```

**Key principle:** No account. No trace. Every action is anonymous.

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
       │ • story-deepen (chat follow-ups)          │
       │ • transcribe-audio (voice transcription) │
       │ • moderate-story (content safety)         │
       │ • ai-brief (risk assessment)             │
       │ • create-checkout (Stripe)                │
       │ • stripe-webhook (payments)               │
       └────────────────────┬──────────────────────┘
                           │
       ┌────────────────────▼──────────────────────┐
       │     Google Gemini API                    │
       │                                           │
       │ • gemini-2.5-flash (stories, transcription)│
       │ • gemini-2.5-flash-lite (moderation)    │
       │ • gemini-3-flash-preview (risk briefs)  │
       │ • gemini-3.1-flash-image-preview (images)│
       └───────────────────────────────────────────┘
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

### GCP Cloud Run (Hadithi Agent)

| Function | Purpose | Tech |
|---|---|---|
| `hadithi-gateway` | Python FastAPI backend for story generation with ADK tools | Python + FastAPI + Google ADK |

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

- Node.js 18+ or Bun
- Firebase project (for Hosting, Firestore, Auth, Cloud Functions)
- Google AI Studio API key (for Gemini)

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

For detailed GCP deployment instructions, see [GCP_DEPLOY.md](GCP_DEPLOY.md).

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
| `/` | Home — hero, quick actions, trust banner | 🌍 Public |
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
