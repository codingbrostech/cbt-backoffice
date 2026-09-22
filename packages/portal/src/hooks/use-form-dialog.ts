import { useCallback, useState } from 'react';

export interface IUseFormDialogResult<TItem> {
  isOpen: boolean;
  /**
   * Item being edited. Absent while creating.
   */
  selected?: TItem;
  open: (item?: TItem) => void;
  close: () => void;
}

/**
 * Open state of a create or edit dialog plus the item it edits.
 */
export const useFormDialog = <TItem>(): IUseFormDialogResult<TItem> => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<TItem>();

  const open = useCallback((item?: TItem) => {
    setSelected(item);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelected(undefined);
  }, []);

  return { isOpen, selected, open, close };
};
