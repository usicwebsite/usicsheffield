"use client";

import { useState } from "react";
import { likePost, incrementViews } from "@/lib/firebase-utils";


interface ForumPostProps {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  createdAt: Date | { toDate(): Date };
  isPinned?: boolean;
  isLocked?: boolean;
}

export default function ForumPost({
  id,
  title,
  content,
  author,
  category,
  tags,
  likes,
  views,
  createdAt,
  isPinned = false,
  isLocked = false,
}: ForumPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localViews, setLocalViews] = useState(views);

  const handleLike = async () => {
    if (!isLiked) {
      try {
        await likePost(id);
        setLocalLikes(prev => prev + 1);
        setIsLiked(true);
      } catch (error) {
        console.error('Error liking post:', error);
      }
    }
  };

  const handleClick = async () => {
    try {
      await incrementViews(id);
      setLocalViews(prev => prev + 1);
    } catch (error) {
      console.error('Error incrementing views:', error);
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

  return (
    <div 
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {isPinned && (
              <span className="bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded">
                PINNED
              </span>
            )}
            {isLocked && (
              <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                LOCKED
              </span>
            )}
            <span className="bg-blue-500 text-white px-3 py-1 text-sm font-bold rounded">
              {category}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-200 transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-300 text-sm line-clamp-3 mb-4">
            {content}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span>By {author}</span>
          <span>{formatDate(createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-4">
                      <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
                isLiked 
                  ? "bg-red-500 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <span>♥</span>
              <span>{localLikes}</span>
            </button>
          
          <div className="flex items-center gap-1">
            <span>👁</span>
            <span>{localViews}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 