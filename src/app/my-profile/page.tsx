"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser, updateProfile } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { UserCircle, Camera, Upload, Shield } from 'lucide-react';
import { PageLoadingSpinner } from '@/components/LoadingSpinner';
import Image from 'next/image';
import { checkUserAdminStatus, ForumPost } from '@/lib/firebase-client';
import { getUserSubmittedPosts, getUserApprovedPosts, getUserRejectedPosts } from '@/lib/firebase-utils';
import { categoryUtils } from '@/lib/static-data';

export default function MyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Removed isEditing state since we no longer have edit mode
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submittedPosts, setSubmittedPosts] = useState<ForumPost[]>([]);
  const [approvedPosts, setApprovedPosts] = useState<ForumPost[]>([]);
  const [rejectedPosts, setRejectedPosts] = useState<ForumPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form validation - no longer needed for profile editing
  // const {
  //   data: formData,
  //   fieldErrors,
  //   isValid,
  //   updateField,
  //   validateField
  // } = useFormValidation(ClientValidationSchemas.profileForm || ClientValidationSchemas.loginForm, {
  //   displayName: '',
  //   email: ''
  // });

  // Check authentication status
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      console.error('Firebase Auth not initialized');
      setError('Authentication service not available');
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          // Redirect to login if not authenticated
          router.push('/login');
          return;
        }
        
        // Verify user object has required methods
        if (typeof user.getIdToken !== 'function') {
          console.error('User object is invalid:', user);
          setError('Invalid user session. Please log in again.');
          router.push('/login');
          return;
        }
        
        setUser(user);
        // No longer initializing form data since we're not editing display name/email
        
        // Check if user is admin by checking Firestore admins collection
        try {
          const adminStatus = await checkUserAdminStatus(user.uid);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in auth state change:', error);
        setError('Authentication error. Please log in again.');
        router.push('/login');
      }
    }, (error) => {
      console.error('Auth state change error:', error);
      setError('Authentication error. Please log in again.');
      router.push('/login');
    });

    return () => unsubscribe();
  }, [router]);

  const loadUserPosts = useCallback(async () => {
    if (!user) return;

    try {
      setPostsLoading(true);

      // Load posts from all three collections
      const [submitted, approved, rejected] = await Promise.all([
        getUserSubmittedPosts(user.uid),
        getUserApprovedPosts(user.uid),
        getUserRejectedPosts(user.uid)
      ]);

      setSubmittedPosts(submitted);
      setApprovedPosts(approved);
      setRejectedPosts(rejected);
    } catch (error) {
      console.error('Error loading user posts:', error);
    } finally {
      setPostsLoading(false);
    }
  }, [user]);

  // Load user's forum posts
  useEffect(() => {
    if (user) {
      loadUserPosts();
    }
  }, [user, loadUserPosts]);

  // Removed handleEditProfile, handleCancelEdit, and handleSaveProfile since we no longer have edit mode

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setError(null);
      setSuccessMessage('');

      // Verify user object is still valid
      if (typeof user.getIdToken !== 'function') {
        throw new Error('Invalid user session. Please log in again.');
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Cloudinary via API route
      const response = await fetch('/api/upload-profile-photo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Upload failed');
      }

      // Update Firebase Auth profile with Cloudinary URL
      await updateProfile(user, { photoURL: result.url });
      
      setSuccessMessage('Profile picture updated successfully!');
      
      // Refresh user data
      setUser({ ...user });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      if (error instanceof Error && error.message.includes('getIdToken')) {
        setError('Session expired. Please log in again.');
        router.push('/login');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to upload profile picture');
      }
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;

    try {
      setIsUploadingPhoto(true);
      setError(null);
      setSuccessMessage('');

      // Remove profile picture
      await updateProfile(user, { photoURL: null });
      
      setSuccessMessage('Profile picture removed successfully!');
      
      // Refresh user data
      setUser({ ...user });
    } catch (error) {
      console.error('Error removing profile picture:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove profile picture');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
        {/* Hero section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white px-4">
            MY PROFILE
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="py-8 flex justify-center">
        <div className="w-16 h-1 bg-white/70"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Success message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-300">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6">
              <ErrorDisplay
                error={error}
                onDismiss={() => setError(null)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="relative w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-16 h-16 text-white" />
                    )}
                    
                    {/* Photo upload overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Upload button */}
                    <button
                      onClick={triggerFileInput}
                      disabled={isUploadingPhoto}
                      className="absolute inset-0 w-full h-full rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
                      title="Change profile picture"
                    >
                      <span className="sr-only">Change profile picture</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-white">
                      {user.displayName || 'User'}
                    </h2>
                    {isAdmin && (
                      <div className="flex items-center gap-1 bg-blue-600/20 border border-blue-500/30 rounded-full px-2 py-1">
                        <Shield className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-300 font-medium">Admin</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                  
                  {/* Photo upload controls - always visible */}
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={triggerFileInput}
                      disabled={isUploadingPhoto}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
                    >
                      {isUploadingPhoto ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Change Photo
                        </>
                      )}
                    </button>
                    
                    {user.photoURL && (
                      <button
                        onClick={handleRemovePhoto}
                        disabled={isUploadingPhoto}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>



                {/* Removed Edit Profile button since we only allow photo editing */}
              </div>
            </div>

            {/* Profile Information - Read Only */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                    <p className="text-white">{user.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Joined</label>
                    <p className="text-white">
                      {user.metadata.creationTime ? formatDate(new Date(user.metadata.creationTime)) : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Sign In</label>
                    <p className="text-white">
                      {user.metadata.lastSignInTime ? formatDate(new Date(user.metadata.lastSignInTime)) : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                    <div className="flex items-center gap-2">
                      {isAdmin ? (
                        <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-md px-3 py-1">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300 font-medium">Administrator</span>
                        </div>
                      ) : (
                        <span className="text-white">Standard User</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forum Posts Section */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">My Forum Posts</h3>

            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your posts...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Submitted Posts */}
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-300 mb-3">Submitted for Approval</h4>
                  <div className="text-3xl font-bold text-blue-400 mb-2">{submittedPosts.length}</div>
                  <p className="text-blue-200 text-sm">Posts waiting for admin review</p>
                  {submittedPosts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {submittedPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="bg-blue-600/20 rounded p-2">
                          <h5 className="text-white font-medium text-sm truncate">{post.title}</h5>
                          <p className="text-blue-200 text-xs">
                            {post.createdAt && (typeof post.createdAt === 'object' && 'toDate' in post.createdAt ? post.createdAt.toDate() : new Date(post.createdAt)).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {submittedPosts.length > 3 && (
                        <p className="text-blue-300 text-xs">+{submittedPosts.length - 3} more...</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Approved Posts */}
                <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-300 mb-3">Approved Posts</h4>
                  <div className="text-3xl font-bold text-green-400 mb-2">{approvedPosts.length}</div>
                  <p className="text-green-200 text-sm">Posts published to the forum</p>
                  {approvedPosts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {approvedPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="bg-green-600/20 rounded p-2">
                          <h5 className="text-white font-medium text-sm truncate">{post.title}</h5>
                          <p className="text-green-200 text-xs">
                            {post.createdAt && (typeof post.createdAt === 'object' && 'toDate' in post.createdAt ? post.createdAt.toDate() : new Date(post.createdAt)).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {approvedPosts.length > 3 && (
                        <p className="text-green-300 text-xs">+{approvedPosts.length - 3} more...</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Rejected Posts */}
                <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-red-300 mb-3">Rejected Posts</h4>
                  <div className="text-3xl font-bold text-red-400 mb-2">{rejectedPosts.length}</div>
                  <p className="text-red-200 text-sm">Posts that need revision</p>
                  {rejectedPosts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {rejectedPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="bg-red-600/20 rounded p-2">
                          <h5 className="text-white font-medium text-sm truncate">{post.title}</h5>
                          <p className="text-red-200 text-xs">
                            {post.createdAt && (typeof post.createdAt === 'object' && 'toDate' in post.createdAt ? post.createdAt.toDate() : new Date(post.createdAt)).toLocaleDateString()}
                          </p>
                          {post.rejectionReason && (
                            <p className="text-red-300 text-xs mt-1 truncate" title={post.rejectionReason}>
                              Reason: {post.rejectionReason.substring(0, 30)}...
                            </p>
                          )}
                        </div>
                      ))}
                      {rejectedPosts.length > 3 && (
                        <p className="text-red-300 text-xs">+{rejectedPosts.length - 3} more...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Detailed Posts View */}
            {(submittedPosts.length > 0 || approvedPosts.length > 0 || rejectedPosts.length > 0) && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">Recent Posts</h4>
                <div className="space-y-4">
                  {/* Show recent posts from all categories */}
                  {[
                    ...submittedPosts.slice(0, 2).map(post => ({ ...post, status: 'submitted' })),
                    ...approvedPosts.slice(0, 2).map(post => ({ ...post, status: 'approved' })),
                    ...rejectedPosts.slice(0, 2).map(post => ({ ...post, status: 'rejected' }))
                  ]
                    .sort((a, b) => {
                      const dateA = a.createdAt ? (typeof a.createdAt === 'object' && 'toDate' in a.createdAt ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
                      const dateB = b.createdAt ? (typeof b.createdAt === 'object' && 'toDate' in b.createdAt ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 5)
                    .map((post) => (
                      <div key={`${post.status}-${post.id}`} className="bg-white/5 rounded-lg p-4 border-l-4"
                           style={{ borderLeftColor: post.status === 'approved' ? '#10B981' : post.status === 'rejected' ? '#EF4444' : '#3B82F6' }}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-white font-medium mb-1">{post.title}</h5>
                            <p className="text-gray-300 text-sm mb-2 line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>Category: {categoryUtils.getCategoryName(post.category)}</span>
                              <span>
                                {post.createdAt && (typeof post.createdAt === 'object' && 'toDate' in post.createdAt ? post.createdAt.toDate() : new Date(post.createdAt)).toLocaleDateString()}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                post.status === 'approved' ? 'bg-green-600/20 text-green-300' :
                                post.status === 'rejected' ? 'bg-red-600/20 text-red-300' :
                                'bg-blue-600/20 text-blue-300'
                              }`}>
                                {post.status === 'submitted' ? 'Pending' : post.status === 'approved' ? 'Approved' : 'Rejected'}
                              </span>
                            </div>
                            {post.status === 'rejected' && post.rejectionReason && (
                              <div className="mt-2 p-2 bg-red-600/10 border border-red-500/20 rounded">
                                <p className="text-red-300 text-xs">
                                  <strong>Rejection Reason:</strong> {post.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden file input for photo upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
