import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ICopyButtonLabels {
  copy: string;
  copied: string;
}

export interface ICopyButtonProps {
  value: string;
  labels: ICopyButtonLabels;
  className?: string;
}

/**
 * Small icon button that writes `value` to the clipboard and confirms with a
 * toast carrying `labels.copied`.
 *
 * @example
 * <CopyButton value={gameName} labels={{ copy: 'Copy', copied: 'Copied' }} />
 */
const CopyButton = ({ value, labels, className }: ICopyButtonProps) => {
  const copy = () => {
    void navigator.clipboard.writeText(value).then(() => toast.success(labels.copied));
  };

  return (
    <button
      type="button"
      aria-label={labels.copy}
      className={cn(
        'shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      onClick={copy}
    >
      <CopyIcon className="size-3.5" strokeWidth={1.5} />
    </button>
  );
};

export default CopyButton;
