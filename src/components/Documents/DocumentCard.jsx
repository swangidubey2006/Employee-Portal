import React from 'react';
import { Eye, Download } from 'lucide-react';

const DocumentCard = ({ doc, onPreview, onDownload }) => {
  return (
    <div className="doc-item-card">
      {/* Top Header Row */}
      <div className="doc-card-top-row">
        <div className="pdf-icon-box">
          <span className="pdf-box-label">PDF</span>
        </div>
        <span className="badge-available-pill">AVAILABLE</span>
      </div>

      {/* Title & Metadata */}
      <div className="doc-card-body">
        <h4 className="doc-card-title">{doc.title}</h4>
        <p className="doc-card-meta">
          {doc.category} • {doc.date}
        </p>
      </div>

      <div className="doc-card-divider" />

      {/* Bottom Action Buttons */}
      <div className="doc-card-actions">
        <button
          className="btn-doc-preview"
          onClick={() => onPreview(doc)}
        >
          <Eye size={14} className="btn-icon-inline" />
          <span>Preview</span>
        </button>

        <button
          className="btn-doc-get"
          onClick={() => onDownload(doc)}
        >
          <Download size={14} className="btn-icon-inline" />
          <span>Get</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
