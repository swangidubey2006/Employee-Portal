import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import BrandHeader from './LeftPanel/BrandHeader.jsx';
import GoogleButton from './LeftPanel/GoogleButton.jsx';
import NotificationToast from './LeftPanel/NotificationToast.jsx';
import GeometricBackground from './RightPanel/GeometricBackground.jsx';

const SignupPage = () => {
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors & feedback toast
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Use and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    setToastMessage('Please fix the errors in the form before submitting.');
    return;
  }

  try {
    setToastMessage('Creating your account...');

    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setToastMessage(data.message || 'Signup failed.');
      return;
    }

    setToastMessage(data.emailSent ? 'Account created! A confirmation email has been sent. Redirecting to login...' : 'Account created! Email could not be sent; please check email configuration. Redirecting to login...');

    setTimeout(() => {
      navigate('/login');
    }, 1500);

  } catch (error) {
    console.error('Signup error:', error);
    setToastMessage(
      'Unable to connect to server. Please make sure the backend is running.'
    );
  }
};

  const handleLoginRedirect = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleGoogleSignup = () => {
    setToastMessage('Initiating Google Workspace Sign Up...');
  };

  return (
    <main className="signup-card">
      <NotificationToast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* LEFT PANEL: Dark Navy Geometric Background with Hero Text */}
      <div className="signup-left-panel-wrapper">
        <GeometricBackground />
        <div className="signup-welcome-content">
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

      {/* RIGHT PANEL: White Angled Section with Form */}
      <div className="signup-right-panel-wrapper">
        <div className="signup-right-panel-content">
          {/* Brand Header */}
          <BrandHeader />

          {/* Form Container */}
          <div className="signup-form-container">
            <div className="form-title-group">
              <h2 className="form-main-title">Create your account</h2>
              <p className="form-sub-title">Join GYANYUG and start your journey with us.</p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="signup-input-group">
                <label htmlFor="full-name" className="input-label">
                  Full Name
                </label>
                <div className="signup-input-wrapper">
                  <input
                    id="full-name"
                    type="text"
                    className={`custom-input with-icon ${errors.fullName ? 'input-error' : ''}`}
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: null });
                    }}
                  />
                  <User size={16} className="field-icon-right" />
                </div>
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              {/* Email Address */}
              <div className="signup-input-group">
                <label htmlFor="signup-email" className="input-label">
                  Email Address
                </label>
                <div className="signup-input-wrapper">
                  <input
                    id="signup-email"
                    type="email"
                    className={`custom-input with-icon ${errors.email ? 'input-error' : ''}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                  />
                  <Mail size={16} className="field-icon-right" />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="signup-input-group">
                <label htmlFor="signup-password" className="input-label">
                  Password
                </label>
                <div className="signup-input-wrapper">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`custom-input with-icon ${errors.password ? 'input-error' : ''}`}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                  />
                  <div className="field-icons-group">
                    <Lock size={15} className="field-icon-lock" />
                    <button
                      type="button"
                      className="password-toggle-btn-right"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="signup-input-group">
                <label htmlFor="confirm-password" className="input-label">
                  Confirm Password
                </label>
                <div className="signup-input-wrapper">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`custom-input with-icon ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn-right"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              {/* Terms & Conditions */}
              <div className="terms-row">
                <label className="terms-label">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: null });
                    }}
                  />
                  <span>
                    I agree to the{' '}
                    <a href="#terms" className="green-link" onClick={(e) => e.preventDefault()}>
                      Terms of Use
                    </a>{' '}
                    and{' '}
                    <a href="#privacy" className="green-link" onClick={(e) => e.preventDefault()}>
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && <span className="error-text block">{errors.agreeTerms}</span>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="login-submit-btn">
                <span>Sign Up</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Already have an account? Login */}
            <div className="signup-row">
              <span>Already have an account?</span>
              <a href="/login" className="signup-link" onClick={handleLoginRedirect}>
                Login
              </a>
            </div>

            {/* Or sign up with Divider */}
            <div className="or-divider">
              <div className="divider-line"></div>
              <span className="divider-text">Or sign up with</span>
              <div className="divider-line"></div>
            </div>

            {/* Google Button */}
            <GoogleButton onClick={handleGoogleSignup} />
          </div>

          {/* Footer */}
          <footer className="footer-text">
            2026 © GYANYUG — By RIG Innovations
          </footer>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;