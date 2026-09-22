import { toast } from 'sonner';

export interface INotificationData {
  title: string;
  message?: string;
}

export interface IUseNotificationResult {
  showNotification: (data: INotificationData) => void;
  showErrorNotification: (data: INotificationData) => void;
}

const showNotification = ({ title, message }: INotificationData): void => {
  toast.success(title, { description: message });
};

const showErrorNotification = ({ title, message }: INotificationData): void => {
  toast.error(title, { description: message });
};

/**
 * Toast helpers backed by the portal `Toaster`.
 */
export const useNotification = (): IUseNotificationResult => ({
  showNotification,
  showErrorNotification
});
