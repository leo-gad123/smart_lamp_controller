import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import DemoCredentials from './components/DemoCredentials';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-6 lg:p-8">
          {/* Header */}
          <LoginHeader />

          {/* Login Form */}
          <LoginForm />

          {/* Demo Credentials */}
          <DemoCredentials />

          {/* Security Badges */}
          <SecurityBadges />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} Smart Lamp Controller. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Secure IoT lighting management platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;