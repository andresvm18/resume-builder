import type { ReactNode } from "react";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import "./ConfirmDialog.css";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  isLoading?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = APP_MESSAGES.CONFIRM_DIALOG.DEFAULT_CANCEL_LABEL,
  isLoading = false,
  error = "",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="confirm-dialog__modal-backdrop"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="confirm-dialog__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-dialog__modal-icon">!</div>

        <h3
          id="confirm-dialog-title"
          className="confirm-dialog__modal-title"
        >
          {title}
        </h3>

        <div className="confirm-dialog__modal-description">
          {description}
        </div>

        {error && (
          <p className="confirm-dialog__modal-error">
            {error}
          </p>
        )}

        <div className="confirm-dialog__modal-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="confirm-dialog__modal-cancel"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="confirm-dialog__modal-confirm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}