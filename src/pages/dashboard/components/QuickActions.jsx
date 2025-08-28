import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ 
  onAllOn, 
  onAllOff, 
  onSceneSelect,
  totalLamps = 0,
  activeLamps = 0,
  className = '' 
}) => {
  const [isExecuting, setIsExecuting] = useState(null);

  const handleAllOn = async () => {
    setIsExecuting('allOn');
    try {
      await onAllOn();
    } catch (error) {
      console.error('Error turning all lamps on:', error);
    } finally {
      setIsExecuting(null);
    }
  };

  const handleAllOff = async () => {
    setIsExecuting('allOff');
    try {
      await onAllOff();
    } catch (error) {
      console.error('Error turning all lamps off:', error);
    } finally {
      setIsExecuting(null);
    }
  };

  const handleSceneSelect = async (sceneName) => {
    setIsExecuting('scene');
    try {
      await onSceneSelect(sceneName);
    } catch (error) {
      console.error('Error applying scene:', error);
    } finally {
      setIsExecuting(null);
    }
  };

  const quickScenes = [
    { id: 'bright', name: 'Bright', icon: 'Sun', color: '#FFE4B5' },
    { id: 'cozy', name: 'Cozy', icon: 'Home', color: '#FFA07A' },
    { id: 'focus', name: 'Focus', icon: 'Zap', color: '#87CEEB' },
    { id: 'relax', name: 'Relax', icon: 'Moon', color: '#DDA0DD' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg p-4 lg:p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Zap" size={14} />
          <span>{activeLamps}/{totalLamps} active</span>
        </div>
      </div>
      {/* Main Controls */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          variant="outline"
          onClick={handleAllOn}
          loading={isExecuting === 'allOn'}
          disabled={isExecuting !== null || totalLamps === 0}
          className="h-12 flex-col gap-1"
          iconName="Power"
          iconSize={18}
        >
          <span className="text-sm font-medium">All On</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleAllOff}
          loading={isExecuting === 'allOff'}
          disabled={isExecuting !== null || activeLamps === 0}
          className="h-12 flex-col gap-1"
          iconName="PowerOff"
          iconSize={18}
        >
          <span className="text-sm font-medium">All Off</span>
        </Button>
      </div>
      {/* Quick Scenes */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Quick Scenes</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {quickScenes?.map((scene) => (
            <button
              key={scene?.id}
              onClick={() => handleSceneSelect(scene?.id)}
              disabled={isExecuting !== null || totalLamps === 0}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: scene?.color }}
              >
                <Icon name={scene?.icon} size={16} color="white" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {scene?.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Scene Management Link */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSceneSelect('manage')}
          className="w-full justify-center"
          iconName="Settings"
          iconPosition="left"
          iconSize={14}
        >
          Manage Scenes
        </Button>
      </div>
      {/* Status Indicator */}
      {isExecuting && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Icon name="Loader2" size={14} className="animate-spin" />
          <span>
            {isExecuting === 'allOn' && 'Turning all lamps on...'}
            {isExecuting === 'allOff' && 'Turning all lamps off...'}
            {isExecuting === 'scene' && 'Applying scene...'}
          </span>
        </div>
      )}
    </div>
  );
};

export default QuickActions;