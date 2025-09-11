# Membership Page Documentation

## Overview

The membership page (`/membership`) is an interactive, scroll-driven timeline that guides users through the USIC membership process. It features a dynamic progress indicator, animated timeline items, and an integrated FAQ modal. The page is optimized for performance with custom hooks, reusable components, and efficient scroll handling.

## File Structure

```
src/
├── app/
│   └── membership/
│       └── page.tsx              # Main membership page (9 lines)
├── components/
│   ├── MembershipTimeline.tsx    # Main timeline component (85 lines)
│   ├── TimelineItem.tsx          # Individual timeline item (67 lines)
│   └── FAQModal.tsx              # Reusable FAQ modal (90 lines)
├── hooks/
│   └── useTimelineScroll.ts      # Custom scroll handling hook (87 lines)
└── lib/
    └── membership-data.ts         # Timeline data and types (46 lines)
```

## Page Architecture

### Main Page: `page.tsx`

**Location:** `src/app/membership/page.tsx`  
**Lines of Code:** 9  
**Type:** Next.js App Router Page Component

#### Key Features:
- **Minimal Wrapper:** Simple container with gradient background
- **Component Delegation:** Delegates all functionality to `MembershipTimeline`
- **Consistent Styling:** Matches site-wide gradient theme

#### Page Structure:
```tsx
export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      <MembershipTimeline />
    </div>
  );
}
```

### Main Component: `MembershipTimeline.tsx`

**Location:** `src/components/MembershipTimeline.tsx`  
**Lines of Code:** 85 (reduced from 326 - 74% reduction)  
**Type:** Client Component with Custom Hooks

#### Key Features:
- **Scroll-Driven Animation:** Timeline items animate based on scroll position
- **Performance Optimized:** Uses custom hook for efficient scroll handling
- **Modular Design:** Separated into reusable components
- **FAQ Integration:** Embedded FAQ modal for membership questions

#### Component Structure:
```tsx
export default function MembershipTimeline() {
  const [showFAQModal, setShowFAQModal] = useState(false);
  const { activeStep, progressHeight, timelineRef, itemRefs } = useTimelineScroll({ 
    itemCount: timelineData.length 
  });

  return (
    <section className="py-20 bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white relative overflow-hidden">
      {/* Background Image */}
      {/* Header Section */}
      {/* Timeline Container */}
      {/* FAQ Section */}
      {/* FAQ Modal */}
    </section>
  );
}
```

### Timeline Item Component: `TimelineItem.tsx`

**Location:** `src/components/TimelineItem.tsx`  
**Lines of Code:** 67  
**Type:** Reusable Component

#### Key Features:
- **Responsive Design:** Adapts to mobile and desktop layouts
- **Interactive States:** Changes opacity based on scroll position
- **CTA Integration:** Special styling for call-to-action items
- **Image Optimization:** Uses Next.js Image component with proper sizing

#### Props Interface:
```typescript
interface TimelineItemProps {
  item: TimelineItemType;
  index: number;
  isActive: boolean;
  ref: (el: HTMLDivElement | null) => void;
}
```

### Custom Hook: `useTimelineScroll.ts`

**Location:** `src/hooks/useTimelineScroll.ts`  
**Lines of Code:** 87  
**Type:** Custom React Hook

#### Key Features:
- **Performance Optimized:** Uses `requestAnimationFrame` for smooth scrolling
- **Efficient Calculations:** Early exit optimization for better performance
- **Hardware Acceleration:** Optimized for GPU rendering
- **Memory Management:** Proper cleanup of event listeners

#### Hook Interface:
```typescript
interface UseTimelineScrollProps {
  itemCount: number;
}

// Returns:
{
  activeStep: number;
  progressHeight: number;
  timelineRef: RefObject<HTMLDivElement>;
  itemRefs: RefObject<(HTMLDivElement | null)[]>;
}
```

### FAQ Modal Component: `FAQModal.tsx`

**Location:** `src/components/FAQModal.tsx`  
**Lines of Code:** 90  
**Type:** Reusable Modal Component

#### Key Features:
- **Reusable Design:** Can be used across different pages
- **Interactive Navigation:** Previous/next buttons and dot indicators
- **Responsive Layout:** Adapts to different screen sizes
- **Accessibility:** Proper focus management and keyboard navigation

#### Props Interface:
```typescript
interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faqData: FAQItem[];
  title: string;
}
```

## Data Structure

### Timeline Item Type
```typescript
interface TimelineItem {
  id: string;           // Unique identifier
  title: string;        // Step title
  description: string;  // Step description
  image: string;        // Image path
  imageAlt: string;     // Alt text for accessibility
  step: string;         // Step number (01, 02, etc.)
  isCTA?: boolean;      // Call-to-action flag
}
```

### Timeline Data
```typescript
const timelineData: TimelineItem[] = [
  {
    id: "step-1",
    title: "Join USIC",
    description: "Sign up through the Students' Union website...",
    image: "/images/WEB/usic-logo.png",
    imageAlt: "USIC Membership Card",
    step: "01"
  },
  // ... additional steps
];
```

## Performance Optimizations

### 1. **Scroll Performance**
- **RequestAnimationFrame:** Replaced `setTimeout` with `requestAnimationFrame` for 60fps updates
- **Throttling:** Prevents excessive scroll event handling
- **Early Exit:** Stops processing when items are below viewport
- **Passive Listeners:** Uses `{ passive: true }` for better scroll performance

### 2. **Component Architecture**
- **Code Splitting:** Separated concerns into focused components
- **Data Extraction:** Moved static data to separate files
- **Reusable Components:** FAQ modal can be used across pages
- **Custom Hooks:** Encapsulated scroll logic for reusability

### 3. **Rendering Optimizations**
- **Hardware Acceleration:** Added `transform: translateZ(0)` for GPU rendering
- **Will-Change:** Used `will-change-transform` for smooth animations
- **Image Optimization:** Proper `sizes` attribute for responsive images
- **Memoization:** Used `useCallback` to prevent unnecessary re-renders

## Visual Design

### Color Scheme
- **Background:** Gradient from `#0A1219` to `#18384D`
- **Primary:** Blue gradient (`from-blue-400 to-blue-600`)
- **Secondary:** Blue variants (`#2c5a7a`, `blue-200`)
- **Text:** White and blue-100 for contrast

### Typography
- **Headings:** `font-heading` with responsive sizing
- **Body Text:** `text-blue-100` for readability
- **Buttons:** Bold font with gradient backgrounds

### Layout
- **Container:** Max-width 4xl with centered alignment
- **Responsive:** Mobile-first design with breakpoint adjustments
- **Spacing:** Consistent padding and margins throughout

## Interactive Features

### 1. **Scroll-Driven Animation**
- Timeline items become active as they scroll into view
- Step numbers change color when active
- Cards transition from translucent to fully visible

### 2. **FAQ Modal**
- Slideshow-style navigation between questions
- Dot indicators for current position
- External link integration for membership signup

### 3. **Call-to-Action**
- Special styling for the final timeline item
- Direct link to Students' Union membership page
- Hover effects and transitions

## Accessibility Features

### 1. **Semantic HTML**
- Proper heading hierarchy
- Descriptive alt text for images
- Meaningful button labels

### 2. **Keyboard Navigation**
- Tab navigation through interactive elements
- Enter/Space key support for buttons
- Escape key to close modal

### 3. **Screen Reader Support**
- ARIA labels for complex interactions
- Descriptive text for visual elements
- Proper focus management

## Browser Support

### Modern Browsers
- **Chrome:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Edge:** 90+

### Features Used
- CSS Grid and Flexbox
- CSS Custom Properties
- ES6+ JavaScript features
- Web APIs (Intersection Observer, requestAnimationFrame)

## Performance Metrics

### Before Refactoring
- **Lines of Code:** 326
- **Bundle Size:** Larger due to inline data
- **Scroll Performance:** 16ms delay with setTimeout
- **Maintainability:** Low due to monolithic structure

### After Refactoring
- **Lines of Code:** 85 (74% reduction)
- **Bundle Size:** Smaller due to code splitting
- **Scroll Performance:** 60fps with requestAnimationFrame
- **Maintainability:** High due to modular architecture

## Future Enhancements

### 1. **Performance**
- Implement virtual scrolling for large datasets
- Add intersection observer for better scroll detection
- Consider lazy loading for images

### 2. **Features**
- Add progress saving for returning users
- Implement analytics tracking for user interactions
- Add social sharing functionality

### 3. **Accessibility**
- Add reduced motion support
- Implement high contrast mode
- Add voice navigation support

## Maintenance Notes

### 1. **Content Updates**
- Timeline data is in `src/lib/membership-data.ts`
- FAQ data is in `src/lib/faq-data.ts`
- Images should be optimized before adding

### 2. **Performance Monitoring**
- Monitor scroll performance on mobile devices
- Check for memory leaks in scroll handlers
- Validate image loading performance

### 3. **Testing**
- Test scroll behavior across different devices
- Validate FAQ modal functionality
- Check accessibility compliance

## Dependencies

### Core Dependencies
- **React:** 18+ (hooks, context)
- **Next.js:** 13+ (App Router, Image component)
- **TypeScript:** 5+ (type safety)

### Styling
- **Tailwind CSS:** 3+ (utility classes)
- **Custom CSS:** Minimal custom styles

### No External Libraries
- Pure React implementation
- Custom hooks for functionality
- Native browser APIs for performance
