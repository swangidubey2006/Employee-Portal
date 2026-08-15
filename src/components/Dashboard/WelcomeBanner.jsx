import React from 'react';
import { Plus, Download } from 'lucide-react';

const WelcomeBanner = () => {
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const firstName = savedUser.fullName ? savedUser.fullName.split(' ')[0] : 'Shristi';

  return (
    <div className="welcome-banner-container">
      <div className="welcome-banner-text">
        <h2 className="banner-greeting">Good Morning, {firstName} 👋</h2>
        <p className="banner-subtext">
          Welcome back to GYANYUG Employee Portal. Have a productive day.
        </p>
      </div>

      <div className="welcome-banner-actions">
        <button className="btn-action-dark">
          <Plus size={15} />
          <span>Apply Leave</span>
        </button>

        <button className="btn-action-light">
          <Download size={15} />
          <span>Get Report</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;
