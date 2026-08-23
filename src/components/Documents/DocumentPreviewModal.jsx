import React from 'react';
import { X, FileText, Download, ShieldCheck } from 'lucide-react';

const DocumentPreviewModal = ({ doc, onClose, onDownload }) => {
  if (!doc) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card modal-doc-preview-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-doc-title-group">
            <span className="modal-doc-category">{doc.category}</span>
            <h3 className="modal-title margin-top-xs">{doc.title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-doc-body">
          <div className="modal-meta-bar">
            <span className="meta-bar-item">
              <strong>Date Issued:</strong> {doc.date}
            </span>
            <span className="badge-available-pill">
              <ShieldCheck size={13} className="inline-icon-left" /> AVAILABLE
            </span>
          </div>

          {/* Document Preview Placeholder Sheet */}
          <div className="document-preview-sheet">
            <div className="preview-sheet-header">
              <FileText size={32} color="#DC2626" />
              <div className="preview-sheet-titles">
                <h4>{doc.title}</h4>
                <p>GYANYUG Confidential Official Record</p>
              </div>
            </div>

            <div className="preview-sheet-content">
              <p className="preview-placeholder-text">
                [Document Preview] This is an official digital record for {doc.title} issued on {doc.date}.
                All terms and conditions outlined in the HR policy manual apply.
              </p>
              <div className="preview-dummy-lines">
                <div className="dummy-line line-wide" />
                <div className="dummy-line line-mid" />
                <div className="dummy-line line-short" />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer-row space-between">
          <button className="btn-action-cancel" onClick={onClose}>
            Close
          </button>

          <button
            className="btn-doc-get"
            onClick={() => {
              onDownload(doc);
              onClose();
            }}
          >
            <Download size={14} className="btn-icon-inline" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
