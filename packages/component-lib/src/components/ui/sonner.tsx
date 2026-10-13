import type { CSSProperties } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { toastIcons } from './toast-icons';

const Toaster = ({ position = 'top-right', ...props }: ToasterProps) => (
  <Sonner
    className="toaster group [--width:22rem]"
    closeButton
    icons={toastIcons}
    position={position}
    style={{ '--border-radius': 'var(--radius)' } as CSSProperties}
    toastOptions={{
      unstyled: true,
      classNames: {
        toast:
          'flex w-full items-start gap-3 rounded-[var(--radius)] border bg-background px-4 py-3 shadow-sm',
        title: 'text-sm font-semibold text-foreground',
        description: 'text-sm text-muted-foreground',
        icon: 'mt-0.5 shrink-0',
        closeButton:
          'order-last ml-auto flex size-6 cursor-pointer shrink-0 items-center justify-center border-0 bg-transparent p-0 text-muted-foreground opacity-100 shadow-none transition-colors hover:bg-transparent hover:text-foreground'
      }
    }}
    {...props}
  />
);

export { Toaster };
