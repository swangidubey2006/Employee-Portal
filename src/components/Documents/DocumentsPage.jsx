import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import Sidebar from "../Dashboard/Sidebar.jsx";
import Header from "../Dashboard/Header.jsx";
import NotificationToast from "../LeftPanel/NotificationToast.jsx";
import DocumentSummaryCards from "./DocumentSummaryCards.jsx";
import DocumentFilter from "./DocumentFilter.jsx";
import DocumentCard from "./DocumentCard.jsx";
import DocumentPreviewModal from "./DocumentPreviewModal.jsx";
import { documentApi } from "../../services/api.js";

const DocumentsPage = () => {
  const [toastMessage, setToastMessage] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Documents");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    documentApi
      .getDocuments()
      .then((res) => {
        if (mounted) setDocuments(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((error) => {
        console.error("Documents load failed:", error);
        if (mounted) setToastMessage(error.message || "Unable to load your documents.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const normalizedDocs = documents.map((doc) => ({
    ...doc,
    id: doc._id || doc.docId,
    fileUrl: doc.filePath || "",
  }));

  const categories = [...new Set(normalizedDocs.map((doc) => doc.category).filter(Boolean))];
  const filteredDocs =
    selectedCategory === "All Documents"
      ? normalizedDocs
      : normalizedDocs.filter((doc) => doc.category === selectedCategory);

  const handleDownloadDoc = async (doc) => {
    try {
      await documentApi.downloadDoc(doc.id);
      setToastMessage("Document download started.");
    } catch (error) {
      console.error("Document download failed:", error);
      setToastMessage(error.message || "Unable to download this document.");
    }
  };

  return (
    <div className="dashboard-layout">
      <NotificationToast message={toastMessage} onClose={() => setToastMessage("")} />

      <Sidebar />

      <main className="dashboard-main-content">
        <Header />

        <div className="dashboard-scroll-body docs-page-body">
          <div className="docs-page-header">
            <div className="docs-title-group">
              <h2 className="docs-main-title">Documents</h2>
              <p className="docs-sub-title">
                View and download your official company documents.
              </p>
            </div>
          </div>

          <DocumentSummaryCards />

          <DocumentFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            showingCount={filteredDocs.length}
            totalCount={normalizedDocs.length}
            categories={categories}
          />

          <div className="doc-card-grid">
            {loading ? (
              <div style={{ padding: "2rem", color: "#64748B" }}>Loading your documents...</div>
            ) : filteredDocs.length === 0 ? (
              <div style={{ padding: "2rem", color: "#64748B" }}>
                No documents are available for your account.
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onPreview={(selected) => setPreviewDoc(selected)}
                  onDownload={handleDownloadDoc}
                />
              ))
            )}
          </div>

          <div className="doc-bottom-section">
            <div className="doc-bottom-divider" />
            <div className="doc-hr-notice">
              <Info size={18} className="hr-notice-icon" />
              <p className="hr-notice-text">
                Please contact HR if any documents are missing or incorrect. Some records may take up to 48 hours to appear after being processed.
              </p>
            </div>
          </div>
        </div>
      </main>

      {previewDoc && (
        <DocumentPreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onDownload={handleDownloadDoc}
        />
      )}
    </div>
  );
};

export default DocumentsPage;
