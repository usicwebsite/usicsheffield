# Home Page Documentation

## Overview
The home page serves as the main landing page for the USIC website, featuring a modern, interactive design with multiple sections showcasing the Islamic Circle's community, events, and membership opportunities.

## Page Structure

### File Location
- **Component**: `src/app/page.tsx`
- **Type**: Next.js App Router page component
- **Layout**: Full-screen sections with dividers

### Main Sections
1. **Hero Section** - Full-screen image slideshow with call-to-action
2. **SwiperSlideshow** - 3D coverflow carousel with community content
3. **EventsSection** - Scrolling image gallery of community events
4. **MembershipSection** - Video showcase with membership call-to-action

## Section Details

### 1. Hero Section
**Component**: `src/components/Hero.tsx`

#### Features
- **Full-screen height** (`h-screen`)
- **Image slideshow** with 30+ community photos
- **Auto-rotation** every 3 seconds
- **Progressive image loading** for performance
- **Smooth transitions** with 2-second fade effects

#### Content
- **SVG Logo**: "Assalamu Aleykum" in Arabic script
- **Main Title**: "University of Sheffield Islamic Circle"
- **Tagline**: "A sanctuary from the trials of university life"
- **Description**: Community and spiritual growth messaging
- **CTA Buttons**: 
  - "Learn More" → `/about`
  - "Become a Member" → External SU link
- **Scroll Arrow**: Animated bounce effect

#### Technical Implementation
- **Custom Hook**: `useImageSlideshow` for optimized image management
- **Image Optimization**: Next.js Image component with lazy loading
- **Performance**: Only renders current + 2 preloaded images
- **Accessibility**: Proper alt text and ARIA labels

#### Styling
- **Background**: Dark gradient overlay on images
- **Typography**: Responsive text sizing (2xl to 6xl)
- **Colors**: White text with blue accents
- **Effects**: Brightness filter (0.5) on background images

### 2. SwiperSlideshow Section
**Component**: `src/components/SwiperSlideshow.tsx`

#### Features
- **3D Coverflow Effect** using Swiper.js
- **Infinite Loop** navigation
- **Interactive Navigation** with arrows and pagination
- **Responsive Design** with different aspect ratios
- **Touch/Drag Support** for mobile devices

#### Content Types
1. **Spotify Podcast** - Embedded player with fallback
2. **YouTube Video** - Embedded video player
3. **Instagram Post** - Embedded Instagram content
4. **Newsletter Signup** - Mailchimp integration

#### Technical Implementation
- **Library**: Swiper.js with EffectCoverflow module
- **Dimensions**: 
  - Desktop: 700px max-width, 16:9 aspect ratio
  - Mobile: 330px max-width, 1:1 aspect ratio
- **Navigation**: Custom arrows with gradient backgrounds
- **Pagination**: Text-based bullets with slide titles

#### Styling
- **Background**: Gradient from `#0A1219` to `#18384D`
- **Title**: Large background text with gradient foreground
- **Cards**: Dark background (`#0F1E2C`) with rounded corners
- **Navigation**: Gradient overlays matching Tate website design

### 3. EventsSection
**Component**: `src/components/EventsSection.tsx`

#### Features
- **Dual Image Rows** with opposite scroll directions
- **Auto-scrolling** with pause on hover
- **Lazy Loading** for performance optimization
- **Responsive Images** with proper sizing

#### Content
- **60+ Community Photos** alternating brothers/sisters
- **Event Highlights** from various USIC activities
- **Annual Dinner Photos** showcasing major events
- **Sports and Social Activities** representation

#### Technical Implementation
- **Intersection Observer** for lazy loading
- **RequestAnimationFrame** for smooth scrolling
- **Browser Detection** for Safari/Chrome compatibility
- **Performance Optimization** with image preloading

### 4. MembershipSection
**Component**: `src/components/MembershipSection.tsx`

#### Features
- **Interactive Video Player** with click-to-play
- **Responsive Video Container** with proper aspect ratios
- **Membership Benefits** highlighting
- **External Link Integration** to SU membership

#### Content
- **Video Thumbnail** with play button overlay
- **Membership Highlights** description
- **Call-to-Action** button to join USIC
- **Benefits List** with icons and descriptions

## Data Sources

### Static Data
**File**: `src/lib/static-data.ts`

#### Hero Images
```typescript
homepage: {
  hero: {
    images: [
      '/images/WEB/brothers/IMG_9262.JPG',
      '/images/WEB/sisters/sister3.jpeg',
      // ... 30+ more images
    ]
  }
}
```

#### Slideshow Content
```typescript
slideshow: {
  title: "USIC",
  subtitle: "Community",
  slides: [
    {
      id: "podcast",
      title: "Latest Podcast",
      type: "spotify",
      embedUrl: "https://open.spotify.com/embed/episode/..."
    },
    // ... other slides
  ]
}
```

## Performance Optimizations

### Image Loading
- **Progressive Loading**: Only load visible + 2 preloaded images
- **Lazy Loading**: Images load as they come into view
- **Quality Optimization**: 85% quality for balance of size/quality
- **Responsive Images**: Different sizes for different screen sizes

### Code Splitting
- **Dynamic Imports**: Swiper.js loaded only when needed
- **Component Separation**: Each section is independently optimized
- **Bundle Size**: Homepage is 41.6kB (150kB First Load JS)

### Caching
- **Static Generation**: Page is pre-rendered at build time
- **Image Optimization**: Next.js automatic image optimization
- **CDN Ready**: All assets optimized for CDN delivery

## Responsive Design

### Breakpoints
- **Desktop**: 1024px+ - Full 3D coverflow with large images
- **Tablet**: 768px-1023px - Adjusted navigation and sizing
- **Mobile**: 320px-767px - Square aspect ratios, touch-optimized

### Mobile Optimizations
- **Touch Navigation**: Swipe gestures for carousel
- **Reduced Motion**: Respects user preferences
- **Optimized Images**: Smaller file sizes for mobile
- **Simplified Navigation**: Larger touch targets

## Accessibility Features

### ARIA Labels
- **Navigation**: Proper button labels for screen readers
- **Images**: Descriptive alt text for all images
- **Interactive Elements**: Clear focus indicators

### Keyboard Navigation
- **Tab Order**: Logical tab sequence through sections
- **Keyboard Shortcuts**: Arrow keys for carousel navigation
- **Focus Management**: Visible focus indicators

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy
- **Live Regions**: Dynamic content announcements
- **Alternative Text**: All images have descriptive alt text

## SEO Optimization

### Meta Tags
- **Title**: "USIC - The Islamic Circle at University of Sheffield"
- **Description**: Community-focused description with keywords
- **Keywords**: Islamic society, Muslim students, University of Sheffield

### Structured Data
- **Organization Schema**: USIC as an organization
- **Local Business**: University location and contact info
- **Social Media**: Links to Instagram, Facebook, WhatsApp

### Performance Metrics
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Lighthouse Score**: 90+ across all categories
- **Page Speed**: Fast loading with optimized images

## Browser Support

### Modern Browsers
- **Chrome**: 90+ (full support)
- **Firefox**: 88+ (full support)
- **Safari**: 14+ (full support)
- **Edge**: 90+ (full support)

### Fallbacks
- **CSS Grid**: Flexbox fallback for older browsers
- **JavaScript**: Progressive enhancement approach
- **Images**: WebP with JPEG fallback

## Maintenance

### Content Updates
- **Images**: Add new photos to `/public/images/WEB/` folders
- **Slideshow**: Update URLs in `static-data.ts`
- **Events**: Modify event data in static configuration

### Performance Monitoring
- **Bundle Analysis**: Regular bundle size checks
- **Image Optimization**: Monitor image loading performance
- **User Experience**: Track Core Web Vitals

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting

## Dependencies

### Core Libraries
- **Next.js**: 15.2.2 (React framework)
- **React**: 18+ (UI library)
- **TypeScript**: 5+ (Type safety)

### UI Libraries
- **Swiper.js**: 11+ (Carousel functionality)
- **Tailwind CSS**: 3+ (Styling framework)

### Image Optimization
- **Next.js Image**: Built-in optimization
- **WebP Support**: Modern image format

## File Structure
```
src/
├── app/
│   └── page.tsx                 # Main home page component
├── components/
│   ├── Hero.tsx                 # Hero section with slideshow
│   ├── SwiperSlideshow.tsx      # 3D carousel section
│   ├── EventsSection.tsx        # Events gallery section
│   ├── MembershipSection.tsx    # Membership showcase
│   └── ui/
│       ├── CTAButton.tsx        # Reusable CTA button
│       └── ScrollArrow.tsx      # Scroll indicator
├── hooks/
│   └── useImageSlideshow.ts     # Image slideshow logic
└── lib/
    └── static-data.ts           # Page content configuration
```

## Future Enhancements

### Planned Features
- **A/B Testing**: Different hero variations
- **Analytics**: User interaction tracking
- **Personalization**: Dynamic content based on user type
- **Performance**: Further optimization opportunities

### Technical Improvements
- **Server Components**: Migrate to React Server Components
- **Edge Runtime**: Deploy to edge locations
- **Progressive Web App**: Add PWA capabilities
- **Advanced Caching**: Implement sophisticated caching strategies

---

*Last Updated: December 2024*
*Version: 1.0*
*Maintainer: USIC Development Team*
