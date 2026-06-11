# Changelog

## 0.2.0 (2026-05-19)

### Added
- Voice transcription via Gemini 2.5 Flash native audio (replaced Google Cloud Speech-to-Text) — AudioRecorder sends audio inline to Gemini, no extra API key needed
- `POST /submit-story` endpoint — user-submitted stories stored in MongoDB with AI safety moderation
- User story persistence — Share tab stories now saved to both localStorage and MongoDB (appear immediately in Read tab)
- `GET /articles` now returns both sourced stories and approved user submissions

### Changed
- AudioRecorder transcription switched from `speech.googleapis.com` REST API to `@google/generative-ai` SDK with `inlineData` audio
- Backend collection query filter widened from `source_type: "sourced_story"` to `source_type: ["sourced_story", "user_submission"]`

## 0.1.0 (2026-03-08)

Initial release for the Google Gemini Live Agent Challenge.

### Features
- Self-check — gentle abuse recognition tool
- Hadithi — AI-powered storytelling (Read, Share, Generate)
- Quiet Signal — anonymous distress signal to responders
- Safety Planning — interactive checklist (works offline)
- Resource Directory — verified organisations with zone map
- Emergency Helplines — one-tap access to Kenya numbers
- Conductor Dashboard — zone-filtered case management with AI risk briefs
- Admin Portal — 12-tab platform management
- Sourced Survivor Stories — agent-powered curation via MongoDB + Cloud Run
- Emergency Exit — instant safe close on every page
