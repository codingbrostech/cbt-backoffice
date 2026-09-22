import { createStore } from '@tanstack/react-store';

export interface IConfirmDialogOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface IConfirmDialogState {
  dialog?: IConfirmDialogOptions;
  isPending: boolean;
}

const initialState: IConfirmDialogState = {
  dialog: undefined,
  isPending: false
};

export const confirmDialogStore = createStore(initialState, ({ setState }) => ({
  open: (dialog: IConfirmDialogOptions) => {
    setState(prev => ({ ...prev, dialog, isPending: false }));
  },
  setPending: (isPending: boolean) => {
    setState(prev => ({ ...prev, isPending }));
  },
  close: () => {
    setState(prev => ({ ...prev, dialog: undefined, isPending: false }));
  }
}));
