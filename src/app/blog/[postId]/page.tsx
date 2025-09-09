"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { getPost, getComments, addComment, likePost, unlikePost, likeComment, unlikeComment, ForumPost, ForumComment } from "@/lib/firebase-utils";
import { LoadingError } from "@/components/ErrorDisplay";
import { useErrorHandler } from "@/components/ErrorBoundary";
import { categoryUtils } from "@/lib/static-data";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [postLiked, setPostLiked] = useState(false);
  const [localPostLikes, setLocalPostLikes] = useState(0);
  const [commentLikes, setCommentLikes] = useState<{[key: string]: {liked: boolean, count: number}}>({});

  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        clearError();

        const fetchedPost = await getPost(postId);
        if (!fetchedPost) {
          handleError(new Error("Post not found"));
          return;
        }

        setPost(fetchedPost);
        setLocalPostLikes(fetchedPost.likes || 0);

        // Fetch comments for this post
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments);

        // Initialize comment likes state
        const initialCommentLikes: {[key: string]: {liked: boolean, count: number}} = {};
        fetchedComments.forEach(comment => {
          initialCommentLikes[comment.id!] = {
            liked: false, // We'll implement user-specific like tracking later
            count: comment.likes || 0
          };
        });
        setCommentLikes(initialCommentLikes);

      } catch (error) {
        console.error('Error fetching post:', error);
        handleError(error instanceof Error ? error : new Error('Failed to fetch post'));
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, clearError, handleError]);

  // Listen for authentication state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

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

  const handlePostLike = async () => {
    if (!currentUser) {
      alert('You must be logged in to like posts');
      return;
    }

    if (!post?.id) return;

    try {
      if (postLiked) {
        await unlikePost(post.id);
        setLocalPostLikes(prev => prev - 1);
        setPostLiked(false);
      } else {
        await likePost(post.id);
        setLocalPostLikes(prev => prev + 1);
        setPostLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like on post:', error);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!currentUser) {
      alert('You must be logged in to like comments');
      return;
    }

    try {
      const currentLikeState = commentLikes[commentId];

      if (currentLikeState?.liked) {
        await unlikeComment(commentId);
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: {
            liked: false,
            count: (prev[commentId]?.count || 0) - 1
          }
        }));
      } else {
        await likeComment(commentId);
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: {
            liked: true,
            count: (prev[commentId]?.count || 0) + 1
          }
        }));
      }
    } catch (error) {
      console.error('Error toggling like on comment:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('You must be logged in to comment');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      setSubmittingComment(true);

      const commentData = {
        postId: postId,
        content: newComment.trim(),
        author: currentUser.displayName || currentUser.email || 'Anonymous',
        authorId: currentUser.uid,
        likes: 0
      };

      await addComment(commentData);

      // Clear the form
      setNewComment('');

      // Refresh comments
      const updatedComments = await getComments(postId);
      setComments(updatedComments);

      // Update comment likes state for new comments
      const newCommentLikes = { ...commentLikes };
      updatedComments.forEach(comment => {
        if (!newCommentLikes[comment.id!]) {
          newCommentLikes[comment.id!] = {
            liked: false,
            count: comment.likes || 0
          };
        }
      });
      setCommentLikes(newCommentLikes);

    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleBackToForum = () => {
    router.push('/blog');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
        <div className="container mx-auto px-4 py-16">
          <LoadingError
            error={error}
            onRetry={() => window.location.reload()}
            onDismiss={clearError}
          />
          <div className="text-center mt-8">
            <button
              onClick={handleBackToForum}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Forum
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-gray-400 mb-8">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <button
              onClick={handleBackToForum}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Forum
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToForum}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Forum
            </button>
            <div className="flex items-center gap-3">
              {post.isPinned && (
                <span className="bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded">
                  PINNED
                </span>
              )}
              {post.isLocked && (
                <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                  LOCKED
                </span>
              )}
              <span className="bg-blue-500 text-white px-3 py-1 text-sm font-bold rounded">
                {categoryUtils.getCategoryName(post.category)}
              </span>
            </div>
          </div>

          {/* Post Content */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
              <span>By {post.author}</span>
              <span>{formatDate(post.createdAt)}</span>
              <button
                onClick={handlePostLike}
                disabled={!currentUser}
                className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
                  postLiked
                    ? "bg-red-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={currentUser ? (postLiked ? "Unlike this post" : "Like this post") : "Login to like posts"}
              >
                <span>♥</span>
                <span>{localPostLikes}</span>
              </button>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

          </div>

          {/* Comments Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
            <h2 className="text-xl font-bold text-white mb-6">
              Comments ({comments.length})
            </h2>

            {comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No comments yet</p>
                <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-blue-400">{comment.author}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <button
                        onClick={() => comment.id && handleCommentLike(comment.id)}
                        disabled={!currentUser}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                          commentLikes[comment.id!]?.liked
                            ? "bg-red-500 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        } disabled:opacity-50 disabled:cursor-not-allowed text-xs`}
                        title={currentUser ? "Like this comment" : "Login to like comments"}
                      >
                        <span>♥</span>
                        <span>{commentLikes[comment.id!]?.count || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Form */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Add a Comment</h3>

              {!currentUser ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-4">You must be logged in to comment</p>
                  <Link
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    disabled={submittingComment}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newComment.trim() || submittingComment}
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
