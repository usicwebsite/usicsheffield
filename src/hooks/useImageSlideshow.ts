import { useState, useEffect } from 'react';

interface UseImageSlideshowProps {
  images: string[];
  interval?: number;
  preloadCount?: number;
}

export function useImageSlideshow({
  images,
  interval = 3000,
  preloadCount = 2
}: UseImageSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images with extended timing for first two slides
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startSlideshow = () => {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          return nextIndex;
        });
      }, interval);
    };

    // Start with 5s for first slide (index 0)
    const initialTimer = setTimeout(() => {
      setCurrentImageIndex(1); // Move to slide 2
      // Start slideshow after showing first two slides for 5s each
      setTimeout(startSlideshow, 5000);
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [images, interval]);

  // Check if image should be rendered - simplified since Next.js handles loading
  const shouldRenderImage = (index: number) => {
    // Always show current image
    if (index === currentImageIndex) return true;

    // Show images within preload distance for smooth transitions
    if (Math.abs(index - currentImageIndex) <= preloadCount) {
      return true;
    }

    return false;
  };

  // Simplified loading state - let Next.js Image handle this
  const getImageLoadingState = (index: number) => {
    // Since we're not manually tracking loading states anymore,
    // just return 'loaded' for images we want to show
    return shouldRenderImage(index) ? 'loaded' : 'loading';
  };

  return {
    currentImageIndex,
    shouldRenderImage,
    getImageLoadingState
  };
}
