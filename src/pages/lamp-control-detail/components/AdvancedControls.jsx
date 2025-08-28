import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedControls = ({ lamp, onUpdateLamp, disabled = false }) => {
  const [temperatureValue, setTemperatureValue] = useState(lamp?.temperature || 3000);

  const sceneOptions = [
    { value: 'none', label: 'No Scene' },
    { value: 'reading', label: 'Reading Mode' },
    { value: 'relaxing', label: 'Relaxing' },
    { value: 'party', label: 'Party Mode' },
    { value: 'sleep', label: 'Sleep Mode' },
    { value: 'work', label: 'Work Focus' }
  ];

  const groupOptions = [
    { value: 'none', label: 'No Group' },
    { value: 'living-room', label: 'Living Room' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'office', label: 'Office' }
  ];

  const handleTemperatureChange = (e) => {
    const value = parseInt(e?.target?.value);
    setTemperatureValue(value);
    if (onUpdateLamp) {
      onUpdateLamp({ ...lamp, temperature: value });
    }
  };

  const handleSceneChange = (value) => {
    if (onUpdateLamp) {
      onUpdateLamp({ ...lamp, scene: value });
    }
  };

  const handleGroupChange = (value) => {
    if (onUpdateLamp) {
      onUpdateLamp({ ...lamp, group: value });
    }
  };

  const handleScheduleToggle = (checked) => {
    if (onUpdateLamp) {
      onUpdateLamp({ ...lamp, scheduleEnabled: checked });
    }
  };

  const getTemperatureLabel = (temp) => {
    if (temp < 2700) return 'Very Warm';
    if (temp < 3500) return 'Warm';
    if (temp < 4500) return 'Neutral';
    if (temp < 5500) return 'Cool';
    return 'Very Cool';
  };

  return (
    <div className="p-6 bg-card space-y-6">
      {/* Color Temperature */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon 
              name="Thermometer" 
              size={20} 
              className={disabled ? 'text-muted-foreground' : 'text-secondary'}
            />
            <h3 className="text-lg font-semibold text-foreground">Temperature</h3>
          </div>
          <div className="text-right">
            <span className="text-sm font-mono font-semibold text-foreground">
              {temperatureValue}K
            </span>
            <p className="text-xs text-muted-foreground">
              {getTemperatureLabel(temperatureValue)}
            </p>
          </div>
        </div>

        <div className="relative">
          <input
            type="range"
            min="2200"
            max="6500"
            value={temperatureValue}
            onChange={handleTemperatureChange}
            disabled={disabled}
            className="w-full h-3 bg-gradient-to-r from-amber-400 via-yellow-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>2200K</span>
            <span>Warm</span>
            <span>Neutral</span>
            <span>Cool</span>
            <span>6500K</span>
          </div>
        </div>
      </div>
      {/* Scene Assignment */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Icon 
            name="Palette" 
            size={20} 
            className={disabled ? 'text-muted-foreground' : 'text-accent'}
          />
          <h3 className="text-lg font-semibold text-foreground">Scene</h3>
        </div>
        <Select
          options={sceneOptions}
          value={lamp?.scene || 'none'}
          onChange={handleSceneChange}
          disabled={disabled}
          placeholder="Select a scene"
          description="Apply predefined lighting scenes"
        />
      </div>
      {/* Group Assignment */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Icon 
            name="Users" 
            size={20} 
            className={disabled ? 'text-muted-foreground' : 'text-primary'}
          />
          <h3 className="text-lg font-semibold text-foreground">Group</h3>
        </div>
        <Select
          options={groupOptions}
          value={lamp?.group || 'none'}
          onChange={handleGroupChange}
          disabled={disabled}
          placeholder="Select a group"
          description="Control multiple lamps together"
        />
      </div>
      {/* Schedule Toggle */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Icon 
            name="Clock" 
            size={20} 
            className={disabled ? 'text-muted-foreground' : 'text-warning'}
          />
          <h3 className="text-lg font-semibold text-foreground">Scheduling</h3>
        </div>
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">
              Enable Automatic Scheduling
            </p>
            <p className="text-xs text-muted-foreground">
              {lamp?.scheduleEnabled ? 'Schedule is active' : 'Manual control only'}
            </p>
          </div>
          <Checkbox
            checked={lamp?.scheduleEnabled || false}
            onChange={(e) => handleScheduleToggle(e?.target?.checked)}
            disabled={disabled}
          />
        </div>
      </div>
      {/* Energy Information */}
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="Zap" size={16} className="text-success" />
          <h4 className="text-sm font-medium text-foreground">Energy Usage</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Current Draw</p>
            <p className="font-mono font-semibold text-foreground">
              {lamp?.isOn ? '8.5W' : '0.1W'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Today's Usage</p>
            <p className="font-mono font-semibold text-foreground">2.4 kWh</p>
          </div>
        </div>
      </div>
      {/* Battery Status (for battery-powered lamps) */}
      {lamp?.batteryPowered && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Icon name="Battery" size={16} className="text-success" />
              <h4 className="text-sm font-medium text-foreground">Battery</h4>
            </div>
            <span className="text-sm font-mono font-semibold text-foreground">
              {lamp?.batteryLevel || 85}%
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-2">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${lamp?.batteryLevel || 85}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Estimated {Math.floor((lamp?.batteryLevel || 85) / 10)} hours remaining
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedControls;