import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';
import SocialRegistration from './components/SocialRegistration';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Mock registration function
  const handleRegister = async (userData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation - check for existing email
      const existingEmails = ['admin@smartlamp.com', 'test@example.com'];
      if (existingEmails?.includes(userData?.email)) {
        throw { code: 'auth/email-already-in-use' };
      }
      
      // Mock successful registration
      setUserEmail(userData?.email);
      setRegistrationSuccess(true);
      
      // Auto redirect after showing success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock social registration
  const handleSocialRegister = async (provider) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful social registration
      setUserEmail(`user@${provider}.com`);
      setRegistrationSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Social registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Success Screen Component
  const SuccessScreen = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
        <Icon name="CheckCircle2" size={32} className="text-success" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Account Created Successfully!</h2>
        <p className="text-muted-foreground">
          Welcome to Smart Lamp Controller. We've sent a verification email to:
        </p>
        <p className="font-medium text-foreground">{userEmail}</p>
      </div>

      <div className="space-y-4 p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Mail" size={20} className="text-primary mt-0.5" />
          <div className="text-left">
            <h3 className="font-medium text-foreground mb-1">Check Your Email</h3>
            <p className="text-sm text-muted-foreground">
              Click the verification link in your email to activate your account and start controlling your smart lamps.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Icon name="Clock" size={16} />
        <span>Redirecting to dashboard in a few seconds...</span>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Create Account - Smart Lamp Controller</title>
        <meta name="description" content="Create your Smart Lamp Controller account to start managing your smart home lighting system remotely." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 lg:p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-cool rounded-lg">
              <Icon name="Lightbulb" size={24} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Smart Lamp</h1>
              <p className="text-xs text-muted-foreground -mt-1">Controller</p>
            </div>
          </Link>
          
          <Link 
            to="/login" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Icon name="LogIn" size={16} />
            <span>Sign In</span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            {!registrationSuccess ? (
              <>
                {/* Registration Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
                  <p className="text-muted-foreground">
                    Join Smart Lamp Controller to manage your smart home lighting
                  </p>
                </div>

                {/* Registration Form */}
                <div className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-6">
                  <RegistrationForm 
                    onSubmit={handleRegister}
                    isLoading={isLoading}
                  />
                  
                  <SocialRegistration 
                    onSocialRegister={handleSocialRegister}
                    isLoading={isLoading}
                  />
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-card border border-border rounded-lg shadow-sm p-6">
                <SuccessScreen />
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 lg:p-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <Link to="/terms" className="hover:text-foreground transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/support" className="hover:text-foreground transition-colors duration-200">
                Support
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={12} className="text-success" />
              <span>Secure & Encrypted</span>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} Smart Lamp Controller. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default Register;