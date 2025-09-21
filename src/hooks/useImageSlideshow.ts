import { useState, useEffect, useCallback, useRef } from 'react';

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
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const preloadPromisesRef = useRef<Map<number, Promise<void>>>(new Map());

  // Optimized preload function - only critical images initially
  const preloadCriticalImages = useCallback(async (count: number = 5) => {
    const preloadPromises: Promise<void>[] = [];

    // Only preload the first few critical images for fast initial load
    for (let i = 0; i < Math.min(count, images.length); i++) {
      if (preloadPromisesRef.current.has(i)) continue; // Already preloading

      const preloadPromise = new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, i]));
          resolve();
        };
        img.onerror = () => {
          setFailedImages(prev => new Set([...prev, i]));
          resolve(); // Resolve even on error to not block other preloads
        };
        img.src = images[i];
      });

      preloadPromisesRef.current.set(i, preloadPromise);
      preloadPromises.push(preloadPromise);
    }

    await Promise.all(preloadPromises);
  }, [images]);

  // Progressive preload for remaining images (background loading)
  const preloadRemainingImages = useCallback(() => {
    // Load remaining images in background without blocking
    for (let i = 5; i < images.length; i++) {
      if (preloadPromisesRef.current.has(i)) continue;

      // Use setTimeout to defer loading and not block main thread
      setTimeout(() => {
        const img = new window.Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, i]));
        };
        img.onerror = () => {
          setFailedImages(prev => new Set([...prev, i]));
        };
        img.src = images[i];
      }, (i - 5) * 50); // Stagger loading to avoid network congestion
    }
  }, [images]);

  // Initial critical preload only
  useEffect(() => {
    preloadCriticalImages();
    // Start background loading after initial render
    setTimeout(() => preloadRemainingImages(), 1000);
  }, [preloadCriticalImages, preloadRemainingImages]);

  // Auto-rotate images
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        return (prevIndex + 1) % images.length;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [images, interval]);

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
