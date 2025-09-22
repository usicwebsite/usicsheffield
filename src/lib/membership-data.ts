export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  step: string;
  isCTA?: boolean;
}

export const timelineData: TimelineItem[] = [
  {
    id: "step-1",
    title: "Join USIC",
    description: "Sign up through the Students' Union website and become an official member of the Islamic Circle Society.",
    image: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png",
    imageAlt: "USIC Membership Card",
    step: "01"
  },
  {
    id: "step-2", 
    title: "Get Your Benefits",
    description: "Receive your membership card and unlock exclusive discounts, priority tickets, and member-only access.",
    image: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-2_l68nse.jpg",
    imageAlt: "USIC Annual Dinner",
    step: "02"
  },
  {
    id: "step-3",
    title: "Connect & Grow",
    description: "Attend events, build friendships, and strengthen your faith within our supportive community.",
    image: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524413/USIC_Annual_Dinner_2025-16_nqlauo.jpg", 
    imageAlt: "USIC Community Events",
    step: "03"
  },
  {
    id: "step-4",
    title: "Ready to Start Your Journey?",
    description: "Join hundreds of students already enjoying the USIC experience.",
    image: "https://res.cloudinary.com/derjeh0m2/image/upload/v1758524415/IMG_9262_w8axs4.jpg",
    imageAlt: "USIC Community",
    step: "04",
    isCTA: true
  }
];
