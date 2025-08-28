import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-cool rounded-xl shadow-lg">
            <Icon name="Lightbulb" size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">Smart Lamp</h1>
            <p className="text-sm text-muted-foreground -mt-1">Controller</p>
          </div>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground">
          Sign in to control your smart home lighting
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;