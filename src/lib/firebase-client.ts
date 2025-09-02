import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  limit, 
  doc, 
  getDoc,
  updateDoc, 
  increment,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { getFirestoreDb, getFirebaseAuth } from './firebase';

// Types for forum data
export interface ForumPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: Date | { toDate(): Date };
  rejectedBy?: string;
  rejectedAt?: Date | { toDate(): Date };
  rejectionReason?: string;
  createdAt: Date | { toDate(): Date };
  updatedAt: Date | { toDate(): Date };
}

export interface ForumComment {
  id?: string;
  postId: string;
  content: string;
  author: string;
  authorId: string;
  likes: number;
  createdAt: Date | { toDate(): Date };
  updatedAt: Date | { toDate(): Date };
}

// Helper function to get Firestore instance
const getDb = (): Firestore => {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return db;
};

// Helper functions to get collection references
const getApprovedPostsCollection = () => collection(getDb(), 'approved_posts');
const getCommentsCollection = () => collection(getDb(), 'comments');

// CLIENT-SIDE FUNCTIONS (using Client SDK)
// Get all approved posts with optional filtering
export const getPosts = async (category?: string, limitCount: number = 20) => {
  try {
    let q = query(
      getApprovedPostsCollection(),
      orderBy('createdAt', 'desc')
    );

    if (category) {
      q = query(q, where('category', '==', category));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const posts: ForumPost[] = [];

    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      } as ForumPost);
    });

    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

// Create a new post via API (with rate limiting)
export const createPost = async (postData: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views' | 'isPinned' | 'isLocked' | 'isApproved' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectionReason'>) => {
  try {
    console.log('[Firebase Client] Creating post via API...');

    // Get Firebase ID token for authentication
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }

    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const idToken = await user.getIdToken();

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags,
        author: postData.author,
        authorId: postData.authorId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Handle rate limiting specifically
      if (response.status === 429) {
        const error = new Error(errorData.message || 'Rate limit exceeded');
        (error as { rateLimitInfo?: { limit: number; remaining: number; resetTime: string; retryAfter: number } }).rateLimitInfo = {
          limit: errorData.limit,
          remaining: errorData.remaining,
          resetTime: errorData.resetTime,
          retryAfter: errorData.retryAfter
        };
        throw error;
      }

      throw new Error(errorData.message || 'Failed to create post');
    }

    const data = await response.json();
    console.log('[Firebase Client] Post created successfully:', data.data.postId);
    return data.data.postId;
  } catch (error) {
    console.error('[Firebase Client] Error creating post:', error);
    throw error;
  }
};

// Get comments for a post
export const getComments = async (postId: string) => {
  try {
    const q = query(
      getCommentsCollection(), 
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const comments: ForumComment[] = [];
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      } as ForumComment);
    });
    
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Add a comment to a post
export const addComment = async (commentData: Omit<ForumComment, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) => {
  try {
    const newComment = {
      ...commentData,
      likes: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(getCommentsCollection(), newComment);
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Like a post (finds post across all collections)
export const likePost = async (postId: string) => {
  try {
    // Search in approved_posts first
    let postDoc = doc(getDb(), 'approved_posts', postId);
    let postSnapshot = await getDoc(postDoc);

    if (!postSnapshot.exists()) {
      // Search in submitted_posts
      postDoc = doc(getDb(), 'submitted_posts', postId);
      postSnapshot = await getDoc(postDoc);
    }

    if (!postSnapshot.exists()) {
      // Search in rejected_posts
      postDoc = doc(getDb(), 'rejected_posts', postId);
      postSnapshot = await getDoc(postDoc);
    }

    if (!postSnapshot.exists()) {
      throw new Error('Post not found');
    }

    await updateDoc(postDoc, {
      likes: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// Increment post views (finds post across all collections)
export const incrementViews = async (postId: string) => {
  try {
    // Search in approved_posts first
    let postDoc = doc(getDb(), 'approved_posts', postId);
    let postSnapshot = await getDoc(postDoc);

    if (!postSnapshot.exists()) {
      // Search in submitted_posts
      postDoc = doc(getDb(), 'submitted_posts', postId);
      postSnapshot = await getDoc(postDoc);
    }

    if (!postSnapshot.exists()) {
      // Search in rejected_posts
      postDoc = doc(getDb(), 'rejected_posts', postId);
      postSnapshot = await getDoc(postDoc);
    }

    if (!postSnapshot.exists()) {
      throw new Error('Post not found');
    }

    await updateDoc(postDoc, {
      views: increment(1),
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw error;
  }
};

// Search posts (only approved posts)
export const searchPosts = async (searchTerm: string) => {
  try {
    const q = query(
      getApprovedPostsCollection(),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const posts: ForumPost[] = [];

    querySnapshot.forEach((doc) => {
      const postData = doc.data() as ForumPost;
      const searchLower = searchTerm.toLowerCase();

      // Search in title, content, and tags
      if (
        postData.title.toLowerCase().includes(searchLower) ||
        postData.content.toLowerCase().includes(searchLower) ||
        postData.tags.some(tag => tag.toLowerCase().includes(searchLower))
      ) {
        posts.push({
          id: doc.id,
          ...postData
        });
      }
    });

    return posts;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

// Check if user is admin by checking Firestore admins collection
export const checkUserAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const adminDocRef = doc(getDb(), 'admins', userId);
    const adminDocSnap = await getDoc(adminDocRef);
    
    return adminDocSnap.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
