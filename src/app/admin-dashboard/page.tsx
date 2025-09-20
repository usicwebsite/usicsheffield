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
  price?: string; // Keep for backwards compatibility, but we'll use memberPrice/nonMemberPrice
  memberPrice?: string;
  nonMemberPrice?: string;
  meetUpTime?: string;
  meetUpLocation?: string;
  description: string;
  imageUrl?: string;
  formFields: string[];
  signupOpen: boolean;
  noSignupNeeded: boolean;
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
  price?: string; // Keep for backwards compatibility
  memberPrice?: string;
  nonMemberPrice?: string;
  meetUpTime?: string;
  meetUpLocation?: string;
  description: string;
  imageFile?: File;
  formFields: string[];
  signupOpen: boolean;
  noSignupNeeded: boolean;
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
    price: '', // Keep for backwards compatibility
    memberPrice: '',
    nonMemberPrice: '',
    meetUpTime: '',
    meetUpLocation: '',
    description: '',
    formFields: [],
    signupOpen: true, // Default to open for signups
    noSignupNeeded: false, // Default to requiring signup
    isPublic: true, // Default to public
    maxSignups: 50, // Default to 50 signups
    tags: [], // Default to empty array
    signupFormUrl: '' // Default to empty string
  });
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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventFormData.noSignupNeeded && eventFormData.formFields.length === 0) {
      alert('Please select at least one form field');
      return;
    }

    if (!eventFormData.startTime) {
      alert('Please select a start time');
      return;
    }

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
      // Non-member price is required
      if (eventFormData.nonMemberPrice && eventFormData.nonMemberPrice.trim()) {
        formData.append('nonMemberPrice', eventFormData.nonMemberPrice.trim());
      }
      if (eventFormData.meetUpTime && eventFormData.meetUpTime.trim()) {
        formData.append('meetUpTime', eventFormData.meetUpTime.trim());
      }
      if (eventFormData.meetUpLocation && eventFormData.meetUpLocation.trim()) {
        formData.append('meetUpLocation', eventFormData.meetUpLocation.trim());
      }
      formData.append('description', eventFormData.description);
      // Only include formFields if signup is needed
      if (eventFormData.noSignupNeeded) {
        formData.append('formFields', JSON.stringify([])); // Empty array for no signup events
      } else {
        formData.append('formFields', JSON.stringify(eventFormData.formFields));
      }
      formData.append('signupOpen', eventFormData.signupOpen.toString());
      formData.append('noSignupNeeded', eventFormData.noSignupNeeded.toString());
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
        price: eventFormData.price,
        description: eventFormData.description,
        imageUrl: result.imageUrl,
        formFields: eventFormData.formFields,
        signupOpen: eventFormData.signupOpen,
        noSignupNeeded: eventFormData.noSignupNeeded,
        isPublic: eventFormData.isPublic,
        maxSignups: eventFormData.maxSignups,
        tags: eventFormData.tags,
        createdAt: new Date(),
        createdBy: user.uid
      };
      
      setEvents(prev => [newEvent, ...prev]);
      
      // Reset form and close modal
                    setEventFormData({
                      title: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      location: '',
                      price: '',
                      description: '',
                      formFields: [],
                      signupOpen: true,
                      noSignupNeeded: false,
                      isPublic: true,
                      maxSignups: 50,
                      tags: []
                    });
      setImagePreview(null);
      setShowEventForm(false);
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error instanceof Error ? error.message : 'Failed to create event');
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
            price: singleEvent.price || '',
            description: singleEvent.description || aiEventText,
            formFields: ['name', 'email'], // Default form fields
            signupOpen: true,
            noSignupNeeded: false,
            isPublic: true, // Default to public
            maxSignups: 50, // Default to 50 signups
            imageFile: undefined,
            tags: [] // Default to empty array
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

        // Skip if missing required fields
        const requiredFields = ['title', 'date', 'startTime', 'location', 'description'] as const;
        const missing = requiredFields.filter(field => !event[field as keyof Event]);
        if (missing.length > 0) {
          errors[i] = `Missing required fields: ${missing.join(', ')}`;
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

  // Temporarily commented out loading condition to debug syntax error
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-[#18384D]">
  //       {/* Header */}
  //       <header className="bg-[#234b64] shadow-lg">
  //         <div className="container mx-auto px-4 py-4">
  //           <div className="flex items-center justify-between">
  //             <div className="flex items-center space-x-4">
  //               <Image
  //                 src="/1. USIC Full Logo.svg"
  //                 alt="USIC Logo"
  //                 width={40}
  //                 height={40}
  //                 className="w-auto h-10"
  //                 style={{ filter: 'invert(1)' }}
  //               />
  //               <h1 className="text-white text-2xl font-bold">USIC Admin Dashboard</h1>
  //             </div>
  //           </div>
  //         </header>

  //       {/* Loading Content */}
  //       <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
  //         <div className="text-center max-w-md mx-auto">
  //           <div className="mb-8">
  //             <div className="w-20 h-20 mx-auto mb-6 relative">
  //               <div className="absolute inset-0 rounded-full border-4 border-gray-300/30"></div>
  //               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
  //               <div className="absolute inset-2 rounded-full bg-blue-400/20 animate-pulse"></div>
  //             </div>
  //             <h2 className="text-white text-2xl font-semibold mb-2">Loading Dashboard</h2>
  //             <p className="text-gray-300 text-sm">Please wait while we prepare your admin panel...</p>
  //           </div>

  //         {/* Loading Steps */}
  //         <div className="space-y-3 text-left">
  //           <div className="flex items-center space-x-3">
  //             <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
  //             <span className="text-gray-300 text-sm">Verifying authentication...</span>
  //           </div>
  //           <div className="flex items-center space-x-3">
  //             <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
  //             <span className="text-gray-300 text-sm">Loading dashboard data...</span>
  //           </div>
  //           <div className="flex items-center space-x-3">
  //             <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
  //             <span className="text-gray-300 text-sm">Preparing admin interface...</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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
      <p>Temporarily simplified for debugging</p>
    </div>
  );
}
