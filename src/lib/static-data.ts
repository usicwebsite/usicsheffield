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
      ctaLink: "/membership"
    },
    features: [
      {
        title: "Faith & Community",
        description: "Connect with fellow Muslim students in a supportive environment",
        icon: "🕌"
      },
      {
        title: "Events & Activities",
        description: "Participate in Islamic events, social activities, and educational programs",
        icon: "🎉"
      },
      {
        title: "Support & Welfare",
        description: "Get support for your academic and personal journey",
        icon: "🤝"
      }
    ]
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
    categories: [
      {
        title: "Islamic Knowledge",
        description: "Books, articles, and resources for Islamic learning",
        items: [
          {
            title: "Quran Study Guide",
            description: "Comprehensive guide for Quran study",
            link: "#",
            type: "PDF"
          },
          {
            title: "Hadith Collection",
            description: "Essential hadiths for daily life",
            link: "#",
            type: "Book"
          }
        ]
      },
      {
        title: "Academic Support",
        description: "Resources for academic success",
        items: [
          {
            title: "Study Tips for Muslim Students",
            description: "Balancing faith and academics",
            link: "#",
            type: "Article"
          },
          {
            title: "Prayer Times App",
            description: "Never miss a prayer",
            link: "#",
            type: "App"
          }
        ]
      },
      {
        title: "Community Resources",
        description: "Local Islamic services and contacts",
        items: [
          {
            title: "Halal Restaurants",
            description: "Halal dining options in Sheffield",
            link: "#",
            type: "Directory"
          },
          {
            title: "Islamic Centers",
            description: "Mosques and Islamic centers nearby",
            link: "#",
            type: "Directory"
          }
        ]
      }
    ]
  },

  // Sponsors data
  sponsors: {
    title: "Our Generous Sponsors",
    description: "We are grateful for the support of our sponsors who help make our activities possible.",
    sponsors: [
      {
        name: "Iqra Store",
        logo: "/images/sponsors/iqrastore.jpg",
        description: "Islamic bookstore and gift shop",
        website: "https://iqrastore.co.uk",
        tier: "gold"
      },
      {
        name: "Rockingham House",
        logo: "/images/sponsors/rockinghamhouse.jpg",
        description: "Student accommodation provider",
        website: "#",
        tier: "silver"
      },
      {
        name: "University of Sheffield",
        logo: "/images/sponsors/unitsheffield.jpg",
        description: "Our host institution",
        website: "https://sheffield.ac.uk",
        tier: "platinum"
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
