import React from 'react';
import GeometricBackground from './GeometricBackground.jsx';

const WelcomePanel = () => {
  return (
    <div className="right-panel-wrapper">
      {/* Intricate Dark Navy Polygon Mesh Background */}
      <GeometricBackground />

      {/* Hero Welcome Text Content */}
      <div className="welcome-content-container">
        <div className="welcome-heading-group">
          <span className="welcome-title-white">WELCOME</span>
          <span className="welcome-title-green">BACK.</span>
        </div>

        <p className="welcome-subtext">
          <span className="welcome-subtext-line">
            GYANYUG is an AI-powered learning platform built by students,
          </span>
          <span className="welcome-subtext-line">
            for students.
          </span>
        </p>
      </div>
    </div>
  );
};

export default WelcomePanel;
