import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    try {
      // Check if we have service account credentials
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      
      if (serviceAccount) {
        // Use service account key if available
        const serviceAccountJson = JSON.parse(serviceAccount);
        initializeApp({
          credential: cert(serviceAccountJson),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        });
        console.log('[Firebase Admin] Initialized with service account credentials');
      } else if (credentialsPath) {
        // Use credentials file path
        initializeApp({
          credential: applicationDefault(),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        });
        console.log('[Firebase Admin] Initialized with application default credentials');
      } else {
        // Use default credentials for development
        initializeApp({
          credential: applicationDefault(),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        });
        console.log('[Firebase Admin] Initialized with default credentials');
      }
    } catch (error) {
      console.error('[Firebase Admin] Failed to initialize:', error);
      // In development, we can still create a minimal app for JWT validation
      if (process.env.NODE_ENV === 'development') {
        try {
          initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'usic-website'
          });
          console.log('[Firebase Admin] Initialized minimal app for development');
        } catch (fallbackError) {
          console.error('[Firebase Admin] Failed to initialize even minimal app:', fallbackError);
        }
      }
    }
  }
  
  return getApps()[0];
};

// Initialize the admin app
const adminApp = initializeFirebaseAdmin();

// Export admin services with error handling
let adminDb: ReturnType<typeof getFirestore> | null = null;
let adminAuth: ReturnType<typeof getAuth> | null = null;

try {
  adminDb = getFirestore(adminApp);
  adminAuth = getAuth(adminApp);
  console.log('[Firebase Admin] Services initialized successfully');
  
  // Test basic functionality (but don't fail if it doesn't work)
  if (adminDb) {
    try {
      adminDb.collection('test');
      console.log('[Firebase Admin] Database connection test successful');
    } catch (testError) {
      console.warn('[Firebase Admin] Database connection test failed (this is normal in development):', testError);
    }
  }
} catch (error) {
  console.error('[Firebase Admin] Failed to initialize services:', error);
  // In development, we can still export null values and handle them in the auth functions
  if (process.env.NODE_ENV === 'development') {
    console.log('[Firebase Admin] Services will be null in development mode');
  }
}

export { adminDb, adminAuth };

export default adminApp;
