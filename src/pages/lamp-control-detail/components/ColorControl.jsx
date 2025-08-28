import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ColorControl = ({ lamp, onUpdateColor, disabled = false }) => {
  const [selectedColor, setSelectedColor] = useState(lamp?.color || '#FFFFFF');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recentColors, setRecentColors] = useState([
    '#FFFFFF', '#FFE4B5', '#FFB6C1', '#98FB98'
  ]);

  useEffect(() => {
    setSelectedColor(lamp?.color || '#FFFFFF');
  }, [lamp?.color]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (onUpdateColor) {
      onUpdateColor(color);
    }
    
    // Add to recent colors
    setRecentColors(prev => {
      const filtered = prev?.filter(c => c !== color);
      return [color, ...filtered]?.slice(0, 8);
    });
  };

  const presetColors = [
    { name: 'Warm White', color: '#FFF8DC', temp: '2700K' },
    { name: 'Cool White', color: '#F0F8FF', temp: '6500K' },
    { name: 'Soft Pink', color: '#FFB6C1', temp: 'RGB' },
    { name: 'Sky Blue', color: '#87CEEB', temp: 'RGB' },
    { name: 'Mint Green', color: '#98FB98', temp: 'RGB' },
    { name: 'Lavender', color: '#DDA0DD', temp: 'RGB' },
    { name: 'Peach', color: '#FFCBA4', temp: 'RGB' },
    { name: 'Coral', color: '#FF7F7F', temp: 'RGB' }
  ];

  const getColorName = (color) => {
    const preset = presetColors?.find(p => p?.color?.toLowerCase() === color?.toLowerCase());
    return preset ? preset?.name : 'Custom';
  };

  return (
    <div className="p-6 bg-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon 
              name="Palette" 
              size={20} 
              className={disabled ? 'text-muted-foreground' : 'text-primary'}
            />
            <h3 className="text-lg font-semibold text-foreground">Color</h3>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50"
          >
            <span>Advanced</span>
            <Icon 
              name={showAdvanced ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </button>
        </div>

        {/* Current Color Display */}
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <div 
            className="w-16 h-16 rounded-lg border-2 border-border shadow-inner"
            style={{ backgroundColor: disabled ? '#F5F5F4' : selectedColor }}
          ></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {getColorName(selectedColor)}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {selectedColor?.toUpperCase()}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                disabled ? 'bg-muted-foreground' : 'bg-success animate-pulse'
              }`}></div>
              <span className="text-xs text-muted-foreground">
                {disabled ? 'Offline' : 'Live Preview'}
              </span>
            </div>
          </div>
        </div>

        {/* Preset Colors */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Preset Colors</h4>
          <div className="grid grid-cols-4 gap-3">
            {presetColors?.map((preset) => (
              <button
                key={preset?.color}
                onClick={() => handleColorChange(preset?.color)}
                disabled={disabled}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedColor?.toLowerCase() === preset?.color?.toLowerCase()
                    ? 'bg-primary text-primary-foreground scale-105'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-full border-2 border-border"
                  style={{ backgroundColor: preset?.color }}
                ></div>
                <div className="text-center">
                  <p className="text-xs font-medium truncate">{preset?.name}</p>
                  <p className="text-xs text-muted-foreground">{preset?.temp}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Colors */}
        {recentColors?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Recent Colors</h4>
            <div className="flex gap-2">
              {recentColors?.map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  onClick={() => handleColorChange(color)}
                  disabled={disabled}
                  className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedColor?.toLowerCase() === color?.toLowerCase()
                      ? 'border-primary scale-110' :'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Color Picker */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium text-foreground">Custom Color</h4>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorChange(e?.target?.value)}
                disabled={disabled}
                className="w-16 h-16 rounded-lg border border-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => {
                    const value = e?.target?.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/?.test(value)) {
                      setSelectedColor(value);
                      if (value?.length === 7) {
                        handleColorChange(value);
                      }
                    }
                  }}
                  disabled={disabled}
                  placeholder="#FFFFFF"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter hex color code (e.g., #FF5733)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorControl;