import React, { useState } from 'react';
import Sidebar from './Dashboard/Sidebar.jsx';
import Header from './Dashboard/Header.jsx';
import NotificationToast from './LeftPanel/NotificationToast.jsx';
import {
  User,
  Briefcase,
  Phone,
  Building2,
  FileText,
  Pencil,
  RotateCcw,
  Eye,
  EyeOff,
  Lock,
  Plus,
  Download,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  X,
  Upload
} from 'lucide-react';

const SettingsPage = () => {
  // Toast Notification state
  const [toastMessage, setToastMessage] = useState('');

  // Bank details toggle state
  const [showBankDetails, setShowBankDetails] = useState(false);

  // Modal dialog states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Profile data state
  const [profile, setProfile] = useState({
    fullName: 'Shristi Kumari',
    gender: 'Female',
    dob: 'October 15, 2002',
    personalEmail: 'shristi.k@gmail.com',
    phone: '+91 98765 43210',
    address: '402 Blue Heaven, Jubilee Hills, Hyderabad',
    officialEmail: 'shristi.kumari@gyanyug.com',
    joiningDate: 'January 12, 2024',
    empType: 'Full-time Intern',
    department: 'Web Development',
    reportingManager: 'Anand Varma',
    workLocation: 'Hybrid - Hyderabad HQ',
    emergencyName: 'Rakesh Prasad',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 99887 76655',
  });

  // Edit form state buffer
  const [editBuffer, setEditBuffer] = useState({ ...profile });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Open Edit Profile modal
  const handleOpenEditModal = () => {
    setEditBuffer({ ...profile });
    setIsEditModalOpen(true);
  };

  // Save profile edits
  const handleSaveProfileModal = (e) => {
    e.preventDefault();
    setProfile({ ...editBuffer });
    setIsEditModalOpen(false);
    setToastMessage('Profile information updated successfully!');
  };

  // Change password submission
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setToastMessage('Please fill all password fields.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToastMessage('New password and confirm password do not match.');
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setToastMessage('Password updated successfully!');
  };

  // Document actions
  const handleDocumentAction = (action, docName) => {
    if (action === 'view') {
      setToastMessage(`Opening ${docName}...`);
    } else if (action === 'download') {
      setToastMessage(`Downloading ${docName}...`);
    } else if (action === 'replace') {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = (e) => {
        if (e.target.files[0]) {
          setToastMessage(`Replaced ${docName} with ${e.target.files[0].name}`);
        }
      };
      input.click();
    } else if (action === 'upload') {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = (e) => {
        if (e.target.files[0]) {
          setToastMessage(`Uploaded ${e.target.files[0].name} successfully!`);
        }
      };
      input.click();
    }
  };

  // Bottom Save Changes
  const handleMainSaveChanges = () => {
    setToastMessage('All profile changes saved successfully!');
  };

  // Bottom Cancel
  const handleMainCancel = () => {
    setEditBuffer({ ...profile });
    setToastMessage('Unsaved changes discarded.');
  };

  return (
    <div className="dashboard-layout">
      {/* Toast Notification */}
      <NotificationToast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        <Header />

        <div className="dashboard-scroll-body settings-page-body">
          {/* Page Top Title Bar */}
          <div className="settings-page-header">
            <div className="settings-title-group">
              <h2 className="settings-main-title">My Profile</h2>
              <p className="settings-sub-title">
                Manage your personal and professional information.
              </p>
            </div>

            <div className="settings-header-actions">
              <button
                className="btn-settings-outline"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <RotateCcw size={15} />
                <span>Change Password</span>
              </button>

              <button className="btn-settings-dark" onClick={handleOpenEditModal}>
                <Pencil size={15} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* 1. PROFILE HEADER CARD */}
          <div className="profile-hero-card">
            <div className="hero-avatar-wrapper">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=240"
                alt={profile.fullName}
                className="hero-avatar-img"
              />
              <span className="badge-active-status">
                <span className="status-bullet">●</span> Active
              </span>
            </div>

            <div className="hero-details-wrapper">
              <div className="hero-name-row">
                <h1 className="hero-employee-name">{profile.fullName}</h1>
                <span className="hero-emp-id-badge">EMP-2026-001</span>
              </div>

              <p className="hero-job-title">
                {profile.empType} • {profile.department}
              </p>

              <div className="hero-meta-columns">
                <div className="meta-col">
                  <span className="meta-label">REPORTS TO</span>
                  <div className="meta-manager-row">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=80"
                      alt={profile.reportingManager}
                      className="manager-avatar-mini"
                    />
                    <span className="meta-val">{profile.reportingManager}</span>
                  </div>
                </div>

                <div className="meta-col">
                  <span className="meta-label">LOCATION</span>
                  <span className="meta-val">Hyderabad, IN</span>
                </div>

                <div className="meta-col">
                  <span className="meta-label">JOIN DATE</span>
                  <span className="meta-val">Jan 12, 2024</span>
                </div>

                <div className="meta-col">
                  <span className="meta-label">TYPE</span>
                  <span className="meta-val">Internship</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PERSONAL INFORMATION CARD */}
          <div className="settings-section-card">
            <div className="section-card-header">
              <div className="section-title-left">
                <div className="section-icon-box icon-box-blue">
                  <User size={18} color="#2563EB" />
                </div>
                <h3 className="section-card-heading">Personal Information</h3>
              </div>

              <button className="btn-circular-edit" onClick={handleOpenEditModal} title="Edit Personal Information">
                <Pencil size={15} />
              </button>
            </div>

            <div className="three-col-data-grid">
              <div className="data-field-group">
                <span className="field-label-sm">FULL NAME</span>
                <span className="field-value-text">{profile.fullName}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">GENDER</span>
                <span className="field-value-text">{profile.gender}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">DATE OF BIRTH</span>
                <span className="field-value-text">{profile.dob}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">PERSONAL EMAIL</span>
                <span className="field-value-text">{profile.personalEmail}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">MOBILE NUMBER</span>
                <span className="field-value-text">{profile.phone}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">ADDRESS</span>
                <span className="field-value-text">{profile.address}</span>
              </div>
            </div>
          </div>

          {/* 3. PROFESSIONAL INFORMATION CARD */}
          <div className="settings-section-card">
            <div className="section-card-header">
              <div className="section-title-left">
                <div className="section-icon-box icon-box-green">
                  <Briefcase size={18} color="#059669" />
                </div>
                <h3 className="section-card-heading">Professional Information</h3>
              </div>

              <button className="btn-circular-edit" onClick={handleOpenEditModal} title="Edit Professional Information">
                <Pencil size={15} />
              </button>
            </div>

            <div className="three-col-data-grid">
              <div className="data-field-group">
                <span className="field-label-sm">OFFICIAL EMAIL</span>
                <span className="field-value-text">{profile.officialEmail}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">JOINING DATE</span>
                <span className="field-value-text">{profile.joiningDate}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">EMPLOYMENT TYPE</span>
                <span className="field-value-text">{profile.empType}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">DEPARTMENT</span>
                <span className="field-value-text">{profile.department}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">REPORTING MANAGER</span>
                <span className="field-value-text">{profile.reportingManager}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">WORK LOCATION</span>
                <span className="field-value-text">{profile.workLocation}</span>
              </div>
            </div>
          </div>

          {/* 4. EMERGENCY CONTACT CARD */}
          <div className="settings-section-card">
            <div className="section-card-header">
              <div className="section-title-left">
                <div className="section-icon-box icon-box-red">
                  <Phone size={18} color="#DC2626" />
                </div>
                <h3 className="section-card-heading">Emergency Contact</h3>
              </div>

              <button className="btn-circular-edit" onClick={handleOpenEditModal} title="Edit Emergency Contact">
                <Pencil size={15} />
              </button>
            </div>

            <div className="emergency-contact-box">
              <div className="contact-person-info">
                <div className="contact-avatar-circle">
                  <User size={18} color="#64748B" />
                </div>
                <div className="contact-names">
                  <span className="contact-name">{profile.emergencyName}</span>
                  <span className="contact-relation">{profile.emergencyRelation}</span>
                </div>
              </div>

              <div className="contact-phone-pill">
                <PhoneCall size={14} color="#0F172A" />
                <span>{profile.emergencyPhone}</span>
              </div>
            </div>
          </div>

          {/* 5. BANK DETAILS CARD */}
          <div className="settings-section-card">
            <div className="section-card-header">
              <div className="section-title-left">
                <div className="section-icon-box icon-box-slate">
                  <Building2 size={18} color="#475569" />
                </div>
                <h3 className="section-card-heading">Bank Details</h3>
              </div>

              <span className="badge-secure-storage">
                <Lock size={12} /> SECURE STORAGE
              </span>
            </div>

            <div className="three-col-data-grid">
              <div className="data-field-group">
                <span className="field-label-sm">BANK NAME</span>
                <span className="field-value-text">HDFC Bank Ltd.</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">ACCOUNT HOLDER</span>
                <span className="field-value-text">{profile.fullName}</span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">ACCOUNT NUMBER</span>
                <span className="field-value-text font-mono">
                  {showBankDetails ? '4521 8839 5529' : 'XXXX XXXX 5529'}
                </span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">IFSC CODE</span>
                <span className="field-value-text font-mono">
                  {showBankDetails ? 'HDFC0001234' : '********'}
                </span>
              </div>

              <div className="data-field-group">
                <span className="field-label-sm">BRANCH</span>
                <span className="field-value-text">
                  {showBankDetails ? 'Jubilee Hills Branch' : '********'}
                </span>
              </div>
            </div>

            <div className="bank-security-footer">
              <div className="security-subtext-row">
                <ShieldCheck size={15} color="#94A3B8" />
                <span>Sensitive information is hidden for your security.</span>
              </div>

              <button
                className="btn-show-details"
                onClick={() => setShowBankDetails(!showBankDetails)}
              >
                {showBankDetails ? <EyeOff size={15} /> : <Eye size={15} />}
                <span>{showBankDetails ? 'Hide Details' : 'Show Details'}</span>
              </button>
            </div>
          </div>

          {/* 6. DOCUMENTS CARD */}
          <div className="settings-section-card">
            <div className="section-card-header">
              <div className="section-title-left">
                <div className="section-icon-box icon-box-slate">
                  <FileText size={18} color="#475569" />
                </div>
                <h3 className="section-card-heading">Documents</h3>
              </div>

              <button
                className="btn-upload-new-doc"
                onClick={() => handleDocumentAction('upload')}
              >
                <Plus size={15} />
                <span>Upload New Document</span>
              </button>
            </div>

            <div className="documents-two-col-grid">
              {/* Document 1: Resume */}
              <div className="document-card-box">
                <div className="doc-card-top-row">
                  <div className="doc-icon-box">
                    <FileText size={18} color="#475569" />
                  </div>
                  <div className="doc-status-badge">
                    <span className="badge-label-status">STATUS</span>
                    <span className="badge-verified">Verified</span>
                  </div>
                </div>

                <div className="doc-card-info">
                  <h4 className="doc-filename">Resume_SK.pdf</h4>
                  <span className="doc-upload-date">Uploaded Jan 10, 2024</span>
                </div>

                <div className="doc-card-actions-grid">
                  <button
                    className="btn-doc-action"
                    onClick={() => handleDocumentAction('view', 'Resume_SK.pdf')}
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>

                  <button
                    className="btn-doc-action"
                    onClick={() => handleDocumentAction('download', 'Resume_SK.pdf')}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>

                  <button
                    className="btn-doc-action full-width"
                    onClick={() => handleDocumentAction('replace', 'Resume_SK.pdf')}
                  >
                    <RefreshCw size={14} />
                    <span>Replace</span>
                  </button>
                </div>
              </div>

              {/* Document 2: Aadhaar Card */}
              <div className="document-card-box">
                <div className="doc-card-top-row">
                  <div className="doc-icon-box">
                    <FileText size={18} color="#475569" />
                  </div>
                  <div className="doc-status-badge">
                    <span className="badge-label-status">STATUS</span>
                    <span className="badge-verified">Verified</span>
                  </div>
                </div>

                <div className="doc-card-info">
                  <h4 className="doc-filename">Aadhaar_Card.pdf</h4>
                  <span className="doc-upload-date">Uploaded Jan 11, 2024</span>
                </div>

                <div className="doc-card-actions-grid">
                  <button
                    className="btn-doc-action"
                    onClick={() => handleDocumentAction('view', 'Aadhaar_Card.pdf')}
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>

                  <button
                    className="btn-doc-action"
                    onClick={() => handleDocumentAction('download', 'Aadhaar_Card.pdf')}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>

                  <button
                    className="btn-doc-action full-width"
                    onClick={() => handleDocumentAction('replace', 'Aadhaar_Card.pdf')}
                  >
                    <RefreshCw size={14} />
                    <span>Replace</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE BOTTOM ACTION BAR */}
          <div className="settings-bottom-action-bar">
            <button className="btn-action-cancel" onClick={handleMainCancel}>
              Cancel
            </button>
            <button className="btn-action-save" onClick={handleMainSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </main>

      {/* EDIT PROFILE MODAL DIALOG */}
      {isEditModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile Information</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className="modal-form-body" onSubmit={handleSaveProfileModal}>
              <div className="modal-form-grid">
                <div className="modal-input-group">
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={editBuffer.fullName}
                    onChange={(e) =>
                      setEditBuffer({ ...editBuffer, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="modal-input-group">
                  <label className="input-label">Gender</label>
                  <select
                    className="custom-input"
                    value={editBuffer.gender}
                    onChange={(e) =>
                      setEditBuffer({ ...editBuffer, gender: e.target.value })
                    }
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="modal-input-group">
                  <label className="input-label">Date of Birth</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={editBuffer.dob}
                    onChange={(e) =>
                      setEditBuffer({ ...editBuffer, dob: e.target.value })
                    }
                  />
                </div>

                <div className="modal-input-group">
                  <label className="input-label">Personal Email</label>
                  <input
                    type="email"
                    className="custom-input"
                    value={editBuffer.personalEmail}
                    onChange={(e) =>
                      setEditBuffer({ ...editBuffer, personalEmail: e.target.value })
                    }
                  />
                </div>

                <div className="modal-input-group">
                  <label className="input-label">Mobile Number</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={editBuffer.phone}
                    onChange={(e) =>
                      setEditBuffer({ ...editBuffer, phone: e.target.value })
                    }
                  />
                </div>

                <div className="modal-input-group">
                  <label className="input-label">Address</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={editBuffer.address}
                    onChange={(e) =>
                      setEditBuffer({ ...editBuffer, address: e.target.value })
                    }
                  />
                </div>

                <div className="modal-input-group">
                  <label className="input-label">Emergency Contact Name</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={editBuffer.emergencyName}
                    onChange={(e) =>
                      setEditBuffer({ ...editBuffer, emergencyName: e.target.value })
                    }
                  />
                </div>

                <div className="modal-input-group">
                  <label className="input-label">Emergency Phone</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={editBuffer.emergencyPhone}
                    onChange={(e) =>
                      setEditBuffer({ ...editBuffer, emergencyPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer-row">
                <button
                  type="button"
                  className="btn-action-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-action-save">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL DIALOG */}
      {isPasswordModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal-content-card modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Change Password</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className="modal-form-body" onSubmit={handleChangePassword}>
              <div className="modal-input-group margin-bottom-sm">
                <label className="input-label">Current Password</label>
                <input
                  type="password"
                  className="custom-input"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-input-group margin-bottom-sm">
                <label className="input-label">New Password</label>
                <input
                  type="password"
                  className="custom-input"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-input-group margin-bottom-md">
                <label className="input-label">Confirm New Password</label>
                <input
                  type="password"
                  className="custom-input"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-footer-row">
                <button
                  type="button"
                  className="btn-action-cancel"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-action-save">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
