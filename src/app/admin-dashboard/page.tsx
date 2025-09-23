"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { getSubmittedPosts, approvePost, rejectPost, getApprovedPosts, updatePost, getComments, getCommentCount, deleteComment, ForumPost, ForumComment } from '@/lib/firebase-utils';
import { categoryUtils } from '@/lib/static-data';
import AdminTimeoutStatus from '@/components/AdminTimeoutStatus';
import UsersManagement from '@/components/admin/UsersManagement';

// Helper function to get Firebase ID token
const getIdToken = async (): Promise<string | null> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('[AdminDashboard] ❌ Error getting ID token:', error);
    return null;
  }
};



interface AdminStats {
  totalPosts: number;
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  totalUsers: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  price?: string; // Keep for backwards compatibility
  memberPrice?: string;
  nonMemberPrice?: string;
  meetUpTime?: string;
  meetUpLocation?: string;
  description: string;
  imageUrl?: string;
  formFields: string[];
  signupOpen: boolean;
  noSignupNeeded?: boolean; // Keep for backwards compatibility
  signupMethod?: 'none' | 'website' | 'external';
  maxSignups?: number;
  tags: string[];
  createdAt: Date;
  createdBy: string;
  isPublic: boolean;
  signupFormUrl?: string;
}

interface EventFormData {
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  price: string; // Keep for backwards compatibility - member price
  nonMemberPrice: string; // Required field
  memberPrice: string; // Required field
  meetUpTime?: string;
  meetUpLocation?: string;
  description: string;
  imageFile?: File;
  formFields: string[];
  signupOpen: boolean;
  noSignupNeeded: boolean; // Keep for backwards compatibility
  signupMethod: 'none' | 'website' | 'external'; // New comprehensive signup method
  maxSignups?: number;
  tags: string[];
  isPublic: boolean;
  signupFormUrl?: string;
}


export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'events' | 'users'>(() => {
    // Read the tab parameter from URL to set initial state
    const tabParam = searchParams.get('tab');
    if (tabParam === 'posts' || tabParam === 'events' || tabParam === 'users') {
      return tabParam;
    }
    return 'overview';
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPostForRejection, setSelectedPostForRejection] = useState<ForumPost | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvedPosts, setApprovedPosts] = useState<ForumPost[]>([]);
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [postComments, setPostComments] = useState<{[postId: string]: ForumComment[]}>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [commentCounts, setCommentCounts] = useState<{[postId: string]: number}>({});
  const [loadingPosts, setLoadingPosts] = useState<{[postId: string]: 'approving' | 'rejecting' | null}>({});
  
  // Events state
  const [events, setEvents] = useState<Event[]>([]);

  // Users management state
  const [usersSearchTerm, setUsersSearchTerm] = useState('');
  const [usersFilterStatus, setUsersFilterStatus] = useState<'all' | 'restricted' | 'active'>('all');
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    price: '', // Member price - backwards compatibility
    nonMemberPrice: '', // Required field
    memberPrice: '', // Optional member price
    meetUpTime: '',
    meetUpLocation: '',
    description: '',
    formFields: [],
    signupOpen: true, // Default to open for signups
    noSignupNeeded: false, // Keep for backwards compatibility
    signupMethod: 'website', // Default to website signup
    isPublic: true, // Default to public
    maxSignups: 50, // Default to 50 signups
    tags: [], // Default to empty array
    signupFormUrl: '' // Default to empty string
  });
  const [eventFormErrors, setEventFormErrors] = useState<string[]>([]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // AI-related state
  const [eventFormTab, setEventFormTab] = useState<'manual' | 'ai'>('manual');
  const [aiEventText, setAiEventText] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Batch events state
  const [parsedEvents, setParsedEvents] = useState<Event[]>([]);
  const [showBatchReview, setShowBatchReview] = useState(false);
  const [batchCreationProgress, setBatchCreationProgress] = useState<{[key: number]: 'pending' | 'creating' | 'completed' | 'failed'}>({});
  const [batchCreationErrors, setBatchCreationErrors] = useState<{[key: number]: string}>({});
  
  const [availableFormFields] = useState([
    'name',
    'email',
    'whatsapp_number',
    'student_id',
    'dietary_requirements',
    'emergency_contact',
    'transportation_needs',
    'accommodation_needs',
    'special_requests'
  ]);

  const [customFormFields, setCustomFormFields] = useState<string[]>([]);
  const [newCustomField, setNewCustomField] = useState('');

  const checkAdminStatus = async (uid: string): Promise<boolean> => {
    try {
      const db = getFirestoreDb();
      if (!db) {
        console.error('[AdminDashboard] ❌ Firestore not initialized');
        return false;
      }

      const adminDocRef = doc(db, 'admins', uid);
      const adminDocSnap = await getDoc(adminDocRef);

      if (adminDocSnap.exists()) {
        return true;
      } else {
        // Let's also check what documents exist in the admins collection
        try {
          const adminsCollection = collection(db, 'admins');
          await getDocs(adminsCollection);
        } catch (collectionError) {
          console.error('[AdminDashboard] ❌ Error listing admins collection:', collectionError);
        }

        return false;
      }
    } catch (error) {
      console.error('[AdminDashboard] ❌ Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          router.push('/admin-login');
          return;
        }

        // Check admin status in Firestore
        const isAdminUser = await checkAdminStatus(user.uid);

        if (!isAdminUser) {
          await signOut(auth);
          router.push('/admin-login');
          return;
        }

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

  // Load events when Events tab is selected
  useEffect(() => {
    if (activeTab === 'events' && isAuthenticated && isAdmin && events.length === 0) {
      loadEvents();
    }
  }, [activeTab, isAuthenticated, isAdmin, events.length]);

  // Update activeTab when URL search params change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'posts' || tabParam === 'events') {
      setActiveTab(tabParam);
    } else if (tabParam === 'overview' || !tabParam) {
      setActiveTab('overview');
    }
  }, [searchParams]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load submitted posts directly from Firestore
      const submittedPosts = await getSubmittedPosts(50);
      setPendingPosts(submittedPosts);

      // Load approved posts for stats
      const approvedPostsData = await getApprovedPosts();

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
      setIsLoading(false);
    }
  };

  const loadApprovedPosts = async () => {
    try {
      setIsLoading(true);

      const posts = await getApprovedPosts(undefined, 100); // Load up to 100 approved posts
      setApprovedPosts(posts);

      // Load comment counts for all posts
      const counts: {[postId: string]: number} = {};
      await Promise.all(posts.map(async (post) => {
        if (post.id) {
          const count = await getCommentCount(post.id);
          counts[post.id] = count;
        }
      }));

      setCommentCounts(counts);
    } catch (error) {
      console.error('[AdminDashboard] Failed to load approved posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setIsLoading(true);

      // Get ID token for authentication
      const token = await getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      // Fetch events from the admin API
      const response = await fetch('/api/admin/events', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('[AdminDashboard] Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh users data (called from the header)
  const fetchUsersData = async () => {
    // This function will be passed to UsersManagement component
    // The actual implementation will be in the UsersManagement component
    // We just need to trigger a refresh
    if (typeof window !== 'undefined') {
      // Dispatch a custom event that UsersManagement can listen to
      window.dispatchEvent(new CustomEvent('refreshUsers'));
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      // Get Firebase ID token for authentication
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Unable to get authentication token');
      }
      
      // Call the API endpoint to delete the post
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }

      // Remove from approved posts list
      setApprovedPosts(prev => prev.filter(post => post.id !== postId));

      // Update stats
      setStats(prev => ({
        ...prev,
        approvedPosts: prev.approvedPosts - 1,
        totalPosts: prev.totalPosts - 1
      }));
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
  };

  const cancelEditing = () => {
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('');
  };

  const savePostEdits = async () => {
    if (!editingPost) return;

    try {
      const updates = {
        title: editTitle.trim(),
        content: editContent.trim(),
        category: editCategory.trim(),
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
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };





  const handleApprovePost = async (postId: string) => {
    try {
      // Set loading state
      setLoadingPosts(prev => ({ ...prev, [postId]: 'approving' }));
      
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !postId) {
        console.error('[AdminDashboard] No authenticated user or invalid post ID');
        setLoadingPosts(prev => ({ ...prev, [postId]: null }));
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
    } catch (error) {
      console.error('Error approving post:', error);
      // You could show an error message to the user here
    } finally {
      // Clear loading state
      setLoadingPosts(prev => ({ ...prev, [postId]: null }));
    }
  };

  const handleRejectPost = async (postId: string, rejectionReason: string) => {
    try {
      // Set loading state
      setLoadingPosts(prev => ({ ...prev, [postId]: 'rejecting' }));
      
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !postId) {
        console.error('[AdminDashboard] No authenticated user or invalid post ID');
        setLoadingPosts(prev => ({ ...prev, [postId]: null }));
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
    } catch (error) {
      console.error('Error rejecting post:', error);
      // You could show an error message to the user here
    } finally {
      // Clear loading state
      setLoadingPosts(prev => ({ ...prev, [postId]: null }));
    }
  };

  // Helper function to update signup method based on URL
  const updateSignupMethodBasedOnUrl = (url: string, currentMethod: 'none' | 'website' | 'external'): 'none' | 'website' | 'external' => {
    if (url.trim()) {
      return 'external';
    }
    // If URL is cleared and current method was external, switch to website
    return currentMethod === 'external' ? 'website' : currentMethod;
  };


  const validateEventForm = (formData: EventFormData): string[] => {
    const errors: string[] = [];

    // Only title is required
    if (!formData.title.trim()) {
      errors.push('Title');
    }

    // Signup method validation
    if (formData.signupMethod === 'external' && !formData.signupFormUrl?.trim()) {
      errors.push('Signup Form URL (required for external signup)');
    }

    // Form fields validation - only if website signup is selected
    if (formData.signupMethod === 'website' && formData.formFields.length === 0) {
      errors.push('At least one form field (when website signup is selected)');
    }

    return errors;
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateEventForm(eventFormData);
    if (validationErrors.length > 0) {
      setEventFormErrors(validationErrors);
      return;
    }

    // Clear any previous errors
    setEventFormErrors([]);

    try {
      setIsCreatingEvent(true);
      
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Create FormData for the request
      const formData = new FormData();
      formData.append('title', eventFormData.title);
      formData.append('date', eventFormData.date);
      formData.append('startTime', eventFormData.startTime);
      if (eventFormData.endTime) {
        formData.append('endTime', eventFormData.endTime);
      }
      formData.append('location', eventFormData.location);
      // Member price uses the old price field for backwards compatibility
      formData.append('price', eventFormData.price || '');
      // Both member and non-member prices are required
      formData.append('memberPrice', eventFormData.memberPrice.trim());
      formData.append('nonMemberPrice', eventFormData.nonMemberPrice.trim());
      if (eventFormData.meetUpTime) {
        formData.append('meetUpTime', eventFormData.meetUpTime);
      }
      if (eventFormData.meetUpLocation) {
        formData.append('meetUpLocation', eventFormData.meetUpLocation);
      }
      formData.append('description', eventFormData.description);
      // Handle formFields based on signup method
      if (eventFormData.signupMethod === 'none') {
        formData.append('formFields', JSON.stringify([])); // Empty array for no signup events
      } else if (eventFormData.signupMethod === 'website') {
        formData.append('formFields', JSON.stringify(eventFormData.formFields));
      } else {
        // External signup - empty form fields since signup happens externally
        formData.append('formFields', JSON.stringify([]));
      }
      formData.append('signupOpen', eventFormData.signupOpen.toString());
      formData.append('signupMethod', eventFormData.signupMethod);
      formData.append('isPublic', eventFormData.isPublic.toString());
      formData.append('tags', JSON.stringify(eventFormData.tags));
      formData.append('maxSignups', (eventFormData.maxSignups || 50).toString());
      if (eventFormData.signupFormUrl) {
        formData.append('signupFormUrl', eventFormData.signupFormUrl);
      }
      formData.append('createdBy', user.uid);
      
      if (eventFormData.imageFile) {
        formData.append('image', eventFormData.imageFile);
      }

      // Get ID token for authentication
      const token = await getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      // Call the API to create the event
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle the simplified error format - only title is required
        if (errorData.message) {
          throw new Error(errorData.message);
        }
        throw new Error(errorData.error || 'Failed to create event');
      }

      const result = await response.json();
      
      // Add the new event to the events list
      const newEvent: Event = {
        id: result.eventId,
        title: eventFormData.title,
        date: eventFormData.date,
        startTime: eventFormData.startTime,
        endTime: eventFormData.endTime,
        location: eventFormData.location,
        price: eventFormData.price, // Keep for backwards compatibility
        memberPrice: eventFormData.price, // Use the price field as member price
        nonMemberPrice: eventFormData.nonMemberPrice,
        meetUpTime: eventFormData.meetUpTime,
        meetUpLocation: eventFormData.meetUpLocation,
        description: eventFormData.description,
        imageUrl: result.imageUrl,
        formFields: eventFormData.formFields,
        signupOpen: eventFormData.signupOpen,
        noSignupNeeded: eventFormData.signupMethod === 'none',
        signupMethod: eventFormData.signupMethod,
        isPublic: eventFormData.isPublic,
        maxSignups: eventFormData.maxSignups,
        tags: eventFormData.tags,
        createdAt: new Date(),
        createdBy: user.uid,
        signupFormUrl: eventFormData.signupFormUrl
      };
      
      setEvents(prev => [newEvent, ...prev]);
      
      // Reset form and close modal
                    setEventFormData({
                      title: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      location: '',
                      price: '', // Member price
                      nonMemberPrice: '', // Required field
                      memberPrice: '', // Optional member price
                      meetUpTime: '',
                      meetUpLocation: '',
                      description: '',
                      formFields: [],
                      signupOpen: true,
                      noSignupNeeded: false, // Keep for backwards compatibility
                      signupMethod: 'website', // Default to website signup
                      isPublic: true,
                      maxSignups: 50,
                      tags: [],
                      signupFormUrl: ''
                    });
      setEventFormErrors([]);
      setImagePreview(null);
      setShowEventForm(false);
    } catch (error) {
      console.error('Error creating event:', error);
      // Clear validation errors and show API error
      setEventFormErrors([error instanceof Error ? error.message : 'Failed to create event']);
    } finally {
      setIsCreatingEvent(false);
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

  const handleAIEventParsing = async () => {
    if (!aiEventText.trim()) {
      alert('Please enter event details to parse');
      return;
    }

    try {
      setIsProcessingAI(true);
      
      const token = await getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const response = await fetch('/api/admin/events/ai-parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ eventText: aiEventText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse event details');
      }

      const result = await response.json();
      
      if (result.success && result.parsedData) {
        // Handle multiple events
        if (Array.isArray(result.parsedData) && result.parsedData.length > 1) {
          // Multiple events - show batch review
          setParsedEvents(result.parsedData);
          setShowBatchReview(true);

          // Initialize batch creation progress
          const progress: {[key: number]: 'pending' | 'creating' | 'completed' | 'failed'} = {};
          result.parsedData.forEach((event: Event, index: number) => {
            progress[index] = 'pending';
          });
          setBatchCreationProgress(progress);
          setBatchCreationErrors({});

          // Show success message
          alert(result.message || `Successfully parsed ${result.parsedData.length} events! Please review them before creating.`);
        } else {
          // Single event - populate form as before
          const singleEvent = Array.isArray(result.parsedData) ? result.parsedData[0] : result.parsedData;
          setEventFormData({
            title: singleEvent.title || '',
            date: singleEvent.date || '',
            startTime: singleEvent.startTime || '',
            endTime: singleEvent.endTime || '',
            location: singleEvent.location || '',
            price: singleEvent.price || '', // Member price (legacy field, now used for member price)
            nonMemberPrice: singleEvent.nonMemberPrice || '',
            memberPrice: singleEvent.price || '', // Member price from AI extraction
            meetUpTime: singleEvent.meetUpTime || '',
            meetUpLocation: singleEvent.meetUpLocation || '',
            description: singleEvent.description || aiEventText,
            formFields: ['name', 'email'], // Default form fields
            signupOpen: true,
            noSignupNeeded: false, // Keep for backwards compatibility
            signupMethod: singleEvent.signupFormUrl ? 'external' : 'website', // Auto-select external if URL found
            isPublic: true, // Default to public
            maxSignups: 50, // Default to 50 signups
            imageFile: undefined,
            tags: [], // Default to empty array
            signupFormUrl: singleEvent.signupFormUrl || '' // Extracted signup URL
          });

          // Set missing fields for visual indication
          setMissingFields(result.eventsWithMissingFields?.[0]?.missingFields || []);

          // Switch to manual tab to show the populated form
          setEventFormTab('manual');

          // Show appropriate message
          const message = result.message || 'Event details parsed successfully! Please review and adjust as needed.';
          alert(message);
        }
      }
    } catch (error) {
      console.error('Error parsing event details:', error);
      alert(error instanceof Error ? error.message : 'Failed to parse event details');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleBatchCreateEvents = async () => {
    try {
      setIsCreatingEvent(true);
      const token = await getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      const errors: {[key: number]: string} = {};
      let successCount = 0;

      // Create events one by one with progress tracking
      for (let i = 0; i < parsedEvents.length; i++) {
        const event = parsedEvents[i];

        // Skip if missing required fields (only title is required)
        const requiredFields = ['title'] as const;
        const missing = requiredFields.filter(field => !event[field as keyof Event]);
        if (missing.length > 0) {
          errors[i] = `Missing required field: ${missing.join(', ')}`;
          setBatchCreationProgress(prev => ({ ...prev, [i]: 'failed' }));
          setBatchCreationErrors(prev => ({ ...prev, [i]: errors[i] }));
          continue;
        }

        // Skip form field validation if no signup is needed
        if (!event.noSignupNeeded && (!event.formFields || event.formFields.length === 0)) {
          errors[i] = 'Please select at least one form field';
          setBatchCreationProgress(prev => ({ ...prev, [i]: 'failed' }));
          setBatchCreationErrors(prev => ({ ...prev, [i]: errors[i] }));
          continue;
        }

        try {
          setBatchCreationProgress(prev => ({ ...prev, [i]: 'creating' }));

          // Create FormData for the request
          const formData = new FormData();
          formData.append('title', event.title);
          formData.append('date', event.date);
          formData.append('startTime', event.startTime);
          if (event.endTime) {
            formData.append('endTime', event.endTime);
          }
          formData.append('location', event.location);
          formData.append('price', event.price || 'Free');
          formData.append('description', event.description);
          // Use formFields from event if available, otherwise use defaults or empty array
          const formFieldsToSend = event.noSignupNeeded ? [] : (event.formFields || ['name', 'email']);
          formData.append('formFields', JSON.stringify(formFieldsToSend));
          formData.append('signupOpen', 'true');
          formData.append('noSignupNeeded', (event.noSignupNeeded || false).toString());
          formData.append('createdBy', user.uid);

          // Call the API to create the event
          const response = await fetch('/api/admin/events', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create event');
          }

          const result = await response.json();
          setBatchCreationProgress(prev => ({ ...prev, [i]: 'completed' }));
          successCount++;

          // Add to events list
          const newEvent: Event = {
            id: result.eventId,
            title: event.title,
            date: event.date,
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            price: event.price || 'Free',
            description: event.description,
            imageUrl: result.imageUrl,
            formFields: event.noSignupNeeded ? [] : (event.formFields || ['name', 'email']),
            signupOpen: true,
            noSignupNeeded: event.noSignupNeeded || false,
            isPublic: event.isPublic !== false, // Default to true for backwards compatibility
            maxSignups: event.maxSignups || 50,
            tags: event.tags || [],
            createdAt: new Date(),
            createdBy: user.uid
          };
          setEvents(prev => [newEvent, ...prev]);

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
          errors[i] = errorMessage;
          setBatchCreationProgress(prev => ({ ...prev, [i]: 'failed' }));
          setBatchCreationErrors(prev => ({ ...prev, [i]: errorMessage }));
        }
      }

      // Show results
      if (successCount === parsedEvents.length) {
        alert(`Successfully created all ${successCount} events!`);
        setShowBatchReview(false);
        setParsedEvents([]);
        setBatchCreationProgress({});
        setBatchCreationErrors({});
      } else if (successCount > 0) {
        alert(`Created ${successCount} out of ${parsedEvents.length} events. Check the errors below for failed events.`);
      } else {
        alert('Failed to create any events. Please check the errors and try again.');
      }

    } catch (error) {
      console.error('Error in batch creation:', error);
      alert(error instanceof Error ? error.message : 'Failed to create events');
    } finally {
      setIsCreatingEvent(false);
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

  const formatTimeRange = (startTime: string, endTime?: string) => {
    if (!startTime) return "Time not set";

    // Format the start time
    const formatTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    const formattedStart = formatTime(startTime);

    if (endTime) {
      const formattedEnd = formatTime(endTime);
      return `${formattedStart} - ${formattedEnd}`;
    }

    return formattedStart;
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
                  src="https://res.cloudinary.com/derjeh0m2/image/upload/v1758531324/1._USIC_Full_Logo_cr0kaw.svg"
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
                src="https://res.cloudinary.com/derjeh0m2/image/upload/v1758531324/1._USIC_Full_Logo_cr0kaw.svg"
                alt="USIC Logo"
                width={40}
                height={40}
                className="w-auto h-10"
                style={{ filter: 'invert(1)' }}
              />
              <h1 className="text-white text-2xl font-bold">USIC Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <AdminTimeoutStatus />
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
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 px-4 border-b-2 transition-colors ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              Manage Events
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-4 border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              Manage Users
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
                          <div className="flex items-center text-gray-400 text-sm space-x-4">
                            <span>By {post.author}</span>
                            <span>{formatDate(post.createdAt)}</span>
                            <span className="bg-blue-500 text-white px-2 py-1 rounded">{categoryUtils.getCategoryName(post.category)}</span>
                            <span>Likes: {post.likes}</span>
                        </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => post.id && handleApprovePost(post.id)}
                            disabled={loadingPosts[post.id!] === 'approving' || loadingPosts[post.id!] === 'rejecting'}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition duration-300 text-sm flex items-center justify-center gap-2"
                          >
                            {loadingPosts[post.id!] === 'approving' ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Approving...
                              </>
                            ) : (
                              'Approve'
                            )}
                          </button>
                          <button
                            onClick={() => openRejectModal(post)}
                            disabled={loadingPosts[post.id!] === 'approving' || loadingPosts[post.id!] === 'rejecting'}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition duration-300 text-sm flex items-center justify-center gap-2"
                          >
                            {loadingPosts[post.id!] === 'rejecting' ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Rejecting...
                              </>
                            ) : (
                              'Reject'
                            )}
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

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Users Management Header */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div>
                  <h2 className="text-white text-2xl font-bold mb-2 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    User Management
                  </h2>
                  <p className="text-gray-300 text-sm">Manage website users and restrict access when needed</p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full lg:w-auto">
                  <div className="flex items-center gap-4 flex-1 lg:flex-none">
                    <div className="relative flex-1 lg:w-80">
                      <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search by email, name, or UID..."
                        value={usersSearchTerm}
                        onChange={(e) => setUsersSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={usersFilterStatus}
                      onChange={(e) => setUsersFilterStatus(e.target.value as 'all' | 'restricted' | 'active')}
                      className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active Users</option>
                      <option value="restricted">Restricted Users</option>
                    </select>

                    <button
                      onClick={() => fetchUsersData()}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 whitespace-nowrap"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <UsersManagement
              searchTerm={usersSearchTerm}
              filterStatus={usersFilterStatus}
            />
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
                                {categoryUtils.getCategoryName(post.category)}
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

        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Events Management Header */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-2xl font-bold mb-2 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Event Management
                  </h2>
                  <p className="text-gray-300 text-sm">Create and manage community events</p>
                </div>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center gap-3 font-semibold"
                >
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Event
                </button>
              </div>
            </div>

            {/* Events Grid */}
            {events.length === 0 ? (
              <div className="bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">No Events Yet</h3>
                <p className="text-gray-400 mb-6">Start by creating your first community event</p>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 inline-flex items-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Event
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/admin-dashboard/events/${event.id}`}
                    className="bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 group cursor-pointer block"
                  >
                    {/* Event Image */}
                    {event.imageUrl && (
                      <div className="mb-4 overflow-hidden rounded-lg">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Event Title and Status */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 text-xs font-bold rounded-full border border-green-500/30 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ACTIVE
                        </span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 text-xs font-bold rounded-full border border-blue-500/30 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          {event.formFields.length} FIELD{event.formFields.length !== 1 ? 'S' : ''}
                        </span>
                        {event.maxSignups && !event.noSignupNeeded && (
                          <span className="bg-green-500/20 text-green-300 px-3 py-1 text-xs font-bold rounded-full border border-green-500/30 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            MAX {event.maxSignups}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-blue-200 transition-colors duration-200">{event.title}</h3>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-300 text-sm">
                        <svg className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <svg className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">
                          {formatTimeRange(event.startTime, event.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <svg className="w-4 h-4 mr-3 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                      {event.price && (
                        <div className="flex items-center text-gray-300 text-sm">
                          <svg className="w-4 h-4 mr-3 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span className="truncate">
                            {event.price === 'Free' || !event.price
                              ? 'Free'
                              : `£${event.price}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Event Description */}
                    <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{event.description}</p>
                    </div>

                    {/* Click indicator */}
                    <div className="flex items-center justify-center text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Click to manage event
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Event Creation Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Create New Event</h3>
                  <button
                    onClick={() => {
                      setShowEventForm(false);
                      setEventFormTab('manual');
                      setAiEventText('');
                      setMissingFields([]);
                      setEventFormErrors([]);
                      if (imagePreview) {
                        URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Validation Errors */}
                {eventFormErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Missing Required Fields
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul role="list" className="list-disc pl-5 space-y-1">
                            {eventFormErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setEventFormTab('manual')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      eventFormTab === 'manual'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventFormTab('ai')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      eventFormTab === 'ai'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    AI Assisted
                  </button>
                </div>

                {eventFormTab === 'manual' && (
                  <>
                    {missingFields.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <h4 className="text-orange-800 font-medium">Please complete the missing information:</h4>
                        </div>
                        <ul className="mt-2 text-orange-700 text-sm">
                          {missingFields.map(field => (
                            <li key={field} className="flex items-center">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                              {field === 'title' ? 'Event Title' :
                               field === 'date' ? 'Event Date' :
                               field === 'startTime' ? 'Start Time' :
                               field === 'endTime' ? 'End Time' :
                               field === 'location' ? 'Event Location' :
                               field === 'description' ? 'Event Description' :
                               field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                <form onSubmit={handleCreateEvent} className="space-y-6">
                  {/* Event Title */}
                  <div>
                    <label htmlFor="eventTitle" className={`block text-sm font-medium mb-2 ${
                      missingFields.includes('title') ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      Event Title * {missingFields.includes('title') && <span className="text-red-500">(Please fill)</span>}
                    </label>
                    <input
                      type="text"
                      id="eventTitle"
                      value={eventFormData.title}
                      onChange={(e) => {
                        setEventFormData({...eventFormData, title: e.target.value});
                        if (missingFields.includes('title') && e.target.value.trim()) {
                          setMissingFields(missingFields.filter(f => f !== 'title'));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        missingFields.includes('title')
                          ? 'border-red-300 bg-red-50 focus:ring-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter event title"
                      required
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="eventDate" className="block text-sm font-medium mb-2 text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        id="eventDate"
                        value={eventFormData.date}
                        onChange={(e) => setEventFormData({...eventFormData, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium mb-2 text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        value={eventFormData.startTime}
                        onChange={(e) => setEventFormData({...eventFormData, startTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                        <span className="text-gray-500 text-xs ml-1">(optional)</span>
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        value={eventFormData.endTime || ''}
                        onChange={(e) => setEventFormData({...eventFormData, endTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <label htmlFor="eventLocation" className="block text-sm font-medium mb-2 text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      id="eventLocation"
                      value={eventFormData.location}
                      onChange={(e) => setEventFormData({...eventFormData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event location"
                    />
                  </div>

                  {/* Member and Non-Member Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-start">
                    <div className="flex flex-col h-full justify-between">
                      <label htmlFor="eventMemberPrice" className="block text-sm font-medium text-gray-700 mb-2">
                        Member Price
                        <span className="text-gray-500 text-xs ml-2"></span>
                      </label>
                      <input
                        type="text"
                        id="eventMemberPrice"
                        value={eventFormData.price}
                        onChange={(e) => setEventFormData({...eventFormData, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(GBP symbol added automatically)"
                      />
                    </div>
                    <div className="flex flex-col h-full justify-between">
                      <label htmlFor="eventNonMemberPrice" className="block text-sm font-medium text-gray-700 mb-2">
                        Non-Member Price
                      </label>
                      <input
                        type="text"
                        id="eventNonMemberPrice"
                        value={eventFormData.nonMemberPrice}
                        onChange={(e) => setEventFormData({...eventFormData, nonMemberPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(GBP symbol added automatically)"
                      />
                    </div>
                  </div>

                  {/* Meet Up Time and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="eventMeetUpTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Meet Up Time
                        <span className="text-gray-500 text-xs ml-2">(optional - different from event start time)</span>
                      </label>
                      <input
                        type="time"
                        id="eventMeetUpTime"
                        value={eventFormData.meetUpTime}
                        onChange={(e) => setEventFormData({...eventFormData, meetUpTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="eventMeetUpLocation" className="block text-sm font-medium text-gray-700 mb-2">
                        Meet Up Location
                        <span className="text-gray-500 text-xs ml-2">(optional - different from event location)</span>
                      </label>
                      <input
                        type="text"
                        id="eventMeetUpLocation"
                        value={eventFormData.meetUpLocation}
                        onChange={(e) => setEventFormData({...eventFormData, meetUpLocation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter meet up location"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="eventDescription" className="block text-sm font-medium mb-2 text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="eventDescription"
                      value={eventFormData.description}
                      onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event description"
                    />
                  </div>

                  {/* Signup Form URL */}
                  <div>
                    <label htmlFor="eventSignupFormUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      Signup Form URL
                      <span className="text-gray-500 text-xs ml-2">
                        (Optional - external signup form link like Google Forms, Eventbrite, etc.)
                      </span>
                    </label>
                    <input
                      type="url"
                      id="eventSignupFormUrl"
                      value={eventFormData.signupFormUrl || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setEventFormData({
                          ...eventFormData,
                          signupFormUrl: url,
                          signupMethod: updateSignupMethodBasedOnUrl(url, eventFormData.signupMethod)
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://forms.google.com/your-form-link"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                      <span className="text-gray-500 text-xs ml-2">
                        (Select relevant tags for this event - optional)
                      </span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        'annual',
                        'weekly',
                        'brothers only',
                        'sisters only',
                        'education',
                        'welfare'
                      ].map((tag) => (
                        <label key={tag} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={eventFormData.tags.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEventFormData({
                                  ...eventFormData,
                                  tags: [...eventFormData.tags, tag]
                                });
                              } else {
                                setEventFormData({
                                  ...eventFormData,
                                  tags: eventFormData.tags.filter(t => t !== tag)
                                });
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 block text-sm text-gray-700 capitalize">
                            {tag}
                          </span>
                        </label>
                      ))}
                    </div>
                    {eventFormData.tags.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Selected Tags:</p>
                        <div className="flex flex-wrap gap-2">
                          {eventFormData.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-700 text-xs rounded-full border border-blue-500/30">
                              {tag}
                              <button
                                type="button"
                                onClick={() => setEventFormData({
                                  ...eventFormData,
                                  tags: eventFormData.tags.filter(t => t !== tag)
                                })}
                                className="ml-2 text-blue-700 hover:text-blue-900"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Event Visibility Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="isPublic" className="block text-sm font-medium text-gray-700">
                        Public
                      </label>
                      <div
                        className="relative inline-flex items-center cursor-pointer group"
                        onClick={() => setEventFormData({
                          ...eventFormData,
                          isPublic: !eventFormData.isPublic
                        })}
                      >
                        {/* Toggle Track */}
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          eventFormData.isPublic
                            ? 'bg-blue-600'
                            : 'bg-gray-400'
                        }`}>
                          {/* Toggle Knob */}
                          <div className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                            eventFormData.isPublic
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`} />
                        </div>

                        {/* Hidden checkbox for form handling */}
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={eventFormData.isPublic}
                          onChange={(e) => setEventFormData({
                            ...eventFormData,
                            isPublic: e.target.checked
                          })}
                          className="sr-only"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Signup Options */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="signupOpen"
                        checked={eventFormData.signupOpen}
                        onChange={(e) => setEventFormData({
                          ...eventFormData,
                          signupOpen: e.target.checked
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="signupOpen" className="ml-2 block text-sm font-medium text-gray-700">
                        Sign up open?
                        <span className="text-gray-500 text-xs ml-2">
                          (If checked, public users can sign up for this event)
                        </span>
                      </label>
                    </div>

                    {/* Signup Method Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Signup Method
                        {eventFormData.signupFormUrl && (
                          <span className="text-purple-600 text-xs ml-2">
                            (Auto-selected: External Link detected)
                          </span>
                        )}
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="signupMethodExternal"
                            name="signupMethod"
                            value="external"
                            checked={eventFormData.signupMethod === 'external'}
                            onChange={(e) => {
                              setEventFormData({
                                ...eventFormData,
                                signupMethod: e.target.value as 'none' | 'website' | 'external',
                                formFields: [], // Clear form fields for external signup
                                maxSignups: 50 // Reset max signups
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            disabled={!!eventFormData.signupFormUrl} // Disable manual selection when URL is present
                          />
                          <label htmlFor="signupMethodExternal" className={`ml-2 block text-sm ${eventFormData.signupFormUrl ? 'text-purple-600' : 'text-gray-700'}`}>
                            External Link
                            <span className="text-gray-500 text-xs ml-2">
                              {eventFormData.signupFormUrl
                                ? '(Automatically selected when URL is provided)'
                                : '(Users sign up via external form/link - requires signup URL below)'
                              }
                            </span>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="signupMethodWebsite"
                            name="signupMethod"
                            value="website"
                            checked={eventFormData.signupMethod === 'website'}
                            onChange={(e) => {
                              setEventFormData({
                                ...eventFormData,
                                signupMethod: e.target.value as 'none' | 'website' | 'external',
                                formFields: eventFormData.formFields.length === 0 ? ['name', 'email'] : eventFormData.formFields, // Set defaults for website signup
                                maxSignups: 50 // Reset max signups
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor="signupMethodWebsite" className="ml-2 block text-sm text-gray-700">
                            Website Signup
                            <span className="text-gray-500 text-xs ml-2">
                              (Users sign up using our website form)
                            </span>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="signupMethodNone"
                            name="signupMethod"
                            value="none"
                            checked={eventFormData.signupMethod === 'none'}
                            onChange={(e) => {
                              setEventFormData({
                                ...eventFormData,
                                signupMethod: e.target.value as 'none' | 'website' | 'external',
                                formFields: [], // Clear form fields for no signup
                                maxSignups: 0, // Clear max signups
                                memberPrice: 'Free', // Set price to Free for no signup events
                                nonMemberPrice: 'Free' // Set price to Free for no signup events
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor="signupMethodNone" className="ml-2 block text-sm text-gray-700">
                            No Sign Up Needed
                            <span className="text-gray-500 text-xs ml-2">
                              (Walk-in event - people can just show up)
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Max Sign Ups - Only show if website signup is selected */}
                  {eventFormData.signupMethod === 'website' && (
                    <div>
                      <label htmlFor="maxSignups" className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Sign Ups
                      </label>
                      <select
                        id="maxSignups"
                        value={eventFormData.maxSignups || 50}
                        onChange={(e) => setEventFormData({
                          ...eventFormData,
                          maxSignups: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Array.from({ length: 200 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Maximum number of people who can sign up for this event</p>
                    </div>
                  )}


                  {/* Show message when no signup is needed */}
                  {eventFormData.signupMethod === 'none' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="text-blue-800 font-medium">No Sign Up Required</h4>
                          <p className="text-blue-600 text-sm">This is a public event where attendees can just show up without registering.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show message when external signup is selected */}
                  {eventFormData.signupMethod === 'external' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <div>
                          <h4 className="text-green-800 font-medium">External Signup</h4>
                          <p className="text-green-600 text-sm">Attendees will sign up using the external link provided above.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Upload */}
                  <div>
                    <label htmlFor="eventImage" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Poster
                    </label>
                    <input
                      type="file"
                      id="eventImage"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEventFormData({...eventFormData, imageFile: file});
                          // Create preview URL
                          const previewUrl = URL.createObjectURL(file);
                          setImagePreview(previewUrl);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload an event poster (optional, max 5MB)</p>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="relative w-full max-w-xs">
                          <Image
                            src={imagePreview}
                            alt="Event poster preview"
                            width={400}
                            height={300}
                            className="w-full max-h-48 object-contain rounded-lg border"
                            style={{ aspectRatio: 'auto' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setEventFormData({...eventFormData, imageFile: undefined});
                              // Clear the file input
                              const fileInput = document.getElementById('eventImage') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Fields Selection - Only show if website signup is selected and no external URL is provided */}
                  {eventFormData.signupMethod === 'website' && !eventFormData.signupFormUrl?.trim() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Signup Form Fields *
                      </label>
                      <p className="text-xs text-gray-500 mb-3">Select which information to collect from attendees</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[...availableFormFields, ...customFormFields].map((field) => (
                          <label key={field} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={eventFormData.formFields.includes(field)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEventFormData({
                                    ...eventFormData,
                                    formFields: [...eventFormData.formFields, field]
                                  });
                                } else {
                                  setEventFormData({
                                    ...eventFormData,
                                    formFields: eventFormData.formFields.filter(f => f !== field)
                                  });
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">
                              {field.replace('_', ' ')}
                            </span>
                          </label>
                        ))}
                      </div>
                      {eventFormData.formFields.length === 0 && (
                        <p className="text-red-500 text-xs mt-1">Please select at least one form field</p>
                      )}

                      {/* Custom Form Fields */}
                      <div className="mt-4 border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add Custom Form Field
                        </label>
                        <p className="text-xs text-gray-500 mb-3">Create your own custom field for specific event requirements</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCustomField}
                            onChange={(e) => setNewCustomField(e.target.value)}
                            placeholder="e.g., Allergies, Dietary Restrictions, etc."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newCustomField.trim() && !availableFormFields.includes(newCustomField.trim()) && !customFormFields.includes(newCustomField.trim())) {
                                setCustomFormFields([...customFormFields, newCustomField.trim()]);
                                setEventFormData({
                                  ...eventFormData,
                                  formFields: [...eventFormData.formFields, newCustomField.trim()]
                                });
                                setNewCustomField('');
                              }
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300"
                          >
                            Add
                          </button>
                        </div>
                        {customFormFields.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Custom Fields Added:</p>
                            <div className="flex flex-wrap gap-2">
                              {customFormFields.map((field, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {field.replace(/_/g, ' ')}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedCustomFields = customFormFields.filter(f => f !== field);
                                      setCustomFormFields(updatedCustomFields);
                                      setEventFormData({
                                        ...eventFormData,
                                        formFields: eventFormData.formFields.filter(f => f !== field)
                                      });
                                    }}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Show message when no signup is needed */}
                  {eventFormData.noSignupNeeded && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="text-blue-800 font-medium">No Sign Up Required</h4>
                          <p className="text-blue-600 text-sm">This is a public event where attendees can just show up without registering.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEventForm(false);
                        if (imagePreview) {
                          URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                        }
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingEvent || (eventFormData.signupMethod === 'website' && !eventFormData.signupFormUrl?.trim() && eventFormData.formFields.length === 0)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCreatingEvent ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        'Create Event'
                      )}
                    </button>
                  </div>
                </form>
                  </>
                )}

                {eventFormTab === 'ai' && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="aiEventText" className="block text-sm font-medium text-gray-700 mb-2">
                        Event Details
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Paste your event details here and AI will automatically extract the title, date, time, location, and description.
                      </p>
                      <textarea
                        id="aiEventText"
                        value={aiEventText}
                        onChange={(e) => setAiEventText(e.target.value)}
                        rows={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Examples:

SINGLE EVENT:
Fresher's Student Panel
Thursday, 2 October⋅6:00 – 8:00pm
The Quran as a Source of Guidance: Panel

MULTIPLE EVENTS (use separators):
---
Fresher's Student Panel
Thursday, 2 October⋅6:00 – 8:00pm
The Quran as a Source of Guidance: Panel
---

Friday Football
Friday, 3 October⋅7:00 – 9:00pm
Join us for our weekly football session
---

Annual Dinner
Saturday, 4 October⋅8:00pm – 11:00pm
Celebrating another successful year
---

Or use numbered lists:
1. Fresher's Student Panel - Thursday, 2 October⋅6:00 – 8:00pm - The Quran as a Source of Guidance
2. Friday Football - Friday, 3 October⋅7:00 – 9:00pm - Weekly sports session
3. Annual Dinner - Saturday, 4 October⋅8:00pm - Celebrating the year`}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEventForm(false);
                          setEventFormTab('manual');
                          setAiEventText('');
                          setMissingFields([]);
                          if (imagePreview) {
                            URL.revokeObjectURL(imagePreview);
                            setImagePreview(null);
                          }
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAIEventParsing}
                        disabled={isProcessingAI || !aiEventText.trim()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isProcessingAI ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Create Event with AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Batch Events Review Modal */}
        {showBatchReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Review Events ({parsedEvents.length})</h3>
                    <p className="text-sm text-gray-600 mt-1">Review and create multiple events at once</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowBatchReview(false);
                      setParsedEvents([]);
                      setBatchCreationProgress({});
                      setBatchCreationErrors({});
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Events List */}
                <div className="space-y-4 mb-6">
                  {parsedEvents.map((event, index) => {
                    const requiredFields = ['title'] as const;
                    const missing = requiredFields.filter(field => !event[field as keyof Event]);
                    const progress = batchCreationProgress[index] || 'pending';
                    const error = batchCreationErrors[index];

                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Event {index + 1}</h4>
                          <div className="flex items-center gap-2">
                            {progress === 'pending' && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Pending</span>
                            )}
                            {progress === 'creating' && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded flex items-center gap-1">
                                <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                Creating...
                              </span>
                            )}
                            {progress === 'completed' && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Created
                              </span>
                            )}
                            {progress === 'failed' && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">Failed</span>
                            )}
                          </div>
                        </div>

                        {error && (
                          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <strong>Error:</strong> {error}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={event.title || ''}
                              onChange={(e) => {
                                const updatedEvents = [...parsedEvents];
                                updatedEvents[index].title = e.target.value;
                                setParsedEvents(updatedEvents);
                              }}
                              className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 ${
                                !event.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                              placeholder="Event title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                              type="date"
                              value={event.date || ''}
                              onChange={(e) => {
                                const updatedEvents = [...parsedEvents];
                                updatedEvents[index].date = e.target.value;
                                setParsedEvents(updatedEvents);
                              }}
                              className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 ${
                                !event.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                              type="time"
                              value={event.startTime || ''}
                              onChange={(e) => {
                                const updatedEvents = [...parsedEvents];
                                updatedEvents[index].startTime = e.target.value;
                                setParsedEvents(updatedEvents);
                              }}
                              className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 ${
                                !event.startTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                              type="text"
                              value={event.location || ''}
                              onChange={(e) => {
                                const updatedEvents = [...parsedEvents];
                                updatedEvents[index].location = e.target.value;
                                setParsedEvents(updatedEvents);
                              }}
                              className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 ${
                                !event.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                              placeholder="Event location"
                            />
                          </div>
                        </div>

                        {/* No Signup Needed Checkbox */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`noSignupNeeded-${index}`}
                              checked={event.noSignupNeeded || false}
                              onChange={(e) => {
                                const updatedEvents = [...parsedEvents];
                                updatedEvents[index].noSignupNeeded = e.target.checked;
                                // Clear form fields if no signup is needed
                                if (e.target.checked) {
                                  updatedEvents[index].formFields = [];
                                } else if (!updatedEvents[index].formFields || updatedEvents[index].formFields.length === 0) {
                                  // Set default form fields if signup is needed and none are set
                                  updatedEvents[index].formFields = ['name', 'email'];
                                }
                                setParsedEvents(updatedEvents);
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`noSignupNeeded-${index}`} className="ml-2 block text-sm font-medium text-gray-700">
                              No sign up needed
                              <span className="text-gray-500 text-xs ml-2">
                                (Public event - people can just show up)
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Show message when no signup is needed */}
                        {event.noSignupNeeded && (
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                            <strong>Note:</strong> No form fields needed for walk-in events
                          </div>
                        )}

                        {/* Form Fields - Only show if signup is needed */}
                        {!event.noSignupNeeded && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Form Fields
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {availableFormFields.map((field) => (
                                <label key={field} className="flex items-center text-xs">
                                  <input
                                    type="checkbox"
                                    checked={event.formFields?.includes(field) || false}
                                    onChange={(e) => {
                                      const updatedEvents = [...parsedEvents];
                                      const currentFields = updatedEvents[index].formFields || [];
                                      if (e.target.checked) {
                                        updatedEvents[index].formFields = [...currentFields, field];
                                      } else {
                                        updatedEvents[index].formFields = currentFields.filter(f => f !== field);
                                      }
                                      setParsedEvents(updatedEvents);
                                    }}
                                    className="mr-2 h-3 w-3"
                                  />
                                  <span className="capitalize">
                                    {field.replace('_', ' ')}
                                  </span>
                                </label>
                              ))}
                            </div>
                            {(!event.formFields || event.formFields.length === 0) && (
                              <p className="text-red-500 text-xs mt-1">Please select at least one form field</p>
                            )}
                          </div>
                        )}

                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={event.description || ''}
                            onChange={(e) => {
                              const updatedEvents = [...parsedEvents];
                              updatedEvents[index].description = e.target.value;
                              setParsedEvents(updatedEvents);
                            }}
                            rows={2}
                            className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 ${
                              !event.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Event description"
                          />
                        </div>

                        {missing.length > 0 && (
                          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                            <strong>Missing:</strong> {missing.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBatchReview(false);
                      setParsedEvents([]);
                      setBatchCreationProgress({});
                      setBatchCreationErrors({});
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBatchCreateEvents}
                    disabled={isCreatingEvent}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition duration-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isCreatingEvent ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Events...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Create All Events ({parsedEvents.length})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
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
                  disabled={!rejectionReason.trim() || (selectedPostForRejection?.id ? loadingPosts[selectedPostForRejection.id] === 'rejecting' : false)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-md transition duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {selectedPostForRejection?.id && loadingPosts[selectedPostForRejection.id] === 'rejecting' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Rejecting...
                    </>
                  ) : (
                    'Reject Post'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
} 