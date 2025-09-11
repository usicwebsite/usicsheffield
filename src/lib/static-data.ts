// Static data for Server-Side Rendering and Static Generation
// This improves performance and SEO by pre-rendering content

export const staticData = {
  // Homepage data
  homepage: {
    hero: {
      title: "Welcome to USIC",
      subtitle: "The Islamic Circle at the University of Sheffield",
      description: "Your university experience doesn't have to mean compromising your faith. Join our community of Muslim students.",
      ctaText: "Join USIC Today",
      ctaLink: "/membership",
      images: [
        '/images/WEB/brothers/IMG_9262.JPG',
        '/images/WEB/brothers/IMG_9980.JPG',
        '/images/WEB/sisters/sister3.jpeg',
        '/images/WEB/brothers/brother1.jpeg',
        '/images/WEB/brothers/brother2.jpeg',
        '/images/WEB/sisters/sister6.jpeg',
        '/images/WEB/brothers/brother3.jpeg',
        '/images/WEB/sisters/sister7.jpeg',
        '/images/WEB/brothers/brother4.jpeg',
        '/images/WEB/sisters/sister8.jpeg',
        '/images/WEB/brothers/brother5.jpeg',
        '/images/WEB/sisters/sister9.jpeg',
        '/images/WEB/brothers/USIC Annual Dinner 2025-2.jpg',
        '/images/WEB/sisters/sister10.jpeg',
        '/images/WEB/brothers/USIC Annual Dinner 2025-6.jpg',
        '/images/WEB/sisters/sister11.jpeg',
        '/images/WEB/brothers/USIC Annual Dinner 2025-16.jpg',
        '/images/WEB/sisters/sister12.jpeg',
        '/images/WEB/brothers/USIC Annual Dinner 2025-21.jpg',
        '/images/WEB/sisters/sister24.jpeg',
        '/images/WEB/sisters/sister25.jpeg',
        '/images/WEB/brothers/USIC Annual Dinner 2025-25.jpg',
        '/images/WEB/sisters/sister26.jpeg',
        '/images/WEB/brothers/USIC Annual Dinner 2025-45.jpg',
        '/images/WEB/sisters/sister27.jpeg',
        '/images/WEB/brothers/USIC Annual Dinner 2025-55.jpg',
        '/images/WEB/brothers/USIC Annual Dinner 2025-81.jpg',
        '/images/WEB/brothers/USIC Annual Dinner 2025-107.jpg',
        '/images/WEB/brothers/IMG_0006.JPG',
        '/images/WEB/brothers/IMG_0028.JPG',
      ]
    },
    slideshow: {
      title: "USIC",
      subtitle: "Socials",
      slides: [
        {
          id: "podcast",
          title: "Latest Podcast",
          description: "Listen to our latest Islamic discussions and community insights",
          type: "spotify",
          thumbnailImage: "/images/WEB/slideshow/podcast.jpg",
          externalUrl: "https://open.spotify.com/episode/6rHLkFmkyRW02yzF0Ne70D",
          fallbackImage: "/images/WEB/usic-logo.png"
        },
        {
          id: "youtube",
          title: "Latest Video",
          description: "Watch our latest events and community highlights",
          type: "youtube",
          thumbnailImage: "/images/WEB/slideshow/youtube.jpg",
          externalUrl: "https://www.youtube.com/watch?v=HDlh7AM22YA",
          fallbackImage: "/images/WEB/usic-logo.png"
        },
        {
          id: "instagram",
          title: "Latest Post",
          description: "Follow our journey on Instagram for daily updates",
          type: "instagram",
          thumbnailImage: "/images/WEB/committee.jpeg",
          externalUrl: "https://www.instagram.com/p/DORUV3lCDAg/",
          fallbackImage: "/images/WEB/usic-logo.png"
        },
        {
          id: "newsletter",
          title: "Weekly Newsletter",
          description: "Sign up for all things USIC - every Sunday!",
          type: "newsletter",
          thumbnailImage: "/images/WEB/slideshow/newsletter.jpg",
          externalUrl: "https://mailchi.mp/f0da36dbc07a/usic-updates",
          fallbackImage: "/images/WEB/usic-logo.png"
        }
      ]
    }
  },

  // Events data
  events: {
    upcoming: [
      {
        id: "1",
        title: "Friday Prayer & Lunch",
        date: "Every Friday",
        time: "1:00 PM",
        location: "USIC Prayer Room",
        description: "Weekly Friday prayer followed by community lunch",
        category: "Prayer",
        isRecurring: true
      },
      {
        id: "2",
        title: "Islamic History Circle",
        date: "Every Tuesday",
        time: "6:00 PM",
        location: "USIC Meeting Room",
        description: "Learn about Islamic history and heritage",
        category: "Education",
        isRecurring: true
      },
      {
        id: "3",
        title: "Annual Dinner 2025",
        date: "March 15, 2025",
        time: "7:00 PM",
        location: "Sheffield City Hall",
        description: "Our biggest event of the year with dinner and entertainment",
        category: "Social",
        isRecurring: false
      }
    ],
    categories: ["Prayer", "Education", "Social", "Sports", "Charity", "Retreat"]
  },

  // Resources data
  resources: {
    title: "RESOURCES",
    description: "Materials to aid your spiritual and academic journey",
    cards: [
      {
        id: 1,
        title: "USIC Map",
        description: "Interactive map showing key locations for USIC members including prayer rooms, halal food spots, and important campus buildings.",
        imagePath: "/images/WEB/usicmap.png",
        category: "NAVIGATION",
        link: "https://www.google.com/maps/d/u/0/viewer?mid=1sf6ignGjx9yqlVM-XgAoRiVtWUjk2KE&hl=en&ll=53.381545854028566%2C-1.4872821811864867&z=16",
        isExternal: true,
        linkText: "OPEN MAP"
      },
      {
        id: 2,
        title: "Committee Members",
        description: "Meet the current USIC committee members and learn more about their roles.",
        imagePath: "/images/WEB/committee.jpeg",
        category: "COMMUNITY",
        link: "https://www.instagram.com/p/DORUV3lCDAg/?igsh=cWM0MGExNWkzcnZt",
        isExternal: true,
        linkText: "VIEW MEMBERS"
      },
      {
        id: 3,
        title: "University Contacts",
        description: "Important contact information for university services including chaplaincy, student union, and mental health support.",
        imagePath: "/images/WEB/usic-logo.png",
        category: "SUPPORT",
        isModal: true,
        linkText: "VIEW CONTACTS"
      },
      {
        id: 4,
        title: "Islamic Knowledge",
        description: "Access to trusted Islamic educational platforms, courses, and resources for deepening your understanding of Islam.",
        imagePath: "/images/WEB/usic-logo.png",
        category: "EDUCATION",
        isModal: true,
        linkText: "VIEW RESOURCES"
      }
    ],
    universityContacts: [
      {
        title: "University Chaplaincy",
        details: [
          { label: "Location", value: "205 Brook Hill, S3 7HG" },
          { label: "Email", value: "bnbr-life@sheffield.ac.uk", type: "email" }
        ]
      },
      {
        title: "Sheffield SU",
        details: [
          { label: "Website", value: "https://su.sheffield.ac.uk/welcome", type: "url" },
          { label: "Phone", value: "0114 222 8500", type: "phone" },
          { label: "Email", value: "studentsunion@sheffield.ac.uk", type: "email" }
        ]
      },
      {
        title: "Mental Health Support",
        details: [
          { label: "Website", value: "https://students.sheffield.ac.uk/mental-health", type: "url" },
          { label: "Email", value: "mentalhealthcounselling@sheffield.ac.uk", type: "email" },
          { label: "Phone", value: "+44 114 222 4134", type: "phone" }
        ]
      }
    ],
    islamicKnowledgeResources: [
      {
        title: "Roots Academy",
        description: "Comprehensive Islamic education platform",
        url: "https://rootsacademy.co.uk/",
      },
      {
        title: "Al-Maghrib Institute",
        description: "Islamic education and courses",
        url: "https://www.almaghrib.org/"
      },
      {
        title: "Bayyinah TV",
        description: "Quranic Arabic and Islamic studies",
        url: "https://bayyinahtv.com/"
      },
      {
        title: "SeekersGuidance",
        description: "Traditional Islamic knowledge and guidance",
        url: "https://seekersguidance.org/"
      },
      {
        title: "Arabic Gems Institute",
        description: "Arabic language and Islamic studies",
        url: "https://arabicgemsinstitute.com/"
      },
      {
        title: "Al-Salam Institute",
        description: "Islamic education and community resources",
        url: "https://linktr.ee/alsalaminstitute?fbclid=PAdGRleAMuftpleHRuA2FlbQIxMQABpwmS54DJb-Qh2GYXO90PhOETj6-X0BfqM3ClvBcPfkVHeE5h9mNVNdaX4LEs_aem_tRVYUVPENDYlNxq_rpeRZA"
      }
    ]
  },

  // Sponsors data
  sponsors: {
    title: "Our Generous Sponsors",
    description: "We are grateful for the support of our sponsors who help make our activities possible.",
    sponsors: [
      {
        name: "UNIT Sheffield",
        logo: "/images/sponsors/unitlogo.png",
        description: "Sheffield halal gourmet burger Urban diner specialising in gourmet burgers, Philly cheese-steaks, freakshakes and much more.",
        website: "https://www.unitsheffield.com/",
        tier: "gold"
      }
    ],
    tiers: {
      platinum: {
        name: "Platinum Sponsor",
        benefits: ["Logo on all materials", "Speaking opportunities", "VIP event access"]
      },
      gold: {
        name: "Gold Sponsor", 
        benefits: ["Logo on website", "Event sponsorship", "Recognition at events"]
      },
      silver: {
        name: "Silver Sponsor",
        benefits: ["Logo on website", "Event recognition"]
      }
    }
  },

  // Membership data
  membership: {
    title: "Join USIC",
    description: "Become part of our vibrant community of Muslim students",
    benefits: [
      {
        title: "Community Access",
        description: "Join our WhatsApp groups and social media channels",
        icon: "👥"
      },
      {
        title: "Event Discounts",
        description: "Get discounted tickets for paid events",
        icon: "🎫"
      },
      {
        title: "Priority Booking",
        description: "Early access to popular events",
        icon: "⭐"
      },
      {
        title: "Member Card",
        description: "Official USIC membership card",
        icon: "🪪"
      },
      {
        title: "Exclusive Events",
        description: "Access to members-only socials and activities",
        icon: "🔒"
      },
      {
        title: "Support Network",
        description: "Connect with mentors and fellow students",
        icon: "🤝"
      }
    ],
    pricing: {
      student: "£5/year",
      alumni: "£10/year",
      supporter: "£20/year"
    },
    joinLink: "https://su.sheffield.ac.uk/activities/view/islamic-circle-society"
  },

  // Contact information
  contact: {
    email: "islam.circle@sheffield.ac.uk",
    social: {
      instagram: "https://instagram.com/usic_sheffield",
      facebook: "https://facebook.com/usic.sheffield",
      whatsapp: "https://chat.whatsapp.com/usic-sheffield"
    },
    location: {
      address: "Students' Union, Western Bank, Sheffield S10 2TG",
      room: "USIC Prayer Room, Level 3",
      campus: "University of Sheffield"
    },
    prayerTimes: {
      fajr: "5:30 AM",
      dhuhr: "1:00 PM", 
      asr: "4:30 PM",
      maghrib: "7:30 PM",
      isha: "9:00 PM"
    }
  }
};

// Category utilities
export const categoryUtils = {
  // Category mapping from ID to display name
  categories: [
    { id: "GENERAL", name: "General" },
    { id: "FAITH", name: "Faith & Spirituality" },
    { id: "ACADEMIC", name: "Academic" },
    { id: "SOCIAL", name: "Social" },
    { id: "EVENTS", name: "Events" },
    { id: "ANNOUNCEMENTS", name: "Announcements" },
    { id: "QUESTIONS", name: "Questions" },
    { id: "DISCUSSION", name: "Discussion" }
  ],

  // Convert category ID to display name
  getCategoryName: (categoryId: string): string => {
    const category = categoryUtils.categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  },

  // Get all category IDs
  getCategoryIds: (): string[] => {
    return categoryUtils.categories.map(cat => cat.id);
  },

  // Get all categories with both ID and name
  getAllCategories: () => {
    return categoryUtils.categories;
  }
};

// SEO metadata for different pages
export const seoMetadata = {
  home: {
    title: "USIC - The Islamic Circle at University of Sheffield",
    description: "Join the Islamic Circle at the University of Sheffield. Connect with Muslim students, participate in Islamic events, and grow in faith together.",
    keywords: "USIC, Islamic Circle, University of Sheffield, Muslim students, Islamic society, faith, community"
  },
  about: {
    title: "About USIC - The Islamic Circle at University of Sheffield",
    description: "Learn about USIC's mission, values, and aspirations. We provide a forum for Muslim students to meet, form bonds of brotherhood & sisterhood, and organize events for deeper knowledge of Islam.",
    keywords: "USIC, Islamic Circle, University of Sheffield, Muslim students, Islamic community, faith, brotherhood, sisterhood"
  },
  events: {
    title: "Events - USIC Sheffield",
    description: "Discover upcoming Islamic events, social activities, and educational programs organized by USIC at the University of Sheffield.",
    keywords: "USIC events, Islamic events, Muslim events, University of Sheffield, social activities, Islamic education"
  },
  membership: {
    title: "Join USIC - Membership",
    description: "Become a member of USIC and join our vibrant community of Muslim students at the University of Sheffield.",
    keywords: "USIC membership, join USIC, Muslim student society, University of Sheffield, Islamic community"
  },
  resources: {
    title: "Resources - USIC Sheffield",
    description: "Access Islamic resources, academic support, and community information for Muslim students at the University of Sheffield.",
    keywords: "Islamic resources, Muslim student resources, academic support, Islamic knowledge, University of Sheffield"
  },
  sponsors: {
    title: "Sponsors - USIC Sheffield",
    description: "Meet our generous sponsors who support USIC's activities and help create opportunities for Muslim students at the University of Sheffield.",
    keywords: "USIC sponsors, Islamic society sponsors, University of Sheffield, community support"
  }
};

// Utility function to generate structured data for SEO
export function generateStructuredData(type: 'organization' | 'event' | 'website') {
  switch (type) {
    case 'organization':
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "USIC - The Islamic Circle",
        "url": "https://usic-sheffield.com",
        "logo": "https://usic-sheffield.com/images/usic-logo.png",
        "description": "The Islamic Circle at the University of Sheffield",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Students' Union, Western Bank",
          "addressLocality": "Sheffield",
          "postalCode": "S10 2TG",
          "addressCountry": "GB"
        },
        "sameAs": [
          "https://instagram.com/usic_sheffield",
          "https://facebook.com/usic.sheffield"
        ]
      };
    
    case 'website':
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "USIC Sheffield",
        "url": "https://usic-sheffield.com",
        "description": "The official website of the Islamic Circle at the University of Sheffield"
      };
    
    default:
      return null;
  }
}
