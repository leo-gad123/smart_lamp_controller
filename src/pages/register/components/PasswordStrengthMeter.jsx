import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthMeter = ({ password = '', className = '' }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password?.length >= 8,
      lowercase: /[a-z]/?.test(password),
      uppercase: /[A-Z]/?.test(password),
      numbers: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    
    score = Object.values(checks)?.filter(Boolean)?.length;
    
    const strengthLevels = {
      0: { label: '', color: '', bgColor: '' },
      1: { label: 'Very Weak', color: 'text-error', bgColor: 'bg-error' },
      2: { label: 'Weak', color: 'text-error', bgColor: 'bg-error' },
      3: { label: 'Fair', color: 'text-warning', bgColor: 'bg-warning' },
      4: { label: 'Good', color: 'text-success', bgColor: 'bg-success' },
      5: { label: 'Strong', color: 'text-success', bgColor: 'bg-success' }
    };
    
    return { score, checks, ...strengthLevels?.[score] };
  };

  const strength = getPasswordStrength(password);
  
  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Password Strength</span>
          <span className={`text-xs font-medium ${strength?.color}`}>
            {strength?.label}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5]?.map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                level <= strength?.score ? strength?.bgColor : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
      {/* Requirements Checklist */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Requirements:</p>
        <div className="grid grid-cols-1 gap-1">
          {[
            { key: 'length', label: 'At least 8 characters' },
            { key: 'lowercase', label: 'One lowercase letter' },
            { key: 'uppercase', label: 'One uppercase letter' },
            { key: 'numbers', label: 'One number' },
            { key: 'special', label: 'One special character' }
          ]?.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <Icon 
                name={strength?.checks?.[key] ? "CheckCircle2" : "Circle"} 
                size={12} 
                className={strength?.checks?.[key] ? 'text-success' : 'text-muted-foreground'}
              />
              <span className={`text-xs ${
                strength?.checks?.[key] ? 'text-success' : 'text-muted-foreground'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;