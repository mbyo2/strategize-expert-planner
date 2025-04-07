
import * as React from "react"

// Constants for breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
}

/**
 * Hook to detect mobile devices based on screen width
 * @returns {boolean} True if the current device is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    }
    
    // Add event listener
    mql.addEventListener("change", onChange)
    
    // Set initial value
    setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    
    // Clean up event listener on unmount
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/**
 * Hook to detect tablet devices based on screen width
 * @returns {boolean} True if the current device is a tablet
 */
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`
    )
    
    const onChange = () => {
      setIsTablet(
        window.innerWidth >= BREAKPOINTS.mobile && 
        window.innerWidth < BREAKPOINTS.tablet
      )
    }
    
    // Add event listener
    mql.addEventListener("change", onChange)
    
    // Set initial value
    setIsTablet(
      window.innerWidth >= BREAKPOINTS.mobile && 
      window.innerWidth < BREAKPOINTS.tablet
    )
    
    // Clean up event listener on unmount
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isTablet
}

/**
 * Hook to detect desktop devices based on screen width
 * @returns {boolean} True if the current device is a desktop
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS.tablet}px)`)
    
    const onChange = () => {
      setIsDesktop(window.innerWidth >= BREAKPOINTS.tablet)
    }
    
    // Add event listener
    mql.addEventListener("change", onChange)
    
    // Set initial value
    setIsDesktop(window.innerWidth >= BREAKPOINTS.tablet)
    
    // Clean up event listener on unmount
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isDesktop
}

/**
 * Hook to get all responsive breakpoints at once
 * @returns {object} Object containing isMobile, isTablet, and isDesktop flags
 */
export function useResponsive() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()
  
  return { isMobile, isTablet, isDesktop }
}

/**
 * Legacy hook for compatibility - returns an object with isMobile property
 * @returns {object} Object with isMobile property
 */
export function useMobile() {
  const isMobile = useIsMobile()
  return { isMobile }
}

/**
 * Hook to get device orientation
 * @returns {string} 'portrait' or 'landscape'
 */
export function useOrientation() {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  )

  React.useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return orientation
}
