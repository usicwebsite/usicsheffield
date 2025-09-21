import { useState, useEffect, useCallback, useRef } from 'react';

interface UseImageSlideshowProps {
  images: string[];
  interval?: number;
  preloadCount?: number;
  swiperImages?: string[]; // For priority loading
  eventImages?: string[]; // For loading during the 10s window
}

export function useImageSlideshow({
  images,
  interval = 3000,
  preloadCount = 2,
  swiperImages = [],
  eventImages = []
}: UseImageSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const preloadPromisesRef = useRef<Map<number, Promise<void>>>(new Map());

  // Background loading state - isolated to prevent re-renders
  const backgroundLoadedRef = useRef<Set<number>>(new Set());

  // Priority preload function - hero slides 1&2 first, then socials
  const preloadPriorityImages = useCallback(async (swiperImages: string[]) => {
    const preloadPromises: Promise<void>[] = [];

    // Priority 1: Hero slides 1 and 2 (indices 0 and 1)
    for (let i = 0; i < Math.min(2, images.length); i++) {
      if (preloadPromisesRef.current.has(i)) continue;

      const preloadPromise = new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, i]));
          resolve();
        };
        img.onerror = () => {
          setFailedImages(prev => new Set([...prev, i]));
          resolve();
        };
        img.src = images[i];
      });

      preloadPromisesRef.current.set(i, preloadPromise);
      preloadPromises.push(preloadPromise);
    }

    // Priority 2: Swiper slideshow images
    swiperImages.forEach((swiperImage, swiperIndex) => {
      const preloadPromise = new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          // Store swiper images in background loaded ref to avoid re-renders
          backgroundLoadedRef.current.add(1000 + swiperIndex); // Use offset to avoid conflicts
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = swiperImage;
      });
      preloadPromises.push(preloadPromise);
    });

    await Promise.all(preloadPromises);
  }, [images]);

  // Load ALL remaining images during the 10s window (hero + events)
  const preloadAllRemainingImages = useCallback(() => {
    // Load remaining hero images
    for (let i = 2; i < images.length; i++) { // Start from index 2 (after slides 1&2)
      if (preloadPromisesRef.current.has(i)) continue;

      setTimeout(() => {
        const img = new window.Image();
        img.onload = () => {
          backgroundLoadedRef.current.add(i);
          // Update state for slideshow if needed
          const nextIndex = (currentImageIndex + 1) % images.length;
          if (i === nextIndex || i === currentImageIndex) {
            setPreloadedImages(prev => new Set([...prev, i]));
          }
        };
        img.onerror = () => {
          backgroundLoadedRef.current.add(i);
        };
        img.src = images[i];
      }, (i - 2) * 50); // Faster loading for hero images
    }

    // Load event images during the 10s window
    eventImages.forEach((eventImage, eventIndex) => {
      setTimeout(() => {
        const img = new window.Image();
        img.onload = () => {
          // Store event images with offset to avoid conflicts
          backgroundLoadedRef.current.add(2000 + eventIndex);
        };
        img.onerror = () => {
          backgroundLoadedRef.current.add(2000 + eventIndex);
        };
        img.src = eventImage;
      }, 200 + (eventIndex * 30)); // Start after hero images, faster loading
    });
  }, [images, eventImages, currentImageIndex]);

  // Initial priority preload
  useEffect(() => {
    preloadPriorityImages(swiperImages);
    // Start loading ALL remaining images during the 10s window
    preloadAllRemainingImages();
  }, [preloadPriorityImages, preloadAllRemainingImages, swiperImages]);

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

  // Check if image should be rendered - more permissive to avoid blanks
  const shouldRenderImage = (index: number) => {
    // Always show current image if it's loaded or failed (will show error state)
    if (index === currentImageIndex) return true;

    // Show preloaded images (critical images)
    if (preloadedImages.has(index)) return true;

    // Check background loaded images (loaded but not triggering re-renders)
    if (backgroundLoadedRef.current.has(index)) return true;

    // For images within preload distance, show if they're not failed
    if (Math.abs(index - currentImageIndex) <= preloadCount && !failedImages.has(index)) {
      return true;
    }

    // Show any successfully loaded images to prevent blanks
    return preloadedImages.has(index) || backgroundLoadedRef.current.has(index);
  };

  // Get loading state for an image - checks both state and ref
  const getImageLoadingState = (index: number) => {
    if (preloadedImages.has(index) || backgroundLoadedRef.current.has(index)) return 'loaded';
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
