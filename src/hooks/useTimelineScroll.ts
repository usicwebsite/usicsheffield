"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimelineScrollProps {
  itemCount: number;
}

export function useTimelineScroll({ itemCount }: UseTimelineScrollProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScroll = useCallback(() => {
    if (!timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const timelineHeight = timelineRect.height;
    const viewportHeight = window.innerHeight;
    const middleLine = viewportHeight / 2;

    // Calculate which step should be active based on scroll position
    let newActiveStep = 0;
    
    // Use for loop for better performance than forEach
    for (let i = 0; i < itemRefs.current.length; i++) {
      const itemRef = itemRefs.current[i];
      if (itemRef) {
        const itemRect = itemRef.getBoundingClientRect();
        
        // Early exit if item is below viewport for better performance
        if (itemRect.top > viewportHeight) break;
        
        if (itemRect.top < middleLine) {
          newActiveStep = i + 1;
        }
      }
    }

    newActiveStep = Math.min(newActiveStep, itemCount);
    setActiveStep(newActiveStep);

    // Calculate progress line height with optimized logic
    let newProgressHeight = 0;
    if (timelineRect.top < middleLine) {
      if (timelineRect.bottom < middleLine) {
        newProgressHeight = 100;
      } else {
        const visibleHeight = middleLine - timelineRect.top;
        newProgressHeight = Math.min((visibleHeight / timelineHeight) * 100, 100);
      }
    }
    
    setProgressHeight(newProgressHeight);
  }, [itemCount]);

  useEffect(() => {
    let rafId: number;
    let isScrolling = false;

    const throttledHandleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        rafId = requestAnimationFrame(() => {
          handleScroll();
          isScrolling = false;
        });
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [handleScroll]);

  return {
    activeStep,
    progressHeight,
    timelineRef,
    itemRefs
  };
}
