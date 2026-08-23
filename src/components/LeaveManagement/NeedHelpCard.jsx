import React from 'react';
import { HelpCircle } from 'lucide-react';

const NeedHelpCard = ({ setToastMessage }) => {
  const handleContactSupport = () => {
    setToastMessage('HR Support will contact you shortly.');
  };

  return (
    <div className="need-help-dark-card">
      <div className="help-card-content">
        <h3 className="help-card-title">Need Help?</h3>
        <p className="help-card-subtext">
          Questions about leave policy or adjustments?
        </p>

        <button className="btn-contact-hr" onClick={handleContactSupport}>
          Contact HR Support
        </button>
      </div>

      <HelpCircle size={70} className="help-card-bg-icon" />
    </div>
  );
};

export default NeedHelpCard;
