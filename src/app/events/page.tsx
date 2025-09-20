'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { faqData } from '@/lib/faq-data';

type StaticEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Other';
  description: string;
  image?: string;
  signupLink?: string;
  tags: string[];
};

type AdminEvent = {
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
  signupMethod: 'none' | 'website' | 'external'; // 'none' = walk-in, 'website' = website signup, 'external' = external link
  noSignupNeeded?: boolean; // Keep for backwards compatibility
  maxSignups?: number;
  signupCount?: number;
  tags: string[];
  createdAt: Date;
  isPublic: boolean;
  signupFormUrl?: string;
};

export default function EventsPage() {
  const [adminEvents, setAdminEvents] = useState<AdminEvent[]>([]);
  const [, setLoadingAdminEvents] = useState(true);

  // Function to get day of the week
  const getDayOfWeek = (date: Date): string => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  };

  // Function to format date like "Monday, Sep. 25th, 2025"
  const formatEventDate = (dateString: string) => {
    try {
      // Handle dates with ordinal suffixes like "November 11th, 2025"
      const ordinalRegex = /^(\w+)\s+(\d+)(?:st|nd|rd|th),\s+(\d{4})$/;
      const match = dateString.match(ordinalRegex);

      if (match) {
        const [, monthName, dayStr, yearStr] = match;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = monthNames.findIndex(name => name.toLowerCase() === monthName.toLowerCase());

        if (monthIndex !== -1) {
          const date = new Date(parseInt(yearStr), monthIndex, parseInt(dayStr));
          const shortMonthNames = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
                                  'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

          const dayOfWeek = getDayOfWeek(date);
          const month = shortMonthNames[date.getMonth()];
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

          return `${dayOfWeek}, ${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
        }
      }

      // Try standard date parsing for other formats
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const monthNames = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
                           'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

        const dayOfWeek = getDayOfWeek(date);
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

        return `${dayOfWeek}, ${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
      }

      return dateString; // Fallback to original format
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

  // Function to organize events by date
  const organizeEventsByDate = (events: StaticEvent[], adminEvents: AdminEvent[]) => {
    const dates: { [key: string]: (StaticEvent | AdminEvent)[] } = {};

    // Helper function to parse event date and get a standardized date key
    const getDateKey = (dateString: string): string | null => {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // Handle dates with ordinal suffixes like "November 11th, 2025"
      const ordinalRegex = /^(\w+)\s+(\d+)(?:st|nd|rd|th),\s+(\d{4})$/;
      const match = dateString.match(ordinalRegex);

      if (match) {
        const [, monthName, dayStr, yearStr] = match;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = monthNames.findIndex(name => name.toLowerCase() === monthName.toLowerCase());

        if (monthIndex !== -1) {
          const date = new Date(parseInt(yearStr), monthIndex, parseInt(dayStr));
          return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
        }
      }

      // Try standard date parsing
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      return null;
    };

    // Helper function to format date for display
    const formatDateForDisplay = (dateKey: string): string => {
      const [year, month, day] = dateKey.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor

      const monthNames = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
                         'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

      const dayOfWeek = getDayOfWeek(date);
      const monthName = monthNames[date.getMonth()];
      const dayNum = date.getDate();
      const yearNum = date.getFullYear();

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

      return `${dayOfWeek}, ${monthName} ${dayNum}${getOrdinalSuffix(dayNum)}, ${yearNum}`;
    };

    // Helper function to calculate recurring event dates
    const calculateRecurringDates = (dateString: string, eventTitle: string, numOccurrences: number = 3): string[] => {
      const dates: string[] = [];

      if (!dateString.includes('Every')) return dates;

      const dayMap: { [key: string]: number } = {
        'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
        'Friday': 5, 'Saturday': 6, 'Sunday': 0
      };

      const dayMatch = dateString.match(/Every (\w+)/);
      if (!dayMatch) return dates;

      const dayOfWeek = dayMap[dayMatch[1]];
      if (dayOfWeek === undefined) return dates;

      // Special handling for Roots Academy Classes - use specific dates
      if (eventTitle === 'Roots Academy Classes') {
        const specificRootsDates = [
          '2025-10-07', '2025-10-14', '2025-10-21', '2025-10-28',
          '2025-11-04', '2025-11-11', '2025-11-18', '2025-11-25',
          '2025-12-02', '2025-12-09', '2025-12-16',
          '2026-03-24', '2026-03-31', '2026-04-07', '2026-04-14', '2026-04-21', '2026-04-28',
          '2026-05-05', '2026-05-12', '2026-05-19'
        ];

        // Filter to only include future dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return specificRootsDates.filter(dateStr => {
          const eventDate = new Date(dateStr);
          return eventDate >= today;
        });
      }

      // Special handling for Friday Football - use specific dates
      if (eventTitle === 'Friday Football') {
        const specificFridayFootballDates = [
          '2025-09-26', '2025-10-03', '2025-10-10', '2025-10-17', '2025-10-24', '2025-10-31',
          '2025-11-07', '2025-11-14', '2025-11-21', '2025-11-28',
          '2025-12-05', '2025-12-12', '2025-12-19'
        ];

        // Filter to only include future dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return specificFridayFootballDates.filter(dateStr => {
          const eventDate = new Date(dateStr);
          return eventDate >= today;
        });
      }

      // Fallback to original logic for events without specific ranges
      const startDate = new Date();

      // Find the next occurrence of the specified day (more reliable method)
      const firstOccurrence = new Date(startDate);
      const startDay = startDate.getDay();
      let daysToAdd = 0;

      if (startDay <= dayOfWeek) {
        // If start day is before or equal to target day, add the difference
        daysToAdd = dayOfWeek - startDay;
      } else {
        // If start day is after target day, add days to reach next occurrence
        daysToAdd = (7 - startDay) + dayOfWeek;
      }

      // If we're already on the target day and it's not today, or if daysToAdd is 0, add 7 days
      if (daysToAdd === 0) {
        daysToAdd = 7;
      }

      firstOccurrence.setDate(startDate.getDate() + daysToAdd);

      // Generate the specified number of occurrences
      for (let i = 0; i < numOccurrences; i++) {
        const occurrenceDate = new Date(firstOccurrence);
        occurrenceDate.setDate(firstOccurrence.getDate() + (i * 7)); // Add 7 days for each occurrence

        // Only include dates that are today or in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (occurrenceDate >= today) {
          dates.push(occurrenceDate.toISOString().split('T')[0]);
        }
      }

      return dates;
    };

    // Process static events
    events.forEach(event => {
      if (event.date.includes('Every')) {
        // Handle recurring events - calculate next few dates (limit to avoid clutter)
        const recurringDates = calculateRecurringDates(event.date, event.title, 12); // Show next 12 occurrences
        recurringDates.forEach(dateKey => {
          if (!dates[dateKey]) {
            dates[dateKey] = [];
          }
          // Prevent duplicate events on the same date
          const existingEvent = dates[dateKey].find(e =>
            ('id' in e ? (e as StaticEvent).id : (e as AdminEvent).id) === event.id
          );
          if (!existingEvent) {
            dates[dateKey].push(event);
          }
        });
      } else {
        // Handle specific dates
        const dateKey = getDateKey(event.date);
        if (dateKey) {
          if (!dates[dateKey]) {
            dates[dateKey] = [];
          }
          dates[dateKey].push(event);
        }
      }
    });

    // Process admin events
    adminEvents.forEach(event => {
      const dateKey = getDateKey(event.date);
      if (dateKey) {
        if (!dates[dateKey]) {
          dates[dateKey] = [];
        }
        dates[dateKey].push(event);
      }
    });

    // Note: Current date filtering could be added here in the future

    // Sort dates chronologically (show all events, both past and future)
    const allDateKeys = Object.keys(dates).sort();

    // Helper function to get event time for sorting
    const getEventTime = (event: StaticEvent | AdminEvent): string => {
      if ('category' in event) {
        // Static event - use time field
        return event.time;
      } else {
        // Admin event - use startTime field
        return event.startTime;
      }
    };

    // Helper function to convert time string to minutes for comparison
    const timeToMinutes = (timeStr: string): number => {
      try {
        // Handle formats like "7:00 PM - 8:30 PM" or "18:00"
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const ampm = timeMatch[3]?.toUpperCase();

          // Convert 12-hour to 24-hour format
          if (ampm === 'PM' && hours !== 12) {
            hours += 12;
          } else if (ampm === 'AM' && hours === 12) {
            hours = 0;
          }

          return hours * 60 + minutes;
        }

        // Fallback: try to parse as 24-hour format
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
          const hours = parseInt(parts[0]);
          const minutes = parseInt(parts[1]);
          return hours * 60 + minutes;
        }

        return 0; // Default fallback
      } catch {
        return 0; // Default fallback
      }
    };

    const sortedDates = allDateKeys
      .map(dateKey => ({
        dateKey,
        dateDisplay: formatDateForDisplay(dateKey),
        events: dates[dateKey].sort((a, b) => {
          const timeA = timeToMinutes(getEventTime(a));
          const timeB = timeToMinutes(getEventTime(b));
          return timeA - timeB; // Sort by time (earlier first)
        })
      }));

    return sortedDates;
  };

  // Events data from events.txt
  const allEvents: StaticEvent[] = [
    // Other Events
    {
      id: 1,
      title: "Roots Academy Classes",
      date: "Every Tuesday",
      time: "7:00 PM - 8:30 PM",
      location: "Lecture Theatre 4, Arts Tower",
      category: "Other",
      description: "Our Tuesday evening classes cover different themes each semester, such as Qur'anic Tafsir/exegesis, Prophetic Seerah/biography, and methods of spiritual purification.",
      image: "/images/WEB/brothers/roots.png",
      signupLink: "https://forms.google.com/roots-academy-signup",
      tags: ["weekly", "education"],
    },
    {
      id: 22,
      title: "Friday Football",
      date: "Every Friday",
      time: "7:00 PM",
      location: "The Wave Pitches",
      category: "Other",
      description: "Brothers' special football sessions. A great way to end the week with physical activity and brotherhood. 14 spots open each week - don't miss out!",
      image: "/images/WEB/brothers/brother3.jpeg",
      signupLink: "https://forms.google.com/friday-football-signup",
      tags: ["brothers only", "weekly", "welfare", "sports"],
    }
  ];

  // State for category filter and modal
  const [categoryFilter, setCategoryFilter] = useState<'All'>('All');
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<StaticEvent | AdminEvent | null>(null);

  // State for FAQ modal
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState(0);

  // State for mobile filter dropdown
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown-container')) {
        setIsFilterDropdownOpen(false);
      }
    };

    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  // Fetch admin-created events
  useEffect(() => {
    const fetchAdminEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setAdminEvents(data.events || []);
        }
      } catch (error) {
        console.error('Error fetching admin events:', error);
      } finally {
        setLoadingAdminEvents(false);
      }
    };

    fetchAdminEvents();
  }, []);

  // Use centralized FAQ data for events
  const eventsFAQData = faqData.events;

  // Filter static events based on tags
  let filteredStaticEvents = allEvents;

  // Filter admin events based on tags only
  let filteredAdminEvents = adminEvents;

  // Apply tag filters to both static and admin events
  if (tagsFilter.length > 0) {
    filteredStaticEvents = filteredStaticEvents.filter(event =>
      tagsFilter.some(tag => event.tags.includes(tag))
    );
    filteredAdminEvents = filteredAdminEvents.filter(event =>
      tagsFilter.some(tag => event.tags.includes(tag))
    );
  }

  // Combine static events and admin events for display
  const combinedEvents = [...filteredStaticEvents, ...filteredAdminEvents];

  // Filter combined events for cards display - only show public events
  const filteredEvents = combinedEvents.filter(event =>
    // Static events are always considered public
    'category' in event || (event as AdminEvent).isPublic !== false
  );

  // Modal handlers
  const openModal = (event: StaticEvent | AdminEvent) => {
    setSelectedEvent(event);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setSelectedEvent(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  // Handle click outside modal to close
  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // FAQ modal handlers
  const closeFAQModal = () => {
    setShowFAQModal(false);
    setCurrentFAQ(0); // Reset to first question
  };

  const nextFAQ = () => setCurrentFAQ(currentFAQ < eventsFAQData.length - 1 ? currentFAQ + 1 : 0);
  const prevFAQ = () => setCurrentFAQ(currentFAQ > 0 ? currentFAQ - 1 : eventsFAQData.length - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white px-4">OUR EVENTS & ACTIVITIES</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Sign up for our events and activities using the links below
          </p>
        </div>
        
        {/* Full-width Date-based Events Timeline */}
        <div className="mt-4 sm:mt-8 w-full relative">
          {/* Horizontal timeline line - spans full width */}
          <div className="absolute top-6 sm:top-12 left-0 right-0 h-0.5 bg-blue-300/30"></div>

          {/* Timeline items - horizontal scroll */}
          <div
            className="overflow-x-auto pb-2 sm:pb-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-transparent"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'transparent transparent',
              // WebKit scrollbar styling for complete transparency
              WebkitScrollbarWidth: 'thin',
              WebkitScrollbarColor: 'transparent transparent'
            } as React.CSSProperties}
          >
            <div className="flex space-x-4 sm:space-x-8 min-w-max px-4 sm:px-8 relative">
              {/* Today's yellow indicator dot - only show when no event on today's date */}
              {(() => {
                const organizedDates = organizeEventsByDate(allEvents, adminEvents);
                const today = new Date();
                const todayKey = today.toISOString().split('T')[0]; // YYYY-MM-DD format

                // Find today's position in the timeline
                const todayIndex = organizedDates.findIndex(dateItem => dateItem.dateKey === todayKey);

                // Only show separate indicator if today has NO events (use closest date instead)
                if (todayIndex !== -1) {
                  return null; // Don't show separate indicator - the timeline dot will be yellow
                }

                // Calculate position for closest date when today has no events
                let todayPosition = 0;
                if (organizedDates.length > 0) {
                  const todayTime = today.getTime();
                  let closestIndex = 0;
                  let minDiff = Math.abs(todayTime - new Date(organizedDates[0].dateKey).getTime());

                  organizedDates.forEach((dateItem, index) => {
                    const diff = Math.abs(todayTime - new Date(dateItem.dateKey).getTime());
                    if (diff < minDiff) {
                      minDiff = diff;
                      closestIndex = index;
                    }
                  });

                  const itemSpacing = 32; // space-x-8 = 2rem = 32px on larger screens
                  const itemWidth = 300; // sm:min-w-[300px]
                  todayPosition = closestIndex * (itemWidth + itemSpacing) + (itemWidth / 2) + 16;
                }

                return todayPosition > 0 ? (
                  <div
                    className="absolute top-4 sm:top-8 z-20"
                    style={{ left: `${todayPosition}px` }}
                  >
                    {/* Today's yellow dot with pulsing animation */}
                    <div className="relative">
                      {/* Outer pulsing ring - properly centered */}
                      <div className="absolute -top-0.5 -left-0.5 w-5 h-5 sm:w-7 sm:h-7 sm:-top-0.5 sm:-left-0.5 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
                      {/* Main yellow dot */}
                      <div className="relative w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full border-2 sm:border-4 border-[#0A1219] shadow-lg shadow-yellow-400/50">
                        {/* Inner white dot for better visibility */}
                        <div className="absolute inset-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    {/* "Today" label */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <span className="text-xs font-semibold text-yellow-300 bg-[#0A1219]/80 px-2 py-1 rounded whitespace-nowrap">
                        Today
                      </span>
                    </div>
                  </div>
                ) : null;
              })()}

              {organizeEventsByDate(allEvents, adminEvents).map((dateItem) => {
                const today = new Date();
                const todayKey = today.toISOString().split('T')[0]; // YYYY-MM-DD format
                const isToday = dateItem.dateKey === todayKey;

                return (
                  <div key={dateItem.dateKey} className="relative flex flex-col items-center min-w-[240px] sm:min-w-[300px]">
                    {/* Timeline dot - yellow for today */}
                    <div className={`absolute top-4 sm:top-8 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 sm:border-4 border-[#0A1219] z-10 ${
                      isToday
                        ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
                        : 'bg-blue-400'
                    }`}></div>

                    {/* Timeline content - yellow border for today */}
                    <div className={`mt-12 sm:mt-20 bg-[#0F1E2C]/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-6 border w-full max-w-[240px] sm:max-w-[320px] transition-all duration-300 ${
                      isToday
                        ? 'border-yellow-400 shadow-lg shadow-yellow-400/20'
                        : 'border-blue-200/20'
                    }`}>
                    {/* Date header */}
                    <div className="text-center mb-2 sm:mb-4">
                      <h4 className="text-sm sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                        {dateItem.dateDisplay}
                      </h4>
                      <span className="text-xs sm:text-sm text-blue-300 bg-[#18384D] px-2 sm:px-3 py-1 rounded-full">
                        {dateItem.events.length} event{dateItem.events.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Events for this date */}
                    <div className="space-y-2 sm:space-y-3">
                      {dateItem.events.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="flex items-center justify-between p-2 sm:p-3 bg-[#18384D]/50 rounded-md sm:rounded-lg hover:bg-[#18384D]/70 transition duration-200 cursor-pointer"
                          onClick={() => {
                            if ('category' in event) {
                              // Static event
                              openModal(event);
                            } else {
                              // Admin event - handle based on signup method
                              const adminEvent = event as AdminEvent;

                              if (adminEvent.signupMethod === 'none') {
                                // Walk-in event
                                openModal(event);
                              } else if (adminEvent.signupMethod === 'external') {
                                // External signup - redirect to external link
                                if (adminEvent.signupFormUrl) {
                                  window.open(adminEvent.signupFormUrl, '_blank');
                                } else {
                                  openModal(event);
                                }
                              } else if (adminEvent.signupMethod === 'website' && adminEvent.signupOpen) {
                                // Website signup - redirect to event page
                                const isSoldOut = adminEvent.maxSignups && adminEvent.signupCount && adminEvent.signupCount >= adminEvent.maxSignups;
                                if (isSoldOut) {
                                  openModal(event);
                                } else {
                                  window.location.href = `/events/${event.id}`;
                                }
                              } else {
                                // Signup closed or other cases
                                openModal(event);
                              }
                            }
                          }}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                            <div className="text-left">
                              <h5 className="font-medium text-white text-xs sm:text-sm">{event.title}</h5>
                              <p className="text-xs text-blue-200">
                                {'category' in event ? event.time : formatTimeRange(event.startTime, event.endTime)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Empty state */}
            {organizeEventsByDate(allEvents, adminEvents).length === 0 && (
              <div className="text-center py-8">
                <p className="text-blue-200">No upcoming events scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4">
        {/* Separator */}
        <div className="py-8 flex justify-center">
          <div className="w-16 h-1 bg-white/70"></div>
        </div>
        
        {/* Events section */}
        <div className="pt-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-center">OUR EVENTS</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-12 text-center">
            Discover our vibrant calendar of events that bring our community together year-round
          </p>
        </div>
        
        {/* Unified Filter Buttons */}
        <div className="mb-8">

          {/* Mobile Filter Dropdown */}
          <div className="filter-dropdown-container md:hidden">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="w-full px-6 py-3 bg-[#0F1E2C] text-blue-100 hover:bg-[#18384D] border border-blue-200/30 rounded-full font-medium transition duration-300 flex items-center justify-between"
            >
              <span>
                All Events
                {tagsFilter.length > 0 && (
                  <span className="ml-2 text-sm text-blue-300">
                    ({tagsFilter.length} selected)
                  </span>
                )}
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isFilterDropdownOpen && (
              <div className="mt-4 bg-[#0F1E2C] rounded-xl border border-blue-200/20 p-4">
                <div className="space-y-3">
                  {/* Tag Filters in Dropdown */}
                  {[
                    { key: 'annual', display: 'Annual Events' },
                    { key: 'weekly', display: 'Weekly Events' },
                    { key: 'brothers only', display: 'Brothers Only' },
                    { key: 'sisters only', display: 'Sisters Only' },
                    { key: 'education', display: 'Education' },
                    { key: 'welfare', display: 'Welfare' },
                    { key: 'sports', display: 'Sports' },
                  ].map((tag) => (
                    <button
                      key={tag.key}
                      onClick={() => {
                        if (tagsFilter.includes(tag.key)) {
                          const newTagsFilter = tagsFilter.filter(t => t !== tag.key);
                          setTagsFilter(newTagsFilter);
                        } else {
                          setTagsFilter([...tagsFilter, tag.key]);
                        }
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg font-medium transition duration-300 ${
                        tagsFilter.includes(tag.key)
                          ? 'bg-white text-[#18384D] shadow-lg'
                          : 'bg-[#18384D] text-blue-100 hover:bg-[#1a4a6d]'
                      }`}
                    >
                      {tag.display}
                    </button>
                  ))}
                </div>

                {/* Clear Tags Button */}
                {tagsFilter.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200/20">
                    <button
                      onClick={() => setTagsFilter([])}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition duration-300"
                    >
                      Clear All Tags
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Filter Layout */}
          <div className="hidden md:flex flex-wrap justify-center gap-3 mb-4">
            {/* All Events Button */}
            <button
              onClick={() => {
                setCategoryFilter('All');
              }}
              className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
                categoryFilter === 'All'
                  ? 'bg-white text-[#18384D] shadow-lg'
                  : 'bg-[#0F1E2C] text-blue-100 hover:bg-[#18384D] border border-blue-200/30'
              }`}
            >
              All Events
            </button>

            {/* Tag Filters */}
            {[
              { key: 'annual', display: 'Annual Events' },
              { key: 'weekly', display: 'Weekly Events' },
              { key: 'brothers only', display: 'Brothers Only' },
              { key: 'sisters only', display: 'Sisters Only' },
              { key: 'education', display: 'Education' },
              { key: 'welfare', display: 'Welfare' },
              { key: 'sports', display: 'Sports' },
            ].map((tag) => (
              <button
                key={tag.key}
                onClick={() => {
                  if (tagsFilter.includes(tag.key)) {
                    const newTagsFilter = tagsFilter.filter(t => t !== tag.key);
                    setTagsFilter(newTagsFilter);
                  } else {
                    setTagsFilter([...tagsFilter, tag.key]);
                  }
                }}
                className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
                  tagsFilter.includes(tag.key)
                    ? 'bg-white text-[#18384D] shadow-lg'
                    : 'bg-[#0F1E2C] text-blue-100 hover:bg-[#18384D] border border-blue-200/30'
                }`}
              >
                {tag.display}
              </button>
            ))}
          </div>

          {/* Desktop Clear Filters */}
          <div className="hidden md:flex justify-center gap-3">
            {tagsFilter.length > 0 && (
              <button
                onClick={() => setTagsFilter([])}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium text-sm transition duration-300"
              >
                Clear Tags
              </button>
            )}
          </div>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Combined events (static and admin) */}
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-[#0F1E2C] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02] cursor-pointer flex flex-col"
              onClick={() => {
                if ('category' in event) {
                  // Static event - open modal
                  openModal(event);
                } else if ('noSignupNeeded' in event && event.noSignupNeeded) {
                  // Admin event with no signup needed - walk-in event
                  openModal(event);
                } else if ('signupOpen' in event && event.signupOpen) {
                  // Admin event with signup open and signup needed - redirect to event page
                  window.location.href = `/events/${event.id}`;
                } else {
                  // Admin event with signup closed
                  openModal(event);
                }
              }}
            >
              <div className="bg-[#102736] relative flex-shrink-0 h-48">
                {('image' in event ? event.image : (event as AdminEvent).imageUrl) ? (
                  <Image
                    src={'image' in event ? event.image! : (event as AdminEvent).imageUrl!}
                    alt={event.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition:
                        event.title === "Roots Academy Classes" ? 'center 55%' :
                        event.title === "Friday Football" ? 'center center' :
                        'center 65%' // default for any other events
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#102736] flex items-center justify-center">
                    <span className="text-blue-300">No image</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{event.title}</h3>
                <div className="space-y-2 text-sm text-blue-200 mb-6 flex-grow">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <span>{'category' in event ? event.time : formatTimeRange(event.startTime, event.endTime)}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  {'meetUpLocation' in event && event.meetUpLocation && (
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Meet up: {event.meetUpLocation}</span>
                    </div>
                  )}
                  {'meetUpTime' in event && event.meetUpTime && (
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                      </svg>
                      <span>Meet up: {formatTimeRange(event.meetUpTime)}</span>
                    </div>
                  )}
                  {('memberPrice' in event || 'nonMemberPrice' in event) && (event.memberPrice || event.nonMemberPrice) ? (
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                      </svg>
                      <div>
                        {event.memberPrice && <div>Members: £{event.memberPrice}</div>}
                        {event.nonMemberPrice && <div>Non-members: £{event.nonMemberPrice}</div>}
                      </div>
                    </div>
                  ) : ('price' in event && event.price && event.price !== 'Free') && (
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                      </svg>
                      <span>£{event.price}</span>
                    </div>
                  )}
                </div>
                <div className="mt-auto">
                {('signupLink' in event && event.signupLink) ? (
                  // Static event with signup link
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when clicking button
                      window.open(event.signupLink, '_blank');
                    }}
                    className="block w-full px-4 py-2 bg-white text-[#18384D] hover:bg-gray-100 transition duration-300 font-semibold rounded-full text-center uppercase text-xs tracking-wider shadow"
                  >
                    SIGN UP NOW
                  </button>
                ) : (event as AdminEvent).signupMethod === 'external' ? (
                  // Admin event with external signup
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when clicking button
                      if ((event as AdminEvent).signupFormUrl) {
                        window.open((event as AdminEvent).signupFormUrl, '_blank');
                      }
                    }}
                    className="block w-full px-4 py-2 bg-white text-[#18384D] hover:bg-gray-100 transition duration-300 font-semibold rounded-full text-center uppercase text-xs tracking-wider shadow"
                  >
                    SIGN UP NOW
                  </button>
                ) : (event as AdminEvent).signupMethod === 'none' ? (
                  // Admin event with no signup needed
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when clicking button
                      openModal(event);
                    }}
                    className="block w-full px-4 py-2 bg-white text-[#18384D] hover:bg-gray-100 transition duration-300 font-semibold rounded-full text-center uppercase text-xs tracking-wider shadow"
                  >
                    LEARN MORE
                  </button>
                ) : (event as AdminEvent).signupMethod === 'website' && (event as AdminEvent).signupOpen ? (
                  // Admin event with website signup open
                  (() => {
                    const adminEvent = event as AdminEvent;
                    const isSoldOut = adminEvent.maxSignups && adminEvent.signupCount && adminEvent.signupCount >= adminEvent.maxSignups;
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click when clicking button
                          if (isSoldOut) {
                            openModal(event);
                          } else {
                            window.location.href = `/events/${event.id}`;
                          }
                        }}
                        className={`block w-full px-4 py-2 text-white hover:opacity-90 transition duration-300 font-semibold rounded-full text-center uppercase text-xs tracking-wider shadow ${
                          isSoldOut
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {isSoldOut ? 'SOLD OUT' : 'SIGN UP NOW'}
                      </button>
                    );
                  })()
                ) : (
                  // Admin event with signup closed
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when clicking button
                      openModal(event);
                    }}
                    className="block w-full px-4 py-2 bg-white text-[#18384D] hover:bg-gray-100 transition duration-300 font-semibold rounded-full text-center uppercase text-xs tracking-wider shadow"
                  >
                    LEARN MORE
                  </button>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No events message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-blue-200">No events found in this category.</p>
          </div>
        )}
        

      </div>

      {/* Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-[#0F1E2C] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#18384D] p-6 border-b border-blue-200/20 flex justify-between items-center">
              <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{selectedEvent.title}</h2>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:text-blue-200 transition duration-200 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Event Image */}
              {('image' in selectedEvent ? selectedEvent.image : (selectedEvent as AdminEvent).imageUrl) && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={'image' in selectedEvent ? selectedEvent.image! : (selectedEvent as AdminEvent).imageUrl!}
                    alt={selectedEvent.title}
                    width={800}
                    height={400}
                    className="w-full max-h-96 object-contain"
                    style={{
                      objectPosition: 'center center',
                      aspectRatio: 'auto'
                    }}
                  />
                </div>
              )}

              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-300 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Date</h4>
                      <p className="text-blue-200">{formatEventDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-300 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Time</h4>
                      <p className="text-blue-200">
                        {'category' in selectedEvent ? selectedEvent.time : formatTimeRange(selectedEvent.startTime, selectedEvent.endTime)}
                      </p>
                      {'meetUpTime' in selectedEvent && selectedEvent.meetUpTime && (
                        <p className="text-blue-200 text-sm mt-1">Meet up: {formatTimeRange(selectedEvent.meetUpTime)}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-300 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Location</h4>
                      <p className="text-blue-200">{selectedEvent.location}</p>
                      {'meetUpLocation' in selectedEvent && selectedEvent.meetUpLocation && (
                        <p className="text-blue-200 text-sm mt-1">Meet up: {selectedEvent.meetUpLocation}</p>
                      )}
                    </div>
                  </div>
                  
                  {('memberPrice' in selectedEvent || 'nonMemberPrice' in selectedEvent) && (selectedEvent.memberPrice || selectedEvent.nonMemberPrice) ? (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-300 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                      </svg>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Price</h4>
                        <div className="text-blue-200">
                          {selectedEvent.memberPrice && <div>Members: £{selectedEvent.memberPrice}</div>}
                          {selectedEvent.nonMemberPrice && <div>Non-members: £{selectedEvent.nonMemberPrice}</div>}
                        </div>
                      </div>
                    </div>
                  ) : 'category' in selectedEvent ? (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-300 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                      </svg>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Category</h4>
                        <p className="text-blue-200">{selectedEvent.category} Event</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-300 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Registration Status</h4>
                        <p className="text-blue-200">
                          {(() => {
                            const adminEvent = selectedEvent as AdminEvent;
                            if ('signupMethod' in adminEvent) {
                              if (adminEvent.signupMethod === 'none') {
                                return 'Walk-in Event - No Registration Required';
                              } else if (adminEvent.signupMethod === 'external') {
                                return 'External Registration Required';
                              } else {
                                return adminEvent.signupOpen ? 'Sign Up Open' : 'Info Only - Registration Closed';
                              }
                            } else {
                              // Fallback for backwards compatibility - static events
                              return 'signupLink' in selectedEvent
                                ? 'Sign Up Open'
                                : 'Info Only - Registration Closed';
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Description */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3 text-lg uppercase tracking-tight">About This Event</h4>
                <div className="text-blue-100 leading-relaxed text-base whitespace-pre-wrap">{selectedEvent.description}</div>
              </div>

              
            </div>
          </div>
        </div>
      )}
      
      {/* FAQ Section for LLM Optimization */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-white">FREQUENTLY ASKED QUESTIONS</h2>
          <button 
            onClick={() => setShowFAQModal(true)}
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View FAQ
          </button>
        </div>
      </section>
      
      {/* FAQ Modal */}
      {showFAQModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeFAQModal}>
          <div className="bg-[#0F1E2C] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#18384D] p-6 border-b border-blue-200/20 flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">FREQUENTLY ASKED QUESTIONS</h2>
              </div>
              <button 
                onClick={closeFAQModal}
                className="text-white hover:text-blue-200 transition duration-200 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* FAQ Slideshow */}
            <div className="p-6">
              <div className="mb-6 flex justify-between items-center">
                <button
                  onClick={prevFAQ}
                  className="text-white hover:text-blue-200 transition duration-200 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <span className="text-blue-200 font-medium">
                  {currentFAQ + 1} of {eventsFAQData.length}
                </span>

                <button
                  onClick={nextFAQ}
                  className="text-white hover:text-blue-200 transition duration-200 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="bg-[#18384D] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">{eventsFAQData[currentFAQ].question}</h3>
                {eventsFAQData[currentFAQ].button ? (
                  <a
                    href={eventsFAQData[currentFAQ].button!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {eventsFAQData[currentFAQ].button!.text}
                  </a>
                ) : (
                  <p className="text-blue-100 leading-relaxed">{eventsFAQData[currentFAQ].answer}</p>
                )}
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center space-x-2">
                {eventsFAQData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFAQ(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentFAQ ? 'bg-blue-400' : 'bg-blue-200/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 