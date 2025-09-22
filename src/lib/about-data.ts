// Available images for random selection from Cloudinary
export const BROTHERS_IMAGES = [
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524316/annualretreat_laws0o.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524316/brother1_clajgi.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524419/brother2_qmuiwv.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524419/brother3_zzxxbp.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524418/brother4_k0pft0.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524417/brother5_pbcmli.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524417/fridayfootball_uvckav.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524414/IMG_0006_qzjpql.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524414/IMG_0028_a1qjg4.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524415/IMG_9262_w8axs4.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524417/IMG_9980_caethj.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/sports_nhapdy.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-107_imdoek.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-16_nqlauo.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-2_l68nse.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-25_km4asl.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-45_p0w096.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-55_rk9wpd.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-6_i0mxfq.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-81_qclhrm.jpg'
];

export const SISTERS_IMAGES = [
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524479/sister10_lldx5c.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524475/sister11_xkalmd.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524475/sister12_bmqelf.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524478/sister24_fxbkeu.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524476/sister25_ap77jh.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524476/sister26_ehsztk.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524476/sister27_x1qgr5.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524482/sister3_bs3ahp.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524481/sister6_opysdf.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524480/sister7_zavuxn.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524480/sister8_hi6u6z.jpg',
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524479/sister9_wofoeq.jpg'
];

// Function to get random images from the available pool
export function getRandomImages(): string[] {
  const allImages = [
    ...BROTHERS_IMAGES,
    ...SISTERS_IMAGES
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
