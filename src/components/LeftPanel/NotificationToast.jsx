import React, { useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

const NotificationToast = ({ message, onClose, type }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const resolvedType = useMemo(() => {
    if (type) return type;
    const text = String(message || '').toLowerCase();

    if (/(failed|failure|error|unable|denied|cannot|could not|not allowed|invalid|expired|rejected|must|required|please fix)/.test(text)) {
      return 'error';
    }
    if (/(creating|loading|redirecting|opening|downloading|processing|still starting|contacting)/.test(text)) {
      return 'warning';
    }
    if (/(success|successfully|saved|updated|created|submitted|exported|uploaded|published|moved to|started|displaying|sent|captured|added)/.test(text)) {
      return 'success';
    }
    return 'success';
  }, [message, type]);

  if (!message) return null;

  const Icon = resolvedType === 'success'
    ? CheckCircle2
    : resolvedType === 'warning'
      ? AlertCircle
      : XCircle;

  return (
    <div className={`notification-toast ${resolvedType}`} role="status" aria-live="polite">
      <Icon size={21} />
      <span>{message}</span>
      <button
        type="button"
        className="notification-toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default NotificationToast;
