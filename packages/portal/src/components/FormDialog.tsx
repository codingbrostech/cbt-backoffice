import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { cn } from '~/lib/utils';

export interface IFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Lets clicks outside the dialog close it. Defaults to false.
   */
  isDismissable?: boolean;
}

/**
 * Dialog shell for forms. Children mount only while open, so forms reset on
 * every open.
 */
const FormDialog = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  isDismissable = false
}: IFormDialogProps) => (
  <Dialog
    open={isOpen}
    onOpenChange={isNextOpen => {
      if (!isNextOpen) onClose();
    }}
  >
    <DialogContent
      className={cn('max-h-[90vh] overflow-y-auto', className)}
      onInteractOutside={event => {
        if (!isDismissable) event.preventDefault();
      }}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className="sr-only">{title}</DialogDescription>
      </DialogHeader>
      {isOpen && children}
    </DialogContent>
  </Dialog>
);

export default FormDialog;
