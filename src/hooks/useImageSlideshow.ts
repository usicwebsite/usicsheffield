import { useState, useEffect, useCallback, useRef } from 'react';

interface UseImageSlideshowProps {
  images: string[];
  interval?: number;
  preloadCount?: number;
}

export function useImageSlideshow({
  images,
  interval = 3000,
  preloadCount = 2,
  initialInterval = 5000 // 5 seconds for first image
}: UseImageSlideshowProps & { initialInterval?: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const preloadPromisesRef = useRef<Map<number, Promise<void>>>(new Map());

  // Ultra-minimal preload - only first image initially
  const preloadFirstImage = useCallback(async () => {
    const preloadPromises: Promise<void>[] = [];

    // Only preload the very first image for ultra-fast initial load
    if (preloadPromisesRef.current.has(0)) return;

    const preloadPromise = new Promise<void>((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, 0]));
        resolve();
      };
      img.onerror = () => {
        setFailedImages(prev => new Set([...prev, 0]));
        resolve(); // Resolve even on error
      };
      img.src = images[0];
    });

    preloadPromisesRef.current.set(0, preloadPromise);
    preloadPromises.push(preloadPromise);

    await Promise.all(preloadPromises);
  }, [images]);

  // Background preload for remaining images during the 5-second pause
  const preloadRemainingImagesDuringPause = useCallback(() => {
    // Start loading other images immediately during the 5-second first image display
    for (let i = 1; i < images.length; i++) {
      if (preloadPromisesRef.current.has(i)) continue;

      // Stagger loading with small delays to not overwhelm network
      setTimeout(() => {
        const img = new window.Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, i]));
        };
        img.onerror = () => {
          setFailedImages(prev => new Set([...prev, i]));
        };
        img.src = images[i];
      }, (i - 1) * 100); // 100ms stagger for smoother loading
    }
  }, [images]);

  // Initial ultra-minimal preload
  useEffect(() => {
    preloadFirstImage();
    // Start background loading immediately after first image loads
    preloadRemainingImagesDuringPause();
  }, [preloadFirstImage, preloadRemainingImagesDuringPause]);

  // Auto-rotate images with extended first image timing
  useEffect(() => {
    let currentInterval = initialInterval; // Start with 5 seconds for first image
    let intervalId: NodeJS.Timeout;

    const startInterval = () => {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;

          // After first transition, switch to normal interval (3 seconds)
          if (nextIndex === 1 && currentInterval === initialInterval) {
            currentInterval = interval;
            clearInterval(intervalId);
            startInterval(); // Restart with new interval
          }

          return nextIndex;
        });
      }, currentInterval);
    };

    startInterval();

    return () => clearInterval(intervalId);
  }, [images, interval, initialInterval]);

  // Check if image should be rendered - more permissive to avoid blanks
  const shouldRenderImage = (index: number) => {
    // Always show current image if it's loaded or failed (will show error state)
    if (index === currentImageIndex) return true;

    // Show preloaded images
    if (preloadedImages.has(index)) return true;

    // For images within preload distance, show if they're not failed
    if (Math.abs(index - currentImageIndex) <= preloadCount && !failedImages.has(index)) {
      return true;
    }

    // Show any successfully loaded images to prevent blanks
    return preloadedImages.has(index);
  };

  // Get loading state for an image
  const getImageLoadingState = (index: number) => {
    if (preloadedImages.has(index)) return 'loaded';
    if (failedImages.has(index)) return 'failed';
    return 'loading';
  };

  return {
    currentImageIndex,
    shouldRenderImage,
    getImageLoadingState,
    allImagesPreloaded: preloadedImages.size + failedImages.size === images.length
  };
}
