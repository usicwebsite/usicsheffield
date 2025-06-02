'use client';

import { useState } from 'react';
import Image from 'next/image';

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Weekly' | 'Annual' | 'Other';
  description: string;
  image?: string;
  signupLink?: string;
};

export default function EventsPage() {
  // Events data from events.txt
  const allEvents: Event[] = [
    // Annual Events
    {
      id: 1,
      title: "Charity Hike",
      date: "November 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Peak District",
      category: "Annual",
      description: "Join us for our annual charity hike through the beautiful Peak District during Charity Week. All proceeds will go to support humanitarian causes around the world. A great opportunity to connect with nature while making a difference.",
      image: "/images/1.png",
      signupLink: "https://forms.google.com/charity-hike-2024"
    },
    {
      id: 2,
      title: "Spring Camp",
      date: "January 2025",
      time: "All Day",
      location: "Yorkshire Dales",
      category: "Annual",
      description: "Our rejuvenating spring camp takes place just before the start of Spring Semester. Enjoy a weekend of spiritual refreshment, workshops, outdoor activities and brotherly/sisterly bonding in the beautiful Yorkshire countryside.",
      image: "/images/2.png",
      signupLink: "https://forms.google.com/spring-camp-2025"
    },
    {
      id: 3,
      title: "Annual Dinner",
      date: "March/April 2025",
      time: "6:00 PM - 10:00 PM",
      location: "Diamond Building, University of Sheffield",
      category: "Annual",
      description: "The highlight of our calendar! A formal evening with inspiring speakers, delicious food, and an opportunity to celebrate our achievements as a community. Smart attire required for this prestigious gathering.",
      image: "/images/3.png",
      signupLink: "https://forms.google.com/annual-dinner-2025"
    },
    
    // Weekly Events
    {
      id: 4,
      title: "Islamic History Lessons",
      date: "Every Thursday",
      time: "5:00 PM - 6:30 PM",
      location: "Room 301, Diamond Building",
      category: "Weekly",
      description: "NEW! Dive into the rich history of Islam over the past century. These engaging sessions explore the major events, movements and personalities that have shaped the modern Muslim world.",
      image: "/images/4.png",
      signupLink: "https://forms.google.com/islamic-history-signup"
    },
    {
      id: 5,
      title: "Qur'an Circles",
      date: "Every Tuesday",
      time: "6:00 PM - 7:30 PM",
      location: "Islamic Society Room, Student Union",
      category: "Weekly",
      description: "Brothers' and sisters' separate circles where we recite, translate and discuss different chapters of the Qur'an. A peaceful environment to connect with the divine revelation regardless of your level of knowledge.",
      image: "/images/5.png",
      signupLink: "https://forms.google.com/quran-circles-signup"
    },
    {
      id: 6,
      title: "Roots Academy Classes",
      date: "Every Tuesday",
      time: "7:00 PM - 8:30 PM",
      location: "Lecture Theatre 3, Arts Tower",
      category: "Weekly",
      description: "Our Tuesday evening classes cover different themes each semester, such as Qur'anic Tafsir/exegesis, Prophetic Seerah/biography, and methods of spiritual purification. Taught by knowledgeable speakers.",
      image: "/images/6.png",
      signupLink: "https://forms.google.com/roots-academy-signup"
    },
    {
      id: 7,
      title: "Welfare Wednesdays",
      date: "Every Wednesday",
      time: "4:00 PM - 6:00 PM",
      location: "Common Room, Student Union",
      category: "Weekly",
      description: "A special social gathering for sisters to build strong bonds of sisterhood. Activities include crafts, games, discussions, and occasional workshops on topics relevant to Muslim women.",
      image: "/images/7.png",
      signupLink: "https://forms.google.com/welfare-wednesdays-signup"
    },
    {
      id: 8,
      title: "Thursday Circles",
      date: "Every Thursday",
      time: "6:30 PM - 8:00 PM",
      location: "Islamic Society Room, Student Union",
      category: "Weekly",
      description: "Brothers' and sisters' separate circles discussing various topics in Islam - from practical daily matters to deeper theological questions. A safe space to ask questions and learn together.",
      image: "/images/8.png",
      signupLink: "https://forms.google.com/thursday-circles-signup"
    },
    {
      id: 9,
      title: "Friday Football",
      date: "Every Friday",
      time: "6:00 PM - 8:00 PM",
      location: "Outdoor Pitch, Sports Centre",
      category: "Weekly",
      description: "Brothers' special football sessions for all skill levels. A great way to end the week with physical activity and brotherhood. No experience necessary - just bring your enthusiasm!",
      image: "/images/9.png",
      signupLink: "https://forms.google.com/friday-football-signup"
    },
    {
      id: 10,
      title: "Saturday Badminton",
      date: "Every Saturday",
      time: "2:00 PM - 4:00 PM",
      location: "Sports Hall, Sports Centre",
      category: "Weekly",
      description: "Brothers' special badminton sessions every Saturday. Whether you're a complete beginner or experienced player, everyone is welcome to join for a fun and energetic afternoon.",
      image: "/images/10.png",
      signupLink: "https://forms.google.com/saturday-badminton-signup"
    },
    
    // Other Events
    {
      id: 11,
      title: "Food Socials at UNIT",
      date: "Various dates",
      time: "7:00 PM - 9:00 PM",
      location: "UNIT Restaurant (2024 Sponsor)",
      category: "Other",
      description: "Enjoy delicious meals and great company at our 2024 Restaurant Sponsor, UNIT. These casual gatherings are perfect for making new friends and strengthening our community bonds over good food.",
      image: "/images/11.png",
      signupLink: "https://forms.google.com/unit-social-signup"
    },
    {
      id: 12,
      title: "Peak District Hikes",
      date: "Various dates",
      time: "10:00 AM - 4:00 PM",
      location: "Peak District",
      category: "Other",
      description: "Explore the breathtaking landscapes of the Peak District with fellow USIC members. These recreational hikes are organized throughout the year when weather permits. Transportation provided from campus.",
      image: "/images/12.png",
      signupLink: "https://forms.google.com/peak-district-hike-signup"
    },
    {
      id: 13,
      title: "Sports Socials",
      date: "Various dates",
      time: "Varies",
      location: "Various locations",
      category: "Other",
      description: "Throughout the year, we organize various sports activities including rounders, cricket, basketball and more. These casual sessions are open to all skill levels and are a great way to stay active.",
      image: "/images/13.png",
      signupLink: "https://forms.google.com/sports-socials-signup"
    }
  ];

  // State for category filter and modal
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Weekly' | 'Annual' | 'Other'>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Filter events based on selected category
  const filteredEvents = categoryFilter === 'All' 
    ? allEvents 
    : allEvents.filter(event => event.category === categoryFilter);

  // Modal handlers
  const openModal = (event: Event) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">OUR EVENTS & ACTIVITIES</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100 mb-8">
            Join us for weekly circles, annual retreats, and other engaging activities
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4">
        {/* Link Tree Section */}
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">GET INVOLVED</h2>
        
        <div className="flex flex-col items-center space-y-4 mb-12">
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSdM6Xs99V7oTUKkCDWqaVT69btgpHyK5rb-ahdjPI5iO0DoZw/viewform" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm px-8 py-3 bg-white text-[#18384D] hover:bg-blue-50 transition duration-300 font-semibold rounded-full uppercase text-sm tracking-wider text-center shadow-lg"
          >
            Apply for EGM 25/26
          </a>
          <a 
            href="https://docs.google.com/document/d/1YIbZpxLgHxGkir1YdB7QpOaKPw7BO3e8NlpN0mW287Q/edit?tab=t.0" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm px-8 py-3 bg-white text-[#18384D] hover:bg-blue-50 transition duration-300 font-semibold rounded-full uppercase text-sm tracking-wider text-center shadow-lg"
          >
            View USIC Roles 25/26
          </a>
        </div>
        
        {/* Events section */}
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">UPCOMING EVENTS</h2>
        
        {/* Category filter buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
              categoryFilter === 'All'
                ? 'bg-white text-[#18384D] shadow-lg'
                : 'bg-[#0F1E2C] text-blue-100 hover:bg-[#18384D] border border-blue-200/30'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setCategoryFilter('Weekly')}
            className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
              categoryFilter === 'Weekly'
                ? 'bg-white text-[#18384D] shadow-lg'
                : 'bg-[#0F1E2C] text-blue-100 hover:bg-[#18384D] border border-blue-200/30'
            }`}
          >
            Weekly Events
          </button>
          <button
            onClick={() => setCategoryFilter('Annual')}
            className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
              categoryFilter === 'Annual'
                ? 'bg-white text-[#18384D] shadow-lg'
                : 'bg-[#0F1E2C] text-blue-100 hover:bg-[#18384D] border border-blue-200/30'
            }`}
          >
            Annual Events
          </button>
          <button
            onClick={() => setCategoryFilter('Other')}
            className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
              categoryFilter === 'Other'
                ? 'bg-white text-[#18384D] shadow-lg'
                : 'bg-[#0F1E2C] text-blue-100 hover:bg-[#18384D] border border-blue-200/30'
            }`}
          >
            Other Events
          </button>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-[#0F1E2C] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02] cursor-pointer"
              onClick={() => openModal(event)}
            >
              <div className="aspect-video bg-[#102736] relative">
                {event.image ? (
                  <Image src={event.image} alt={event.title} width={640} height={360} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#102736] flex items-center justify-center">
                    <span className="text-blue-300">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium bg-white text-[#18384D] shadow-md">
                  {event.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{event.title}</h3>
                <p className="text-blue-200 mb-4 text-sm">{event.description}</p>
                <div className="space-y-2 text-sm text-blue-200 mb-6">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
                {event.signupLink && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when clicking button
                      openModal(event);
                    }}
                    className="block w-full px-4 py-2 bg-white text-[#18384D] hover:bg-blue-50 transition duration-300 font-semibold rounded-full text-center uppercase text-xs tracking-wider shadow"
                  >
                    LEARN MORE
                  </button>
                )}
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
        
        {/* Contact section */}
        <div className="text-center mt-16 mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">SUGGEST AN EVENT</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            We&apos;re always open to new ideas! If you have suggestions for events or activities, 
            please get in touch with the USIC committee.
          </p>
          <a 
            href="mailto:usic@sheffield.ac.uk" 
            className="inline-block bg-white text-[#18384D] hover:bg-blue-50 px-6 py-3 rounded-full font-semibold transition duration-300 uppercase text-sm tracking-wider shadow-lg"
          >
            CONTACT US
          </a>
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-[#0F1E2C] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#18384D] p-6 border-b border-blue-200/20 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{selectedEvent.title}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-[#18384D] shadow-md">
                    {selectedEvent.category}
                  </span>
                </div>
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
              {selectedEvent.image && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <Image 
                    src={selectedEvent.image} 
                    alt={selectedEvent.title} 
                    width={800} 
                    height={400} 
                    className="w-full h-64 md:h-80 object-cover"
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
                      <p className="text-blue-200">{selectedEvent.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-300 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Time</h4>
                      <p className="text-blue-200">{selectedEvent.time}</p>
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
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-300 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Category</h4>
                      <p className="text-blue-200">{selectedEvent.category} Event</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3 text-lg uppercase tracking-tight">About This Event</h4>
                <p className="text-blue-100 leading-relaxed text-base">{selectedEvent.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {selectedEvent.signupLink && (
                  <a 
                    href={selectedEvent.signupLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 px-6 py-3 bg-white text-[#18384D] hover:bg-blue-50 transition duration-300 font-semibold rounded-full text-center uppercase text-sm tracking-wider shadow-lg"
                  >
                    SIGN UP NOW
                  </a>
                )}
                <button 
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-[#18384D] text-white hover:bg-[#234b64] transition duration-300 font-semibold rounded-full border border-blue-200/30 uppercase text-sm tracking-wider"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 