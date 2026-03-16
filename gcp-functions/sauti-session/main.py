import os
import json
import time
import uuid
import base64
from flask import Flask, Request, Response
import requests

app = Flask(__name__)

def base64_url_encode(data: bytes) -> str:
    return base64.b64encode(data).decode().replace('+', '-').replace('/', '_').replace('=', '')

@app.route('/sauti-session', methods=['POST'])
def sauti_session():
    try:
        data = request.get_json() or {}
        language = data.get('language', 'sw')
        zone = data.get('zone', 'unspecified')
        
        # Opt-in: route to ADK Cloud Run backend if configured
        adk_url = os.environ.get('SAUTI_ADK_URL')
        if adk_url:
            adk_token = os.environ.get('SAUTI_ADK_TOKEN')
            headers = {'Content-Type': 'application/json'}
            if adk_token:
                headers['Authorization'] = f'Bearer {adk_token}'
            
            adk_response = requests.post(adk_url, json={'language': language, 'zone': zone}, headers=headers)
            
            if not adk_response.ok:
                raise Exception(f'ADK service error: {adk_response.status_code}')
            
            adk_data = adk_response.json()
            return json.dumps({
                'wsUrl': adk_data.get('wsUrl'),
                'accessToken': adk_data.get('accessToken'),
                'sessionId': adk_data.get('sessionId'),
                'model': adk_data.get('model'),
                'language': language,
                'zone': zone,
                'expiresAt': adk_data.get('expiresAt', int(time.time() * 1000) + 5 * 60 * 1000),
            }), 200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        
        # Primary: Google AI Studio API key
        ai_studio_key = os.environ.get('GOOGLE_AI_STUDIO_API_KEY')
        if ai_studio_key:
            model = os.environ.get('GEMINI_MODEL', 'gemini-2.0-flash-live')
            ws_url = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent'
            session_id = str(uuid.uuid4())
            expires_at = int(time.time() * 1000) + 15 * 60 * 1000
            
            return json.dumps({
                'wsUrl': ws_url,
                'accessToken': ai_studio_key,
                'expiresAt': expires_at,
                'sessionId': session_id,
                'model': f'models/{model}',
                'language': language,
                'zone': zone,
                'authMode': 'api_key',
            }), 200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        
        # Fallback: Vertex AI service account
        service_account_key = os.environ.get('VERTEX_AI_SERVICE_ACCOUNT_KEY')
        if not service_account_key:
            return json.dumps({'error': 'No AI credentials configured. Set GOOGLE_AI_STUDIO_API_KEY or VERTEX_AI_SERVICE_ACCOUNT_KEY.'}), 500, {'Content-Type': 'application/json'}
        
        # Decode service account key
        try:
            import json
            service_account = json.loads(service_account_key)
        except:
            # Try base64 decode
            try:
                decoded = base64.b64decode(service_account_key)
                service_account = json.loads(decoded)
            except Exception as e:
                return json.dumps({'error': f'Failed to decode service account: {str(e)}'}), 500, {'Content-Type': 'application/json'}
        
        if not service_account.get('client_email') or not service_account.get('private_key'):
            return json.dumps({'error': 'VERTEX_AI_SERVICE_ACCOUNT_KEY missing client_email/private_key'}), 500, {'Content-Type': 'application/json'}
        
        project_id = os.environ.get('GOOGLE_CLOUD_PROJECT_ID') or service_account.get('project_id')
        if not project_id:
            return json.dumps({'error': 'GOOGLE_CLOUD_PROJECT_ID not configured'}), 500, {'Content-Type': 'application/json'}
        
        location = os.environ.get('GOOGLE_CLOUD_LOCATION', 'us-central1')
        model = os.environ.get('GEMINI_MODEL', 'gemini-2.0-flash-live')
        
        # Create JWT
        now = int(time.time())
        header = base64_url_encode(json.dumps({'alg': 'RS256', 'typ': 'JWT'}).encode())
        payload = base64_url_encode(json.dumps({
            'iss': service_account['client_email'],
            'scope': 'https://www.googleapis.com/auth/cloud-platform',
            'aud': 'https://oauth2.googleapis.com/token',
            'exp': now + 3600,
            'iat': now,
        }).encode())
        
        # Sign JWT with private key
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.asymmetric import padding
        from cryptography.hazmat.primitives.serialization import load_pem_private_key
        
        private_key_pem = service_account['private_key'].encode()
        private_key = load_pem_private_key(private_key_pem, password=None)
        
        signature = private_key.sign(
            f'{header}.{payload}'.encode(),
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        
        jwt = f'{header}.{payload}.{base64_url_encode(signature)}'
        
        # Exchange JWT for access token
        token_response = requests.post(
            'https://oauth2.googleapis.com/token',
            data={'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion': jwt}
        )
        
        if not token_response.ok:
            raise Exception(f'Token exchange failed: {token_response.status_code}')
        
        token_json = token_response.json()
        access_token = token_json.get('access_token')
        if not access_token:
            raise Exception('Token exchange succeeded but access_token missing')
        
        ws_url = f'wss://{location}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent'
        session_id = str(uuid.uuid4())
        expires_at = int(time.time() * 1000) + 5 * 60 * 1000
        
        return json.dumps({
            'wsUrl': ws_url,
            'accessToken': access_token,
            'expiresAt': expires_at,
            'sessionId': session_id,
            'model': f'projects/{project_id}/locations/{location}/publishers/google/models/{model}',
            'language': language,
            'zone': zone,
            'authMode': 'bearer',
        }), 200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        
    except Exception as e:
        return json.dumps({'error': str(e)}), 500, {'Content-Type': 'application/json'}

@app.route('/sauti-complete', methods=['POST'])
def sauti_complete():
    try:
        payload = request.get_json()
        
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_url or not supabase_key:
            return json.dumps({'error': 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured'}), 500, {'Content-Type': 'application/json'}
        
        # Insert into signals table
        response = requests.post(
            f'{supabase_url}/rest/v1/signals',
            json={
                'urgency': payload.get('urgency', 'medium'),
                'zone': payload.get('zone', 'unspecified'),
                'resource_needed': payload.get('resource_needed'),
                'source': 'sauti_voice',
                'language': payload.get('language', 'sw'),
                'consent': True,
            },
            headers={
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}',
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        )
        
        if not response.ok:
            raise Exception(f'Insert error: {response.status_code}')
        
        data = response.json()
        return json.dumps({'success': True, 'signal_id': data[0]['id'] if data else None}), 200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        
    except Exception as e:
        return json.dumps({'error': str(e)}), 500, {'Content-Type': 'application/json'}

@app.route('/', methods=['GET'])
def health():
    return json.dumps({'status': 'ok', 'service': 'sauti-gateway'}), 200, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)