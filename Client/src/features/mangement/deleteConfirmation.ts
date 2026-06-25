import { createElement } from "react";
import toast from "react-hot-toast";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

export function showDeleteConfirmation(
  messageKey: string,
  messageValues: Record<string, string | number> | undefined,
  onConfirm: () => void
) {
  toast.custom(
    () =>
      createElement(ConfirmDeleteModal, {
        messageKey,
        messageValues,
        onConfirm,
      }),
    {
      duration: Infinity,
    }
  );
}
