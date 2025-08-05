import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  limit, 
  doc, 
  updateDoc, 
  increment,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

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

// Forum posts collection reference
const postsCollection = collection(db, 'posts');
const commentsCollection = collection(db, 'comments');

// Get all posts with optional filtering
export const getPosts = async (category?: string, limitCount: number = 20) => {
  try {
    let q = query(postsCollection, orderBy('createdAt', 'desc'));
    
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

// Get a single post by ID
export const getPost = async (postId: string) => {
  try {
    const postSnapshot = await getDocs(query(postsCollection, where('__name__', '==', postId)));
    
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

// Create a new post
export const createPost = async (postData: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views' | 'isPinned' | 'isLocked'>) => {
  try {
    const newPost = {
      ...postData,
      likes: 0,
      views: 0,
      isPinned: false,
      isLocked: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(postsCollection, newPost);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Get comments for a post
export const getComments = async (postId: string) => {
  try {
    const q = query(
      commentsCollection, 
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
    
    const docRef = await addDoc(commentsCollection, newComment);
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Like a post
export const likePost = async (postId: string) => {
  try {
    const postDoc = doc(db, 'posts', postId);
    await updateDoc(postDoc, {
      likes: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// Increment post views
export const incrementViews = async (postId: string) => {
  try {
    const postDoc = doc(db, 'posts', postId);
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
    const postDoc = doc(db, 'posts', postId);
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
    const commentsQuery = query(commentsCollection, where('postId', '==', postId));
    const commentsSnapshot = await getDocs(commentsQuery);
    
    const deletePromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Delete the post
    const postDoc = doc(db, 'posts', postId);
    await deleteDoc(postDoc);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Search posts
export const searchPosts = async (searchTerm: string) => {
  try {
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
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