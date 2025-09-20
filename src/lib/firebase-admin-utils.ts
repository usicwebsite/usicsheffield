import { adminDb, adminAuth } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Types for forum data (server-side)
export interface ForumPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: string;
  likes: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: Date | FirebaseFirestore.Timestamp;
  rejectedBy?: string;
  rejectedAt?: Date | FirebaseFirestore.Timestamp;
  rejectionReason?: string;
  createdAt: Date | FirebaseFirestore.Timestamp;
  updatedAt: Date | FirebaseFirestore.Timestamp;
}

// SERVER-SIDE FUNCTIONS (using Admin SDK)

// Verify Firebase ID token
export const verifyFirebaseToken = async (token: string) => {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth is not initialized');
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return {
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
      customClaims: decodedToken.customClaims || {}
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Token verification failed'
    };
  }
};

// Verify admin token from request headers
export const verifyAdminToken = async (request: Request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No authorization header' };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const verification = await verifyFirebaseToken(token);

    if (!verification.success) {
      return verification;
    }

    // Check if user has admin privileges (you can implement custom claims or check against an admin users collection)
    // For now, we'll allow any authenticated user - you can add admin role checking here
    return verification;

  } catch (error) {
    console.error('Admin token verification failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Token verification failed'
    };
  }
};

// Create a new post in submitted_posts collection (server-side)
export const createPost = async (postData: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views' | 'isPinned' | 'isLocked' | 'isApproved' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectionReason'>) => {
  if (!adminDb) {
    throw new Error('Firebase Admin Database is not initialized');
  }

  try {
    const newPost = {
      ...postData,
      likes: 0,
      views: 0,
      isPinned: false,
      isLocked: false,
      isApproved: false, // Posts are pending by default
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('submitted_posts').add(newPost);
    
    return docRef.id;
  } catch (error) {
    console.error('[Firebase Admin Utils] Error creating post:', error);
    throw error;
  }
};

// Get submitted posts for admin review (server-side)
export const getSubmittedPosts = async (limitCount: number = 50) => {
  if (!adminDb) {
    throw new Error('Firebase Admin Database is not initialized');
  }

  try {
    const query = adminDb
      .collection('submitted_posts')
      .orderBy('createdAt', 'desc')
      .limit(limitCount);

    const querySnapshot = await query.get();

    const posts: ForumPost[] = [];

    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      } as ForumPost);
    });

    return posts;
  } catch (error) {
    console.error('[Firebase Admin Utils] Error getting submitted posts:', error);
    throw error;
  }
};

// Approve a post (move from submitted_posts to approved_posts) - server-side
export const approvePost = async (postId: string, adminUid: string) => {
  if (!adminDb) {
    throw new Error('Firebase Admin Database is not initialized');
  }

  try {

    // Get the post from submitted_posts
    const submittedPostRef = adminDb.collection('submitted_posts').doc(postId);
    const postSnapshot = await submittedPostRef.get();

    if (!postSnapshot.exists) {
      throw new Error('Post not found in submitted_posts');
    }

    const postData = postSnapshot.data() as ForumPost;

    // Create the post in approved_posts collection
    const approvedPostData = {
      ...postData,
      isApproved: true,
      approvedBy: adminUid,
      approvedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const approvedDocRef = await adminDb.collection('approved_posts').add(approvedPostData);

    // Delete from submitted_posts
    await submittedPostRef.delete();

    return approvedDocRef.id;
  } catch (error) {
    console.error('[Firebase Admin Utils] Error approving post:', error);
    throw error;
  }
};

// Reject a post (move from submitted_posts to rejected_posts with reason) - server-side
export const rejectPost = async (postId: string, adminUid: string, rejectionReason: string) => {
  if (!adminDb) {
    throw new Error('Firebase Admin Database is not initialized');
  }

  try {

    // Get the post from submitted_posts
    const submittedPostRef = adminDb.collection('submitted_posts').doc(postId);
    const postSnapshot = await submittedPostRef.get();

    if (!postSnapshot.exists) {
      throw new Error('Post not found in submitted_posts');
    }

    const postData = postSnapshot.data() as ForumPost;

    // Create the post in rejected_posts collection
    const rejectedPostData = {
      ...postData,
      isApproved: false,
      rejectedBy: adminUid,
      rejectedAt: FieldValue.serverTimestamp(),
      rejectionReason,
      updatedAt: FieldValue.serverTimestamp(),
    };

    const rejectedDocRef = await adminDb.collection('rejected_posts').add(rejectedPostData);

    // Delete from submitted_posts
    await submittedPostRef.delete();

    return rejectedDocRef.id;
  } catch (error) {
    console.error('[Firebase Admin Utils] Error rejecting post:', error);
    throw error;
  }
};

// Get all posts for admin view (server-side)
export const getAllPosts = async (limitCount: number = 100) => {
  if (!adminDb) {
    throw new Error('Firebase Admin Database is not initialized');
  }

  try {
    
    // Get posts from all collections
    const [submittedSnapshot, approvedSnapshot, rejectedSnapshot] = await Promise.all([
      adminDb.collection('submitted_posts').orderBy('createdAt', 'desc').limit(limitCount / 3).get(),
      adminDb.collection('approved_posts').orderBy('createdAt', 'desc').limit(limitCount / 3).get(),
      adminDb.collection('rejected_posts').orderBy('createdAt', 'desc').limit(limitCount / 3).get()
    ]);

    const posts: (ForumPost & { status: 'submitted' | 'approved' | 'rejected' })[] = [];

    // Add submitted posts
    submittedSnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
        status: 'submitted'
      } as ForumPost & { status: 'submitted' });
    });

    // Add approved posts
    approvedSnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
        status: 'approved'
      } as ForumPost & { status: 'approved' });
    });

    // Add rejected posts
    rejectedSnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
        status: 'rejected'
      } as ForumPost & { status: 'rejected' });
    });

    // Sort by creation date
    posts.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt as FirebaseFirestore.Timestamp).toDate().getTime();
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt as FirebaseFirestore.Timestamp).toDate().getTime();
      return bTime - aTime;
    });

    return posts;
  } catch (error) {
    console.error('[Firebase Admin Utils] Error getting all posts:', error);
    throw error;
  }
};

// Delete a post and its comments (server-side)
export const deletePost = async (postId: string, adminUid: string) => {
  if (!adminDb) {
    throw new Error('Firebase Admin Database is not initialized');
  }

  try {

    // First, check if the post exists in any of the collections
    const [submittedSnapshot, approvedSnapshot, rejectedSnapshot] = await Promise.all([
      adminDb.collection('submitted_posts').doc(postId).get(),
      adminDb.collection('approved_posts').doc(postId).get(),
      adminDb.collection('rejected_posts').doc(postId).get()
    ]);

    let postExists = false;
    let postCollection = '';
    if (submittedSnapshot.exists) {
      postExists = true;
      postCollection = 'submitted_posts';
    } else if (approvedSnapshot.exists) {
      postExists = true;
      postCollection = 'approved_posts';
    } else if (rejectedSnapshot.exists) {
      postExists = true;
      postCollection = 'rejected_posts';
    }

    if (!postExists) {
      throw new Error('Post not found in any collection');
    }

    // Delete all comments for this post first
    const commentsQuery = adminDb.collection('comments').where('postId', '==', postId);
    const commentsSnapshot = await commentsQuery.get();
    
    const deleteCommentPromises = commentsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteCommentPromises);

    // Delete the post from its collection
    await adminDb.collection(postCollection).doc(postId).delete();

    return {
      postId,
      deletedFrom: postCollection,
      commentsDeleted: commentsSnapshot.size,
      deletedBy: adminUid,
      deletedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Firebase Admin Utils] Error deleting post:', error);
    throw error;
  }
};

// Types for user management
export interface WebsiteUser {
  uid: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  restricted: boolean;
  restrictionReason?: string;
  restrictedBy?: string;
  restrictedAt?: Date;
  createdAt: Date;
  lastSignInTime?: Date;
  customClaims?: Record<string, unknown>;
}

// Get all users from Firebase Auth (admin function)
export const getAllUsers = async (limitCount: number = 1000): Promise<WebsiteUser[]> => {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth is not initialized');
  }

  try {
    const users: WebsiteUser[] = [];
    let nextPageToken: string | undefined;

    // Get users in batches (Firebase Auth has pagination)
    do {
      const listUsersResult = await adminAuth.listUsers(limitCount, nextPageToken);
      nextPageToken = listUsersResult.pageToken;

      // Get additional user data from Firestore users collection
      const userIds = listUsersResult.users.map(user => user.uid);
      const userDocs = await Promise.all(
        userIds.map(uid => adminDb?.collection('users').doc(uid).get())
      );

      listUsersResult.users.forEach((userRecord, index) => {
        const userDoc = userDocs[index];
        const userData = userDoc?.exists ? userDoc.data() : {};

        // Safely create dates with validation
        const createdAt = userRecord.metadata.creationTime ? new Date(userRecord.metadata.creationTime) : new Date();
        const lastSignInTime = userRecord.metadata.lastSignInTime ? new Date(userRecord.metadata.lastSignInTime) : undefined;

        // Validate dates
        if (isNaN(createdAt.getTime())) {
          console.warn(`Invalid creation time for user ${userRecord.uid}:`, userRecord.metadata.creationTime);
        }

        users.push({
          uid: userRecord.uid,
          email: userRecord.email,
          emailVerified: userRecord.emailVerified,
          displayName: userRecord.displayName || undefined,
          photoURL: userRecord.photoURL || undefined,
          disabled: userRecord.disabled,
          restricted: userData?.restricted || false,
          restrictionReason: userData?.restrictionReason,
          restrictedBy: userData?.restrictedBy,
          restrictedAt: userData?.restrictedAt?.toDate(),
          createdAt: createdAt,
          lastSignInTime: lastSignInTime,
          customClaims: userRecord.customClaims || {}
        });
      });

    } while (nextPageToken && users.length < limitCount);

    // Sort by creation date (newest first)
    users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return users;
  } catch (error) {
    console.error('[Firebase Admin Utils] Error getting all users:', error);
    throw error;
  }
};

// Restrict a user (prevent them from accessing the site)
export const restrictUser = async (userId: string, adminUid: string, reason?: string) => {
  if (!adminAuth || !adminDb) {
    throw new Error('Firebase Admin Auth or Database is not initialized');
  }

  try {
    // Update user's custom claims to mark as restricted
    await adminAuth.setCustomUserClaims(userId, {
      restricted: true,
      restrictedAt: new Date().toISOString(),
      restrictedBy: adminUid,
      restrictionReason: reason
    });

    // Update user document in Firestore
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.set({
      restricted: true,
      restrictionReason: reason,
      restrictedBy: adminUid,
      restrictedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    // Log the restriction action
    await adminDb.collection('admin_audit_logs').add({
      action: 'restrict_user',
      targetUserId: userId,
      performedBy: adminUid,
      reason: reason,
      timestamp: FieldValue.serverTimestamp(),
      details: {
        userId,
        restrictionReason: reason
      }
    });

  } catch (error) {
    console.error('[Firebase Admin Utils] Error restricting user:', error);
    throw error;
  }
};

// Unrestrict a user (allow them to access the site again)
export const unrestrictUser = async (userId: string, adminUid: string) => {
  if (!adminAuth || !adminDb) {
    throw new Error('Firebase Admin Auth or Database is not initialized');
  }

  try {
    // Get current custom claims to preserve other claims
    const userRecord = await adminAuth.getUser(userId);
    const currentClaims = userRecord.customClaims || {};

    // Remove restriction claims
    const updatedClaims = { ...currentClaims };
    delete updatedClaims.restricted;
    delete updatedClaims.restrictedAt;
    delete updatedClaims.restrictedBy;
    delete updatedClaims.restrictionReason;

    // Update user's custom claims
    await adminAuth.setCustomUserClaims(userId, updatedClaims);

    // Update user document in Firestore
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update({
      restricted: false,
      restrictionReason: FieldValue.delete(),
      restrictedBy: FieldValue.delete(),
      restrictedAt: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp()
    });

    // Log the unrestriction action
    await adminDb.collection('admin_audit_logs').add({
      action: 'unrestrict_user',
      targetUserId: userId,
      performedBy: adminUid,
      timestamp: FieldValue.serverTimestamp(),
      details: {
        userId
      }
    });

  } catch (error) {
    console.error('[Firebase Admin Utils] Error unrestricting user:', error);
    throw error;
  }
};

// Get a specific user's details
export const getUserDetails = async (userId: string): Promise<WebsiteUser | null> => {
  if (!adminAuth || !adminDb) {
    throw new Error('Firebase Admin Auth or Database is not initialized');
  }

  try {
    const userRecord = await adminAuth.getUser(userId);
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // Safely create dates with validation
    const createdAt = userRecord.metadata.creationTime ? new Date(userRecord.metadata.creationTime) : new Date();
    const lastSignInTime = userRecord.metadata.lastSignInTime ? new Date(userRecord.metadata.lastSignInTime) : undefined;

    // Validate dates
    if (isNaN(createdAt.getTime())) {
      console.warn(`Invalid creation time for user ${userRecord.uid}:`, userRecord.metadata.creationTime);
    }

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      displayName: userRecord.displayName || undefined,
      photoURL: userRecord.photoURL || undefined,
      disabled: userRecord.disabled,
      restricted: userData?.restricted || false,
      restrictionReason: userData?.restrictionReason,
      restrictedBy: userData?.restrictedBy,
      restrictedAt: userData?.restrictedAt?.toDate(),
      createdAt: createdAt,
      lastSignInTime: lastSignInTime,
      customClaims: userRecord.customClaims || {}
    };
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'auth/user-not-found') {
      return null; // User doesn't exist
    }
    console.error('[Firebase Admin Utils] Error getting user details:', error);
    throw error;
  }
};

// Delete a post by admin (can delete from any collection)
export const deletePostByAdmin = async (postId: string, adminUid: string): Promise<{ success: boolean; collection?: string; commentsDeleted?: number }> => {
  if (!adminDb) {
    throw new Error('Firebase Admin Database is not initialized');
  }

  try {
    // First, check if the post exists in any of the collections
    const [submittedSnapshot, approvedSnapshot, rejectedSnapshot] = await Promise.all([
      adminDb.collection('submitted_posts').doc(postId).get(),
      adminDb.collection('approved_posts').doc(postId).get(),
      adminDb.collection('rejected_posts').doc(postId).get()
    ]);

    let postExists = false;
    let postCollection = '';
    if (submittedSnapshot.exists) {
      postExists = true;
      postCollection = 'submitted_posts';
    } else if (approvedSnapshot.exists) {
      postExists = true;
      postCollection = 'approved_posts';
    } else if (rejectedSnapshot.exists) {
      postExists = true;
      postCollection = 'rejected_posts';
    }

    if (!postExists) {
      throw new Error('Post not found in any collection');
    }

    // Delete all comments for this post first
    const commentsQuery = adminDb.collection('comments').where('postId', '==', postId);
    const commentsSnapshot = await commentsQuery.get();

    const deleteCommentPromises = commentsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteCommentPromises);

    // Delete the post from its collection
    await adminDb.collection(postCollection).doc(postId).delete();

    // Log the deletion action
    await adminDb.collection('admin_audit_logs').add({
      action: 'delete_post',
      targetPostId: postId,
      performedBy: adminUid,
      timestamp: FieldValue.serverTimestamp(),
      details: {
        postId,
        deletedFrom: postCollection,
        commentsDeleted: commentsSnapshot.size
      }
    });

    return {
      success: true,
      collection: postCollection,
      commentsDeleted: commentsSnapshot.size
    };
  } catch (error) {
    console.error('[Firebase Admin Utils] Error deleting post:', error);
    throw error;
  }
};

// Delete a comment by admin
export const deleteCommentByAdmin = async (commentId: string, adminUid: string): Promise<{ success: boolean }> => {
  if (!adminDb) {
    throw new Error('Firebase Admin Database is not initialized');
  }

  try {
    // Delete the comment
    await adminDb.collection('comments').doc(commentId).delete();

    // Log the deletion action
    await adminDb.collection('admin_audit_logs').add({
      action: 'delete_comment',
      targetCommentId: commentId,
      performedBy: adminUid,
      timestamp: FieldValue.serverTimestamp(),
      details: {
        commentId
      }
    });

    return { success: true };
  } catch (error) {
    console.error('[Firebase Admin Utils] Error deleting comment:', error);
    throw error;
  }
};

// Sync user display name with Google account name
export const syncUserDisplayNameWithGoogle = async (userId: string, performedBy?: string): Promise<{ synced: boolean; oldName?: string; newName?: string }> => {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth is not initialized');
  }

  try {
    // Get the user record from Firebase Auth
    const userRecord = await adminAuth.getUser(userId);

    // Get the current display name from Firebase Auth
    const currentDisplayName = userRecord.displayName || null;

    // Get user data from Firestore to check if there's any custom name stored
    let firestoreUserData = null;
    if (adminDb) {
      try {
        const userDoc = await adminDb.collection('users').doc(userId).get();
        if (userDoc.exists) {
          firestoreUserData = userDoc.data();
        }
      } catch (firestoreError) {
        console.warn('[Sync Display Name] Could not read Firestore user data:', firestoreError);
      }
    }

    // Check if the display name matches what we expect from Google
    // Firebase Auth display name comes from Google account
    const googleDisplayName = userRecord.displayName;

    // If there's no display name from Google, we can't sync
    if (!googleDisplayName) {
      console.log(`[Sync Display Name] No Google display name found for user ${userId}`);
      return { synced: false };
    }

    // If the current display name doesn't match the Google account name, update it
    if (currentDisplayName !== googleDisplayName) {
      console.log(`[Sync Display Name] Updating display name for user ${userId} from "${currentDisplayName}" to "${googleDisplayName}"`);

      // Update the display name in Firebase Auth
      await adminAuth.updateUser(userId, {
        displayName: googleDisplayName
      });

      // Update Firestore user document if it exists
      if (adminDb && firestoreUserData) {
        await adminDb.collection('users').doc(userId).update({
          displayName: googleDisplayName,
          updatedAt: FieldValue.serverTimestamp()
        });
      }

      // Log the sync action
      if (adminDb) {
        await adminDb.collection('admin_audit_logs').add({
          action: 'sync_display_name_with_google',
          targetUserId: userId,
          performedBy: performedBy || 'system',
          timestamp: FieldValue.serverTimestamp(),
          details: {
            oldDisplayName: currentDisplayName,
            newDisplayName: googleDisplayName,
            reason: 'Display name did not match Google account name'
          }
        });
      }

      return {
        synced: true,
        oldName: currentDisplayName || undefined,
        newName: googleDisplayName
      };
    } else {
      // Display name already matches Google account
      return { synced: false };
    }

  } catch (error) {
    console.error('[Sync Display Name] Error syncing user display name:', error);
    throw error;
  }
};

// Batch sync display names for all users with Google accounts
export const batchSyncDisplayNamesWithGoogle = async (adminUid: string): Promise<{ totalUsers: number; syncedUsers: number; errors: number }> => {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth is not initialized');
  }

  try {
    const users = await getAllUsers();
    let syncedCount = 0;
    let errorCount = 0;

    console.log(`[Batch Sync] Starting sync for ${users.length} users`);

    for (const user of users) {
      try {
        // Only sync users that have a display name (indicating they have a Google account)
        if (user.displayName) {
          const result = await syncUserDisplayNameWithGoogle(user.uid, adminUid);
          if (result.synced) {
            syncedCount++;
          }
        }
      } catch (error) {
        console.error(`[Batch Sync] Error syncing user ${user.uid}:`, error);
        errorCount++;
      }
    }

    console.log(`[Batch Sync] Completed: ${syncedCount} synced, ${errorCount} errors out of ${users.length} total users`);

    // Log the batch sync action
    if (adminDb) {
      await adminDb.collection('admin_audit_logs').add({
        action: 'batch_sync_display_names',
        performedBy: adminUid,
        timestamp: FieldValue.serverTimestamp(),
        details: {
          totalUsers: users.length,
          syncedUsers: syncedCount,
          errors: errorCount
        }
      });
    }

    return {
      totalUsers: users.length,
      syncedUsers: syncedCount,
      errors: errorCount
    };
  } catch (error) {
    console.error('[Batch Sync] Error in batch sync:', error);
    throw error;
  }
};
