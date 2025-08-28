import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const LampControlModal = ({ 
  isOpen = false, 
  onClose, 
  lamp = null,
  onSave,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false
}) => {
  const [lampData, setLampData] = useState({
    name: '',
    brightness: 50,
    color: '#FFFFFF',
    isOn: false,
    temperature: 3000,
    schedule: null
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lamp) {
      setLampData({
        name: lamp?.name || '',
        brightness: lamp?.brightness || 50,
        color: lamp?.color || '#FFFFFF',
        isOn: lamp?.isOn || false,
        temperature: lamp?.temperature || 3000,
        schedule: lamp?.schedule || null
      });
    }
  }, [lamp]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (onSave) {
        await onSave({ ...lamp, ...lampData });
      }
      handleClose();
    } catch (error) {
      console.error('Error saving lamp:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePower = () => {
    setLampData(prev => ({ ...prev, isOn: !prev?.isOn }));
  };

  const handleBrightnessChange = (e) => {
    const value = parseInt(e?.target?.value);
    setLampData(prev => ({ ...prev, brightness: value }));
  };

  const handleTemperatureChange = (e) => {
    const value = parseInt(e?.target?.value);
    setLampData(prev => ({ ...prev, temperature: value }));
  };

  const handleColorChange = (e) => {
    setLampData(prev => ({ ...prev, color: e?.target?.value }));
  };

  const handleNameChange = (e) => {
    setLampData(prev => ({ ...prev, name: e?.target?.value }));
  };

  const getTemperatureLabel = (temp) => {
    if (temp < 2700) return 'Warm';
    if (temp < 4000) return 'Neutral';
    return 'Cool';
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="modal-content w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e?.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                lampData?.isOn ? 'bg-gradient-warm' : 'bg-muted'
              }`}>
                <Icon 
                  name="Lightbulb" 
                  size={20} 
                  color={lampData?.isOn ? 'white' : 'currentColor'} 
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Lamp Control</h2>
                <p className="text-sm text-muted-foreground">{lamp?.room || 'Living Room'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Navigation Arrows */}
              {hasPrevious && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPrevious}
                  className="touch-target"
                >
                  <Icon name="ChevronLeft" size={20} />
                </Button>
              )}
              {hasNext && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNext}
                  className="touch-target"
                >
                  <Icon name="ChevronRight" size={20} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="touch-target"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Lamp Name */}
            <Input
              label="Lamp Name"
              type="text"
              value={lampData?.name}
              onChange={handleNameChange}
              placeholder="Enter lamp name"
            />

            {/* Power Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="Power" size={20} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Power</p>
                  <p className="text-xs text-muted-foreground">
                    {lampData?.isOn ? 'On' : 'Off'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleTogglePower}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  lampData?.isOn ? 'bg-primary' : 'bg-muted-foreground'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    lampData?.isOn ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Brightness Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Brightness</label>
                <span className="text-sm font-mono text-muted-foreground">{lampData?.brightness}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lampData?.brightness}
                  onChange={handleBrightnessChange}
                  disabled={!lampData?.isOn}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: lampData?.isOn 
                      ? `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${lampData?.brightness}%, #F5F5F4 ${lampData?.brightness}%, #F5F5F4 100%)`
                      : '#F5F5F4'
                  }}
                />
              </div>
            </div>

            {/* Color Temperature */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Temperature</label>
                <span className="text-sm font-mono text-muted-foreground">
                  {lampData?.temperature}K ({getTemperatureLabel(lampData?.temperature)})
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="2200"
                  max="6500"
                  value={lampData?.temperature}
                  onChange={handleTemperatureChange}
                  disabled={!lampData?.isOn}
                  className="w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Color Picker */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={lampData?.color}
                  onChange={handleColorChange}
                  disabled={!lampData?.isOn}
                  className="w-12 h-12 rounded-lg border border-border cursor-pointer disabled:opacity-50"
                />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-mono">{lampData?.color}</p>
                  <p className="text-xs text-muted-foreground">Custom color selection</p>
                </div>
              </div>
            </div>

            {/* Quick Color Presets */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Quick Colors</label>
              <div className="grid grid-cols-6 gap-2">
                {[
                  '#FFFFFF', '#FFE4B5', '#FFB6C1', '#98FB98', 
                  '#87CEEB', '#DDA0DD', '#F0E68C', '#FFA07A'
                ]?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setLampData(prev => ({ ...prev, color }))}
                    disabled={!lampData?.isOn}
                    className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 ${
                      lampData?.color === color ? 'border-primary scale-110' : 'border-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="status-indicator status-online"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Connected</p>
                <p className="text-xs text-muted-foreground">Last updated: just now</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isLoading}
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LampControlModal;