"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { getSubmittedPosts, approvePost, rejectPost, getApprovedPosts, deletePost, updatePost, getComments, getCommentCount, deleteComment, ForumPost, ForumComment } from '@/lib/firebase-utils';

// Helper function to get Firebase ID token
// const getIdToken = async (): Promise<string | null> => {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   if (!user) {
//     console.log('[AdminDashboard] ❌ No current user for ID token');
//     return null;
//   }

//   console.log('[AdminDashboard] 🔑 Getting ID token for user:', user.uid);
//   try {
//     const token = await user.getIdToken();
//     console.log('[AdminDashboard] ✅ ID token obtained, length:', token?.length);
//     console.log('[AdminDashboard] 🔍 ID token starts with:', token?.substring(0, 50) + '...');
//     return token;
//   } catch (error) {
//     console.error('[AdminDashboard] ❌ Error getting ID token:', error);
//     return null;
//   }
// };



interface AdminStats {
  totalPosts: number;
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingPosts, setPendingPosts] = useState<ForumPost[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalPosts: 0,
    pendingPosts: 0,
    approvedPosts: 0,
    rejectedPosts: 0,
    totalUsers: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'posts'>('overview');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPostForRejection, setSelectedPostForRejection] = useState<ForumPost | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvedPosts, setApprovedPosts] = useState<ForumPost[]>([]);
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [postComments, setPostComments] = useState<{[postId: string]: ForumComment[]}>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [commentCounts, setCommentCounts] = useState<{[postId: string]: number}>({});

  const checkAdminStatus = async (uid: string): Promise<boolean> => {
    try {
      console.log('[AdminDashboard] 🔍 Checking admin status for UID:', uid);
      console.log('[AdminDashboard] 🔍 UID type:', typeof uid);
      console.log('[AdminDashboard] 🔍 UID length:', uid?.length);

      const db = getFirestoreDb();
      if (!db) {
        console.error('[AdminDashboard] ❌ Firestore not initialized');
        return false;
      }
      console.log('[AdminDashboard] ✅ Firestore initialized successfully');

      console.log('[AdminDashboard] 🔍 Looking for admin document at path: admins/' + uid);
      const adminDocRef = doc(db, 'admins', uid);
      console.log('[AdminDashboard] 🔍 Admin document reference created');

      const adminDocSnap = await getDoc(adminDocRef);
      console.log('[AdminDashboard] 🔍 Admin document snapshot received');
      console.log('[AdminDashboard] 🔍 Document exists:', adminDocSnap.exists());
      console.log('[AdminDashboard] 🔍 Document data:', adminDocSnap.data());

      if (adminDocSnap.exists()) {
        console.log('[AdminDashboard] ✅ Admin document found - user is admin');
        return true;
      } else {
        console.log('[AdminDashboard] ❌ Admin document not found - user is not admin');

        // Let's also check what documents exist in the admins collection
        console.log('[AdminDashboard] 🔍 Checking all documents in admins collection...');
        try {
          const adminsCollection = collection(db, 'admins');
          const adminsSnapshot = await getDocs(adminsCollection);
          console.log('[AdminDashboard] 🔍 Total documents in admins collection:', adminsSnapshot.size);

          if (adminsSnapshot.size > 0) {
            console.log('[AdminDashboard] 🔍 Existing admin UIDs:');
            adminsSnapshot.forEach((doc) => {
              console.log('  - UID:', doc.id, 'Data:', doc.data());
            });
          } else {
            console.log('[AdminDashboard] ❌ No documents found in admins collection');
          }
        } catch (collectionError) {
          console.error('[AdminDashboard] ❌ Error listing admins collection:', collectionError);
        }

        return false;
      }
    } catch (error) {
      console.error('[AdminDashboard] ❌ Error checking admin status:', error);
      console.error('[AdminDashboard] ❌ Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('[AdminDashboard] Starting authentication check...');

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        console.log('[AdminDashboard] Auth state changed:', user ? 'User found' : 'No user');

        if (!user) {
          console.log('[AdminDashboard] No authenticated user, redirecting to login');
          router.push('/admin-login');
          return;
        }

        console.log('[AdminDashboard] User authenticated, checking admin status...');
        console.log('[AdminDashboard] 🔍 User UID from Firebase:', user.uid);
        console.log('[AdminDashboard] 🔍 User email from Firebase:', user.email);
        console.log('[AdminDashboard] 🔍 User display name:', user.displayName);

        // Check admin status in Firestore
        const isAdminUser = await checkAdminStatus(user.uid);

        if (!isAdminUser) {
          console.log('[AdminDashboard] User is not an admin, signing out and redirecting');
          await signOut(auth);
          router.push('/admin-login');
          return;
        }

        console.log('[AdminDashboard] Admin verification successful, loading dashboard');
        setIsAdmin(true);
        setIsAuthenticated(true);
        setIsLoading(false);
        await loadDashboardData();
      } catch (err) {
        console.error('[AdminDashboard] Authentication error:', err);
        router.push('/admin-login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Load approved posts when Posts tab is selected
  useEffect(() => {
    if (activeTab === 'posts' && isAuthenticated && isAdmin && approvedPosts.length === 0) {
      loadApprovedPosts();
    }
  }, [activeTab, isAuthenticated, isAdmin, approvedPosts.length]);

  const loadDashboardData = async () => {
    try {
      console.log('[AdminDashboard] Loading dashboard data...');
      setIsLoading(true);
      
      // Load submitted posts directly from Firestore
      console.log('[AdminDashboard] Loading submitted posts...');
      const submittedPosts = await getSubmittedPosts(50);
      console.log('[AdminDashboard] Loaded', submittedPosts.length, 'submitted posts');

      setPendingPosts(submittedPosts);

      // Load approved posts for stats
      console.log('[AdminDashboard] Loading approved posts for stats...');
      const approvedPostsData = await getApprovedPosts();
      console.log('[AdminDashboard] Loaded', approvedPostsData.length, 'approved posts');

      // Calculate basic stats
      const totalPosts = submittedPosts.length + approvedPostsData.length;
      const totalUsers = 0; // Placeholder for now

      setStats({
        totalPosts,
        pendingPosts: submittedPosts.length,
        approvedPosts: approvedPostsData.length,
        totalUsers,
        rejectedPosts: 0 // We'll load this if needed
      });

    } catch (error) {
      console.error('[AdminDashboard] Failed to load dashboard data:', error);
    } finally {
      console.log('[AdminDashboard] Setting loading to false');
      setIsLoading(false);
    }
  };

  const loadApprovedPosts = async () => {
    try {
      console.log('[AdminDashboard] Loading approved posts...');
      setIsLoading(true);

      const posts = await getApprovedPosts(undefined, 100); // Load up to 100 approved posts
      console.log('[AdminDashboard] Loaded', posts.length, 'approved posts');

      setApprovedPosts(posts);

      // Load comment counts for all posts
      console.log('[AdminDashboard] Loading comment counts for posts...');
      const counts: {[postId: string]: number} = {};
      await Promise.all(posts.map(async (post) => {
        if (post.id) {
          const count = await getCommentCount(post.id);
          counts[post.id] = count;
        }
      }));

      setCommentCounts(counts);
      console.log('[AdminDashboard] Loaded comment counts:', counts);
    } catch (error) {
      console.error('[AdminDashboard] Failed to load approved posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('[AdminDashboard] Deleting post:', postId);
      await deletePost(postId);

      // Remove from approved posts list
      setApprovedPosts(prev => prev.filter(post => post.id !== postId));

      // Update stats
      setStats(prev => ({
        ...prev,
        approvedPosts: prev.approvedPosts - 1,
        totalPosts: prev.totalPosts - 1
      }));

      console.log('[AdminDashboard] Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const startEditingPost = (post: ForumPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
    setEditTags([...post.tags]);
  };

  const cancelEditing = () => {
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('');
    setEditTags([]);
  };

  const savePostEdits = async () => {
    if (!editingPost) return;

    try {
      console.log('[AdminDashboard] Updating post:', editingPost.id);

      const updates = {
        title: editTitle.trim(),
        content: editContent.trim(),
        category: editCategory.trim(),
        tags: editTags.filter(tag => tag.trim() !== '').map(tag => tag.trim()),
        updatedAt: new Date()
      };

      await updatePost(editingPost.id!, updates);

      // Update the post in the approved posts list
      setApprovedPosts(prev =>
        prev.map(post =>
          post.id === editingPost.id
            ? { ...post, ...updates }
            : post
        )
      );

      cancelEditing();
      console.log('[AdminDashboard] Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  const toggleComments = async (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
      } else {
      newExpanded.add(postId);
      // Load comments if not already loaded
      if (!postComments[postId]) {
        try {
          const comments = await getComments(postId);
          setPostComments(prev => ({
            ...prev,
            [postId]: comments
          }));
        } catch (error) {
          console.error('Error loading comments:', error);
        }
      }
    }
    setExpandedPosts(newExpanded);
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('[AdminDashboard] Deleting comment:', commentId);
      await deleteComment(commentId);

      // Remove comment from local state
      setPostComments(prev => ({
        ...prev,
        [postId]: prev[postId].filter(comment => comment.id !== commentId)
      }));

      // Update comment count
      setCommentCounts(prev => ({
        ...prev,
        [postId]: Math.max(0, (prev[postId] || 0) - 1)
      }));

      console.log('[AdminDashboard] Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };





  const handleApprovePost = async (postId: string) => {
    try {
      console.log('[AdminDashboard] Approving post:', postId);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !postId) {
        console.error('[AdminDashboard] No authenticated user or invalid post ID');
        return;
      }

      // Use the new approvePost function from firebase-utils
      await approvePost(postId, user.uid);

        // Remove from pending posts
        setPendingPosts(prev => prev.filter(post => post.id !== postId));
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingPosts: prev.pendingPosts - 1,
        approvedPosts: prev.approvedPosts + 1
      }));

      console.log('[AdminDashboard] Post approved successfully');
    } catch (error) {
      console.error('Error approving post:', error);
      // You could show an error message to the user here
    }
  };

  const handleRejectPost = async (postId: string, rejectionReason: string) => {
    try {
      console.log('[AdminDashboard] Rejecting post:', postId, 'with reason:', rejectionReason);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !postId) {
        console.error('[AdminDashboard] No authenticated user or invalid post ID');
        return;
      }

      // Use the new rejectPost function from firebase-utils
      await rejectPost(postId, user.uid, rejectionReason);

        // Remove from pending posts
        setPendingPosts(prev => prev.filter(post => post.id !== postId));
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingPosts: prev.pendingPosts - 1,
        rejectedPosts: (prev.rejectedPosts || 0) + 1
      }));

        // Close modal and reset state
        setShowRejectModal(false);
        setSelectedPostForRejection(null);
        setRejectionReason('');

      console.log('[AdminDashboard] Post rejected successfully');
    } catch (error) {
      console.error('Error rejecting post:', error);
      // You could show an error message to the user here
    }
  };

  const openRejectModal = (post: ForumPost) => {
    setSelectedPostForRejection(post);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedPostForRejection(null);
    setRejectionReason('');
  };

  const submitRejection = () => {
    if (selectedPostForRejection && selectedPostForRejection.id && rejectionReason.trim()) {
      handleRejectPost(selectedPostForRejection.id, rejectionReason.trim());
    }
  };



  const handleLogout = async () => {
    try {
      // Sign out from Firebase Auth
      await signOut(getAuth());

      // Redirect to login page
      router.push('/admin-login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if sign out fails, redirect to login
      router.push('/admin-login');
    }
  };

  const formatDate = (timestamp: Date | { toDate(): Date }) => {
    if (!timestamp) return "Unknown date";
    
    const date = 'toDate' in timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#18384D]">
        {/* Header */}
        <header className="bg-[#234b64] shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src="/1. USIC Full Logo.svg"
                  alt="USIC Logo"
                  width={40}
                  height={40}
                  className="w-auto h-10"
                  style={{ filter: 'invert(1)' }}
                />
                <h1 className="text-white text-2xl font-bold">USIC Admin Dashboard</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Loading Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-gray-300/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-blue-400/20 animate-pulse"></div>
              </div>
              <h2 className="text-white text-2xl font-semibold mb-2">Loading Dashboard</h2>
              <p className="text-gray-300 text-sm">Please wait while we prepare your admin panel...</p>
            </div>
            
            {/* Loading Steps */}
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 text-sm">Verifying authentication...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-gray-300 text-sm">Loading dashboard data...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-gray-300 text-sm">Preparing admin interface...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    router.push('/admin-login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#18384D]">
      {/* Header */}
      <header className="bg-[#234b64] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/1. USIC Full Logo.svg"
                alt="USIC Logo"
                width={40}
                height={40}
                className="w-auto h-10"
                style={{ filter: 'invert(1)' }}
              />
              <h1 className="text-white text-2xl font-bold">USIC Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#1a3a4d] border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-4 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-2 px-4 border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              Manage Posts
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-2">Total Posts</h3>
                <p className="text-3xl font-bold text-blue-300">{stats.totalPosts}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-2">Pending Posts</h3>
                <p className="text-3xl font-bold text-yellow-300">{stats.pendingPosts}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-2">Approved Posts</h3>
                <p className="text-3xl font-bold text-green-300">{stats.approvedPosts}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-2">Rejected Posts</h3>
                <p className="text-3xl font-bold text-red-300">{stats.rejectedPosts || 0}</p>
              </div>
            </div>

            {/* Pending Posts for Review */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Pending Posts for Review</h2>

              {pendingPosts.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-300 mt-4">No pending posts to review.</p>
                  <p className="text-gray-400 text-sm mt-2">All submitted posts have been processed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPosts.map((post) => (
                    <div key={post.id} className="bg-white/5 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                          <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                      </div>
                          <div className="flex items-center text-gray-400 text-sm space-x-4">
                            <span>By {post.author}</span>
                            <span>{formatDate(post.createdAt)}</span>
                            <span className="bg-blue-500 text-white px-2 py-1 rounded">{post.category}</span>
                            <span>Likes: {post.likes}</span>
                        </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => post.id && handleApprovePost(post.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300 text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(post)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Posts Management Header */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-xl font-semibold mb-2">Manage Approved Posts</h2>
                  <p className="text-gray-300 text-sm">Edit or delete posts that have been published to the forum</p>
                  </div>
                      <button
                  onClick={loadApprovedPosts}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300"
                      >
                  Refresh Posts
                      </button>
                    </div>
                  </div>

            {/* Approved Posts List */}
            {approvedPosts.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-300 mt-4 text-lg">No approved posts found</p>
                  <p className="text-gray-400 text-sm mt-2">Approved posts will appear here for management</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedPosts.map((post) => (
                  <div key={post.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
                    {editingPost?.id === post.id ? (
                      // Edit Mode
                      <div className="space-y-6">
                        {/* Edit Header */}
                        <div className="flex items-center gap-3 pb-4 border-b border-white/20">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">Editing Post</h3>
                            <p className="text-gray-400 text-sm">Make changes to the post content</p>
                </div>
              </div>

                        {/* Edit Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Title
                              </label>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter post title..."
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Category
                              </label>
                              <input
                                type="text"
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter category..."
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              Tags (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={editTags.join(', ')}
                              onChange={(e) => setEditTags(e.target.value.split(',').map(tag => tag.trim()))}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="tag1, tag2, tag3"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Content
                          </label>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={8}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Enter post content..."
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
                          <button
                            onClick={cancelEditing}
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                          <button
                            onClick={savePostEdits}
                            disabled={!editTitle.trim() || !editContent.trim()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                          </button>
                        </div>
                </div>
              ) : (
                      // View Mode
                <div className="space-y-4">
                        {/* Header with Status Badges */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {post.isPinned && (
                                <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 text-xs font-bold rounded-full border border-yellow-500/30 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                  </svg>
                                  PINNED
                                </span>
                              )}
                              {post.isLocked && (
                                <span className="bg-red-500/20 text-red-300 px-3 py-1 text-xs font-bold rounded-full border border-red-500/30 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                  LOCKED
                                </span>
                              )}
                              <span className="bg-green-500/20 text-green-300 px-3 py-1 text-xs font-bold rounded-full border border-green-500/30 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                APPROVED
                              </span>
                              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 text-xs font-bold rounded-full border border-blue-500/30 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                {post.category}
                              </span>
                            </div>

                                                        {/* Post Title */}
                            <h3 className="text-white font-bold text-lg mb-3 leading-tight">{post.title}</h3>

                            {/* Post Content Preview */}
                            <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                                {post.content}
                              </p>
                            </div>

                            {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-3 py-1 text-xs rounded-full border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                            {/* Post Metadata */}
                            <div className="flex items-center gap-6 text-gray-400 text-sm">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{post.likes || 0} likes</span>
                        </div>
                              {post.approvedAt && (
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Approved {formatDate(post.approvedAt)}</span>
                                </div>
                              )}
                            </div>
                                                      </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 ml-6">
                          <button
                              onClick={() => startEditingPost(post)}
                              className="group flex items-center gap-3 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200"
                          >
                              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span className="font-medium">Edit Post</span>
                          </button>

                          <button
                              onClick={() => post.id && toggleComments(post.id)}
                              className="group flex items-center gap-3 px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 rounded-lg text-green-300 hover:text-green-200 transition-all duration-200"
                            >
                              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span className="font-medium">
                                {expandedPosts.has(post.id!) ? 'Hide Comments' : `View Comments (${commentCounts[post.id!] || 0})`}
                              </span>
                            </button>

                            <button
                              onClick={() => post.id && handleDeletePost(post.id)}
                              className="group flex items-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200"
                            >
                              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="font-medium">Delete Post</span>
                          </button>
                        </div>
                      </div>

                        {/* Comments Section */}
                        {expandedPosts.has(post.id!) && (
                          <div className="mt-6">
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
                              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                    </div>
                              <div>
                                <h4 className="text-white font-semibold">Comments</h4>
                                <p className="text-gray-400 text-sm">{commentCounts[post.id!] || 0} comments</p>
                </div>
            </div>

                            {postComments[post.id!]?.length === 0 ? (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                </div>
                                <p className="text-gray-400 font-medium">No comments yet</p>
                                <p className="text-gray-500 text-sm mt-1">Comments will appear here when users engage with this post</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {postComments[post.id!].map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="bg-gradient-to-r from-white/5 to-white/3 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-200"
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                                          <span className="text-blue-400 text-sm font-semibold">
                                            {comment.author.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        <div>
                                          <p className="text-white font-medium text-sm">{comment.author}</p>
                                          <p className="text-gray-400 text-xs">{formatDate(comment.createdAt)}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 px-2 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full">
                                          <svg className="w-3 h-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                          </svg>
                                          <span className="text-pink-300 text-xs font-medium">{comment.likes || 0}</span>
                                        </div>
                                        <button
                                          onClick={() => comment.id && handleDeleteComment(comment.id, post.id!)}
                                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 group"
                                          title="Delete comment"
                                        >
                                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                      <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rejection Reason Modal */}
        {showRejectModal && selectedPostForRejection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Reject Post</h3>

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Post Title:</h4>
                <p className="text-gray-600 text-sm">{selectedPostForRejection.title}</p>
              </div>

              <div className="mb-4">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Please provide a reason for rejecting this post..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeRejectModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRejection}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-md transition duration-300 disabled:cursor-not-allowed"
                >
                  Reject Post
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 
