import { confirmDialogStore, type IConfirmDialogOptions } from '~/store/confirm-dialog-store';

export interface IUseConfirmDialogResult {
  confirm: (options: IConfirmDialogOptions) => void;
}

const confirm = (options: IConfirmDialogOptions): void => {
  confirmDialogStore.actions.open(options);
};

/**
 * Opens the shared confirm dialog rendered by `ConfirmDialogHost`.
 *
 * @example
 * const { confirm } = useConfirmDialog();
 * confirm({ title: t('admins.delete.title'), onConfirm: () => removeAdmin(id) });
 */
export const useConfirmDialog = (): IUseConfirmDialogResult => ({ confirm });
