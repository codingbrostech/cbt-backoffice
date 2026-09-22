import { useCallback, useEffect, useRef, useState } from 'react';

export interface IUseClipboardResult {
  isCopied: boolean;
  copy: (value: string) => void;
}

const DEFAULT_TIMEOUT_MS = 2000;

/**
 * Copies text to the clipboard and reports `isCopied` for `timeoutMs`.
 */
export const useClipboard = (timeoutMs = DEFAULT_TIMEOUT_MS): IUseClipboardResult => {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = useCallback(
    (value: string) => {
      void navigator.clipboard.writeText(value).then(() => {
        setIsCopied(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setIsCopied(false);
        }, timeoutMs);
      });
    },
    [timeoutMs]
  );

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    []
  );

  return { isCopied, copy };
};
