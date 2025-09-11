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
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set());

  // Preload images function
  const preloadImages = useCallback((startIndex: number) => {
    const indicesToPreload = [];
    for (let i = 1; i <= preloadCount; i++) {
      indicesToPreload.push((startIndex + i) % images.length);
    }
    
    indicesToPreload.forEach(index => {
      if (!preloadedImages.has(index)) {
        const img = new window.Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, index]));
        };
        img.src = images[index];
      }
    });
  }, [images, preloadCount, preloadedImages]);

  // Initial preload
  useEffect(() => {
    preloadImages(0);
  }, [images, preloadImages]);

  // Auto-rotate images
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        preloadImages(nextIndex);
        return nextIndex;
      });
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [images, interval, preloadedImages, preloadImages]);

  // Check if image should be rendered
  const shouldRenderImage = (index: number) => {
    return index === currentImageIndex || 
           (preloadedImages.has(index) && Math.abs(index - currentImageIndex) <= preloadCount);
  };

  return {
    currentImageIndex,
    shouldRenderImage
  };
}
