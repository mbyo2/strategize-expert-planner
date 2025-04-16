
import { useRef, useEffect } from 'react';

/**
 * Hook to track if a component is mounted.
 * Useful for preventing state updates after a component unmounts.
 * 
 * @returns A ref object that is true when the component is mounted,
 * false otherwise.
 */
export function useIsMountedRef() {
  const isMounted = useRef(false);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return isMounted;
}
