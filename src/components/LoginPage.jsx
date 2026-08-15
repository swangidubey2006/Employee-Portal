import React from 'react';
import LoginForm from './LeftPanel/LoginForm.jsx';
import WelcomePanel from './RightPanel/WelcomePanel.jsx';

const LoginPage = () => {
  return (
    <main className="login-card">
      <LoginForm />
      <WelcomePanel />
    </main>
  );
};

export default LoginPage;
