// Available images for random selection from WEB folder
export const BROTHERS_IMAGES = [
  'annualretreat.jpeg', 'brother1.jpeg', 'brother2.jpeg', 'brother3.jpeg',
  'brother4.jpeg', 'brother5.jpeg', 'fridayfootball.jpeg', 'IMG_0006.JPG',
  'IMG_0028.JPG', 'IMG_9262.JPG', 'IMG_9980.JPG', 'roots.png', 'sports.jpeg',
  'USIC Annual Dinner 2025-107.jpg', 'USIC Annual Dinner 2025-16.jpg',
  'USIC Annual Dinner 2025-2.jpg', 'USIC Annual Dinner 2025-21.jpg',
  'USIC Annual Dinner 2025-25.jpg', 'USIC Annual Dinner 2025-45.jpg',
  'USIC Annual Dinner 2025-55.jpg', 'USIC Annual Dinner 2025-6.jpg',
  'USIC Annual Dinner 2025-81.jpg'
];

export const SISTERS_IMAGES = [
  'sister10.jpeg', 'sister11.jpeg', 'sister12.jpeg', 'sister24.jpeg', 
  'sister25.jpeg', 'sister26.jpeg', 'sister27.jpeg', 'sister3.jpeg', 
  'sister6.jpeg', 'sister7.jpeg', 'sister8.jpeg', 'sister9.jpeg'
];

// Function to get random images from the available pool
export function getRandomImages(): string[] {
  const allImages = [
    ...BROTHERS_IMAGES.map(img => `/images/WEB/brothers/${img}`),
    ...SISTERS_IMAGES.map(img => `/images/WEB/sisters/${img}`)
  ];

  // Shuffle array and return 4 unique images
  const shuffled = [...allImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
}

export interface AboutSectionData {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  paragraphs: string[];
  highlights?: string[];
  events?: {
    title: string;
    items: string;
  }[];
}

// Function to generate about sections with random images
export function getAboutSections(): AboutSectionData[] {
  const randomImages = getRandomImages();
  
  return [
    {
      title: "WELCOME TO YOUR NEW FAMILY",
      subtitle: "Worried about being able to grow and hold on to your faith while at university?",
      imageSrc: randomImages[0],
      imageAlt: "USIC Community",
      imagePosition: "60% 40%",
      paragraphs: [
        "We get it. You've heard the horror stories about university life. But here's the truth: you can have an amazing university experience while staying true to your faith.",
        "Founded in 1964, USIC is your sanctuary from the trials of university life. We're your halal social hub - where you can make friends, have fun, grow spiritually, and never feel like you're missing out.",
        "Whatever your background, faith level, or current beliefs - everyone is welcome here."
      ]
    },
    {
      title: "WHY WE'RE DIFFERENT",
      subtitle: "We don't just talk about Islamic values - we live them through fun, engaging activities.",
      imageSrc: randomImages[1],
      imageAlt: "USIC Values",
      paragraphs: [
        "We don't just talk about Islamic values - we live them through fun, engaging activities that bring our community together."
      ],
      highlights: [
        "Faith with Fun - Deep spiritual connections through exciting activities",
        "Brotherhood & Sisterhood - We're not just a society, we're a family",
        "Knowledge Through Experience - Learn about Islam through interactive sessions",
        "Community Service - Make a real difference while having fun"
      ]
    },
    {
      title: "FUN ACTIVITIES (YES, REALLY!)",
      subtitle: "From football to food socials - we've got something for everyone.",
      imageSrc: randomImages[2],
      imageAlt: "USIC Events",
      paragraphs: [
        "Forget the stereotype that Islamic societies are boring. We're here to prove that halal fun is the best kind of fun!"
      ],
      events: [
        {
          title: "Annual Events",
          items: "Charity Hike, Annual Retreat, Annual Dinner"
        },
        {
          title: "Weekly Events", 
          items: "Islamic History Lessons, Qur'an Circles, Football (Sisters Thursday, Brothers Friday)"
        },
        {
          title: "Other Fun Stuff",
          items: "Food socials, Peak District hikes, Sports socials"
        }
      ]
    },
    {
      title: "JOIN THE FAMILY",
      subtitle: "Your gateway to an incredible university experience",
      imageSrc: randomImages[3],
      imageAlt: "USIC Membership",
      paragraphs: [
        "Join thousands of students who've made USIC their home away from home. More than just a membership card - you're joining a family that will support you throughout your university journey."
      ]
    }
  ];
}
