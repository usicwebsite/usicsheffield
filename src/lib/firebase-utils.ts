import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  limit,
  doc,
  updateDoc,
  increment,
  deleteDoc,
  serverTimestamp,
  Firestore,
  QueryConstraint
} from 'firebase/firestore';
import { getFirestoreDb } from './firebase';

// Types for forum data
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
const getPostsCollection = () => collection(getDb(), 'posts'); // Legacy collection
const getSubmittedPostsCollection = () => collection(getDb(), 'submitted_posts');
const getApprovedPostsCollection = () => collection(getDb(), 'approved_posts');
const getRejectedPostsCollection = () => collection(getDb(), 'rejected_posts');
const getCommentsCollection = () => collection(getDb(), 'comments');



// Get all posts for admin view (client-side)
export const getAllPosts = async (limitCount: number = 100) => {
  try {
    const postsCollection = getPostsCollection();

    const q = query(
      postsCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const posts: ForumPost[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      posts.push({
        id: doc.id,
        ...data
      } as ForumPost);
    });

    return posts;
  } catch (error) {
    console.error('[Firebase Utils] getAllPosts: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};



// CLIENT-SIDE FUNCTIONS (using Client SDK)
// Get all approved posts with optional filtering
export const getPosts = async (category?: string, limitCount: number = 20) => {
  // Use the new approved posts collection
  return getApprovedPosts(category, limitCount);
};

// Get pending posts for admin approval (legacy function - now uses submitted posts)
export const getPendingPosts = async (limitCount: number = 50): Promise<ForumPost[]> => {
  // Use the new submitted posts collection
  return getSubmittedPosts(limitCount);
};

// Get a single post by ID (searches all collections)
export const getPost = async (postId: string) => {
  try {
    // Search in submitted_posts first
    let postSnapshot = await getDocs(query(getSubmittedPostsCollection(), where('__name__', '==', postId)));
    if (!postSnapshot.empty) {
      const postData = postSnapshot.docs[0];
      return {
        id: postData.id,
        ...postData.data()
      } as ForumPost;
    }

    // Search in approved_posts
    postSnapshot = await getDocs(query(getApprovedPostsCollection(), where('__name__', '==', postId)));
    if (!postSnapshot.empty) {
      const postData = postSnapshot.docs[0];
      return {
        id: postData.id,
        ...postData.data()
      } as ForumPost;
    }

    // Search in rejected_posts
    postSnapshot = await getDocs(query(getRejectedPostsCollection(), where('__name__', '==', postId)));
    if (!postSnapshot.empty) {
      const postData = postSnapshot.docs[0];
      return {
        id: postData.id,
        ...postData.data()
      } as ForumPost;
    }

    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

// Create a new post in submitted_posts collection
export const createPost = async (postData: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views' | 'isPinned' | 'isLocked' | 'isApproved' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectionReason'>) => {
  try {
    const newPost = {
      ...postData,
      likes: 0,
      views: 0,
      isPinned: false,
      isLocked: false,
      isApproved: false, // Posts are pending by default
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(getSubmittedPostsCollection(), newPost);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Approve a post (move from submitted_posts to approved_posts)
export const approvePost = async (postId: string, adminUid: string) => {
  try {

    // Get the post from submitted_posts
    const submittedPostRef = doc(getDb(), 'submitted_posts', postId);
    const postSnapshot = await getDocs(query(getSubmittedPostsCollection(), where('__name__', '==', postId)));

    if (postSnapshot.empty) {
      throw new Error('Post not found in submitted_posts');
    }

    const postData = postSnapshot.docs[0].data() as ForumPost;

    // Create the post in approved_posts collection
    const approvedPostData = {
      ...postData,
      isApproved: true,
      approvedBy: adminUid,
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const approvedDocRef = await addDoc(getApprovedPostsCollection(), approvedPostData);

    // Delete from submitted_posts
    await deleteDoc(submittedPostRef);

    return approvedDocRef.id;
  } catch (error) {
    console.error('Error approving post:', error);
    throw error;
  }
};

// Reject a post (move from submitted_posts to rejected_posts with reason)
export const rejectPost = async (postId: string, adminUid: string, rejectionReason: string) => {
  try {

    // Get the post from submitted_posts
    const submittedPostRef = doc(getDb(), 'submitted_posts', postId);
    const postSnapshot = await getDocs(query(getSubmittedPostsCollection(), where('__name__', '==', postId)));

    if (postSnapshot.empty) {
      throw new Error('Post not found in submitted_posts');
    }

    const postData = postSnapshot.docs[0].data() as ForumPost;

    // Create the post in rejected_posts collection
    const rejectedPostData = {
      ...postData,
      isApproved: false,
      rejectedBy: adminUid,
      rejectedAt: serverTimestamp(),
      rejectionReason,
      updatedAt: serverTimestamp(),
    };

    const rejectedDocRef = await addDoc(getRejectedPostsCollection(), rejectedPostData);

    // Delete from submitted_posts
    await deleteDoc(submittedPostRef);

    return rejectedDocRef.id;
  } catch (error) {
    console.error('Error rejecting post:', error);
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

// Get comment count for a post (more efficient than loading all comments)
export const getCommentCount = async (postId: string): Promise<number> => {
  try {
    const q = query(
      getCommentsCollection(),
      where('postId', '==', postId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
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

// Like a post (works with approved_posts collection)
export const likePost = async (postId: string) => {
  try {
    // Try approved_posts collection first
    let postDoc = doc(getDb(), 'approved_posts', postId);
    let postSnapshot = await getDoc(postDoc);

    if (!postSnapshot.exists()) {
      // Fallback to legacy posts collection
      postDoc = doc(getDb(), 'posts', postId);
      postSnapshot = await getDoc(postDoc);
    }

    if (postSnapshot.exists()) {
      await updateDoc(postDoc, {
        likes: increment(1),
        updatedAt: serverTimestamp(),
      });
    } else {
      throw new Error('Post not found');
    }
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// Unlike a post
export const unlikePost = async (postId: string) => {
  try {
    // Try approved_posts collection first
    let postDoc = doc(getDb(), 'approved_posts', postId);
    let postSnapshot = await getDoc(postDoc);

    if (!postSnapshot.exists()) {
      // Fallback to legacy posts collection
      postDoc = doc(getDb(), 'posts', postId);
      postSnapshot = await getDoc(postDoc);
    }

    if (postSnapshot.exists()) {
      await updateDoc(postDoc, {
        likes: increment(-1),
        updatedAt: serverTimestamp(),
      });
    } else {
      throw new Error('Post not found');
    }
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

// Like a comment
export const likeComment = async (commentId: string) => {
  try {
    const commentDoc = doc(getDb(), 'comments', commentId);
    await updateDoc(commentDoc, {
      likes: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

// Unlike a comment
export const unlikeComment = async (commentId: string) => {
  try {
    const commentDoc = doc(getDb(), 'comments', commentId);
    await updateDoc(commentDoc, {
      likes: increment(-1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error unliking comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId: string) => {
  try {
    const commentDoc = doc(getDb(), 'comments', commentId);
    await deleteDoc(commentDoc);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Increment post views
export const incrementViews = async (postId: string) => {
  try {
    const postDoc = doc(getDb(), 'posts', postId);
    await updateDoc(postDoc, {
      views: increment(1),
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw error;
  }
};

// Update a post
export const updatePost = async (postId: string, updates: Partial<ForumPost>) => {
  try {
    const postDoc = doc(getDb(), 'posts', postId);
    await updateDoc(postDoc, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete a post and its comments
export const deletePost = async (postId: string) => {
  try {
    // Delete all comments for this post first
    const commentsQuery = query(getCommentsCollection(), where('postId', '==', postId));
    const commentsSnapshot = await getDocs(commentsQuery);
    
    const deletePromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Delete the post
    const postDoc = doc(getDb(), 'posts', postId);
    await deleteDoc(postDoc);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// NEW COLLECTION FUNCTIONS

// Get submitted posts for admin review
export const getSubmittedPosts = async (limitCount: number = 50) => {
  try {
    const collectionRef = getSubmittedPostsCollection();

    const q = query(
      collectionRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const posts: ForumPost[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data
      } as ForumPost);
    });

    return posts;
  } catch (error) {
    console.error('[Firebase Utils] getSubmittedPosts: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

// Get approved posts for public view
export const getApprovedPosts = async (category?: string, limitCount: number = 20) => {
  try {
    // Build query conditions array with proper typing
    const queryConditions: QueryConstraint[] = [
      orderBy('createdAt', 'desc')
    ];

    // Add category filter if specified
    if (category) {
      queryConditions.push(where('category', '==', category));
    }

    // Add limit if specified
    if (limitCount) {
      queryConditions.push(limit(limitCount));
    }

    // Create the query with all conditions
    const q = query(getApprovedPostsCollection(), ...queryConditions);

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
    console.error('Error getting approved posts:', error);
    throw error;
  }
};

// Get user's submitted posts (for profile)
export const getUserSubmittedPosts = async (userId: string, limitCount: number = 20) => {
  try {
    const q = query(
      getSubmittedPostsCollection(),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

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
    console.error('Error getting user submitted posts:', error);
    throw error;
  }
};

// Get user's approved posts (for profile)
export const getUserApprovedPosts = async (userId: string, limitCount: number = 20) => {
  try {
    const q = query(
      getApprovedPostsCollection(),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

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
    console.error('Error getting user approved posts:', error);
    throw error;
  }
};

// Get user's rejected posts (for profile)
export const getUserRejectedPosts = async (userId: string, limitCount: number = 20) => {
  try {
    const q = query(
      getRejectedPostsCollection(),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

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
    console.error('Error getting user rejected posts:', error);
    throw error;
  }
};

// Search approved posts (only approved posts)
export const searchApprovedPosts = async (searchTerm: string) => {
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

      // Search in title and content
      if (
        postData.title.toLowerCase().includes(searchLower) ||
        postData.content.toLowerCase().includes(searchLower)
      ) {
        posts.push({
          id: doc.id,
          ...postData
        });
      }
    });

    return posts;
  } catch (error) {
    console.error('Error searching approved posts:', error);
    throw error;
  }
}; 