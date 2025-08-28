import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveSceneIndicator = ({ 
  activeScene = null, 
  onDeactivate,
  className = '' 
}) => {
  if (!activeScene) return null;

  const handleDeactivate = () => {
    if (onDeactivate) onDeactivate();
  };

  const getSceneIcon = () => {
    switch (activeScene?.type) {
      case 'movie':
        return 'Film';
      case 'dinner':
        return 'Utensils';
      case 'reading':
        return 'BookOpen';
      case 'sleep':
        return 'Moon';
      case 'party':
        return 'Music';
      case 'work':
        return 'Briefcase';
      default:
        return 'Lightbulb';
    }
  };

  return (
    <div className={`bg-primary/10 border border-primary/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name={getSceneIcon()} size={20} color="white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{activeScene?.name}</h3>
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                Active
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {activeScene?.lampCount} {activeScene?.lampCount === 1 ? 'lamp' : 'lamps'} • 
              Activated {activeScene?.activatedAt || 'just now'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDeactivate}
          iconName="Square"
          iconPosition="left"
        >
          Deactivate
        </Button>
      </div>
      {/* Active Lamp Colors Preview */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-muted-foreground">Colors:</span>
        <div className="flex items-center gap-1">
          {activeScene?.colors?.slice(0, 6)?.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-background"
              style={{ backgroundColor: color }}
            ></div>
          ))}
          {activeScene?.colors?.length > 6 && (
            <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                +{activeScene?.colors?.length - 6}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveSceneIndicator;