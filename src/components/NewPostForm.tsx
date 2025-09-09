"use client";

import { useState, useEffect } from "react";
import { createPost } from "@/lib/firebase-client";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import ForumAuth from "./ForumAuth";
import { useFormValidation, ClientValidationSchemas } from "@/lib/client-validation";
import { categoryUtils } from "@/lib/static-data";

interface NewPostFormProps {
  onPostCreated?: () => void;
}

export default function NewPostForm({ onPostCreated }: NewPostFormProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [submitFieldErrors, setSubmitFieldErrors] = useState<Record<string, string>>({});

  // Enhanced form validation
  const {
    data: formData,
    updateField
  } = useFormValidation(ClientValidationSchemas.postForm, {
    title: "",
    content: "",
    category: categoryUtils.getCategoryIds()[0] // Use first category as default
  });

  // Listen to Firebase auth state changes
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = categoryUtils.getAllCategories();

  // Simple field validation functions
  const validateTitle = (value: string) => {
    if (!value || value.trim().length < 5) return "Title must be at least 5 characters";
    if (value.length > 200) return "Title must be less than 200 characters";
    return null;
  };

  const validateContent = (value: string) => {
    if (!value || value.trim().length < 10) return "Content must be at least 10 characters";
    if (value.length > 10000) return "Content must be less than 10,000 characters";
    return null;
  };

  const validateCategory = (value: string) => {
    if (!value || value.trim().length < 2) return "Please select a category";
    return null;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark that user has attempted to submit (for showing validation errors)
    setHasAttemptedSubmit(true);

    // Validate all fields on submit
    const titleError = validateTitle(formData.title as string);
    const contentError = validateContent(formData.content as string);
    const categoryError = validateCategory(formData.category as string);

    // Set field errors
    const newFieldErrors: Record<string, string> = {};
    if (titleError) newFieldErrors.title = titleError;
    if (contentError) newFieldErrors.content = contentError;
    if (categoryError) newFieldErrors.category = categoryError;

    setSubmitFieldErrors(newFieldErrors);

    // Check if all validations passed
    if (Object.keys(newFieldErrors).length > 0) {
      console.error("Form validation failed:", newFieldErrors);
      return;
    }

    if (!user) {
      alert("Please sign in to create a post");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createPost({
        title: (formData.title as string).trim(),
        content: (formData.content as string).trim(),
        author: user.displayName || user.email || "Anonymous User",
        authorId: user.uid,
        category: formData.category as string,
      });

      // Clear any previous error messages
      setErrorMessage(null);

      // Reset validation state
      setHasAttemptedSubmit(false);
      setSubmitFieldErrors({});

      // Show confirmation message
      setShowConfirmation(true);

      // Reset form
      updateField("title", "");
      updateField("content", "");
      updateField("category", categoryUtils.getCategoryIds()[0]);

      // Hide confirmation after 10 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        onPostCreated?.();
      }, 10000);
    } catch (error) {
      console.error("Error creating post:", error);

      // Handle rate limiting errors specifically
      if ((error as { rateLimitInfo?: { resetTime: string } }).rateLimitInfo) {
        const rateLimitInfo = (error as { rateLimitInfo: { resetTime: string } }).rateLimitInfo;
        const resetTime = new Date(rateLimitInfo.resetTime);
        const timeUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60)); // minutes

        setErrorMessage(
          `You've reached the post submission limit. You can submit another post in ${timeUntilReset} minute${timeUntilReset !== 1 ? 's' : ''}. ` +
          `Posts are limited to 1 per hour to maintain quality discussions.`
        );
      } else {
        // Show general error message
        const errorMsg = error instanceof Error ? error.message : "Failed to create post. Please try again.";
        setErrorMessage(errorMsg);
      }

      // Auto-hide error message after 8 seconds for rate limits, 5 seconds for others
      const hideDelay = (error as { rateLimitInfo?: unknown }).rateLimitInfo ? 8000 : 5000;
      setTimeout(() => {
        setErrorMessage(null);
      }, hideDelay);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <ForumAuth />
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Create New Post</h3>
      
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/40 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-red-300 mb-1">
                Submission Failed
              </h4>
              <p className="text-red-200 text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Dismiss error message"
            >
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showConfirmation && (
        <div className="mb-6 p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/40 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-green-300 mb-1">
                Post Submitted Successfully! 🎉
              </h4>
              <p className="text-green-200 text-sm leading-relaxed">
                Your post has been submitted for approval. Our moderation team will review it shortly, and you&apos;ll receive a notification once it&apos;s published. This usually takes 24-48 hours.
              </p>
              <div className="mt-3 flex items-center text-xs text-green-400">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.414L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Check your profile for updates on approval status
              </div>
            </div>
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Dismiss success message"
            >
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title as string}
            onChange={(e) => {
              updateField("title", e.target.value);
              // Remove real-time validation - only validate on submit
            }}
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              hasAttemptedSubmit && submitFieldErrors.title ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Enter post title..."
            required
          />
          {submitFieldErrors.title && (
            <p className="mt-1 text-sm text-red-400">{submitFieldErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={formData.category as string}
            onChange={(e) => {
              updateField("category", e.target.value);
              // Remove real-time validation - only validate on submit
            }}
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              hasAttemptedSubmit && submitFieldErrors.category ? 'border-red-500' : 'border-gray-600'
            }`}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {submitFieldErrors.category && (
            <p className="mt-1 text-sm text-red-400">{submitFieldErrors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            value={formData.content as string}
            onChange={(e) => {
              updateField("content", e.target.value);
              // Remove real-time validation - only validate on submit
            }}
            rows={6}
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
              hasAttemptedSubmit && submitFieldErrors.content ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Write your post content here..."
            required
          />
          {submitFieldErrors.content && (
            <p className="mt-1 text-sm text-red-400">{submitFieldErrors.content}</p>
          )}
        </div>


        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit for Approval</span>
          )}
        </button>
      </form>
    </div>
  );
} 