// Static data for Server-Side Rendering and Static Generation
// This improves performance and SEO by pre-rendering content

import { optimizeCloudinaryUrls } from './cloudinary-optimizer';

const heroImages = [
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-55_rk9wpd.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524316/brother1_clajgi.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524481/sister6_opysdf.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524419/brother3_zzxxbp.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524480/sister7_zavuxn.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524418/brother4_k0pft0.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524480/sister8_hi6u6z.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524417/brother5_pbcmli.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524479/sister9_wofoeq.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-2_l68nse.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524479/sister10_lldx5c.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-6_i0mxfq.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524475/sister11_xkalmd.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524475/sister12_bmqelf.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-16_nqlauo.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524478/sister24_fxbkeu.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524476/sister25_ap77jh.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-25_km4asl.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524476/sister26_ehsztk.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-45_p0w096.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524476/sister27_x1qgr5.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-81_qclhrm.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-107_imdoek.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524414/IMG_0006_qzjpql.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524414/IMG_0028_a1qjg4.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524415/IMG_9262_w8axs4.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524417/IMG_9980_caethj.jpg',
];

export const staticData = {
  // Homepage data
  homepage: {
    hero: {
      title: "Welcome to USIC",
      subtitle: "The Islamic Circle at the University of Sheffield",
      description: "Your university experience doesn't have to mean compromising your faith. Join our community of Muslim students.",
      ctaText: "Join USIC Today",
      ctaLink: "/membership",
      images: optimizeCloudinaryUrls(heroImages, 'hero')
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
          thumbnailImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758529333/podcast_ezrmts.jpg",
          externalUrl: "https://open.spotify.com/episode/6rHLkFmkyRW02yzF0Ne70D",
          fallbackImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png"
        },
        {
          id: "youtube",
          title: "Latest Video",
          description: "Watch our latest events and community highlights",
          type: "youtube",
          thumbnailImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758529336/youtube_w6ehbt.jpg",
          externalUrl: "https://youtu.be/X_EiFOr168o?si=1damg0KSBXm04U-R",
          fallbackImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png"
        },
        {
          id: "instagram",
          title: "Latest Post",
          description: "Follow our journey on Instagram for daily updates",
          type: "instagram",
          thumbnailImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758529339/committee_qfdbkh.jpg",
          externalUrl: "https://www.instagram.com/usicsheffield/",
          fallbackImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png"
        },
        {
          id: "newsletter",
          title: "Weekly Newsletter",
          description: "Sign up for all things USIC - every Sunday!",
          type: "newsletter",
          thumbnailImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758529334/newsletter_ish3hi.jpg",
          externalUrl: "https://mailchi.mp/f0da36dbc07a/usic-updates",
          fallbackImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png"
        },
        // Duplicate slides for loop mode
        {
          id: "podcast-duplicate",
          title: "Latest Podcast",
          description: "Listen to our latest Islamic discussions and community insights",
          type: "spotify",
          thumbnailImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758529333/podcast_ezrmts.jpg",
          externalUrl: "https://open.spotify.com/episode/6rHLkFmkyRW02yzF0Ne70D",
          fallbackImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png"
        },
        {
          id: "youtube-duplicate",
          title: "Latest Video",
          description: "Watch our latest events and community highlights",
          type: "youtube",
          thumbnailImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758529336/youtube_w6ehbt.jpg",
          externalUrl: "https://youtu.be/X_EiFOr168o?si=1damg0KSBXm04U-R",
          fallbackImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png"
        },
        {
          id: "instagram-duplicate",
          title: "Latest Post",
          description: "Follow our journey on Instagram for daily updates",
          type: "instagram",
          thumbnailImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758529339/committee_qfdbkh.jpg",
          externalUrl: "https://www.instagram.com/usicsheffield/",
          fallbackImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png"
        },
        {
          id: "newsletter-duplicate",
          title: "Weekly Newsletter",
          description: "Sign up for all things USIC - every Sunday!",
          type: "newsletter",
          thumbnailImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758529334/newsletter_ish3hi.jpg",
          externalUrl: "https://mailchi.mp/f0da36dbc07a/usic-updates",
          fallbackImage: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png"
        }
      ]
    },

    // Event section images for preloading
    eventImages: [
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-55_rk9wpd.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524316/brother1_clajgi.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524419/brother2_qmuiwv.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524481/sister6_opysdf.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524419/brother3_zzxxbp.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524480/sister7_zavuxn.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524418/brother4_k0pft0.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524480/sister8_hi6u6z.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524417/brother5_pbcmli.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524479/sister9_wofoeq.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-2_l68nse.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524479/sister10_lldx5c.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-6_i0mxfq.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524475/sister11_xkalmd.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524475/sister12_bmqelf.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-16_nqlauo.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524478/sister24_fxbkeu.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524476/sister25_ap77jh.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-25_km4asl.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524476/sister26_ehsztk.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-45_p0w096.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524476/sister27_x1qgr5.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-81_qclhrm.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-107_imdoek.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524414/IMG_0006_qzjpql.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524414/IMG_0028_a1qjg4.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524415/IMG_9262_w8axs4.jpg",
      "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524417/IMG_9980_caethj.jpg"
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
    title: "RESOURCES",
    description: "Materials to aid your spiritual and academic journey",
    cards: [
      {
        id: 1,
        title: "USIC Map",
        description: "Interactive map showing key locations for USIC members including prayer rooms, halal food spots, and important campus buildings.",
        imagePath: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530889/usicmap_bddddi.png",
        category: "NAVIGATION",
        link: "https://www.google.com/maps/d/u/0/viewer?mid=1sf6ignGjx9yqlVM-XgAoRiVtWUjk2KE&hl=en&ll=53.381545854028566%2C-1.4872821811864867&z=16",
        isExternal: true,
        linkText: "OPEN MAP"
      },
      {
        id: 2,
        title: "Committee Members",
        description: "Meet the current USIC committee members and learn more about their roles.",
        imagePath: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758529339/committee_qfdbkh.jpg",
        category: "COMMUNITY",
        link: "https://www.instagram.com/p/DORUV3lCDAg/?igsh=cWM0MGExNWkzcnZt",
        isExternal: true,
        linkText: "VIEW MEMBERS"
      },
      {
        id: 3,
        title: "University Contacts",
        description: "Important contact information for university services including chaplaincy, student union, and mental health support.",
        imagePath: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png",
        category: "SUPPORT",
        isModal: true,
        linkText: "VIEW CONTACTS"
      },
      {
        id: 4,
        title: "Islamic Knowledge",
        description: "Access to trusted Islamic educational platforms, courses, and resources for deepening your understanding of Islam.",
        imagePath: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png",
        category: "EDUCATION",
        isModal: true,
        linkText: "VIEW RESOURCES"
      },
      {
        id: 5,
        title: "Islamic Q&A Service - فاسأل",
        description: "Get authentic Islamic answers from qualified scholars. Browse hundreds of answered questions covering worship, family life, Islamic rulings, and more.",
        imagePath: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530830/fasal_ayktj5.jpg",
        category: "EDUCATION",
        link: "https://fasalqa.com",
        isExternal: true,
        linkText: "VISIT SITE"
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
        description: "Islamic education and courses. Faith Essentials are 40% off for USIC members!",
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
        name: "Iqra Store",
        logo: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524316/iqra.png",
        description: "South Yorkshire's premier lifestyle store, committed to providing our customers with traditional & contemporary merchandise from around the world.",
        website: "https://www.instagram.com/iqralifestylestore/?hl=en-gb",
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
      student: "£12/year",
      alumni: "£10/year",
      supporter: "£30/lifetime"
    },
    joinLink: "https://su.sheffield.ac.uk/activities/view/islamic-circle-society"
  },

  // Pricing data for the pricing page
  pricing: {
    title: "Choose Your USIC Membership",
    subtitle: "Join our vibrant community with flexible membership options",
    tiers: [
      {
        name: "Non-Member",
        price: "Free",
        period: "",
        description: "Public events and community",
        popular: false,
        features: [
          "Access to public events",
          "Community WhatsApp groups",
          "No exclusive store discounts",
          "No priority booking",
          "No membership card",
          "Standard event pricing"
        ],
        ctaText: "Stay Free",
        highlighted: false
      },
      {
        name: "1 Year",
        price: "£12",
        period: "per year",
        description: "Perfect for current students",
        popular: false,
        features: [
          "Personal USIC membership card",
          "19+ partner business discounts",
          "Priority ticket access",
          "Exclusive store discounts",
          "Community WhatsApp groups",
          "Discounted tickets for events"
        ],
        ctaText: "Join for 1 Year",
        highlighted: false
      },
      {
        name: "Lifetime",
        price: "£30",
        period: "one-time",
        description: "Be a part of the community for the duration of your course",
        popular: true,
        features: [
          "Lifetime membership card",
          "19+ partner business discounts",
          "Priority ticket access",
          "Exclusive store discounts",
          "Community WhatsApp groups",
          "Discounted tickets for events"
        ],
        ctaText: "Become Lifetime Member",
        highlighted: true
      }
    ],
    partnerDiscounts: [
      "Sabir's Grill (10%)", "5 Akhis (20%)", "Karak Chai (15%)", "Big Daddy's (30%)",
      "Mighty Bites (30%)", "Insomnia Cookies (15%)", "Ohannes (15%)", "Al Maghrib Faith Essentials (40%)",
      "Shakebees (10%)", "Heavenly Desserts (15%)", "M.A.K Halal (20%)", "Kebabish Original (15%)",
      "Calis (10%)", "Cha Cha Chai (10%)", "Damascus Bakery (15%)", "Noori Charms (15%)",
      "Frog (10%)", "Regen Therapy (20%)", "Unit (10%)"
    ],
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
    { id: "DISCUSSION", name: "Discussion" },
    { id: "PODCAST_REFLECTIONS", name: "Podcast Reflections" }
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
  },
  pricing: {
    title: "USIC Membership Pricing - Join USIC Sheffield",
    description: "Choose your USIC membership tier: Non-Member (Free), 1 Year (£12), or Lifetime (£30). Access exclusive discounts, priority booking, and community benefits.",
    keywords: "USIC membership pricing, join USIC, Islamic society membership, University of Sheffield, Muslim student membership, USIC pricing"
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
        "logo": "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png",
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
