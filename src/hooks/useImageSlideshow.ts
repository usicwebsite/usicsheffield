import { useState, useEffect, useRef, useCallback } from 'react';

interface UseImageSlideshowProps {
  images: string[];
  interval?: number;
}

/** Walk from `from` by `direction` until a non-skipped index, or return `from`. */
export function findNonSkippedIndex(
  from: number,
  direction: 1 | -1,
  length: number,
  skipped: ReadonlySet<number>
): number {
  if (length === 0) {
    return from;
  }

  for (let step = 1; step <= length; step++) {
    const candidate = (((from + direction * step) % length) + length) % length;

    if (!skipped.has(candidate)) {
      return candidate;
    }
  }

  return from;
}

export function useImageSlideshow({
  images,
  interval = 3000
}: UseImageSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [skippedIndices, setSkippedIndices] = useState<ReadonlySet<number>>(
    () => new Set()
  );

  // Ready only for the currently mounted src at that index
  const readyByIndexRef = useRef<Map<number, string>>(new Map());

  const skippedRef = useRef<ReadonlySet<number>>(skippedIndices);
  const imagesRef = useRef(images);

  imagesRef.current = images;
  skippedRef.current = skippedIndices;

  const markReady = useCallback((index: number, src: string) => {
    readyByIndexRef.current.set(index, src);
  }, []);

  const markUnready = useCallback((index: number) => {
    readyByIndexRef.current.delete(index);
  }, []);

  const markSkipped = useCallback((index: number) => {
    readyByIndexRef.current.delete(index);
    setSkippedIndices((prev) => {
      if (prev.has(index)) {
        return prev;
      }

      const next = new Set(prev);
      next.add(index);

      return next;
    });
  }, []);

  // Auto-rotate only when the next non-skipped slide's current src has loaded
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const urls = imagesRef.current;
        const skipped = skippedRef.current;
        const len = urls.length;

        if (len === 0) {
          return prevIndex;
        }

        for (let step = 1; step <= len; step++) {
          const candidate = (prevIndex + step) % len;

          if (candidate === prevIndex) {
            break;
          }

          if (skipped.has(candidate)) {
            continue;
          }

          if (readyByIndexRef.current.get(candidate) === urls[candidate]) {
            return candidate;
          }

          // Next non-skipped slide is still loading; wait
          return prevIndex;
        }

        return prevIndex;
      });
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [interval]);

  return {
    currentImageIndex,
    skippedIndices,
    markReady,
    markUnready,
    markSkipped,
  };
}
