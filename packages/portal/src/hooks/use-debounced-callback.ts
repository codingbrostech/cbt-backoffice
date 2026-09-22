import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns a stable callback that invokes the latest `callback` once no call
 * has happened for `delayMs`. Pending calls are dropped on unmount.
 */
export const useDebouncedCallback = <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number
): ((...args: TArgs) => void) => {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const debounced = useCallback(
    (...args: TArgs) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delayMs);
    },
    [delayMs]
  );

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    []
  );

  return debounced;
};
