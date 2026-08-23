import React, { useEffect, useState } from 'react';
import BrandHeader from './BrandHeader.jsx';
import MicrosoftButton from './MicrosoftButton.jsx';
import NotificationToast from './NotificationToast.jsx';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LoginForm = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      setToastType('error');
      setToastMessage(error);
      window.history.replaceState({}, document.title, '/login');
    }
  }, []);

  const startOAuth = () => {
    setToastType('success');
    setToastMessage('Redirecting to secure Microsoft sign-in...');
    window.location.href = `${API_BASE}/api/auth/microsoft`;
  };

  return (
    <div className="left-panel-wrapper">
      <NotificationToast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

      <div className="left-panel-content">
        <BrandHeader />

        <div className="form-main-container">
          <div className="form-title-group">
            <h2 className="form-main-title">Sign in to your account</h2>
            <p className="form-sub-title">
              Use your company account to access the employee workspace.
            </p>
          </div>

          <div className="company-login-methods">
            <MicrosoftButton onClick={startOAuth} />
          </div>

          <div className="company-domain-note">
            <strong>Authorized company accounts only</strong>
          </div>

          <button
            type="button"
            className="login-help-btn"
            onClick={() => {
              setToastType('error');
              setToastMessage(
                'Please use your assigned GYANYUG Microsoft company account. Personal accounts are not allowed.'
              );
            }}
          >
            Need help signing in?
          </button>
        </div>

        <footer className="footer-text">
          2026 © GYANYUG — By RIG Innovations
        </footer>
      </div>
    </div>
  );
};

export default LoginForm;
