import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const subscribe = (onChange: () => void): (() => void) => {
  const mediaQuery = window.matchMedia(MOBILE_QUERY);
  mediaQuery.addEventListener('change', onChange);

  return () => {
    mediaQuery.removeEventListener('change', onChange);
  };
};

const getSnapshot = (): boolean => window.matchMedia(MOBILE_QUERY).matches;

const getServerSnapshot = (): boolean => false;

/**
 * Whether the viewport is narrower than MOBILE_BREAKPOINT. False during SSR.
 */
export const useIsMobile = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
