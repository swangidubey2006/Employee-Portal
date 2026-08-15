// import React, { useEffect } from 'react';
// import { CheckCircle2 } from 'lucide-react';

// const NotificationToast = ({ message, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3500);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   if (!message) return null;

//   return (
//     <div className="notification-toast">
//       <CheckCircle2 size={20} color="#00E676" />
//       <span>{message}</span>
//     </div>
//   );
// };

// export default NotificationToast;
// import React, { useEffect } from 'react';
// import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

// const NotificationToast = ({ message, onClose, type = 'error' }) => {
//   useEffect(() => {
//     if (!message) return;

//     const timer = setTimeout(() => {
//       onClose();
//     }, 3500);

//     return () => clearTimeout(timer);
//   }, [message, onClose]);

//   if (!message) return null;

//   const isSuccess = type === 'success';
//   const isWarning = type === 'warning';

//   const Icon = isSuccess
//     ? CheckCircle2
//     : isWarning
//       ? AlertCircle
//       : XCircle;

//   return (
//     <div className={`notification-toast ${type}`}>
//       <Icon size={21} />

//       <span>{message}</span>

//       <button
//         type="button"
//         className="notification-toast-close"
//         onClick={onClose}
//         aria-label="Close notification"
//       >
//         <X size={16} />
//       </button>
//     </div>
//   );
// };

// export default NotificationToast;
import React, { useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';

const NotificationToast = ({
  message,
  onClose,
  type = 'error'
}) => {

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isWarning = type === 'warning';

  const Icon = isSuccess
    ? CheckCircle2
    : isWarning
      ? AlertCircle
      : XCircle;

  return (
    <div className={`notification-toast ${type}`}>
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