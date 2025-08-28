import React from 'react';
import Icon from '../../../components/AppIcon';

const PowerToggle = ({ lamp, onTogglePower, isLoading = false }) => {
  const handleToggle = () => {
    if (!isLoading && onTogglePower) {
      onTogglePower(!lamp?.isOn);
    }
  };

  return (
    <div className="p-6 bg-card">
      <div className="flex items-center justify-between p-6 bg-muted rounded-xl">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg transition-colors duration-300 ${
            lamp?.isOn ? 'bg-primary' : 'bg-muted-foreground'
          }`}>
            <Icon 
              name="Power" 
              size={24} 
              color="white"
              className={isLoading ? 'animate-pulse' : ''}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Power</h3>
            <p className="text-sm text-muted-foreground">
              {lamp?.isOn ? 'Lamp is currently on' : 'Lamp is currently off'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 ${
            lamp?.isOn ? 'bg-primary' : 'bg-muted-foreground'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
              lamp?.isOn ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-muted rounded-lg">
        <div className={`w-2 h-2 rounded-full ${
          lamp?.isOn ? 'bg-success animate-pulse' : 'bg-error'
        }`}></div>
        <span className="text-sm text-muted-foreground">
          {lamp?.isOn ? 'Active' : 'Inactive'} • Last updated: just now
        </span>
      </div>
    </div>
  );
};

export default PowerToggle;