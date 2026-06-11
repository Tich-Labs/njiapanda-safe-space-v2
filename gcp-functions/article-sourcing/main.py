"""
Story Sourcing Agent — Cloud Run
Gemini-powered agent that sources SGBV survivor stories from the web,
stores them in MongoDB, and serves them to the frontend.
"""

import os
import json
import re as re_module
import logging
from datetime import datetime
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from bson import ObjectId

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("story-sourcing")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
MONGODB_URI = os.environ.get("MONGODB_CONNECTION_STRING")
DB_NAME = os.environ.get("MONGODB_DB_NAME", "njiapanda")
COLLECTION_NAME = os.environ.get("MONGODB_COLLECTION_STORIES", "sourced_stories")

VALID_ABUSE_TYPES = [
    "physical", "sexual", "emotional", "economic", "financial abuse",
    "digital surveillance", "isolation", "coercive control", "stalking",
    "psychological abuse", "reproductive coercion", "workplace abuse", "other",
]

mongo_client = None
db = None
collection = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global mongo_client, db, collection
    logger.info("Starting story-sourcing agent...")
    if MONGODB_URI:
        mongo_client = MongoClient(MONGODB_URI, connectTimeoutMS=5000, serverSelectionTimeoutMS=5000)
        db = mongo_client[DB_NAME]
        collection = db[COLLECTION_NAME]
        logger.info(f"Connected to MongoDB: {DB_NAME}.{COLLECTION_NAME}")
    else:
        logger.warning("MONGODB_CONNECTION_STRING not set — running without persistence")
    yield
    if mongo_client:
        mongo_client.close()
        logger.info("MongoDB connection closed")


app = FastAPI(title="Njiapanda Story Sourcing Agent", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class StoryResponse(BaseModel):
    id: str
    title: str
    summary: str
    source_url: str
    source_name: str
    location: str
    abuse_type: str
    tags: list[str]
    language: str
    created_at: str


class IngestRequest(BaseModel):
    query: str = Field(default="SGBV survivor personal story Africa")
    abuse_type: Optional[str] = None
    location: Optional[str] = None


class IngestUrlRequest(BaseModel):
    url: str = Field(..., description="URL to a published survivor story")
    abuse_type: Optional[str] = None
    location: Optional[str] = None


class SubmitStoryRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="Story text")
    title: Optional[str] = None
    abuse_type: Optional[str] = None
    language: Optional[str] = "en"
    tags: Optional[list[str]] = None


def sanitize(s: Optional[str], max_len: int = 3000) -> str:
    if not s or not isinstance(s, str):
        return ""
    return s.strip()[:max_len]


def doc_to_response(doc) -> StoryResponse:
    return StoryResponse(
        id=str(doc["_id"]),
        title=doc.get("title", ""),
        summary=doc.get("summary", ""),
        source_url=doc.get("source_url", ""),
        source_name=doc.get("source_name", "Unknown"),
        location=doc.get("location", "Africa"),
        abuse_type=doc.get("abuse_type", "Other"),
        tags=doc.get("tags", []),
        language=doc.get("language", "en"),
        created_at=doc.get("created_at", ""),
    )


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "story-sourcing-agent", "mongodb": mongo_client is not None}


@app.get("/articles", response_model=list[dict])
async def list_stories(
    abuse_type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(default=50, le=100),
):
    if collection is None:
        return []

    query = {"source_type": {"$in": ["sourced_story", "user_submission"]}, "status": "approved"}
    if abuse_type:
        query["abuse_type"] = {"$regex": sanitize(abuse_type), "$options": "i"}
    if location:
        query["location"] = {"$regex": sanitize(location), "$options": "i"}
    if search:
        s = sanitize(search)
        query["$or"] = [
            {"title": {"$regex": s, "$options": "i"}},
            {"summary": {"$regex": s, "$options": "i"}},
            {"tags": {"$regex": s, "$options": "i"}},
        ]

    cursor = collection.find(query, {"_id": 1, "title": 1, "summary": 1, "source_url": 1,
                                      "source_name": 1, "location": 1, "abuse_type": 1,
                                      "tags": 1, "language": 1, "created_at": 1}) \
        .sort("created_at", -1) \
        .limit(limit)

    stories = []
    for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        stories.append(doc)

    return stories


@app.get("/articles/{story_id}")
async def get_story(story_id: str):
    if collection is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    try:
        oid = ObjectId(story_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid story ID")

    doc = collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Story not found")

    doc["id"] = str(doc.pop("_id"))
    return doc


@app.post("/search-and-ingest")
async def search_and_ingest(payload: IngestRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
    if collection is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")

    query = sanitize(payload.query)
    abuse_type_filter = sanitize(payload.abuse_type or "")
    location_filter = sanitize(payload.location or "")

    logger.info(f"Searching survivor stories: {query}")

    prompt = f"""You are a curator of personal survivor stories about gender-based violence.

Search the web for FIRST-PERSON survivor stories about real people who have experienced GBV. Look for:
- Personal narratives published by organizations (UNFPA, UNHCR, SafeAndEqual, Women's Aid, etc.)
- Survivor testimonial pages where a real person tells their own story
- "My story" or "her story" features from reputable sources
- Interviews where survivors share their personal journey

ONLY use URLs that you are confident are still active and working. Prefer URLs from:
- unfpa.org
- unhcr.org  
- safeandequal.org.au
- womensaid.org
- amnesty.org
- hrw.org
- who.int
- worldbank.org

DO NOT include:
- News articles reporting incidents or crime statistics
- Academic papers or research
- Opinion pieces or editorials
- Pages behind paywalls
- Content that is not a personal narrative from a survivor
- URLs you are not sure still work

Focus on personal journeys, healing, and survivor voices.

Topic: {query}
{"Abuse type: " + abuse_type_filter if abuse_type_filter else ""}
{"Location: " + location_filter if location_filter else ""}

For each story found, return a JSON array of objects with EXACTLY these fields:
{{
  "title": "Story title or headline",
  "source_url": "Full URL",
  "source_name": "Organization name (e.g. 'UNFPA', 'UNHCR', 'SafeandEqual')",
  "location": "Country or region (e.g. 'Kenya', 'Uganda', 'Global')",
  "summary": "2-3 sentence summary of the survivor's personal journey",
  "abuse_type": "Type of abuse described",
  "tags": ["up to", "5", "relevant", "tags"]
}}

Return a valid JSON array only, no markdown, no explanation. Use simple English. Minimum 3 stories if possible."""

    try:
        response = model.generate_content(prompt, generation_config={"temperature": 0.3, "max_output_tokens": 4096})
        text = response.text
        json_match = re_module.search(r"\[[\s\S]*\]", text)
        if not json_match:
            raise ValueError("No JSON array found in AI response")
        stories_data = json.loads(json_match.group(0))
    except Exception as e:
        logger.error(f"AI parsing failed: {e}")
        raise HTTPException(status_code=500, detail=f"AI parsing failed: {str(e)}")

    validated = []
    for s in stories_data:
        if not s.get("title") or not s.get("source_url"):
            continue

        url = sanitize(s.get("source_url", ""))
        try:
            check = requests.head(url, timeout=8, allow_redirects=True, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            if check.status_code >= 400:
                logger.warning(f"Skipping broken URL ({check.status_code}): {url[:80]}")
                continue
        except requests.RequestException:
            logger.warning(f"Skipping unreachable URL: {url[:80]}")
            continue

        abuse_type = sanitize(s.get("abuse_type", ""))
        if abuse_type.lower() not in VALID_ABUSE_TYPES:
            abuse_type = "Other"

        validated.append({
            "title": sanitize(s.get("title", "")),
            "summary": sanitize(s.get("summary", "")),
            "text": sanitize(s.get("summary", "")),
            "source_url": url,
            "source_name": sanitize(s.get("source_name", "Unknown")),
            "source_name": sanitize(s.get("source_name", "Unknown")),
            "location": sanitize(s.get("location", "Africa")),
            "abuse_type": abuse_type,
            "tags": [sanitize(t) for t in s.get("tags", []) if sanitize(t)],
            "language": "en",
            "source": "sourced_story",
            "source_type": "sourced_story",
            "resonance_count": 0,
            "created_at": datetime.utcnow().isoformat(),
        })

    if not validated:
        return {"success": True, "articles_count": 0, "message": "No valid stories found"}

    result = collection.insert_many(validated)
    logger.info(f"Stored {len(result.inserted_ids)} survivor stories via MongoDB")

    return {"success": True, "articles_count": len(result.inserted_ids)}


@app.post("/submit-story")
async def submit_story(payload: SubmitStoryRequest):
    if collection is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    text = sanitize(payload.text, 10000)
    if not text.strip():
        raise HTTPException(status_code=400, detail="Story text is required")

    title = sanitize(payload.title or text.split(".")[0][:120], 200)
    abuse_type = sanitize(payload.abuse_type or "", 50)
    language = sanitize(payload.language or "en", 10)
    tags = [sanitize(t, 50) for t in (payload.tags or []) if sanitize(t, 50)]

    if abuse_type and abuse_type.lower() not in VALID_ABUSE_TYPES:
        abuse_type = "Other"

    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
        review_prompt = f"""Review the following survivor story submission.

Return a JSON object with EXACTLY these fields:
{{
  "safe": true or false,
  "abuse_type": "Type of abuse described",
  "summary": "One-sentence summary",
  "tags": ["up to", "3", "relevant", "tags"],
  "reason": "If unsafe, explain briefly why in 5 words or fewer"
}}

Rules:
- The story MUST be about gender-based violence or a personal struggle.
- Reject if it contains hate speech, spam, self-harm details, or is off-topic.
- Be inclusive — allow any GBV experience, even if described imperfectly.

Story:
{text[:4000]}"""

        try:
            response = model.generate_content(review_prompt, generation_config={"temperature": 0.1, "max_output_tokens": 1024})
            json_match = re_module.search(r"\{[\s\S]*\}", response.text)
            if json_match:
                review = json.loads(json_match.group(0))
                if not review.get("safe", True):
                    logger.warning(f"Story rejected by safety review: {review.get('reason', 'No reason')}")
                    raise HTTPException(status_code=400, detail="Story could not be published. Please try again with different content.")
                if not abuse_type:
                    abuse_type = sanitize(review.get("abuse_type", ""), 50)
                if not tags:
                    tags = [sanitize(t, 50) for t in review.get("tags", []) if sanitize(t, 50)]
                summary = sanitize(review.get("summary", text[:200]), 500)
            else:
                summary = text[:200]
        except Exception as e:
            logger.error(f"Safety review failed: {e}")
            if "400" in str(e):
                raise
            summary = text[:200]
    else:
        summary = text[:200]

    story_doc = {
        "title": title,
        "summary": summary,
        "text": text,
        "source_url": "",
        "source_name": "Anonymous",
        "location": "Africa",
        "abuse_type": abuse_type or "Other",
        "tags": tags or [],
        "language": language,
        "source": "user_submission",
        "source_type": "user_submission",
        "status": "approved",
        "resonance_count": 0,
        "created_at": datetime.utcnow().isoformat(),
    }

    result = collection.insert_one(story_doc)
    story_doc["id"] = str(result.inserted_id)
    logger.info(f"User story submitted: {title[:60]}")

    return {"success": True, "story": story_doc}


@app.post("/ingest-url")
async def ingest_story_url(payload: IngestUrlRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
    if collection is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    url = sanitize(payload.url)
    logger.info(f"Ingesting story URL: {url}")

    try:
        resp = requests.get(url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        })
        resp.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {str(e)}")

    soup = BeautifulSoup(resp.text, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()

    page_text = soup.get_text(separator=" ", strip=True)
    page_text = re_module.sub(r"\s+", " ", page_text)[:8000]

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""You are a curator of survivor stories. Read the following webpage content and extract the survivor's personal story.

Return a JSON object with EXACTLY these fields:
{{
  "title": "A compelling title for this survivor's story",
  "summary": "2-4 sentence summary of the survivor's personal journey — their experience, their strength, their healing",
  "source_name": "Organization or publication name",
  "location": "Country or region mentioned",
  "abuse_type": "Type of abuse described — choose from: {', '.join(VALID_ABUSE_TYPES)}",
  "tags": ["up to", "5", "relevant", "tags"]
}}

Use simple English. Short sentences. Avoid big words.
Only return valid JSON, no markdown, no explanation.

Webpage content:
{page_text[:7000]}"""

    try:
        response = model.generate_content(prompt, generation_config={"temperature": 0.2, "max_output_tokens": 2048})
        text = response.text
        json_match = re_module.search(r"\{[\s\S]*\}", text)
        if not json_match:
            raise ValueError("No JSON object found in AI response")
        story_data = json.loads(json_match.group(0))
    except Exception as e:
        logger.error(f"AI parsing of URL failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse story: {str(e)}")

    abuse_type = sanitize(story_data.get("abuse_type", ""))
    if abuse_type.lower() not in VALID_ABUSE_TYPES:
        abuse_type = "Other"

    story_doc = {
        "title": sanitize(story_data.get("title", "Untitled Story")),
        "summary": sanitize(story_data.get("summary", "")),
        "text": sanitize(story_data.get("summary", "")),
        "source_url": url,
        "source_name": sanitize(story_data.get("source_name", "Unknown")),
        "location": sanitize(story_data.get("location", "Africa")),
        "abuse_type": abuse_type,
        "tags": [sanitize(t) for t in story_data.get("tags", []) if sanitize(t)],
        "language": "en",
        "source": "sourced_story",
        "source_type": "sourced_story",
        "resonance_count": 0,
        "created_at": datetime.utcnow().isoformat(),
    }

    result = collection.insert_one(story_doc)
    story_doc["id"] = str(result.inserted_id)
    logger.info(f"Ingested story from URL: {url}")

    return {"success": True, "story": story_doc}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8080"))
    uvicorn.run(app, host="0.0.0.0", port=port)
