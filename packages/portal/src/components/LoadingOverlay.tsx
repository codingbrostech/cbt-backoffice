import { Spinner } from '~/components/ui/spinner';
import { cn } from '~/lib/utils';

export interface ILoadingOverlayProps {
  isVisible: boolean;
  className?: string;
}

const LoadingOverlay = ({ isVisible, className }: ILoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div
      aria-busy="true"
      className={cn(
        'absolute inset-0 z-20 flex items-center justify-center rounded-md bg-background/60 backdrop-blur-[1px]',
        className
      )}
    >
      <Spinner className="size-6" />
    </div>
  );
};

export default LoadingOverlay;
