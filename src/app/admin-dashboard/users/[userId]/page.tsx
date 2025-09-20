'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WebsiteUser } from '@/lib/firebase-admin-utils';
import { ForumPost, ForumComment } from '@/lib/firebase-utils';
import { getAuth } from 'firebase/auth';
// Local formatDate function
const formatDate = (date: Date | string | number | { toDate(): Date } | undefined) => {
  if (!date) return 'Never';

  try {
    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'object' && 'toDate' in date) {
      dateObj = date.toDate();
    } else {
      dateObj = new Date(date);
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return 'Invalid Date';
  }
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserDetailPageProps {
  // No props needed for this component
}

export default function UserDetailPage({}: UserDetailPageProps) {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<WebsiteUser | null>(null);
  const [userPosts, setUserPosts] = useState<ForumPost[]>([]);
  const [userComments, setUserComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'comments'>('overview');
  const [deletingPost, setDeletingPost] = useState<string | null>(null);
  const [deletingComment, setDeletingComment] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);

      // Get Firebase ID token for authentication
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Admin not authenticated');
      }

      const idToken = await currentUser.getIdToken();

      // Fetch user details
      const userResponse = await fetch(`/api/admin/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();
      if (userData.success) {
        setUser(userData.user);
      } else {
        throw new Error(userData.error || 'Failed to fetch user details');
      }

      // Fetch user's posts
      const postsResponse = await fetch(`/api/admin/users/${userId}/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        if (postsData.success) {
          setUserPosts(postsData.posts || []);
        }
      }

      // Fetch user's comments
      const commentsResponse = await fetch(`/api/admin/users/${userId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        if (commentsData.success) {
          setUserComments(commentsData.comments || []);
        }
      }

    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleRestrictUser = async (action: 'restrict' | 'unrestrict') => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Admin not authenticated');
      }

      const idToken = await currentUser.getIdToken();

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId,
          action,
          reason: action === 'restrict' ? 'Administrative action' : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user restriction');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh user data
        await fetchUserDetails();
      } else {
        throw new Error(data.error || 'Failed to update user restriction');
      }
    } catch (err) {
      console.error('Error updating user restriction:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user restriction');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setDeletingPost(postId);

      // Get Firebase ID token for authentication
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Admin not authenticated');
      }

      const idToken = await currentUser.getIdToken();

      const response = await fetch(`/api/admin/users/${userId}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      const data = await response.json();
      if (data.success) {
        // Remove the post from the local state
        setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } else {
        throw new Error(data.error || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setDeletingPost(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeletingComment(commentId);

      // Get Firebase ID token for authentication
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Admin not authenticated');
      }

      const idToken = await currentUser.getIdToken();

      const response = await fetch(`/api/admin/users/${userId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      const data = await response.json();
      if (data.success) {
        // Remove the comment from the local state
        setUserComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      } else {
        throw new Error(data.error || 'Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    } finally {
      setDeletingComment(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18384D] flex items-center justify-center">
        <div className="text-white text-xl">Loading user details...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#18384D] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
          <button
            onClick={() => router.push('/admin-dashboard?tab=users')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Users
          </button>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-red-400 text-2xl font-bold mb-4">Error</h2>
            <p className="text-red-300 mb-6">{error || 'User not found'}</p>
            <button
              onClick={() => router.push('/admin-dashboard?tab=users')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300"
            >
              Return to Users List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18384D] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin-dashboard?tab=users')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition duration-300 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Users
          </button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">User Profile</h1>

            {/* Restriction Actions */}
            <div className="flex gap-3">
              {user.restricted ? (
                <button
                  onClick={() => handleRestrictUser('unrestrict')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Unrestrict User
                </button>
              ) : (
                <button
                  onClick={() => handleRestrictUser('restrict')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Restrict User
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              {/* Profile Picture */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={`${user.displayName || user.email || 'User'}'s profile`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-2xl">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {user.displayName || 'No Display Name'}
                  </h3>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">User ID:</span>
                    <span className="text-gray-300 text-sm font-mono">
                      {user.uid.substring(0, 8)}...
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className={`text-sm font-medium ${
                      user.restricted ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {user.restricted ? 'Restricted' : 'Active'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Email Verified:</span>
                    <span className={`text-sm ${
                      user.emailVerified ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {user.emailVerified ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Joined:</span>
                    <span className="text-gray-300 text-sm">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>

                  {user.lastSignInTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Last Sign In:</span>
                      <span className="text-gray-300 text-sm">
                        {formatDate(user.lastSignInTime)}
                      </span>
                    </div>
                  )}
                </div>

                {user.restricted && user.restrictionReason && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="text-red-400 font-medium text-sm mb-1">Restriction Reason:</h4>
                    <p className="text-red-300 text-sm">{user.restrictionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl mb-6">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-3 px-6 text-center transition duration-300 ${
                    activeTab === 'overview'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex-1 py-3 px-6 text-center transition duration-300 ${
                    activeTab === 'posts'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Posts ({userPosts.length})
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 py-3 px-6 text-center transition duration-300 ${
                    activeTab === 'comments'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Comments ({userComments.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <h3 className="text-white font-semibold text-xl mb-4">Activity Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Posts:</span>
                        <span className="text-white font-medium">{userPosts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Comments:</span>
                        <span className="text-white font-medium">{userComments.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Account Status:</span>
                        <span className={`font-medium ${
                          user.restricted ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {user.restricted ? 'Restricted' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <h3 className="text-white font-semibold text-xl mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {userPosts.length > 0 && (
                        <div>
                          <span className="text-gray-300 text-sm">Latest Post:</span>
                          <p className="text-white text-sm mt-1 truncate">
                            {userPosts[0].title}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {formatDate(userPosts[0].createdAt)}
                          </p>
                        </div>
                      )}
                      {userComments.length > 0 && (
                        <div>
                          <span className="text-gray-300 text-sm">Latest Comment:</span>
                          <p className="text-white text-sm mt-1 truncate">
                            {userComments[0].content}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {formatDate(userComments[0].createdAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="space-y-4">
                  {userPosts.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-white text-lg font-medium mb-2">No Posts Yet</h3>
                      <p className="text-gray-400">This user hasn&apos;t created any posts.</p>
                    </div>
                  ) : (
                    userPosts.map((post) => (
                      <div key={post.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-lg mb-2">{post.title}</h4>
                            <p className="text-gray-300 text-sm line-clamp-3">{post.content}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.isApproved
                              ? 'bg-green-500/20 text-green-400'
                              : post.rejectionReason
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {post.isApproved ? 'Approved' : post.rejectionReason ? 'Rejected' : 'Pending'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center gap-4">
                            <span>Category: {post.category}</span>
                            <span>Likes: {post.likes}</span>
                            <span>Views: {post.views}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span>{formatDate(post.createdAt)}</span>
                            <button
                              onClick={() => handleDeletePost(post.id!)}
                              disabled={deletingPost === post.id}
                              className="text-red-400 hover:text-red-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingPost === post.id ? (
                                <div className="flex items-center gap-1">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b border-red-400"></div>
                                  <span className="text-xs">Deleting...</span>
                                </div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {userComments.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <h3 className="text-white text-lg font-medium mb-2">No Comments Yet</h3>
                      <p className="text-gray-400">This user hasn&apos;t posted any comments.</p>
                    </div>
                  ) : (
                    userComments.map((comment) => (
                      <div key={comment.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm mb-2">On post: <span className="text-blue-400">Post #{comment.postId}</span></p>
                            <p className="text-white">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-gray-400 text-sm">Likes: {comment.likes}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>Author: {comment.author}</span>
                          <div className="flex items-center gap-3">
                            <span>{formatDate(comment.createdAt)}</span>
                            <button
                              onClick={() => handleDeleteComment(comment.id!)}
                              disabled={deletingComment === comment.id}
                              className="text-red-400 hover:text-red-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingComment === comment.id ? (
                                <div className="flex items-center gap-1">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b border-red-400"></div>
                                  <span className="text-xs">Deleting...</span>
                                </div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
