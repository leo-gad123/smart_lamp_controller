import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickScheduleActions = ({ 
  onCreateSchedule,
  onImportSchedule,
  onBulkAction,
  selectedSchedules = [],
  className = '' 
}) => {
  const quickTemplates = [
    {
      id: 'morning_routine',
      name: 'Morning Routine',
      icon: 'Sunrise',
      description: 'Turn on lights at 7:00 AM on weekdays',
      template: {
        name: 'Morning Routine',
        time: '07:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        action: {
          type: 'turn_on',
          brightness: 80,
          color: '#FFFFFF'
        }
      }
    },
    {
      id: 'evening_lights',
      name: 'Evening Lights',
      icon: 'Sunset',
      description: 'Warm lighting at 8:00 PM daily',
      template: {
        name: 'Evening Lights',
        time: '20:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        action: {
          type: 'turn_on',
          brightness: 60,
          color: '#FFE4B5'
        }
      }
    },
    {
      id: 'bedtime',
      name: 'Bedtime',
      icon: 'Moon',
      description: 'Turn off all lights at 11:00 PM',
      template: {
        name: 'Bedtime',
        time: '23:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        action: {
          type: 'turn_off'
        }
      }
    },
    {
      id: 'weekend_late_start',
      name: 'Weekend Late Start',
      icon: 'Coffee',
      description: 'Gentle wake-up at 9:00 AM on weekends',
      template: {
        name: 'Weekend Late Start',
        time: '09:00',
        days: ['saturday', 'sunday'],
        action: {
          type: 'turn_on',
          brightness: 40,
          color: '#FFF8DC'
        }
      }
    }
  ];

  const handleTemplateSelect = (template) => {
    if (onCreateSchedule) {
      onCreateSchedule(template);
    }
  };

  const handleBulkEnable = () => {
    if (onBulkAction) {
      onBulkAction('enable', selectedSchedules);
    }
  };

  const handleBulkDisable = () => {
    if (onBulkAction) {
      onBulkAction('disable', selectedSchedules);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkAction) {
      onBulkAction('delete', selectedSchedules);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Templates */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Zap" size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Quick Templates</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickTemplates?.map((template) => (
            <button
              key={template?.id}
              onClick={() => handleTemplateSelect(template?.template)}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left"
            >
              <div className="w-8 h-8 bg-gradient-cool rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={template?.icon} size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground">{template?.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {template?.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Bulk Actions */}
      {selectedSchedules?.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="CheckSquare" size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Bulk Actions ({selectedSchedules?.length} selected)
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkEnable}
              iconName="Play"
              iconPosition="left"
              iconSize={14}
            >
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDisable}
              iconName="Pause"
              iconPosition="left"
              iconSize={14}
            >
              Disable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              iconName="Trash2"
              iconPosition="left"
              iconSize={14}
              className="text-error hover:text-error hover:border-error"
            >
              Delete All
            </Button>
          </div>
        </div>
      )}
      {/* Import/Export */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Download" size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Import & Export</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onImportSchedule}
            iconName="Upload"
            iconPosition="left"
            iconSize={14}
          >
            Import Schedules
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={14}
          >
            Export Schedules
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Import schedules from a JSON file or export current schedules for backup
        </p>
      </div>
      {/* Schedule Statistics */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="BarChart3" size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Statistics</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-lg font-mono font-semibold text-success">12</p>
            <p className="text-xs text-muted-foreground">Active Schedules</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-mono font-semibold text-muted-foreground">3</p>
            <p className="text-xs text-muted-foreground">Inactive Schedules</p>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Next execution:</span>
            <span className="font-mono">Today 8:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickScheduleActions;