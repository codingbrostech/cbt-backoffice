import { useSelector } from '@tanstack/react-store';
import { useTranslation } from 'react-i18next';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/ui/alert-dialog';
import { Spinner } from '~/components/ui/spinner';
import { cn } from '~/lib/utils';
import { confirmDialogStore } from '~/store/confirm-dialog-store';

const ConfirmDialogHost = () => {
  const dialog = useSelector(confirmDialogStore, state => state.dialog);
  const isPending = useSelector(confirmDialogStore, state => state.isPending);
  const { t } = useTranslation();

  const { close, setPending } = confirmDialogStore.actions;

  const handleCancel = () => {
    dialog?.onCancel?.();
    close();
  };

  const handleConfirm = async () => {
    if (!dialog) return;

    setPending(true);
    try {
      await dialog.onConfirm();
    } finally {
      close();
    }
  };

  return (
    <AlertDialog
      open={Boolean(dialog)}
      onOpenChange={isOpen => {
        if (!isOpen && !isPending) handleCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialog?.title}</AlertDialogTitle>
          {dialog?.message && <AlertDialogDescription>{dialog.message}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={handleCancel}>
            {dialog?.cancelLabel ?? t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className={cn(
              dialog?.isDestructive && 'bg-destructive text-white hover:bg-destructive/90'
            )}
            onClick={event => {
              event.preventDefault();
              void handleConfirm();
            }}
          >
            {isPending && <Spinner />}
            {dialog?.confirmLabel ?? t('common.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialogHost;
