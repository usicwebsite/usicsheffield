import { adminDb } from './firebase-admin';
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

// Create a new post in submitted_posts collection (server-side)
export const createPost = async (postData: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views' | 'isPinned' | 'isLocked' | 'isApproved' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectionReason'>) => {
  if (!adminDb) {
    throw new Error('Firebase Admin Database is not initialized');
  }

  try {
    console.log('[Firebase Admin Utils] Creating post with admin SDK...');
    
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

    console.log('[Firebase Admin Utils] Post data prepared:', {
      title: newPost.title.substring(0, 50) + '...',
      author: newPost.author,
      category: newPost.category
    });

    const docRef = await adminDb.collection('submitted_posts').add(newPost);
    console.log('[Firebase Admin Utils] Post created successfully with ID:', docRef.id);
    
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
    console.log('[Firebase Admin Utils] Getting submitted posts with admin SDK...');
    
    const query = adminDb
      .collection('submitted_posts')
      .orderBy('createdAt', 'desc')
      .limit(limitCount);

    const querySnapshot = await query.get();
    console.log('[Firebase Admin Utils] Query executed successfully, found:', querySnapshot.size, 'posts');

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
    console.log('[Firebase Admin Utils] Approving post:', postId, 'by admin:', adminUid);

    // Get the post from submitted_posts
    const submittedPostRef = adminDb.collection('submitted_posts').doc(postId);
    const postSnapshot = await submittedPostRef.get();

    if (!postSnapshot.exists) {
      throw new Error('Post not found in submitted_posts');
    }

    const postData = postSnapshot.data() as ForumPost;
    console.log('[Firebase Admin Utils] Post data retrieved:', postData.title);

    // Create the post in approved_posts collection
    const approvedPostData = {
      ...postData,
      isApproved: true,
      approvedBy: adminUid,
      approvedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const approvedDocRef = await adminDb.collection('approved_posts').add(approvedPostData);
    console.log('[Firebase Admin Utils] Post added to approved_posts with ID:', approvedDocRef.id);

    // Delete from submitted_posts
    await submittedPostRef.delete();
    console.log('[Firebase Admin Utils] Post deleted from submitted_posts');

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
    console.log('[Firebase Admin Utils] Rejecting post:', postId, 'by admin:', adminUid, 'reason:', rejectionReason);

    // Get the post from submitted_posts
    const submittedPostRef = adminDb.collection('submitted_posts').doc(postId);
    const postSnapshot = await submittedPostRef.get();

    if (!postSnapshot.exists) {
      throw new Error('Post not found in submitted_posts');
    }

    const postData = postSnapshot.data() as ForumPost;
    console.log('[Firebase Admin Utils] Post data retrieved:', postData.title);

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
    console.log('[Firebase Admin Utils] Post added to rejected_posts with ID:', rejectedDocRef.id);

    // Delete from submitted_posts
    await submittedPostRef.delete();
    console.log('[Firebase Admin Utils] Post deleted from submitted_posts');

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
    console.log('[Firebase Admin Utils] Getting all posts with admin SDK...');
    
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

    console.log('[Firebase Admin Utils] Total posts found:', posts.length);
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
    console.log('[Firebase Admin Utils] Deleting post:', postId, 'by admin:', adminUid);

    // First, check if the post exists in any of the collections
    const [submittedSnapshot, approvedSnapshot, rejectedSnapshot] = await Promise.all([
      adminDb.collection('submitted_posts').doc(postId).get(),
      adminDb.collection('approved_posts').doc(postId).get(),
      adminDb.collection('rejected_posts').doc(postId).get()
    ]);

    let postExists = false;
    let postCollection = '';
    let postData: ForumPost | null = null;

    if (submittedSnapshot.exists) {
      postExists = true;
      postCollection = 'submitted_posts';
      postData = submittedSnapshot.data() as ForumPost;
    } else if (approvedSnapshot.exists) {
      postExists = true;
      postCollection = 'approved_posts';
      postData = approvedSnapshot.data() as ForumPost;
    } else if (rejectedSnapshot.exists) {
      postExists = true;
      postCollection = 'rejected_posts';
      postData = rejectedSnapshot.data() as ForumPost;
    }

    if (!postExists) {
      throw new Error('Post not found in any collection');
    }

    console.log('[Firebase Admin Utils] Post found in collection:', postCollection);
    console.log('[Firebase Admin Utils] Post title:', postData?.title);

    // Delete all comments for this post first
    console.log('[Firebase Admin Utils] Deleting comments for post:', postId);
    const commentsQuery = adminDb.collection('comments').where('postId', '==', postId);
    const commentsSnapshot = await commentsQuery.get();
    
    const deleteCommentPromises = commentsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteCommentPromises);
    console.log('[Firebase Admin Utils] Deleted', commentsSnapshot.size, 'comments');

    // Delete the post from its collection
    await adminDb.collection(postCollection).doc(postId).delete();
    console.log('[Firebase Admin Utils] Post deleted from', postCollection);

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
