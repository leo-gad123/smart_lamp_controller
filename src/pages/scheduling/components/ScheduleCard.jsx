import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduleCard = ({ 
  schedule, 
  onEdit, 
  onDelete, 
  onToggle,
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(schedule?.id, !schedule?.isActive);
    } catch (error) {
      console.error('Error toggling schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time?.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDays = (days) => {
    if (days?.length === 7) return 'Every day';
    if (days?.length === 5 && !days?.includes('saturday') && !days?.includes('sunday')) {
      return 'Weekdays';
    }
    if (days?.length === 2 && days?.includes('saturday') && days?.includes('sunday')) {
      return 'Weekends';
    }
    return days?.map(day => day?.charAt(0)?.toUpperCase() + day?.slice(1, 3))?.join(', ');
  };

  const getNextExecution = () => {
    if (!schedule?.isActive) return null;
    
    const now = new Date();
    const today = now?.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now?.toTimeString()?.slice(0, 5);
    
    // Simple next execution calculation
    if (schedule?.days?.includes(today) && schedule?.time > currentTime) {
      return 'Today';
    }
    return 'Tomorrow';
  };

  const getActionDescription = () => {
    const { action } = schedule;
    if (action?.type === 'turn_on') {
      return `Turn on (${action?.brightness}% brightness)`;
    }
    if (action?.type === 'turn_off') {
      return 'Turn off';
    }
    if (action?.type === 'scene') {
      return `Activate scene: ${action?.sceneName}`;
    }
    return 'Custom action';
  };

  const nextExecution = getNextExecution();

  return (
    <div className={`control-card p-4 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            schedule?.isActive ? 'bg-gradient-cool' : 'bg-muted'
          }`}>
            <Icon 
              name="Clock" 
              size={20} 
              color={schedule?.isActive ? 'white' : 'currentColor'} 
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{schedule?.name}</h3>
            <p className="text-xs text-muted-foreground">
              {formatTime(schedule?.time)} • {formatDays(schedule?.days)}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            schedule?.isActive ? 'bg-primary' : 'bg-muted-foreground'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
              schedule?.isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Lightbulb" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {schedule?.lamps?.length} lamp{schedule?.lamps?.length !== 1 ? 's' : ''} affected
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Icon name="Settings" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {getActionDescription()}
          </span>
        </div>

        {nextExecution && (
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">
              Next: {nextExecution} at {formatTime(schedule?.time)}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(schedule)}
          iconName="Edit2"
          iconPosition="left"
          iconSize={14}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(schedule?.id)}
          iconName="Trash2"
          iconPosition="left"
          iconSize={14}
          className="text-error hover:text-error hover:bg-error/10"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ScheduleCard;