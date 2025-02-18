// CODE GEN initial prompt (O3-mini):
// Create a React hook that handles window resize events.
// Key requirements:
// 1. It should use TypeScript
// 2. It should return the window size typed as {x: number, y: number}.
// 3. It should debounce the event handler for performance optimization.

import { useState, useEffect } from 'react';

export type WindowSize = { x: number, y: number };

export function useWindowSize(debounceDelay: number = 500): { windowSize: WindowSize, resizeInProgress: boolean }  {
  // Initialize state with the current window dimensions (if available)
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window !== 'undefined') {
      return { x: window.innerWidth, y: window.innerHeight};
    }
    return { x: 0, y: 0 };
  });
  const [resizeInProgress, setResizeInProgress] = useState<boolean>(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      setResizeInProgress(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setResizeInProgress(false);
        setWindowSize({ x: window.innerWidth, y: window.innerHeight });
      }, debounceDelay);
    };

    window.addEventListener('resize', handleResize);
    
    // Call once to capture any size changes on mount
    handleResize();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceDelay]);

  return { windowSize, resizeInProgress };
}