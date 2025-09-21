import { useState, useEffect, useCallback } from 'react';

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

  // Memoized function to check if image should be rendered
  const shouldRenderImage = useCallback((index: number) => {
    // Always show current image
    if (index === currentImageIndex) return true;

    // Show images within preload distance for smooth transitions
    if (Math.abs(index - currentImageIndex) <= preloadCount) {
      return true;
    }

    return false;
  }, [currentImageIndex, preloadCount]);

  return {
    currentImageIndex,
    shouldRenderImage
  };
}
