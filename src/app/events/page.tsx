'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

  // State for category filter
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Weekly' | 'Annual' | 'Other'>('All');

  // Filter events based on selected category
  const filteredEvents = categoryFilter === 'All' 
    ? allEvents 
    : allEvents.filter(event => event.category === categoryFilter);

  return (
    <div className="bg-gradient-to-b from-[#18384D] to-[#102736] min-h-screen">
      {/* Hero section */}
      <div className="pt-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-2 text-white uppercase tracking-tight">USIC EVENTS</h1>
        <p className="text-lg max-w-3xl mx-auto text-blue-100 mb-16">
          Join our events and activities throughout the year
        </p>
        
        {/* Video section */}
        <div className="max-w-4xl mx-auto mb-16 relative bg-gray-900 aspect-video rounded-xl overflow-hidden shadow-2xl">
          <Image 
            src="/images/14.png" 
            alt="USIC Events Video Thumbnail" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <button className="w-16 h-16 rounded-full flex items-center justify-center bg-[#18384D]/70 backdrop-blur-sm border-2 border-white/30 hover:bg-[#18384D] transition duration-300">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Description text */}
        <div className="max-w-4xl mx-auto text-left">
          <div className="space-y-4 text-blue-100 mb-6">
            <p>
              At USIC, we organize a variety of events designed to enrich your university experience. Our events range from spiritual and educational gatherings to social and recreational activities.
            </p>
            <p>
              Founded in 1964, USIC has a long tradition of bringing Muslim students together to strengthen their faith, build lasting friendships, and create a supportive community. Our events reflect our commitment to providing both spiritual growth and social connection.
            </p>
            <p>
              Below you can find all our upcoming events with links to sign up. Most of our events require registration to help us plan accordingly, so please make sure to sign up in advance!
            </p>
          </div>
          <div className="flex justify-center mt-8 mb-16">
            <Link href="#event-list" className="px-8 py-3 bg-white text-[#18384D] hover:bg-blue-50 transition duration-300 font-semibold rounded-full uppercase text-sm tracking-wider shadow-lg">
              VIEW ALL EVENTS
            </Link>
          </div>
        </div>
      </div>

      {/* Events list section */}
      <div className="py-16 px-4" id="event-list">
        <div className="container mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center text-white uppercase tracking-tight">OUR EVENTS & ACTIVITIES</h2>
          
          {/* Category filter buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setCategoryFilter('All')}
              className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
                categoryFilter === 'All'
                  ? 'bg-white text-[#18384D] shadow-lg'
                  : 'bg-[#18384D] text-blue-100 hover:bg-[#234b64] border border-blue-200/30'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setCategoryFilter('Weekly')}
              className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
                categoryFilter === 'Weekly'
                  ? 'bg-white text-[#18384D] shadow-lg'
                  : 'bg-[#18384D] text-blue-100 hover:bg-[#234b64] border border-blue-200/30'
              }`}
            >
              Weekly Events
            </button>
            <button
              onClick={() => setCategoryFilter('Annual')}
              className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
                categoryFilter === 'Annual'
                  ? 'bg-white text-[#18384D] shadow-lg'
                  : 'bg-[#18384D] text-blue-100 hover:bg-[#234b64] border border-blue-200/30'
              }`}
            >
              Annual Events
            </button>
            <button
              onClick={() => setCategoryFilter('Other')}
              className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
                categoryFilter === 'Other'
                  ? 'bg-white text-[#18384D] shadow-lg'
                  : 'bg-[#18384D] text-blue-100 hover:bg-[#234b64] border border-blue-200/30'
              }`}
            >
              Other Events
            </button>
          </div>

          {/* Events grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-[#18384D] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition duration-300 border border-blue-200/10">
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
                    <a 
                      href={event.signupLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block w-full px-4 py-2 bg-white text-[#18384D] hover:bg-blue-50 transition duration-300 font-semibold rounded-full text-center uppercase text-xs tracking-wider shadow"
                    >
                      SIGN UP
                    </a>
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
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">SUGGEST AN EVENT</h3>
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
      </div>
    </div>
  );
} 