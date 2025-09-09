'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  description: string;
  imageUrl?: string;
  formFields: string[];
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
    time: '',
    location: '',
    price: '',
    description: ''
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

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

  // Load event data
  const loadEvent = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/admin/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to load events');

      const data = await response.json();
      const foundEvent = data.events.find((e: Event) => e.id === eventId);

      if (foundEvent) {
        setEvent(foundEvent);
        setEditForm({
          title: foundEvent.title,
          date: foundEvent.date,
          time: foundEvent.time,
          location: foundEvent.location,
          price: foundEvent.price || '',
          description: foundEvent.description
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
      formData.append('time', editForm.time);
      formData.append('location', editForm.location);
      formData.append('price', editForm.price);
      formData.append('description', editForm.description);
      formData.append('formFields', JSON.stringify(event.formFields));

      // Handle image URL - send empty string to remove, or new URL if uploaded
      if (selectedImageFile) {
        formData.append('imageUrl', newImageUrl || '');
      } else if (event.imageUrl === null) {
        // Image was removed
        formData.append('imageUrl', '');
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

      // Redirect back to admin dashboard
      router.push('/admin-dashboard');
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
            href="/admin-dashboard"
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
      {/* Header */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin-dashboard"
                className="text-gray-400 hover:text-white transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <p className="text-gray-400">Event Management</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isEditing ? 'Cancel Edit' : 'Edit Event'}
              </button>
              <button
                onClick={handleDeleteEvent}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Event
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
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
                    className="max-w-full h-auto object-contain"
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
                          className="max-w-full h-auto object-contain rounded-lg"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                      <input
                        type="text"
                        value={editForm.time}
                        onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
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
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveEvent}
                      disabled={uploadingImage}
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
                      {event.formFields.length} FORM FIELDS
                    </span>
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
                          <p className="font-semibold">{event.time}</p>
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
                            <p className="font-semibold">{event.price}</p>
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
