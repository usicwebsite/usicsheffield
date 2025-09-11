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
    image: "/images/WEB/usic-logo.png",
    imageAlt: "USIC Membership Card",
    step: "01"
  },
  {
    id: "step-2", 
    title: "Get Your Benefits",
    description: "Receive your membership card and unlock exclusive discounts, priority tickets, and member-only access.",
    image: "/images/WEB/brothers/USIC Annual Dinner 2025-2.jpg",
    imageAlt: "USIC Annual Dinner",
    step: "02"
  },
  {
    id: "step-3",
    title: "Connect & Grow",
    description: "Attend events, build friendships, and strengthen your faith within our supportive community.",
    image: "/images/WEB/brothers/USIC Annual Dinner 2025-16.jpg", 
    imageAlt: "USIC Community Events",
    step: "03"
  },
  {
    id: "step-4",
    title: "Ready to Start Your Journey?",
    description: "Join hundreds of students already enjoying the USIC experience.",
    image: "/images/WEB/brothers/IMG_9262.JPG",
    imageAlt: "USIC Community",
    step: "04",
    isCTA: true
  }
];
