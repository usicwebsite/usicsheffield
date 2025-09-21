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

  // Background preload for remaining images in slideshow order
  const preloadRemainingImagesDuringPause = useCallback(() => {
    // Load images in slideshow order starting from next image
    // This ensures smooth transitions without random image appearances
    let currentLoadIndex = 1; // Start from second image

    const loadNextImage = () => {
      if (currentLoadIndex >= images.length) return;

      const img = new window.Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, currentLoadIndex]));
        currentLoadIndex++;
        // Load next image after a short delay
        setTimeout(loadNextImage, 50);
      };
      img.onerror = () => {
        setFailedImages(prev => new Set([...prev, currentLoadIndex]));
        currentLoadIndex++;
        // Continue loading next image even if this one failed
        setTimeout(loadNextImage, 50);
      };
      img.src = images[currentLoadIndex];
    };

    // Start the sequential loading
    loadNextImage();
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

  // Ensure current image is always considered loaded to prevent blanks
  useEffect(() => {
    // Mark current image as loaded when it becomes current
    // This prevents any blank states during transitions
    if (!preloadedImages.has(currentImageIndex) && !failedImages.has(currentImageIndex)) {
      setPreloadedImages(prev => new Set([...prev, currentImageIndex]));
    }
  }, [currentImageIndex]);

  // Check if image should be rendered - conservative to prevent flickering
  const shouldRenderImage = (index: number) => {
    // Always show current image (even if loading) to prevent blanks
    if (index === currentImageIndex) return true;

    // Only show preloaded images that are close to current image
    // This prevents random images from appearing during slideshow
    const distance = Math.abs(index - currentImageIndex);
    if (distance <= preloadCount && preloadedImages.has(index) && !failedImages.has(index)) {
      return true;
    }

    // Don't show images that loaded in background randomly
    return false;
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
