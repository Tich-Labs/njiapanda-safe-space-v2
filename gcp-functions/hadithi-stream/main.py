import os
import json
from flask import Flask, Request, Response, stream_with_context
from google import genai
from google.genai import types

app = Flask(__name__)

NAMES_FEMALE = ["Wanjiku", "Akinyi", "Fatuma", "Njeri", "Atieno", "Rehema", "Zawadi", "Nyambura", "Halima", "Zuri", "Makena", "Nyokabi", "Sifa", "Baraka", "Neema"]
NAMES_MALE = ["Otieno", "Kamau", "Juma", "Ochieng", "Mwangi", "Hassan", "Kipchoge", "Barasa", "Mutua", "Ndung'u", "Abdi", "Wekesa", "Karanja", "Ruto", "Abubakar"]
LOCATIONS = ["Kisumu", "Mombasa", "Nakuru", "Nairobi's Eastlands", "Eldoret", "Malindi", "Nyeri", "Machakos", "Kilifi", "Garissa", "Thika", "Kitale", "Kakamega", "Lamu", "Nanyuki"]
RELATIONSHIPS = ["partner", "husband", "boyfriend", "uncle", "employer", "in-law", "neighbour", "colleague", "elder", "family friend"]
PERSPECTIVES = ["first-person", "third-person"]
SETTINGS = ["rural village", "urban apartment", "market stall", "school compound", "small business", "church community", "hospital ward", "fishing village", "tea plantation", "matatu route"]

ABUSE_TYPE_MAP = {
    "emotional": "emotional abuse and psychological manipulation",
    "economic": "economic abuse and financial control",
    "physical": "physical violence",
    "sexual": "sexual coercion",
    "isolation": "social isolation and control",
    "digital": "digital surveillance and technology-facilitated abuse",
    "coercive": "coercive control patterns",
    "stalking": "stalking and harassment",
    "spiritual": "spiritual abuse and religious manipulation",
    "reproductive": "reproductive coercion",
    "workplace": "workplace harassment and abuse of power",
    "elder": "elder abuse",
    "financial": "financial abuse and economic control",
    "psychological": "psychological abuse and manipulation",
    "humiliation": "public humiliation and shaming",
    "child": "child marriage and forced unions",
}

def pick(arr):
    import random
    return arr[random.randint(0, len(arr) - 1)]

def detect_abuse_type(prompt: str) -> str:
    lower = prompt.lower()
    for key, value in ABUSE_TYPE_MAP.items():
        if key in lower:
            return value
    return list(ABUSE_TYPE_MAP.values())[0]

def generate_metadata():
    return {
        "type": "meta",
        "abuseType": detect_abuse_type(""),
        "protagonist": pick(NAMES_FEMALE),
        "location": pick(LOCATIONS),
    }

@app.route('/', methods=['POST'])
def hadithi_stream():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        language = data.get('language', 'en')
        format_type = data.get('format', 'illustrated')
        
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            return json.dumps({"error": "GEMINI_API_KEY not set"}), 500, {'Content-Type': 'application/json'}
        
        client = genai.Client(api_key=api_key)
        
        protagonist = pick(NAMES_FEMALE)
        abuser = pick(NAMES_MALE)
        location = pick(LOCATIONS)
        relationship = pick(RELATIONSHIPS)
        perspective = pick(PERSPECTIVES)
        setting = pick(SETTINGS)
        abuse_type = detect_abuse_type(prompt)
        
        perspective_instruction = f"Write in first person as {protagonist}." if perspective == "first-person" else f"Write in third person about {protagonist}."
        
        image_instruction = ""
        if format_type == "illustrated":
            image_instruction = " Every two paragraphs, on its own line write exactly: [IMAGE: brief visual description of the emotional mood]. Keep image descriptions under 20 words."
        
        system_prompt = f"""You are a trauma-informed awareness storyteller about gender-based violence in East Africa.

IMPORTANT RULES:
- Use these EXACT character details: protagonist is {protagonist}, the abuser is {relationship} named {abuser}, set in {location} near a {setting}.
- {perspective_instruction}
- The story must focus on: {abuse_type}.
- Write 6-8 paragraphs. Show how the abuse develops gradually — the early "good days", then the slow shift.
- End by gently naming what happened and showing a moment of recognition or small act of courage.
- Use culturally specific details (food, transport, language, social dynamics).
- Do NOT always use the same story arc. Vary the ending: sometimes hope, sometimes ambiguity, sometimes a community response.
- Avoid clinical or medical language. Be gentle and dignified.{image_instruction}
- At the very end, add on its own line: "⚠️ This story is fictional and created for awareness purposes only."
- Respond with the story only."""
        
        is_generic_start = prompt == "begin" or prompt == "anza" or len(prompt.strip()) < 10
        user_prompt = (
            f"Niandikia hadithi kuhusu {abuse_type} inayotokea {location}"
            if is_generic_start and language == "sw"
            else (f"Tell me a story about {abuse_type} set in {location}" if is_generic_start else prompt)
        )
        
        def generate():
            yield f"data: {json.dumps({'type': 'meta', 'abuseType': abuse_type, 'protagonist': protagonist, 'location': location})}\n\n"
            
            try:
                response = client.models.generate_content_stream(
                    model="gemini-2.0-flash",
                    contents=[
                        types.Content(
                            role="user",
                            parts=[types.Part(text=user_prompt)],
                        ),
                    ],
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                    )
                )
                
                for chunk in response:
                    if chunk.text:
                        yield f"data: {json.dumps({'type': 'text', 'content': chunk.text})}\n\n"
                        
            except Exception as e:
                yield f"data: {json.dumps({'type': 'error', 'error': str(e)})}\n\n"
            
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
        
        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, content-type',
            }
        )
        
    except Exception as e:
        return json.dumps({"error": str(e)}), 500, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)