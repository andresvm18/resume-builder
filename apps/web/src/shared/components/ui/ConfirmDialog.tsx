import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import "./ConfirmDialog.css";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
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
      className="confirm-dialog__backdrop"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-dialog__icon">!</div>

        <h3 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h3>

        <p className="confirm-dialog__description">{description}</p>

        {error && <p className="confirm-dialog__error">{error}</p>}

        <div className="confirm-dialog__actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="confirm-dialog__cancel"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="confirm-dialog__confirm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}