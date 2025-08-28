import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SocialRegistration = ({ onSocialRegister, isLoading = false, className = '' }) => {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      bgColor: 'bg-white hover:bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300'
    }
  ];

  const handleSocialRegister = async (provider) => {
    setLoadingProvider(provider?.id);
    try {
      if (onSocialRegister) {
        await onSocialRegister(provider?.id);
      }
    } catch (error) {
      console.error(`${provider?.name} registration failed:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="space-y-2">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.id}
            variant="outline"
            fullWidth
            onClick={() => handleSocialRegister(provider)}
            loading={loadingProvider === provider?.id}
            disabled={isLoading || loadingProvider !== null}
            className={`${provider?.bgColor} ${provider?.textColor} ${provider?.borderColor} hover:scale-[1.02] transition-transform duration-200`}
          >
            <div className="flex items-center justify-center gap-3">
              <Icon name={provider?.icon} size={18} />
              <span className="font-medium">Continue with {provider?.name}</span>
            </div>
          </Button>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground">
        Social registration is secure and encrypted
      </p>
    </div>
  );
};

export default SocialRegistration;