"use client";

import { useState, useEffect } from "react";
import { getPosts } from "@/lib/firebase-utils";
import { ForumPost as ForumPostType } from "@/lib/firebase-utils";
import ForumPost from "@/components/ForumPost";
import ForumSidebar from "@/components/ForumSidebar";
import NewPostForm from "@/components/NewPostForm";

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<ForumPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState<ForumPostType[]>([]);

  // Fetch posts from Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await getPosts(selectedCategory || undefined, 20);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  // Filter posts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const handlePostCreated = () => {
    setShowNewPostForm(false);
    // Refresh posts after creating a new one
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts(selectedCategory || undefined, 20);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
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
      <div className="container mx-auto px-4 pb-16">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
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
                  {!searchQuery && (
                    <button
                      onClick={handleShowNewPostForm}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                      Create First Post
                    </button>
                  )}
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
                    tags={post.tags}
                    likes={post.likes}
                    views={post.views}
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