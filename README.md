# Njiapanda — Paths to Safety

**A community-led GBV survivor support platform for Kenya, powered by Google Gemini Live AI**

*Njiapanda* is Swahili for **crossroads** — the moment a person stops and asks:
*is this normal? Is this love? Or is this something I need to name?*

[![License: MIT](https://img.shields.io/badge/License-MIT-2D8A77.svg)](LICENSE)
[![Live Platform](https://img.shields.io/badge/Platform-Live-C4871A.svg)](https://njiapanda-support-kenya.lovable.app)
[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-E9A83A.svg)](https://lovable.dev)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%20Live-4285F4.svg)](https://ai.google.dev)
[![Google Cloud](https://img.shields.io/badge/Cloud-Google%20Cloud-4285F4.svg)](https://cloud.google.com)
[![DPG Aligned](https://img.shields.io/badge/DPG-Aligned-0F3D34.svg)](https://digitalpublicgoods.net)

[🌍 Live Platform](https://njiapanda-support-kenya.lovable.app) · [📖 Why Njiapanda](https://njiapanda-support-kenya.lovable.app/why) · [🤝 Join the Network](https://njiapanda-support-kenya.lovable.app/join) · [💬 LinkedIn](https://www.linkedin.com/in/naijeriatoweett/)

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
| 🟢 **Survivor** | Anonymous visitor | Reads a story, recognises abuse, speaks to Sauti (AI voice companion), submits a quiet signal, finds real organisations nearby, taps to call. No account. No trace. |
| 🟡 **Conductor** | Trained community responder | Receives signals, assesses risk with AI support, coordinates safe house placement and referrals. |
| 🔵 **Admin** | Platform manager | Manages conductors, moderates stories, monitors escalation alerts, reviews metrics. |

---

## Features & Functionalities

### 🎙️ Sauti — Real-Time AI Voice Companion (Gemini Live API)
The centrepiece of Njiapanda. Sauti ("voice" in Swahili) is a **real-time multimodal AI agent** powered by **Google Gemini 2.0 Flash Live API** that provides:
- **Real-time voice conversation** — survivors speak in English or Kiswahili and receive instant spoken responses
- **Trauma-informed AI counsellor** — trained system prompt for empathetic, non-judgmental support
- **Voice interruption handling** — natural turn-taking with turn-complete signals
- **Vision input** — optional camera toggle sends periodic snapshots for visual context (e.g. showing injuries)
- **Live waveform visualiser** — real-time audio feedback during conversation
- **No recordings saved** — session-only, privacy by design
- **Consent-first** — clear explanation before any session begins
- **Emergency detection** — automatic escalation when danger is identified
- **Bilingual** — full UI and AI in English and Kiswahili

**Tech:** WebSocket connection to Gemini BidiGenerateContent API via Google AI Studio / Vertex AI, with PCM16 audio streaming at 16kHz.

### 📖 Hadithi — AI-Powered Awareness Stories
Interactive storytelling engine for GBV awareness education:
- **AI-generated stories** — users describe a scenario and receive illustrated awareness narratives
- **SSE streaming** — stories appear progressively as they're generated
- **Multimodal output** — text, AI-generated images, and audio blocks
- **Bilingual** — English and Kiswahili
- **Shareable** — copy and share stories for community awareness
- **Disclaimer** — clear labelling that stories are fictional and for awareness only

### 📡 Quiet Help Signal
Anonymous, no-login distress signal with:
- **3-level urgency** — Emergency (in danger now), Urgent (need help soon), Information
- **Resource selection** — safe place, legal help, counselling, transport, medical
- **Zone targeting** — Nairobi, Mombasa, Kisumu, Nakuru, Eldoret
- **Consent toggle** — explicit opt-in for follow-up
- **Calm confirmation** — reassuring screen after submission
- **Emergency exit** — instant safe close to weather.com

### 💬 Share Your Story
Anonymous survivor story submission:
- **Text or voice** — write or record audio (transcribed via Gemini AI)
- **Abuse type tagging** — Physical, Sexual, Emotional, Economic, Other
- **Language selection** — English, Kiswahili, Sheng
- **AI moderation** — automatic content safety screening via Gemini (flags PII, unsafe advice, gratuitous content)
- **No account needed** — fully anonymous

### 📚 Story Library
Community story collection for recognition and solidarity:
- **Bilingual stories** — English and Kiswahili with simple-language variants
- **Search & filter** — by abuse type, with real-time search
- **Resonance** — "This sounds familiar" button (anonymous, non-identifying)
- **Help CTA** — every story includes a "I need help" path to resources
- **Pagination** — infinite scroll with 12-story batches

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
    ├──▶ 📖 Story Library ──▶ "This sounds familiar" ──▶ Recognise abuse
    │         │
    │         └──▶ "I need help" ──▶ Resources / Signal
    │
    ├──▶ 🎙️ Sauti (Voice AI) ──▶ Speak in Swahili/English
    │         │                      Real-time conversation
    │         │                      Trauma-informed support
    │         └──▶ Emergency detected ──▶ Helpline / Signal
    │
    ├──▶ 📡 Quiet Signal ──▶ Select urgency + resources
    │         │                No login, no trace
    │         └──▶ Confirmed ──▶ Conductor notified
    │
    ├──▶ 💬 Share Story ──▶ Text or voice recording
    │         │               AI transcription + moderation
    │         └──▶ Published anonymously in Story Library
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
| **AI Voice Agent** | [Google Gemini 2.0 Flash Live API](https://ai.google.dev) | Real-time multimodal voice conversation via WebSocket (BidiGenerateContent) |
| **AI Moderation** | [Google Gemini](https://ai.google.dev) via Lovable AI Gateway | Content safety screening for story submissions |
| **AI Risk Assessment** | [Google Gemini](https://ai.google.dev) via Lovable AI Gateway | Structured risk briefs for conductors (tool calling) |
| **AI Transcription** | [Google Gemini](https://ai.google.dev) via Lovable AI Gateway | Voice-to-text for story submissions |
| **AI Storytelling** | [Google Gemini / ADK](https://ai.google.dev) | Hadithi awareness story generation with images |
| Frontend + Build | [Lovable.ai](https://lovable.dev) + React + Vite + Tailwind | Mobile-first, trauma-informed UI |
| Database + Auth | [Supabase](https://supabase.com) (via Lovable Cloud) | Postgres, RLS by role and zone, Realtime |
| Backend Functions | Supabase Edge Functions (Deno) | 7 serverless functions for AI, payments, notifications |
| Interoperability | [OpenFN](https://openfn.org) | Bridge to DHIS2, Kobo, CommCare, Salesforce NPSP |
| Maps | [Leaflet](https://leafletjs.com) + [OpenStreetMap](https://openstreetmap.org) | 100% open source, zone-level only |
| Payments | Stripe + M-Pesa + PayPal | M-Pesa from day one — built for Kenya |
| SMS (planned) | [Africa's Talking](https://africastalking.com) | Low-data and feature phone access |

### Google Cloud Services Used

| Service | Usage |
|---|---|
| **Gemini 2.0 Flash Live API** | Sauti real-time voice agent (WebSocket, BidiGenerateContent) |
| **Gemini 2.5 Flash** | Audio transcription for voice stories |
| **Gemini 2.5 Flash Lite** | Story content moderation |
| **Gemini 3 Flash Preview** | AI risk assessment briefs for conductors |
| **Google AI Studio** | API key authentication for Gemini models |
| **Vertex AI** (fallback) | Alternative auth path via service account |

---

## Edge Functions

| Function | Purpose | AI Model |
|---|---|---|
| `sauti-session` | Provisions WebSocket credentials for Gemini Live voice sessions | Gemini 2.0 Flash Live |
| `sauti-complete` | Post-session processing and signal creation | — |
| `hadithi-stream` | SSE proxy to Hadithi story generation agent | Gemini (via ADK) |
| `transcribe-audio` | Voice recording → text transcription | Gemini 2.5 Flash |
| `moderate-story` | AI content safety screening for submissions | Gemini 2.5 Flash Lite |
| `ai-brief` | Structured risk assessment for conductors | Gemini 3 Flash Preview |
| `forward-signal` | Webhook relay to OpenFN for external integrations | — |
| `notify-feedback` | Feedback notification routing | — |
| `create-checkout` | Stripe checkout session creation | — |
| `stripe-webhook` | Stripe payment confirmation handling | — |

---

## Data Model

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
- 🤖 **AI output is session-only** — risk briefs and voice conversations are never stored
- 🎙️ **No audio recorded** — Sauti voice sessions are real-time only, no recordings saved
- 📍 **Zone-level display only** — exact safe house addresses never surface in the UI
- 🗑️ **Minimal data collection** — only what is necessary for the referral
- ⏱️ **Idle timeout** — auto-clear session after inactivity for logged-in users
- 🔍 **AI moderation** — automatic PII detection and content safety screening on story submissions

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
| `/` | Home — hero, 7 quick actions, trust banner | 🌍 Public |
| `/sauti` | **Sauti** — real-time AI voice companion (Gemini Live) | 🌍 Public |
| `/hadithi` | **Hadithi** — AI-powered awareness storytelling | 🌍 Public |
| `/stories` | Story library — bilingual stories, search + filter + resonance | 🌍 Public |
| `/signal` | Quiet help signal — anonymous, 3 fields only | 🌍 Anonymous |
| `/share` | Share a story — text + voice, AI moderated | 🌍 Anonymous |
| `/safety` | Interactive 6-step safety plan checklist (works offline) | 🌍 Public |
| `/resources` | Verified resource directory — Leaflet map + text fallback | 🌍 Public |
| `/helpline` | Emergency helplines — tap-to-call | 🌍 Public |
| `/contribute` | Contributions — Stripe / M-Pesa / PayPal | 🌍 Public |
| `/why` | Why Njiapanda — the personal narrative | 🌍 Public |
| `/join` | Join the network — conductors, orgs, integrations | 🌍 Public |
| `/dashboard` | Conductor dashboard — zone-filtered cases, AI briefs | 🔒 Conductor |
| `/admin` | Admin portal — 12 tabs of platform management | 🔒 Admin |
| `/architecture` | System architecture diagram | 🌍 Public |

---

## Pilot

**Locations:** Nairobi & Limuru, Kenya
**Status:** Live — seeking conductor partners and NGO integrations

The pilot tests whether a hybrid community + digital support system can:
- Help survivors recognise abuse earlier
- Provide clear pathways to support via AI voice companion
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
- Update Sauti system prompts for local language

---

## Contributing

Contributions welcome — especially from people with lived experience, GBV practitioners, and developers in East Africa.

| Type | How |
|---|---|
| 🐛 Bug report | Open an issue with label `bug` |
| 💡 Feature idea | Open an issue with label `enhancement` |
| 🌍 Localisation | Open a PR with translated story content |
| 🏥 Add an organisation | Submit via [/join](https://njiapanda-support-kenya.lovable.app/join) |
| 🤝 Become a conductor | Apply via [/join](https://njiapanda-support-kenya.lovable.app/join) |
| 🔌 System integration | Book a call via [/join](https://njiapanda-support-kenya.lovable.app/join) |

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.
All contributors must agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Acknowledgements

Built on International Women's Day, 8 March 2026, during the Lovable [#SheBuilds](https://lovable.dev) hackathon.
Enhanced for the Google Gemini Live Agent hackathon with real-time multimodal voice AI.

Thanks to the organisations already doing this work in Kenya every day — FIDA Kenya, COVAW, Gender Violence Recovery Centre, and every community health worker, social worker, and trusted neighbour who has ever opened their door.

---

## Licence

MIT — fork it, localise it, deploy it.
See [LICENSE](LICENSE) for details.

---

**Njiapanda is a pilot. The network grows one conductor, one organisation, one conversation at a time.**

[🌍 njiapanda-support-kenya.lovable.app](https://njiapanda-support-kenya.lovable.app)

*Built with purpose · Open source · Powered by Google Gemini · Made in Kenya*
