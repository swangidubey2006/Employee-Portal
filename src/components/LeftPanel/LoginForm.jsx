import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BrandHeader from './BrandHeader.jsx';
import InputField from './InputField.jsx';
import PasswordField from './PasswordField.jsx';
import GoogleButton from './GoogleButton.jsx';
import NotificationToast from './NotificationToast.jsx';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
 const [toastType, setToastType] = useState('error');
const [isLoading, setIsLoading] = useState(false);
 
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setToastMessage('Please fill in both email and password.');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      setToastMessage('Verifying credentials...');

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404 || data.message?.includes('not registered')) {
         setToastType('error');
setToastMessage('User not registered. Please Sign Up first.');
        } else if (response.status === 401 || data.message?.includes('Invalid')) {
         setToastType('error');
setToastMessage('Invalid email or password.');
        } else {
         setToastType('error');
setToastMessage(data.message || 'Login failed.');
        }
        return;
      }

      // Store authentication state & token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToastType('success');
setToastMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      console.error('Login error:', error);
      setToastMessage('Unable to connect to server. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setToastMessage('Password reset link sent to your registered email.');
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handleGoogleLogin = () => {
    setToastMessage('Initiating secure Google Workspace OAuth authentication...');
  };

  return (
    <div className="left-panel-wrapper">
      <NotificationToast message={toastMessage}
      type={toastType}
       onClose={() => setToastMessage('')} />
      
      <div className="left-panel-content">
        {/* Brand Logo Header */}
        <BrandHeader />

        {/* Login Form Core */}
        <div className="form-main-container">
          <div className="form-title-group">
            <h2 className="form-main-title">Log in to your account</h2>
            <p className="form-sub-title">Access your employee workspace securely.</p>
          </div>

          <form className="login-form" onSubmit={handleLoginSubmit}>
            {/* Email Address Input */}
            <InputField
              id="email-address"
              label="Email Address"
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Input with Show/Hide Eye Toggle */}
            <PasswordField
              id="password-input"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Remember Me & Forgot Password Row */}
            <div className="remember-forgot-row">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>

              <a
                href="#forgot-password"
                className="forgot-password-link"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button with Right Arrow Icon */}
            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              <span>{isLoading ? 'Signing In...' : 'Login'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Signup Subtext */}
          <div className="signup-row">
            <span>Don't have an account?</span>
            <a href="#signup" className="signup-link" onClick={handleSignUpClick}>
              Sign Up
            </a>
          </div>

          {/* Or Login With Divider */}
          <div className="or-divider">
            <div className="divider-line"></div>
            <span className="divider-text">Or login with</span>
            <div className="divider-line"></div>
          </div>

          {/* Google OAuth Login Button */}
          <GoogleButton onClick={handleGoogleLogin} />
        </div>

        {/* Footer Copyright */}
        <footer className="footer-text">
          2026 © GYANYUG — By RIG Innovations
        </footer>
      </div>
    </div>
  );
};

export default LoginForm;