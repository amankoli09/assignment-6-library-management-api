const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not set in your .env file');
}

const serviceAccount = require(path.resolve(serviceAccountPath));

const app = initializeApp({
  credential: cert(serviceAccount),
});

console.log('✅ Firebase initialized successfully with service account');

const db = getFirestore(app);

module.exports = { db };
