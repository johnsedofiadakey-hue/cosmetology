import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Must match the app's actual Storage bucket (see NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    // in firebase.ts) — not Firebase App Hosting's internal build-artifact bucket.
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "cosmetologysystem.firebasestorage.app",
  });
}

export const bucket = admin.storage().bucket();
export default admin;
