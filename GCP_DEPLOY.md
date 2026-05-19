# GCP Deployment Guide

## Gemini Live Agent Challenge — Proof of Google Cloud Deployment

This document provides the step-by-step instructions to deploy and verify the Njiapanda backend on Google Cloud, demonstrating compliance with the challenge requirement:

> *"Include Proof of Google Cloud Deployment: You must demonstrate that the backend is running on Google Cloud with a short recording (separate from your demo) proving your Project's backend is running on Google Cloud."*

---

## Deploy Functions to Google Cloud Run

### Prerequisites

1. Google Cloud SDK installed (`gcloud`)
2. A GCP project with billing enabled
3. Gemini API enabled in Google AI Studio
4. Docker installed (for local testing)

### Steps

#### 1. Set your project

```bash
gcloud config set project YOUR_PROJECT_ID
```

#### 2. Enable required APIs

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
```

#### 3. Deploy article-sourcing agent (Cloud Run)

```bash
cd gcp-functions/article-sourcing

gcloud run deploy article-sourcing \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_CONNECTION_STRING=$MONGODB_CONNECTION_STRING,GEMINI_API_KEY=$GEMINI_API_KEY"

# Get the service URL
gcloud run services describe article-sourcing --region us-central1 --format="value(status.url)"
```

Set the returned URL in `.env`:
```
VITE_ARTICLE_SOURCING_URL=https://article-sourcing-xxxx-uc.a.run.app
```

#### 4. Deploy Firebase Cloud Functions

```bash
firebase deploy --only functions
```

#### 5. Deploy hadithi-stream to Cloud Run (GCP)

```bash
cd gcp-functions/hadithi-stream

gcloud run deploy hadithi-stream \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=AIza.your_google_ai_studio_key
```

#### 6. Deploy sauti-session & sauti-complete (voice AI)

```bash
cd gcp-functions/sauti-session

gcloud run deploy sauti-gateway \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_AI_STUDIO_API_KEY=AIza.your_key,SUPABASE_URL=your_url,SUPABASE_SERVICE_ROLE_KEY=your_key
```

#### 7. Get the function URLs

```bash
gcloud run services describe article-sourcing --region us-central1 --format="value(status.url)"
gcloud run services describe hadithi-stream --region us-central1 --format="value(status.url)"
gcloud run services describe sauti-gateway --region us-central1 --format="value(status.url)"
```

#### 8. Update your .env file

```
VITE_ARTICLE_SOURCING_URL=https://article-sourcing-xxxx-uc.a.run.app
VITE_GCP_FUNCTION_URL=https://sauti-gateway-xxxx-uc.a.run.app
```

### MongoDB Atlas Setup

For the MCP-powered article sourcing feature, you also need MongoDB Atlas:

1. Create a free M0 cluster at https://mongodb.com/atlas
2. Set `MONGODB_CONNECTION_STRING` in your Cloud Run service environment variables
3. See `MCP_SETUP.md` for full setup instructions

---

## Proof of Deployment — Recording Instructions

To create the required proof-of-deployment recording:

### 1. Open Google Cloud Console

Navigate to: https://console.cloud.google.com/run

### 2. Record the following:

1. **Services List** — Show the list of deployed Cloud Run services
2. **Service Details** — Click on a service (e.g., `hadithi-stream`) and show:
   - Status (Ready)
   - Region (us-central1)
   - URL endpoint
   - Recent revisions
3. **Logs** — Click "Logs" tab and show recent requests
4. **Metrics** — Click "Metrics" tab to show traffic graphs

### 3. Sample Recording Script

```
[Open GCP Console - Cloud Run]
"Here you can see our two Cloud Run services deployed:
- hadithi-stream (story generation)
- sauti-gateway (voice AI agent)

Both are running in us-central1 with the status 'Ready'."

[Click on hadithi-stream]
"This is our story generation service. You can see it's actively
serving requests. The URL is hadithi-stream-xxx-uc.a.run.app"

[Click Logs]
"These are the live logs showing recent requests being processed
by the Gemini-powered story generation service."

[Open Vertex AI Console]
"Additionally, all our Gemini API calls go through Vertex AI
for enterprise-grade security and monitoring."
```

---

## Testing locally

```bash
# Hadithi
cd gcp-functions/hadithi-stream
pip install -r requirements.txt
export GEMINI_API_KEY=your_key
python main.py
```

---

## Environment Variables Reference

| Variable | Required | For |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Gemini API (story generation, article parsing, moderation) |
| `SUPABASE_URL` | Yes | Supabase project URL (signals, cases, etc.) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (for backend calls) |
| `GOOGLE_CLOUD_PROJECT_ID` | Yes | GCP project ID |
| `GOOGLE_CLOUD_LOCATION` | No | Vertex AI location (default: us-central1) |
| `MONGODB_CONNECTION_STRING` | Yes (for articles) | MongoDB Atlas connection string for sourced articles |
| `MONGODB_DB_NAME` | No | Database name (default: `njiapanda`) |
| `MONGODB_COLLECTION_ARTICLES` | No | Collection name (default: `sourced_articles`) |