'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  createdAt: Date;
  signupFormUrl?: string;
}

interface EventSignupForm {
  [key: string]: string;
}

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

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
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventSignupForm>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Event not found');
        } else {
          setError('Failed to load event');
        }
        return;
      }

      const data = await response.json();
      setEvent(data.event);
      
      // Initialize form data with empty values
      const initialFormData: EventSignupForm = {};
      data.event.formFields.forEach((field: string) => {
        initialFormData[field] = '';
      });
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId, fetchEvent]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    // Validate required fields
    const missingFields = event.formFields.filter(field => !formData[field]?.trim());
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/events/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          formData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit signup');
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting signup:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldLabel = (field: string) => {
    return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFieldType = (field: string) => {
    if (field.includes('email')) return 'email';
    if (field.includes('phone') || field.includes('whatsapp')) return 'tel';
    if (field.includes('student_id')) return 'text';
    return 'text';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <p className="text-gray-300 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/events')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-300"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Signup Successful!</h1>
          <p className="text-gray-300 mb-6">
            Thank you for signing up for <strong>{event.title}</strong>. We&apos;ll be in touch with more details soon.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/events')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-300"
            >
              Back to Events
            </button>
            <button
              onClick={() => {
                setSubmitSuccess(false);
              setFormData(() => {
                const resetData: EventSignupForm = {};
                event.formFields.forEach(field => {
                  resetData[field] = '';
                });
                return resetData;
              });
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition duration-300"
            >
              Sign Up Another Person
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D]">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={() => router.push('/events')}
          className="mb-6 text-blue-300 hover:text-blue-200 flex items-center gap-2 transition duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h1 className="text-3xl font-bold text-white mb-4">{event.title}</h1>
              
              {event.imageUrl && (
                <div className="mb-6">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-4 text-white">
                {/* Registration Status */}
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">
                    {event.signupOpen ? (
                      <span className="text-green-300 font-semibold">Registration Open</span>
                    ) : (
                      <span className="text-gray-400">Registration Closed</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">{formatEventDate(event.date)}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">{formatTimeRange(event.startTime, event.endTime)}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">{event.location}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">
                    {event.price === 'Free' || !event.price
                      ? 'Free'
                      : `£${event.price}`}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-white mb-3">About This Event</h3>
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Conditional Signup Form or Info Message */}
          {event.signupFormUrl ? (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>
              <p className="text-gray-300 mb-4">Click the button below to sign up for this event using our external registration form.</p>
              <button
                onClick={() => window.open(event.signupFormUrl, '_blank')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                Sign Up for Event
              </button>
            </div>
          ) : event.signupOpen ? (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {event.formFields.map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-white mb-2">
                      {getFieldLabel(field)} *
                    </label>
                    {field === 'dietary_requirements' || field === 'special_requests' ? (
                      <textarea
                        id={field}
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter your ${getFieldLabel(field).toLowerCase()}`}
                        required
                      />
                    ) : (
                      <input
                        type={getFieldType(field)}
                        id={field}
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter your ${getFieldLabel(field).toLowerCase()}`}
                        required
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Sign Up for Event'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-600/20 backdrop-blur-sm border border-gray-500/30 rounded-lg p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Registration Closed</h2>
                <p className="text-gray-300 mb-4">
                  Sign up for this event is currently closed. Please check back later or contact the organizers for more information.
                </p>
                <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Event Information</h3>
                  <p className="text-gray-300 text-sm">
                    You can still view the event details and contact information. If you have any questions about this event, please reach out to the USIC team.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
