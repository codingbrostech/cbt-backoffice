import { useEffect, useState } from 'react';

/**
 * The current time, refreshed every second while mounted.
 */
export const useNow = (): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return now;
};
