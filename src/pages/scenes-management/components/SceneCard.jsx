import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SceneCard = ({ 
  scene, 
  isActive = false, 
  onActivate, 
  onEdit, 
  onDelete,
  onLongPress 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);

  const handleMouseDown = () => {
    setIsPressed(true);
    const timer = setTimeout(() => {
      if (onLongPress) onLongPress(scene);
    }, 500);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleActivate = (e) => {
    e?.stopPropagation();
    if (onActivate) onActivate(scene);
  };

  const handleEdit = (e) => {
    e?.stopPropagation();
    if (onEdit) onEdit(scene);
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    if (onDelete) onDelete(scene);
  };

  const getSceneIcon = () => {
    switch (scene?.type) {
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
    <div 
      className={`control-card relative p-4 transition-all duration-300 ${
        isActive ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${isPressed ? 'scale-95' : 'hover:scale-105'} cursor-pointer`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
      )}
      {/* Scene Preview */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          <Icon name={getSceneIcon()} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{scene?.name}</h3>
          <p className="text-sm text-muted-foreground">
            {scene?.lampCount} {scene?.lampCount === 1 ? 'lamp' : 'lamps'}
          </p>
        </div>
      </div>
      {/* Color Preview */}
      <div className="flex items-center gap-1 mb-4">
        {scene?.colors?.slice(0, 4)?.map((color, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full border-2 border-background"
            style={{ backgroundColor: color }}
          ></div>
        ))}
        {scene?.colors?.length > 4 && (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">
              +{scene?.colors?.length - 4}
            </span>
          </div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={isActive ? "outline" : "default"}
          size="sm"
          onClick={handleActivate}
          className="flex-1"
          iconName={isActive ? "Square" : "Play"}
          iconPosition="left"
        >
          {isActive ? 'Deactivate' : 'Activate'}
        </Button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="w-8 h-8"
          >
            <Icon name="Edit2" size={14} />
          </Button>
          {!scene?.isDefault && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="w-8 h-8 text-error hover:text-error"
            >
              <Icon name="Trash2" size={14} />
            </Button>
          )}
        </div>
      </div>
      {/* Scene Details */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Created: {scene?.createdAt}</span>
          {scene?.lastUsed && (
            <span>Used: {scene?.lastUsed}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneCard;