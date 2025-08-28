import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LampCard = ({ 
  lamp, 
  onToggle, 
  onCardClick, 
  onBrightnessChange,
  className = '' 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (e) => {
    e?.stopPropagation();
    setIsUpdating(true);
    try {
      await onToggle(lamp?.id, !lamp?.isOn);
    } catch (error) {
      console.error('Error toggling lamp:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBrightnessChange = async (e) => {
    e?.stopPropagation();
    const newBrightness = parseInt(e?.target?.value);
    try {
      await onBrightnessChange(lamp?.id, newBrightness);
    } catch (error) {
      console.error('Error changing brightness:', error);
    }
  };

  const getStatusColor = () => {
    if (lamp?.connectionStatus === 'offline') return 'text-error';
    return lamp?.isOn ? 'text-success' : 'text-muted-foreground';
  };

  const getStatusIcon = () => {
    if (lamp?.connectionStatus === 'offline') return 'WifiOff';
    return lamp?.isOn ? 'Lightbulb' : 'LightbulbOff';
  };

  return (
    <div 
      className={`control-card p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        lamp?.connectionStatus === 'offline' ? 'opacity-60' : ''
      } ${className}`}
      onClick={() => onCardClick(lamp)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            lamp?.isOn && lamp?.connectionStatus === 'online' ?'bg-gradient-warm' :'bg-muted'
          }`}>
            <Icon 
              name={getStatusIcon()} 
              size={16} 
              color={lamp?.isOn && lamp?.connectionStatus === 'online' ? 'white' : 'currentColor'}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground truncate">
              {lamp?.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lamp?.room}
            </p>
          </div>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${
            lamp?.connectionStatus === 'online' ? 'bg-success' : 'bg-error'
          }`}></div>
        </div>
      </div>
      {/* Color Preview */}
      {lamp?.isOn && lamp?.connectionStatus === 'online' && (
        <div className="mb-3">
          <div 
            className="w-full h-2 rounded-full border border-border"
            style={{ backgroundColor: lamp?.color }}
          ></div>
        </div>
      )}
      {/* Controls */}
      <div className="space-y-3">
        {/* Power Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Power</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={lamp?.connectionStatus === 'offline' || isUpdating}
            loading={isUpdating}
            className="h-8 px-3"
          >
            <Icon 
              name="Power" 
              size={14} 
              className={getStatusColor()}
            />
          </Button>
        </div>

        {/* Brightness Slider */}
        {lamp?.connectionStatus === 'online' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Brightness</span>
              <span className="text-xs font-mono text-muted-foreground">
                {lamp?.brightness}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={lamp?.brightness}
              onChange={handleBrightnessChange}
              disabled={!lamp?.isOn}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: lamp?.isOn 
                  ? `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${lamp?.brightness}%, #F5F5F4 ${lamp?.brightness}%, #F5F5F4 100%)`
                  : '#F5F5F4'
              }}
              onClick={(e) => e?.stopPropagation()}
            />
          </div>
        )}

        {/* Status Text */}
        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium ${getStatusColor()}`}>
            {lamp?.connectionStatus === 'offline' ?'Offline' : lamp?.isOn ?'On' : 'Off'
            }
          </span>
          {lamp?.connectionStatus === 'online' && (
            <span className="text-muted-foreground">
              {lamp?.temperature}K
            </span>
          )}
        </div>
      </div>
      {/* Offline Reconnect */}
      {lamp?.connectionStatus === 'offline' && (
        <div className="mt-3 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs"
            onClick={(e) => {
              e?.stopPropagation();
              // Handle reconnect logic
            }}
          >
            <Icon name="RefreshCw" size={12} />
            Reconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default LampCard;