import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const RegistrationForm = ({ onSubmit, isLoading = false, className = '' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validatePassword = (password) => {
    const checks = {
      length: password?.length >= 8,
      lowercase: /[a-z]/?.test(password),
      uppercase: /[A-Z]/?.test(password),
      numbers: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    return Object.values(checks)?.filter(Boolean)?.length >= 4;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData?.password)) {
      newErrors.password = 'Password must meet security requirements';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit({
          email: formData?.email,
          password: formData?.password
        });
      }
    } catch (error) {
      if (error?.code === 'auth/email-already-in-use') {
        setErrors({ email: 'An account with this email already exists' });
      } else if (error?.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak' });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    }
  };

  const isFormValid = () => {
    return formData?.email && 
           formData?.password && 
           formData?.confirmPassword && 
           formData?.acceptTerms &&
           validateEmail(formData?.email) &&
           validatePassword(formData?.password) &&
           formData?.password === formData?.confirmPassword;
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* General Error */}
      {errors?.general && (
        <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
          <Icon name="AlertCircle" size={16} className="text-error" />
          <span className="text-sm text-error">{errors?.general}</span>
        </div>
      )}
      {/* Email Field */}
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        value={formData?.email}
        onChange={(e) => handleInputChange('email', e?.target?.value)}
        error={errors?.email}
        required
        disabled={isLoading}
      />
      {/* Password Field */}
      <div className="space-y-2">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
            disabled={isLoading}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>
        <PasswordStrengthMeter password={formData?.password} />
      </div>
      {/* Confirm Password Field */}
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
          disabled={isLoading}
        >
          <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
        </button>
      </div>
      {/* Terms and Conditions */}
      <div className="space-y-2">
        <Checkbox
          label={
            <span className="text-sm">
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </a>
            </span>
          }
          checked={formData?.acceptTerms}
          onChange={(e) => handleInputChange('acceptTerms', e?.target?.checked)}
          error={errors?.acceptTerms}
          required
          disabled={isLoading}
        />
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={!isFormValid() || isLoading}
        className="mt-8"
      >
        <div className="flex items-center justify-center gap-2">
          <Icon name="UserPlus" size={18} />
          <span className="font-semibold">Create Account</span>
        </div>
      </Button>
      {/* Security Notice */}
      <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
        <Icon name="Shield" size={16} className="text-success mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Your data is secure</p>
          <p>We use industry-standard encryption to protect your personal information and never share your data with third parties.</p>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;