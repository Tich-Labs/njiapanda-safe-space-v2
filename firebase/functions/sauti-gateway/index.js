const functions = require('firebase-functions');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

admin.initializeApp();

const NAMES_FEMALE = ["Wanjiku", "Akinyi", "Fatuma", "Njeri", "Atieno", "Rehema", "Zawadi", "Nyambura", "Halima", "Zuri"];
const LOCATIONS = ["Kisumu", "Mombasa", "Nakuru", "Nairobi", "Eldoret", "Malindi", "Nyeri", "Machakos"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// JWT signing for Vertex AI
const base64UrlEncode = (data) => Buffer.from(JSON.stringify(data)).toString('base64url');

const signJwt = async (serviceAccount, scope) => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const headerEnc = base64UrlEncode(header);
  const payloadEnc = base64UrlEncode(payload);
  const signingInput = `${headerEnc}.${payloadEnc}`;

  const privateKey = serviceAccount.private_key.replace(/\\n/g, '\n');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(privateKey, 'base64url');

  return `${signingInput}.${signature}`;
};

exports.sautiSession = functions.https.onRequest(async (req, res) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, content-type',
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).send('ok');
  }

  try {
    const { language = 'sw', zone } = req.body;

    // 1. Try ADK Cloud Run backend
    const adkUrl = process.env.SAUTI_ADK_URL;
    if (adkUrl) {
      const adkToken = process.env.SAUTI_ADK_TOKEN;
      const headers = { 'Content-Type': 'application/json' };
      if (adkToken) headers['Authorization'] = `Bearer ${adkToken}`;

      const adkResponse = await fetch(adkUrl, { method: 'POST', headers, body: JSON.stringify({ language, zone }) });
      if (adkResponse.ok) {
        const adkData = await adkResponse.json();
        return res.set({ ...corsHeaders, 'Content-Type': 'application/json' }).json({
          wsUrl: adkData.wsUrl,
          accessToken: adkData.accessToken,
          sessionId: adkData.sessionId,
          model: adkData.model,
          language,
          zone: zone || 'unspecified',
          expiresAt: adkData.expiresAt || Date.now() + 5 * 60 * 1000,
        });
      }
    }

    // 2. Use Google AI Studio API key
    const aiStudioKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    if (aiStudioKey) {
      const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-live';
      return res.set({ ...corsHeaders, 'Content-Type': 'application/json' }).json({
        wsUrl: 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent',
        accessToken: aiStudioKey,
        expiresAt: Date.now() + 15 * 60 * 1000,
        sessionId: crypto.randomUUID(),
        model: `models/${model}`,
        language,
        zone: zone || 'unspecified',
        authMode: 'api_key',
      });
    }

    // 3. Fallback to Vertex AI service account
    const serviceAccountKey = process.env.VERTEX_AI_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      return res.status(500).set({ ...corsHeaders, 'Content-Type': 'application/json' })
        .json({ error: 'No AI credentials configured' });
    }

    const serviceAccount = typeof serviceAccountKey === 'string' ? JSON.parse(serviceAccountKey) : serviceAccountKey;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || serviceAccount.project_id;
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-live';

    const jwtToken = await signJwt(serviceAccount, 'https://www.googleapis.com/auth/cloud-platform');
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtToken}`,
    });

    if (!tokenResp.ok) throw new Error('Token exchange failed');
    const { access_token } = await tokenResp.json();

    return res.set({ ...corsHeaders, 'Content-Type': 'application/json' }).json({
      wsUrl: `wss://${location}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent`,
      accessToken: access_token,
      expiresAt: Date.now() + 5 * 60 * 1000,
      sessionId: crypto.randomUUID(),
      model: `projects/${projectId}/locations/${location}/publishers/google/models/${model}`,
      language,
      zone: zone || 'unspecified',
      authMode: 'bearer',
    });

  } catch (err) {
    return res.status(500).set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .json({ error: err.message });
  }
});

exports.sautiComplete = functions.https.onRequest(async (req, res) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, content-type',
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).send('ok');
  }

  try {
    const payload = req.body;
    const { urgency, zone, resource_needed, language, sessionId } = payload;

    // Store in Firestore
    const db = admin.firestore();
    const signalRef = db.collection('signals').doc();
    await signalRef.set({
      urgency: urgency || 'medium',
      zone: zone || 'unspecified',
      resource_needed,
      source: 'sauti_voice',
      language: language || 'sw',
      consent: true,
      sessionId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.set({ ...corsHeaders, 'Content-Type': 'application/json' }).json({ success: true, signal_id: signalRef.id });
  } catch (err) {
    return res.status(500).set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .json({ error: err.message });
  }
});