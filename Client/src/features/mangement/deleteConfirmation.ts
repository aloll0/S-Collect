import { createElement } from 'react';
import toast from 'react-hot-toast';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

type ConfirmationOptions = {
  titleKey?: string;
  confirmKey?: string;
  confirmClassName?: string;
};

export function showDeleteConfirmation(
  messageKey: string,
  messageValues: Record<string, string | number> | undefined,
  onConfirm: () => void,
  options?: ConfirmationOptions
) {
  toast.custom(
    () =>
      createElement(ConfirmDeleteModal, {
        messageKey,
        messageValues,
        onConfirm,
        ...options,
      }),
    {
      duration: Infinity,
    }
  );
}
