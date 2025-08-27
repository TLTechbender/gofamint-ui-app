"use client";

import { updateGenericViewCount, updateVerifiedViewCount } from "@/actions/blog/viewCount";
import { useEffect, useRef, useCallback } from "react";



interface ViewTrackerProps {
  sanitySlug: string;
  threshold?: number; // Percentage of element that needs to be visible (0-1)
  delay?: number; // Delay in ms before tracking the view
}

const ViewTracker = ({
  sanitySlug,
  threshold = 0.5,
  delay = 1000,
}: ViewTrackerProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasTrackedGeneric = useRef(false);
  const hasTrackedVerified = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Local storage key for generic view tracking
  const getLocalStorageKey = useCallback((slug: string) => {
    return `blog_generic_view_${slug}`;
  }, []);

  // Check if generic view was already tracked
  const hasGenericViewInStorage = useCallback(
    (slug: string) => {
      try {
        const key = getLocalStorageKey(slug);
        return localStorage.getItem(key) === "true";
      } catch (error) {
       
        return false;
      }
    },
    [getLocalStorageKey]
  );

  // Set generic view in local storage
  const setGenericViewInStorage = useCallback(
    (slug: string) => {
    
        const key = getLocalStorageKey(slug);
        localStorage.setItem(key, "true");
       
    },
    [getLocalStorageKey]
  );

  // Handle generic view count update
  const handleGenericViewUpdate = useCallback(async () => {
    if (hasTrackedGeneric.current) return;

    // Check if already tracked in localStorage
    if (hasGenericViewInStorage(sanitySlug)) {
      hasTrackedGeneric.current = true;
      return;
    }

    try {
      const formData = new FormData();
      formData.append("sanitySlug", sanitySlug);

      const result = await updateGenericViewCount(formData);

      if (result.success) {
        setGenericViewInStorage(sanitySlug);
        hasTrackedGeneric.current = true;
      
      } else {
     
      }
    } catch (error) {
    
    }
  }, [sanitySlug, hasGenericViewInStorage, setGenericViewInStorage]);

  // Handle verified view count update
  const handleVerifiedViewUpdate = useCallback(async () => {
    if (hasTrackedVerified.current) return;

  
      const formData = new FormData();
      formData.append("sanitySlug", sanitySlug);

      const result = await updateVerifiedViewCount(formData);

      if (result.success) {
        hasTrackedVerified.current = true;
        if ((result.data as unknown as any).alreadyRead) {
   
        } else {
          
        }
      } 
     
  }, [sanitySlug]);

  // Handle intersection observer callback
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set a delay before tracking views
        timeoutRef.current = setTimeout(() => {
          // Track both views simultaneously
          handleGenericViewUpdate();
          handleVerifiedViewUpdate();
        }, delay);
      } else {
        // Clear timeout if user scrolls away before delay
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    },
    [handleGenericViewUpdate, handleVerifiedViewUpdate, delay]
  );

  // Setup intersection observer
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin: "0px",
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleIntersection, threshold]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className="view-tracker"
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default ViewTracker;
