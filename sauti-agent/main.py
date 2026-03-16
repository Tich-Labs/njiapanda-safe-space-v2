"""
Sauti ADK Agent - Runs on Cloud Run
Wraps Gemini Live and exposes triage_call and lookup_service tools.
"""

import os
import json
import asyncio
from typing import Any, AsyncGenerator, Optional
from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import google.auth
import google.auth.transport.requests
from google.generativeai import GenerativeModel
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import vertexai
from vertexai import agent_models

# Initialize Vertex AI
PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT_ID", "njiapanda-safe-space")
LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")
vertexai.init(project=PROJECT_ID, location=LOCATION)

app = FastAPI(title="Sauti ADK Agent")

# Kenya GBV Service Directory (mock - replace with actual database)
SERVICE_DIRECTORY = {
    "nairobi": [
        {"name": "Gender Based Violence Recovery Centre", "phone": "+254-20-271-6000", "type": "medical"},
        {"name": "Kenya Women Microfinance Bank Support", "phone": "+254-20-222-2000", "type": "financial"},
        {"name": " Nairobi Women's Hospital", "phone": "+254-20-271-1200", "type": "medical"},
        {"name": "Faith-based Counseling Services", "phone": "+254-20-250-0000", "type": "counseling"},
    ],
    "kisumu": [
        {"name": "Kisumu Gender Office", "phone": "+254-57-202-0000", "type": "government"},
        {"name": "Jaramogi Oginga Odinga Hospital", "phone": "+254-57-202-2000", "type": "medical"},
    ],
    "mombasa": [
        {"name": "Mombasa Gender Office", "phone": "+254-41-231-0000", "type": "government"},
        {"name": "Coast General Hospital GBV Unit", "phone": "+254-41-231-5000", "type": "medical"},
    ],
    "default": [
        {"name": "National GBV Hotline", "phone": "1190 (toll-free)", "type": "hotline"},
        {"name": "Police GBV Unit", "phone": "999", "type": "police"},
    ]
}

class TriagePayload(BaseModel):
    urgency: str = "medium"
    zone: str = "unspecified"
    resource_needed: str = "general_support"

class LookupRequest(BaseModel):
    zone: str
    service_type: Optional[str] = None

def get_access_token() -> str:
    """Get OAuth access token for Gemini Live API."""
    credentials, _ = google.auth.default(
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    auth_request = google.auth.transport.requests.Request()
    credentials.refresh(auth_request)
    return credentials.token

@app.post("/session")
async def create_session(request: Request):
    """Create a Gemini Live session and return WebSocket URL + auth."""
    body = await request.json()
    language = body.get("language", "en")
    zone = body.get("zone", "unspecified")
    
    try:
        access_token = get_access_token()
        
        # Create agent session via ADK
        agent = agent_models.AgentModel(
            model="gemini-2.0-flash-live",
            project=PROJECT_ID,
            location=LOCATION,
        )
        
        session = agent.create_session(
            generation_config={
                "response_modalities": ["AUDIO", "TEXT"],
                "speech_config": {
                    "voice_config": {
                        "prebuilt_voice_config": {"voice_name": "Aoede"}
                    }
                }
            }
        )
        
        # For now, return direct Gemini Live WebSocket URL
        # ADK wraps this - in production use agent session WebSocket
        ws_url = f"wss://{LOCATION}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent"
        
        return JSONResponse({
            "wsUrl": ws_url,
            "accessToken": access_token,
            "sessionId": session.name,
            "model": f"projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/gemini-2.0-flash-live",
            "expiresAt": session.expires_at,
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/triage")
async def triage_call(payload: TriagePayload):
    """Tool: Set urgency/zone/resource from conversation analysis."""
    services = []
    
    if payload.zone.lower() in SERVICE_DIRECTORY:
        services = SERVICE_DIRECTORY[payload.zone.lower()]
    else:
        services = SERVICE_DIRECTORY["default"]
    
    if payload.resource_needed and payload.resource_needed != "general_support":
        services = [s for s in services if s["type"] == payload.resource_needed]
    
    return {
        "urgency": payload.urgency,
        "zone": payload.zone,
        "resource_needed": payload.resource_needed,
        "recommended_services": services[:3],
    }

@app.post("/lookup")
async def lookup_service(request: LookupRequest):
    """Tool: Query GBV service directory."""
    zone_key = request.zone.lower() if request.zone.lower() in SERVICE_DIRECTORY else "default"
    services = SERVICE_DIRECTORY.get(zone_key, SERVICE_DIRECTORY["default"])
    
    if request.service_type:
        services = [s for s in services if s["type"] == request.service_type]
    
    return {
        "zone": request.zone,
        "service_type": request.service_type,
        "services": services,
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "sauti-adk-agent"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
