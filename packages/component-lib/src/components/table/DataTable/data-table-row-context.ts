import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { createContext, useContext } from 'react';

export interface IDataTableRowContext {
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  isDragging: boolean;
}

export const DataTableRowContext = createContext<IDataTableRowContext | undefined>(undefined);

/**
 * Drag bindings of the row being rendered, published by a sortable row so
 * `DataTable.DragHandle` can attach them. Throws outside a sortable row.
 */
export const useDataTableRow = (): IDataTableRowContext => {
  const context = useContext(DataTableRowContext);
  if (!context) throw new Error('useDataTableRow must be used within a sortable DataTable row');

  return context;
};
