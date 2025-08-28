import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DemoCredentials = () => {
  const [isVisible, setIsVisible] = useState(false);

  const credentials = {
    email: 'admin@smartlamp.com',
    password: 'SmartLamp123!'
  };

  const handleCopyCredentials = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            Demo Credentials
          </span>
        </div>
        <Icon 
          name={isVisible ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground" 
        />
      </button>
      {isVisible && (
        <div className="mt-3 pt-3 border-t border-border space-y-3">
          <p className="text-xs text-muted-foreground">
            Use these credentials to test the application:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-card rounded border">
              <div>
                <p className="text-xs text-muted-foreground">Email:</p>
                <p className="text-sm font-mono text-foreground">{credentials?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleCopyCredentials(credentials?.email)}
                iconName="Copy"
                iconPosition="left"
              >
                Copy
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-card rounded border">
              <div>
                <p className="text-xs text-muted-foreground">Password:</p>
                <p className="text-sm font-mono text-foreground">{credentials?.password}</p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleCopyCredentials(credentials?.password)}
                iconName="Copy"
                iconPosition="left"
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoCredentials;