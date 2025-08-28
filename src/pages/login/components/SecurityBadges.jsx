import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      label: 'SSL Secured',
      description: '256-bit encryption'
    },
    {
      icon: 'Database',
      label: 'Firebase Protected',
      description: 'Google security'
    },
    {
      icon: 'Lock',
      label: 'Privacy First',
      description: 'Your data is safe'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="grid grid-cols-3 gap-4">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-muted rounded-lg">
              <Icon 
                name={feature?.icon} 
                size={16} 
                className="text-muted-foreground" 
              />
            </div>
            <p className="text-xs font-medium text-foreground mb-1">
              {feature?.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;