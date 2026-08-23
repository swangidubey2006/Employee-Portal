import React from 'react';

const MicrosoftButton = ({ onClick }) => {
  return (
    <button type="button" className="microsoft-login-btn oauth-login-btn" onClick={onClick}>
      <span className="microsoft-icon" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </span>
      <span>Continue with Microsoft</span>
    </button>
  );
};

export default MicrosoftButton;
