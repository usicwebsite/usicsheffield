# Firebase Setup for USIC Website

This document outlines the Firebase integration setup for the USIC website.

## Overview

Firebase has been integrated into the USIC website with the following services:
- **Authentication**: User sign-in/sign-up functionality
- **Firestore**: NoSQL database for storing data
- **Storage**: File upload and storage
- **Analytics**: User behavior tracking

## Configuration

The Firebase configuration is located in `src/lib/firebase.ts` with the following settings:
- Project ID: `usic-website`
- Auth Domain: `usic-website.firebaseapp.com`
- Storage Bucket: `usic-website.firebasestorage.app`

## File Structure

```
src/
├── lib/
│   ├── firebase.ts          # Firebase initialization and configuration
│   └── firebase-utils.ts    # Utility functions for Firebase operations
├── contexts/
│   └── FirebaseContext.tsx  # React context for Firebase services
└── components/
    └── FirebaseExample.tsx  # Example component demonstrating Firebase usage
```

## Usage

### 1. Using Firebase Context

Wrap your app with the `FirebaseProvider` in your layout:

```tsx
import { FirebaseProvider } from '@/contexts/FirebaseContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
```

### 2. Accessing Firebase Services

Use the `useFirebase` hook in your components:

```tsx
import { useFirebase } from '@/contexts/FirebaseContext';

function MyComponent() {
  const { auth, db, storage, analytics } = useFirebase();
  // Use Firebase services here
}
```

### 3. Authentication

```tsx
import { signInUser, signUpUser, signOutUser } from '@/lib/firebase-utils';

// Sign in
const { user, error } = await signInUser(email, password);

// Sign up
const { user, error } = await signUpUser(email, password, userData);

// Sign out
const { error } = await signOutUser();
```

### 4. Firestore Operations

```tsx
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument,
  queryDocuments 
} from '@/lib/firebase-utils';

// Create a document
const { id, error } = await createDocument('events', eventData);

// Get a document
const { data, error } = await getDocument('events', documentId);

// Update a document
const { error } = await updateDocument('events', documentId, updatedData);

// Delete a document
const { error } = await deleteDocument('events', documentId);

// Query documents
const { data, error } = await queryDocuments('events', [
  { field: 'status', operator: '==', value: 'active' }
], 'date', 'desc', 10);
```

### 5. File Storage

```tsx
import { uploadFile, deleteFile } from '@/lib/firebase-utils';

// Upload a file
const { url, error } = await uploadFile('images/event-photo.jpg', file);

// Delete a file
const { error } = await deleteFile('images/event-photo.jpg');
```

### 6. Analytics

```tsx
import { trackEvent, trackPageView, trackButtonClick } from '@/lib/firebase-utils';

// Track custom events
trackEvent('event_registration', { event_id: '123', user_type: 'student' });

// Track page views
trackPageView('events-page');

// Track button clicks
trackButtonClick('join-event-button');
```

## Security Rules

Make sure to set up proper Firestore security rules in your Firebase console:

```javascript
// Example Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to events for all users
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Environment Variables

For production, consider moving Firebase configuration to environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Then update `src/lib/firebase.ts`:

```tsx
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

## Testing

The `FirebaseExample` component provides a simple interface to test:
- User authentication (sign in/sign up/sign out)
- Document creation in Firestore
- Analytics tracking

You can add this component to any page to test the Firebase integration.

## Next Steps

1. Set up Firestore security rules
2. Configure Firebase Authentication providers (Google, Facebook, etc.)
3. Set up Firebase Storage rules
4. Configure Analytics events for better tracking
5. Implement proper error handling and loading states
6. Add user role-based access control
7. Set up Firebase Functions for server-side operations

## Support

For Firebase-specific issues, refer to the [Firebase Documentation](https://firebase.google.com/docs). 