import React from 'react';
import LoginForm from '../LoginForm';

function LoginView() {
  return (
    <div className="login-page">
      <div className="header">
        <h1>Trading</h1>
      </div>
      <div className="content">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginView;