import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cosmetologysystem.firebasestorage.app",
  });
}

export const bucket = admin.storage().bucket();
export default admin;
