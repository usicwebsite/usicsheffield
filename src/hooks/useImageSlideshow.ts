import { useState, useEffect } from 'react';

interface UseImageSlideshowProps {
  images: string[];
  interval?: number;
}

export function useImageSlideshow({
  images,
  interval = 3000
}: UseImageSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images with consistent 3s intervals for all slides
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        return nextIndex;
      });
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [images, interval]);

  return {
    currentImageIndex
  };
}
