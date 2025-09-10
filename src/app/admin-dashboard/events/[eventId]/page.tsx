'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  price: string;
  description: string;
  imageUrl?: string;
  formFields: string[];
  signupOpen: boolean;
  noSignupNeeded: boolean;
  maxSignups?: number;
  tags: string[];
  createdAt: Date;
  createdBy: string;
}

interface EventSignup {
  id: string;
  eventId: string;
  eventTitle: string;
  formData: Record<string, string>;
  submittedAt: Date;
  ipAddress: string;
  paid?: boolean;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [signups, setSignups] = useState<EventSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSignups, setLoadingSignups] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    price: '',
    description: '',
    formFields: [] as string[],
    signupOpen: true,
    noSignupNeeded: false,
    maxSignups: 50,
    tags: [] as string[]
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showEventsSidebar, setShowEventsSidebar] = useState(false);

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

  // Navigation helpers
  const getCurrentEventIndex = useCallback(() => {
    return allEvents.findIndex(e => e.id === eventId);
  }, [allEvents, eventId]);

  const getPreviousEvent = useCallback(() => {
    const currentIndex = getCurrentEventIndex();
    if (currentIndex > 0) {
      return allEvents[currentIndex - 1];
    }
    return null;
  }, [allEvents, getCurrentEventIndex]);

  const getNextEvent = useCallback(() => {
    const currentIndex = getCurrentEventIndex();
    if (currentIndex < allEvents.length - 1) {
      return allEvents[currentIndex + 1];
    }
    return null;
  }, [allEvents, getCurrentEventIndex]);

  // Navigate to event
  const navigateToEvent = useCallback((targetEventId: string) => {
    router.push(`/admin-dashboard/events/${targetEventId}`);
  }, [router]);

  // Function to format date like "Sep. 25th, 2025"
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const monthNames = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      // Add ordinal suffix
      const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };

      return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
    } catch {
      return dateString; // Fallback to original format
    }
  };

  // Function to format time range like "6:00 PM - 10:00 PM"
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

  // Load event data and all events for navigation
  const loadEvent = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/admin/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to load events');

      const data = await response.json();
      const eventsList = data.events || [];
      setAllEvents(eventsList);

      const foundEvent = eventsList.find((e: Event) => e.id === eventId);

      if (foundEvent) {
        setEvent(foundEvent);
        setEditForm({
          title: foundEvent.title,
          date: foundEvent.date,
          startTime: foundEvent.startTime,
          endTime: foundEvent.endTime || '',
          location: foundEvent.location,
          price: foundEvent.price || '',
          description: foundEvent.description,
          formFields: foundEvent.formFields || [],
          signupOpen: foundEvent.signupOpen || false,
          noSignupNeeded: foundEvent.noSignupNeeded || false,
          maxSignups: foundEvent.maxSignups || 50,
          tags: foundEvent.tags || []
        });
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const loadSignups = useCallback(async () => {
    try {
      setLoadingSignups(true);
      const token = await getIdToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`/api/admin/events/${eventId}/signups`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to load signups');

      const data = await response.json();
      setSignups(data.signups || []);
    } catch (error) {
      console.error('Error loading signups:', error);
      setSignups([]);
    } finally {
      setLoadingSignups(false);
    }
  }, [eventId]);

  // Load data when component mounts
  useEffect(() => {
    if (eventId) {
      loadEvent();
      loadSignups();
    }
  }, [eventId, loadEvent, loadSignups]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle navigation if not typing in an input/textarea
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT')) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        const prevEvent = getPreviousEvent();
        if (prevEvent) {
          navigateToEvent(prevEvent.id);
        }
      } else if (event.key === 'ArrowRight') {
        const nextEvent = getNextEvent();
        if (nextEvent) {
          navigateToEvent(nextEvent.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getPreviousEvent, getNextEvent, navigateToEvent]);

  // Initialize auth loading
  useEffect(() => {
    setAuthLoading(true);
  }, []);

  const getIdToken = async (): Promise<string | null> => {
    try {
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      const auth = getAuth();

      // Check if we already have a current user
      if (auth.currentUser) {
        setAuthLoading(false);
        return await auth.currentUser.getIdToken();
      }

      // Wait for auth state to be restored
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          unsubscribe(); // Clean up listener
          setAuthLoading(false);
          if (user) {
            try {
              const token = await user.getIdToken();
              resolve(token);
            } catch {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      });
    } catch {
      setAuthLoading(false);
      return null;
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    // Update the event to remove the image
    if (event) {
      setEvent({...event, imageUrl: undefined});
    }
  };

  const handleSaveEvent = async () => {
    if (!event) return;

    try {
      setUploadingImage(true);
      const token = await getIdToken();
      if (!token) throw new Error('No authentication token');

      let newImageUrl = event.imageUrl;

      // Upload new image if selected
      if (selectedImageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', selectedImageFile);

        const uploadResponse = await fetch('/api/upload-event-image', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const uploadResult = await uploadResponse.json();
        newImageUrl = uploadResult.url;
      }

      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('date', editForm.date);
      formData.append('startTime', editForm.startTime);
      if (editForm.endTime) {
        formData.append('endTime', editForm.endTime);
      }
      formData.append('location', editForm.location);
      formData.append('price', editForm.price);
      formData.append('description', editForm.description);
      // Only include formFields if signup is needed
      if (editForm.noSignupNeeded) {
        formData.append('formFields', JSON.stringify([])); // Empty array for no signup events
      } else {
        formData.append('formFields', JSON.stringify(editForm.formFields));
      }
      formData.append('signupOpen', editForm.signupOpen.toString());
      formData.append('noSignupNeeded', editForm.noSignupNeeded.toString());
      formData.append('tags', JSON.stringify(editForm.tags));
      formData.append('maxSignups', (editForm.maxSignups || 50).toString());

      // Handle image URL
      if (selectedImageFile) {
        // New image was uploaded
        formData.append('imageUrl', newImageUrl || '');
      } else if (event.imageUrl === null || event.imageUrl === undefined) {
        // Image was removed
        formData.append('imageUrl', '');
      } else {
        // Keep existing image
        formData.append('existingImageUrl', event.imageUrl || '');
      }

      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
      }

      const result = await response.json();
      alert(result.message);

      // Reload event data and reset states
      await loadEvent();
      setIsEditing(false);
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
    } catch (error) {
      console.error('Error updating event:', error);
      alert(error instanceof Error ? error.message : 'Failed to update event');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event) return;

    if (!confirm('Are you sure you want to delete this event? This will also delete all associated signups and cannot be undone.')) {
      return;
    }

    try {
      const token = await getIdToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }

      const result = await response.json();
      alert(result.message);

      // Redirect back to admin dashboard events tab
      router.push('/admin-dashboard?tab=events');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete event');
    }
  };

  const handlePaymentToggle = async (signupId: string, paid: boolean) => {
    try {
      const token = await getIdToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`/api/admin/events/${eventId}/signups/${signupId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update payment status');
      }

      // Update local state
      setSignups(prev => prev.map(signup =>
        signup.id === signupId ? { ...signup, paid } : signup
      ));

    } catch (error) {
      console.error('Error updating payment status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update payment status');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>{authLoading ? 'Authenticating...' : 'Loading event...'}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Link
            href="/admin-dashboard?tab=events"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Redesigned Header */}
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          {/* Main Header Row */}
          <div className="flex items-center justify-between">
            {/* Left Section - Navigation & Title */}
            <div className="flex items-center gap-6">
              {/* Back Button */}
              <button
                onClick={() => {
                  const prevEvent = getPreviousEvent();
                  if (prevEvent) {
                    navigateToEvent(prevEvent.id);
                  } else {
                    router.push('/admin-dashboard?tab=events');
                  }
                }}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50"
                title={getPreviousEvent() ? 'Previous Event' : 'Back to Dashboard'}
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </button>

              {/* Event Title & Counter */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white truncate max-w-md">{event.title}</h1>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-full border border-slate-600/50">
                    <span className="text-xs font-medium text-slate-300">
                      {getCurrentEventIndex() + 1} of {allEvents.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Event Management</span>
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400 font-medium">Live</span>
                </div>
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex items-center gap-4">
              {/* Navigation Controls */}
              <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <button
                  onClick={() => {
                    const prevEvent = getPreviousEvent();
                    if (prevEvent) navigateToEvent(prevEvent.id);
                  }}
                  disabled={!getPreviousEvent()}
                  className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent hover:bg-slate-700/70 rounded-lg transition-all duration-200"
                  title="Previous Event (←)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Prev</span>
                </button>

                <div className="w-px h-6 bg-slate-600/50"></div>

                <button
                  onClick={() => setShowEventsSidebar(!showEventsSidebar)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/70 rounded-lg transition-all duration-200"
                  title="Show All Events"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="text-sm font-medium hidden sm:inline">Events</span>
                </button>

                <div className="w-px h-6 bg-slate-600/50"></div>

                <button
                  onClick={() => {
                    const nextEvent = getNextEvent();
                    if (nextEvent) navigateToEvent(nextEvent.id);
                  }}
                  disabled={!getNextEvent()}
                  className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent hover:bg-slate-700/70 rounded-lg transition-all duration-200"
                  title="Next Event (→)"
                >
                  <span className="text-sm font-medium">Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                >
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>

                <button
                  onClick={handleDeleteEvent}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                >
                  <svg className="w-4 h-4 group-hover:shake transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Events Sidebar */}
        {showEventsSidebar && (
          <div className="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-[#0A1219] to-[#18384D] border-r border-white/20 shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h2 className="text-xl font-bold">All Events</h2>
                <button
                  onClick={() => setShowEventsSidebar(false)}
                  className="p-2 text-gray-400 hover:text-white transition duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Events List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {allEvents.map((sidebarEvent, index) => (
                    <div
                      key={sidebarEvent.id}
                      onClick={() => {
                        navigateToEvent(sidebarEvent.id);
                        setShowEventsSidebar(false);
                      }}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        sidebarEvent.id === eventId
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          sidebarEvent.id === eventId
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium text-sm truncate ${
                            sidebarEvent.id === eventId ? 'text-blue-200' : 'text-white'
                          }`}>
                            {sidebarEvent.title}
                          </h3>
                          <p className="text-xs text-gray-400 truncate">
                            {sidebarEvent.date} • {sidebarEvent.location}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {sidebarEvent.signupOpen ? (
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                                Signups Open
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full">
                                Signups Closed
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {sidebarEvent.formFields.length} fields
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overlay for sidebar */}
        {showEventsSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowEventsSidebar(false)}
          />
        )}

        <div className="space-y-8">
          {/* Navigation Help */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-blue-200 font-medium text-sm">Quick Navigation</h4>
                <p className="text-blue-300 text-xs">
                  Use arrow keys (← →) to navigate between events, or click the list icon to see all events
                </p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <div className="bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              {!isEditing && event.imageUrl && (
                <div className="mb-6 rounded-lg flex justify-center">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={600}
                    height={300}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                </div>
              )}

              {isEditing ? (
                <div className="space-y-4">
                  {/* Current Image Preview */}
                  {(imagePreviewUrl || (event.imageUrl && event.imageUrl !== null)) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Event Poster</label>
                      <div className="relative mb-4 flex justify-center">
                        <Image
                          src={imagePreviewUrl || event.imageUrl!}
                          alt="Event poster preview"
                          width={400}
                          height={200}
                          className="w-full h-64 md:h-80 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {(event.imageUrl && event.imageUrl !== null) || imagePreviewUrl ? 'Replace Event Poster' : 'Upload Event Poster'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Supported formats: JPG, PNG, GIF. Max size: 5MB<br/>
                      <strong>Important:</strong> For best display, use 4:3 aspect ratio (e.g., 800×600, 1200×900)<br/>
                      Non-4:3 images will be cropped to fit the display area
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                      <input
                        type="text"
                        value={editForm.date}
                        onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={editForm.startTime}
                        onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Time
                        <span className="text-gray-500 text-xs ml-1">(optional)</span>
                      </label>
                      <input
                        type="time"
                        value={editForm.endTime}
                        onChange={(e) => setEditForm({...editForm, endTime: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price (Optional)</label>
                    <input
                      type="text"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                      placeholder="Free or enter price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                            checked={editForm.tags.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditForm({
                                  ...editForm,
                                  tags: [...editForm.tags, tag]
                                });
                              } else {
                                setEditForm({
                                  ...editForm,
                                  tags: editForm.tags.filter(t => t !== tag)
                                });
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 block text-sm text-gray-300 capitalize">
                            {tag}
                          </span>
                        </label>
                      ))}
                    </div>
                    {editForm.tags.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-300 mb-2">Selected Tags:</p>
                        <div className="flex flex-wrap gap-2">
                          {editForm.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                              {tag}
                              <button
                                type="button"
                                onClick={() => setEditForm({
                                  ...editForm,
                                  tags: editForm.tags.filter(t => t !== tag)
                                })}
                                className="ml-2 text-blue-300 hover:text-blue-100"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Signup Options */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="editSignupOpen"
                        checked={editForm.signupOpen}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setEditForm({
                            ...editForm,
                            signupOpen: checked,
                            // If signup is being opened, no signup cannot be needed
                            noSignupNeeded: checked ? false : editForm.noSignupNeeded
                          });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="editSignupOpen" className="ml-2 block text-sm font-medium text-gray-300">
                        Sign up open?
                        <span className="text-gray-500 text-xs ml-2">
                          (If checked, public users can sign up for this event)
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="editNoSignupNeeded"
                        checked={editForm.noSignupNeeded}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setEditForm({
                            ...editForm,
                            noSignupNeeded: checked,
                            // If no signup is needed, signup cannot be open
                            signupOpen: checked ? false : editForm.signupOpen,
                            // Clear form fields if no signup is needed, or set defaults if signup is needed
                            formFields: checked ? [] : (editForm.formFields.length === 0 ? ['name', 'email'] : editForm.formFields),
                            // Clear maxSignups if no signup is needed
                            maxSignups: checked ? 0 : editForm.maxSignups
                          });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="editNoSignupNeeded" className="ml-2 block text-sm font-medium text-gray-300">
                        No sign up needed
                        <span className="text-gray-500 text-xs ml-2">
                          (Check if this is a public event where people can just show up without registering)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Max Sign Ups - Only show if signup is needed */}
                  {!editForm.noSignupNeeded && (
                    <div>
                      <label htmlFor="editMaxSignups" className="block text-sm font-medium text-gray-300 mb-2">
                        Maximum Sign Ups
                      </label>
                      <select
                        id="editMaxSignups"
                        value={editForm.maxSignups || 50}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          maxSignups: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Array.from({ length: 200 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-400 mt-1">Maximum number of people who can sign up for this event</p>
                    </div>
                  )}

                  {/* Form Fields Selection - Only show if signup is needed */}
                  {!editForm.noSignupNeeded && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Signup Form Fields *
                        <span className="text-gray-500 text-xs ml-2">
                          (Select which information to collect from attendees)
                        </span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                        {[...availableFormFields, ...customFormFields].map((field) => (
                          <label key={field} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editForm.formFields.includes(field)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditForm({
                                    ...editForm,
                                    formFields: [...editForm.formFields, field]
                                  });
                                } else {
                                  setEditForm({
                                    ...editForm,
                                    formFields: editForm.formFields.filter(f => f !== field)
                                  });
                                }
                              }}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-300 capitalize">
                              {field.replace(/_/g, ' ')}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Custom Form Fields */}
                      <div className="mt-4 border-t border-white/20 pt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Add Custom Form Field
                        </label>
                        <p className="text-xs text-gray-400 mb-3">Create your own custom field for specific event requirements</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCustomField}
                            onChange={(e) => setNewCustomField(e.target.value)}
                            placeholder="e.g., Allergies, Dietary Restrictions, etc."
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newCustomField.trim() && !availableFormFields.includes(newCustomField.trim()) && !customFormFields.includes(newCustomField.trim())) {
                                setCustomFormFields([...customFormFields, newCustomField.trim()]);
                                setEditForm({
                                  ...editForm,
                                  formFields: [...editForm.formFields, newCustomField.trim()]
                                });
                                setNewCustomField('');
                              }
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300"
                          >
                            Add
                          </button>
                        </div>
                        {customFormFields.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-300 mb-2">Custom Fields Added:</p>
                            <div className="flex flex-wrap gap-2">
                              {customFormFields.map((field, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                                  {field.replace(/_/g, ' ')}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedCustomFields = customFormFields.filter(f => f !== field);
                                      setCustomFormFields(updatedCustomFields);
                                      setEditForm({
                                        ...editForm,
                                        formFields: editForm.formFields.filter(f => f !== field)
                                      });
                                    }}
                                    className="ml-2 text-blue-300 hover:text-blue-100"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {editForm.formFields.length === 0 && (
                        <p className="text-red-400 text-xs">Please select at least one form field</p>
                      )}
                    </div>
                  )}

                  {/* Show message when no signup is needed */}
                  {editForm.noSignupNeeded && (
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

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveEvent}
                      disabled={uploadingImage || (!editForm.noSignupNeeded && editForm.formFields.length === 0)}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition duration-300 flex items-center gap-2"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedImageFile(null);
                        setImagePreviewUrl(null);
                      }}
                      disabled={uploadingImage}
                      className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 text-xs font-bold rounded-full border border-green-500/30">
                      ACTIVE EVENT
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 text-xs font-bold rounded-full border border-blue-500/30">
                      {event.noSignupNeeded ? 0 : event.formFields.length} FORM FIELDS
                    </span>
                    {!event.noSignupNeeded && (
                      <button
                        onClick={async () => {
                          try {
                            const token = await getIdToken();
                            if (!token) throw new Error('No authentication token');

                            // Optimistically update the UI first
                            const newStatus = !event.signupOpen;
                            setEvent({...event, signupOpen: newStatus});

                            const response = await fetch(`/api/admin/events/${eventId}`, {
                              method: 'PATCH',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                signupOpen: newStatus
                              }),
                            });

                            if (!response.ok) {
                              // Revert the optimistic update on error
                              setEvent({...event, signupOpen: !newStatus});
                              const errorData = await response.json();
                              throw new Error(errorData.error || 'Failed to update signup status');
                            }
                          } catch (error) {
                            console.error('Error toggling signup status:', error);
                            alert(error instanceof Error ? error.message : 'Failed to update signup status');
                          }
                        }}
                        className="relative inline-flex items-center cursor-pointer group"
                        title={event.signupOpen ? 'Click to close signups' : 'Click to open signups'}
                      >
                        {/* Toggle Track */}
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          event.signupOpen
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        }`}>
                          {/* Toggle Knob */}
                          <div className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                            event.signupOpen
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`} />
                        </div>

                        {/* Status Label */}
                        <span className={`ml-3 text-xs font-bold transition-colors duration-200 ${
                          event.signupOpen
                            ? 'text-green-300'
                            : 'text-gray-400'
                        }`}>
                          {event.signupOpen ? 'SIGN UP OPEN' : 'SIGN UP CLOSED'}
                        </span>
                      </button>
                    )}
                    {event.noSignupNeeded && (
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 text-xs font-bold rounded-full border border-blue-500/30">
                        WALK-IN EVENT
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold mb-4">{event.title}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-400">Date</p>
                          <p className="font-semibold">{formatEventDate(event.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-400">Time</p>
                          <p className="font-semibold">{formatTimeRange(event.startTime, event.endTime)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="font-semibold">{event.location}</p>
                        </div>
                      </div>
                      {event.price && (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-400">Price</p>
                            <p className="font-semibold">
                              {event.price === 'Free' || !event.price
                                ? 'Free'
                                : `£${event.price}`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Signups</span>
                  <span className="font-semibold">{signups.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Paid</span>
                  <span className="font-semibold text-green-400">
                    {signups.filter(s => s.paid).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Payment</span>
                  <span className="font-semibold text-yellow-400">
                    {signups.filter(s => !s.paid).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Form Fields</span>
                  <span className="font-semibold">{event.formFields.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="font-semibold text-sm">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Signups Table */}
            <div className="space-y-6 w-full">
              <div className="bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Event Signups</h3>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 text-sm font-bold rounded-full border border-blue-500/30">
                  {signups.length} signup{signups.length !== 1 ? 's' : ''}
                </span>
              </div>

              {loadingSignups ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-400 text-sm">Loading signups...</p>
                </div>
              ) : signups.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h4 className="font-medium text-gray-300 mb-2">No Signups Yet</h4>
                  <p className="text-gray-500 text-sm">Signups will appear here when people register</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-2 font-semibold text-white">#</th>
                        {event.formFields.map((field) => (
                          <th key={field} className="text-left py-3 px-2 font-semibold text-white capitalize">
                            {field.replace(/_/g, ' ')}
                          </th>
                        ))}
                        <th className="text-left py-3 px-2 font-semibold text-white">Submitted</th>
                        <th className="text-left py-3 px-2 font-semibold text-white">Paid?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signups.map((signup, index) => (
                        <tr key={signup.id || index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-2 text-gray-300 font-medium">
                            {index + 1}
                          </td>
                          {event.formFields.map((field) => (
                            <td key={field} className="py-3 px-2 text-gray-300 max-w-48 truncate">
                              {signup.formData?.[field] || 'N/A'}
                            </td>
                          ))}
                          <td className="py-3 px-2 text-gray-400 text-xs">
                            {new Date(signup.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2">
                            <input
                              type="checkbox"
                              checked={signup.paid || false}
                              onChange={(e) => handlePaymentToggle(signup.id, e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </div>
            </div>

        </div>
      </div>
    </div>
  );
}
