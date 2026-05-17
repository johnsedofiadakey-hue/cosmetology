import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "152762339392-asia-east1-blueprint-config",
  });
}

export const bucket = admin.storage().bucket();
export default admin;
