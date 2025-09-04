// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from "firebase/auth";

// Validate required Firebase environment variables (log warnings but don't throw)
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  const warningMessage = `Missing Firebase environment variables: ${missingEnvVars.join(', ')}. Firebase features will be disabled.`;
  console.warn(warningMessage);
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with error handling
let app: any = null;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (error) {
  console.error('Firebase app initialization failed:', error);
  app = null;
}

// Initialize Firebase services with error handling
let analytics: unknown = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function getFirestoreDb(): Firestore | null {
  try {
    // Check if we're in a build environment
    const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build';

    if (isBuildTime) {
      console.log('Build time detected, skipping Firestore initialization');
      return null;
    }

    // Check if Firebase app was initialized successfully
    if (!app) {
      console.warn('Firebase app not initialized, skipping Firestore');
      return null;
    }

    if (!db) {
      db = getFirestore(app);
    }

    return db;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  try {
    // Check if Firebase app was initialized successfully
    if (!app) {
      console.warn('Firebase app not initialized, skipping Auth');
      return null;
    }

    if (!auth) {
      auth = getAuth(app);
    }
    return auth;
  } catch (error) {
    console.error('Error initializing Firebase Auth:', error);
    return null;
  }
}

// Initialize services (only if app is available)
try {
  if (app) {
    analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
  }
  db = getFirestoreDb();
  auth = getFirebaseAuth();
} catch (error) {
  console.error('Error initializing Firebase services:', error);
}

export { analytics, db, auth };
export default app; 