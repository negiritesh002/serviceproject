const crypto = require('crypto');

const CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
let cachedCerts = null;
let certsExpireAt = 0;

const decodeBase64Url = (value) => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
};

const parseJwt = (token) => {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('Invalid Firebase token');

  return {
    header: JSON.parse(decodeBase64Url(parts[0])),
    payload: JSON.parse(decodeBase64Url(parts[1])),
    signature: parts[2],
    signedContent: `${parts[0]}.${parts[1]}`
  };
};

const getFirebaseCerts = async () => {
  if (cachedCerts && Date.now() < certsExpireAt) return cachedCerts;

  const response = await fetch(CERTS_URL);
  if (!response.ok) throw new Error('Unable to fetch Firebase public certificates');

  const cacheControl = response.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeSeconds = maxAgeMatch ? Number(maxAgeMatch[1]) : 3600;

  cachedCerts = await response.json();
  certsExpireAt = Date.now() + maxAgeSeconds * 1000;
  return cachedCerts;
};

const verifySignature = (signedContent, signature, certificate) => {
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(signedContent);
  verifier.end();
  return verifier.verify(certificate, signature.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
};

const verifyFirebaseIdToken = async (idToken) => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('FIREBASE_PROJECT_ID is missing from .env');

  const token = parseJwt(idToken);
  const certs = await getFirebaseCerts();
  const certificate = certs[token.header.kid];

  if (token.header.alg !== 'RS256' || !certificate) {
    throw new Error('Invalid Firebase token header');
  }

  if (!verifySignature(token.signedContent, token.signature, certificate)) {
    throw new Error('Invalid Firebase token signature');
  }

  const now = Math.floor(Date.now() / 1000);
  const expectedIssuer = `https://securetoken.google.com/${projectId}`;

  if (token.payload.aud !== projectId) throw new Error('Invalid Firebase token audience');
  if (token.payload.iss !== expectedIssuer) throw new Error('Invalid Firebase token issuer');
  if (!token.payload.sub) throw new Error('Invalid Firebase token subject');
  if (token.payload.exp <= now) throw new Error('Firebase token has expired');
  if (token.payload.iat > now) throw new Error('Firebase token issued in the future');

  return token.payload;
};

module.exports = { verifyFirebaseIdToken };
