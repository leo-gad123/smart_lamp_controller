import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const BrightnessControl = ({ lamp, onUpdateBrightness, disabled = false }) => {
  const [brightness, setBrightness] = useState(lamp?.brightness || 50);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setBrightness(lamp?.brightness || 50);
  }, [lamp?.brightness]);

  // Debounced update to prevent excessive Firebase writes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (brightness !== lamp?.brightness && onUpdateBrightness) {
        setIsUpdating(true);
        onUpdateBrightness(brightness);
        setTimeout(() => setIsUpdating(false), 500);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [brightness, lamp?.brightness, onUpdateBrightness]);

  const handleBrightnessChange = (e) => {
    const value = parseInt(e?.target?.value);
    setBrightness(value);
  };

  const getBrightnessIcon = () => {
    if (brightness === 0) return 'Sun';
    if (brightness < 30) return 'Sun';
    if (brightness < 70) return 'Sun';
    return 'Sun';
  };

  const getBrightnessLabel = () => {
    if (brightness === 0) return 'Off';
    if (brightness < 30) return 'Dim';
    if (brightness < 70) return 'Medium';
    return 'Bright';
  };

  return (
    <div className="p-6 bg-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon 
              name={getBrightnessIcon()} 
              size={20} 
              className={`${disabled ? 'text-muted-foreground' : 'text-warning'} ${isUpdating ? 'animate-pulse' : ''}`}
            />
            <h3 className="text-lg font-semibold text-foreground">Brightness</h3>
          </div>
          <div className="text-right">
            <span className="text-lg font-mono font-semibold text-foreground">
              {brightness}%
            </span>
            <p className="text-xs text-muted-foreground">
              {getBrightnessLabel()}
            </p>
          </div>
        </div>

        {/* Brightness Slider */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={handleBrightnessChange}
            disabled={disabled}
            className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: disabled 
                ? '#F5F5F4'
                : `linear-gradient(to right, #F59E0B 0%, #F59E0B ${brightness}%, #F5F5F4 ${brightness}%, #F5F5F4 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Quick Brightness Presets */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Off', value: 0, icon: 'Moon' },
            { label: 'Dim', value: 25, icon: 'Sun' },
            { label: 'Medium', value: 50, icon: 'Sun' },
            { label: 'Bright', value: 100, icon: 'Sun' }
          ]?.map((preset) => (
            <button
              key={preset?.value}
              onClick={() => setBrightness(preset?.value)}
              disabled={disabled}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                brightness === preset?.value
                  ? 'bg-primary text-primary-foreground scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              <Icon name={preset?.icon} size={16} />
              <span className="text-xs font-medium">{preset?.label}</span>
            </button>
          ))}
        </div>

        {/* Real-time Preview */}
        <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
          <div 
            className="w-16 h-16 rounded-full border-4 border-warning transition-all duration-300"
            style={{
              opacity: disabled ? 0.3 : brightness / 100,
              boxShadow: disabled ? 'none' : `0 0 ${brightness / 2}px rgba(245, 158, 11, 0.5)`
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-warm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrightnessControl;