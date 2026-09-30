import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Single server-only Admin SDK initializer. Uses FIREBASE_SERVICE_ACCOUNT_KEY when set,
// otherwise Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS or Google-hosted runtime).
// A malformed service account key throws here instead of silently falling back.
const initializeFirebaseAdmin = () => {
  const existing = getApps()[0];

  if (existing) return existing;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  let credential;

  if (serviceAccount) {
    try {
      credential = cert(JSON.parse(serviceAccount));
    } catch (error) {
      throw new Error(
        `[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_KEY is not a valid service account JSON: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } else {
    credential = applicationDefault();
  }

  return initializeApp({
    credential,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
};

const adminApp = initializeFirebaseAdmin();

export const adminDb = getFirestore(adminApp);

export const adminAuth = getAuth(adminApp);

export default adminApp;
