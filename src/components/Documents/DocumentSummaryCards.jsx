import React from 'react';
import { FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react';

const DocumentSummaryCards = () => {
  return (
    <div className="doc-summary-grid">
      {/* 1. Total Documents */}
      <div className="doc-summary-card">
        <div className="doc-summary-icon icon-circle-slate">
          <FileText size={20} color="#FFFFFF" />
        </div>
        <div className="doc-summary-text-group">
          <span className="doc-summary-label">
            Total<br />Documents
          </span>
          <span className="doc-summary-val">08</span>
        </div>
      </div>

      {/* 2. Recently Added */}
      <div className="doc-summary-card">
        <div className="doc-summary-icon icon-circle-emerald">
          <CheckCircle2 size={20} color="#FFFFFF" />
        </div>
        <div className="doc-summary-text-group">
          <span className="doc-summary-label">
            Recently<br />Added
          </span>
          <span className="doc-summary-val">02</span>
        </div>
      </div>

      {/* 3. Important */}
      <div className="doc-summary-card">
        <div className="doc-summary-icon icon-circle-red">
          <AlertCircle size={20} color="#DC2626" />
        </div>
        <div className="doc-summary-text-group">
          <span className="doc-summary-label">
            Important<br />&nbsp;
          </span>
          <span className="doc-summary-val">03</span>
        </div>
      </div>

      {/* 4. Downloads */}
      <div className="doc-summary-card">
        <div className="doc-summary-icon icon-circle-blue">
          <Download size={20} color="#2563EB" />
        </div>
        <div className="doc-summary-text-group">
          <span className="doc-summary-label">
            Downloads<br />&nbsp;
          </span>
          <span className="doc-summary-val">15</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentSummaryCards;
