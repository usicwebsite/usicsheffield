"use client";

import { useState, useEffect } from "react";
import { getPosts, getCommentCount } from "@/lib/firebase-utils";
import { ForumPost as ForumPostType } from "@/lib/firebase-utils";
import ForumPost from "@/components/ForumPost";
import ForumSidebar from "@/components/ForumSidebar";
import NewPostForm from "@/components/NewPostForm";
import { LoadingError, ValidationError } from "@/components/ErrorDisplay";
import { useErrorHandler } from "@/components/ErrorBoundary";

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<ForumPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState<ForumPostType[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  
  // Enhanced error handling
  const { error, handleError, clearError } = useErrorHandler();

  // Fetch posts from Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        clearError();
        const fetchedPosts = await getPosts(selectedCategory || undefined, 20);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        handleError(error instanceof Error ? error : new Error('Failed to fetch posts'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, clearError, handleError]);

  // Fetch comment counts for posts
  const fetchCommentCounts = async (postsToFetch: ForumPostType[]) => {
    try {
      const counts: Record<string, number> = {};
      const commentPromises = postsToFetch.map(async (post) => {
        if (post.id) {
          const count = await getCommentCount(post.id);
          counts[post.id] = count;
        }
      });

      await Promise.all(commentPromises);
      setCommentCounts(counts);
    } catch (error) {
      console.error('Error fetching comment counts:', error);
      // Don't show error to user for comment counts, just log it
    }
  };

  // Fetch comment counts when posts change
  useEffect(() => {
    if (posts.length > 0) {
      fetchCommentCounts(posts);
    }
  }, [posts]);

  // Filter posts based on search query with validation
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      setValidationErrors([]);
    } else {
      // Validate search query
      if (searchQuery.length < 2) {
        setValidationErrors(['Search query must be at least 2 characters long']);
        setFilteredPosts([]);
        return;
      }
      
      if (searchQuery.length > 100) {
        setValidationErrors(['Search query is too long']);
        setFilteredPosts([]);
        return;
      }
      
      // Check for invalid characters
      if (/[<>'";&|]/.test(searchQuery)) {
        setValidationErrors(['Search query contains invalid characters']);
        setFilteredPosts([]);
        return;
      }
      
      setValidationErrors([]);
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [posts, searchQuery]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleShowNewPostForm = () => {
    setShowNewPostForm(true);
  };

  const handlePostCreated = async () => {
    setShowNewPostForm(false);
    // Refresh posts by refetching
    try {
      setLoading(true);
      clearError();
      const fetchedPosts = await getPosts(selectedCategory || undefined, 20);
      setPosts(fetchedPosts);
      // Refresh comment counts for the new posts
      await refreshCommentCounts(fetchedPosts);
    } catch (error) {
      console.error('Error refreshing posts:', error);
      handleError(error instanceof Error ? error : new Error('Failed to refresh posts'));
    } finally {
      setLoading(false);
    }
  };

  // Also refresh comment counts when posts are refreshed
  const refreshCommentCounts = async (refreshedPosts: ForumPostType[]) => {
    await fetchCommentCounts(refreshedPosts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white px-4">
            USIC FORUM
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Connect, discuss, and share with the USIC community
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="py-8 flex justify-center">
        <div className="w-16 h-1 bg-white/70"></div>
      </div>

      {/* Main forum content */}
      <div className="container mx-auto px-4 pb-16 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ForumSidebar
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              onShowNewPostForm={handleShowNewPostForm}
            />
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* Search and filters */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleShowNewPostForm}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200"
                >
                  New Post
                </button>
              </div>

              {/* Category filter pills */}
              {selectedCategory && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Filtered by:</span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCategory}
                  </span>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✕ Clear
                  </button>
                </div>
              )}
            </div>

            {/* Error displays */}
            {error && (
              <div className="mb-6">
                <LoadingError 
                  error={error} 
                  onRetry={() => {
                    clearError();
                    const fetchPosts = async () => {
                      try {
                        setLoading(true);
                        const fetchedPosts = await getPosts(selectedCategory || undefined, 20);
                        setPosts(fetchedPosts);
                      } catch (error) {
                        handleError(error instanceof Error ? error : new Error('Failed to fetch posts'));
                      } finally {
                        setLoading(false);
                      }
                    };
                    fetchPosts();
                  }}
                  onDismiss={clearError}
                />
              </div>
            )}

            {validationErrors.length > 0 && (
              <div className="mb-6">
                <ValidationError 
                  errors={validationErrors} 
                  onDismiss={() => setValidationErrors([])}
                />
              </div>
            )}

            {/* New post form */}
            {showNewPostForm && (
              <div className="mb-8">
                <NewPostForm onPostCreated={handlePostCreated} />
              </div>
            )}

            {/* Posts list */}
            <div className="space-y-6">
              {loading ? (
                // Loading state
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                // Empty state
                <div className="text-center py-12">
                  <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
                  <p className="text-gray-400 mb-6">
                    {searchQuery 
                      ? "No posts match your search criteria."
                      : "Be the first to start a discussion!"
                    }
                  </p>
                </div>
              ) : (
                // Posts list
                filteredPosts.map((post) => (
                  <ForumPost
                    key={post.id}
                    id={post.id || ''}
                    title={post.title}
                    content={post.content}
                    author={post.author}
                    category={post.category}
                    likes={post.likes}
                    commentsCount={commentCounts[post.id || ''] || 0}
                    createdAt={post.createdAt}
                    isPinned={post.isPinned}
                    isLocked={post.isLocked}
                  />
                ))
              )}
            </div>

            {/* Load more button */}
            {posts.length >= 20 && (
              <div className="text-center mt-8">
                <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
                  Load More Posts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 