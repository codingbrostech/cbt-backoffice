import { CheckIcon, Loader2Icon } from 'lucide-react';

const ICON_BASE_CLASS = 'flex size-4 shrink-0 items-center justify-center rounded-full text-white';

const ToastWarningIcon = () => (
  <svg viewBox="0 0 1024 1024" className="size-4 shrink-0 text-toast-warning" aria-hidden>
    <path
      fill="currentColor"
      d="M955.7 856 539.7 136c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16L67.7 856C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48z"
    />
    <path
      fill="#fff"
      d="M480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416zm32 352a48 48 0 1 0 0-96 48 48 0 0 0 0 96z"
    />
  </svg>
);

export const toastIcons = {
  success: (
    <span className={`${ICON_BASE_CLASS} bg-toast-success`}>
      <CheckIcon className="size-3 stroke-3" />
    </span>
  ),
  info: (
    <span className={`${ICON_BASE_CLASS} bg-toast-info`}>
      <span className="text-[11px] leading-none font-black">i</span>
    </span>
  ),
  warning: <ToastWarningIcon />,
  error: (
    <span className={`${ICON_BASE_CLASS} bg-toast-error`}>
      <span className="text-[11px] leading-none font-black">!</span>
    </span>
  ),
  loading: (
    <span className={`${ICON_BASE_CLASS} bg-muted-foreground`}>
      <Loader2Icon className="size-3 animate-spin" />
    </span>
  )
};
