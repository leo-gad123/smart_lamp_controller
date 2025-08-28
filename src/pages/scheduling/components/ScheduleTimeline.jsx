import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ScheduleTimeline = ({ 
  schedules = [], 
  selectedDate = new Date(),
  onScheduleClick,
  className = '' 
}) => {
  const [timelineData, setTimelineData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    generateTimelineData();
  }, [schedules, selectedDate]);

  const generateTimelineData = () => {
    const dayOfWeek = selectedDate?.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const todaySchedules = schedules?.filter(schedule => 
      schedule?.isActive && schedule?.days?.includes(dayOfWeek)
    );

    const timeline = [];
    for (let hour = 0; hour < 24; hour++) {
      const timeSlot = {
        hour,
        displayTime: formatHour(hour),
        schedules: todaySchedules?.filter(schedule => {
          const scheduleHour = parseInt(schedule?.time?.split(':')?.[0]);
          return scheduleHour === hour;
        })
      };
      timeline?.push(timeSlot);
    }

    setTimelineData(timeline);
  };

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${ampm}`;
  };

  const isCurrentHour = (hour) => {
    const now = new Date();
    const today = now?.toDateString();
    const selectedDay = selectedDate?.toDateString();
    return today === selectedDay && now?.getHours() === hour;
  };

  const getScheduleColor = (schedule) => {
    switch (schedule?.action?.type) {
      case 'turn_on':
        return 'bg-success';
      case 'turn_off':
        return 'bg-error';
      case 'scene':
        return 'bg-secondary';
      default:
        return 'bg-primary';
    }
  };

  const getScheduleIcon = (schedule) => {
    switch (schedule?.action?.type) {
      case 'turn_on':
        return 'Sun';
      case 'turn_off':
        return 'Moon';
      case 'scene':
        return 'Palette';
      default:
        return 'Clock';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-cool rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={16} color="white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Timeline View</h3>
              <p className="text-xs text-muted-foreground">
                {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Turn On</span>
            <div className="w-2 h-2 bg-error rounded-full"></div>
            <span>Turn Off</span>
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span>Scene</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {timelineData?.map((timeSlot) => (
            <div
              key={timeSlot?.hour}
              className={`flex items-center gap-4 p-2 rounded-lg transition-colors duration-200 ${
                isCurrentHour(timeSlot?.hour) ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
              }`}
            >
              {/* Time Label */}
              <div className="w-16 text-right">
                <span className={`text-xs font-mono ${
                  isCurrentHour(timeSlot?.hour) ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}>
                  {timeSlot?.displayTime}
                </span>
              </div>

              {/* Timeline Bar */}
              <div className="flex-1 relative">
                <div className={`h-px ${
                  isCurrentHour(timeSlot?.hour) ? 'bg-primary' : 'bg-border'
                }`}></div>
                
                {/* Current Time Indicator */}
                {isCurrentHour(timeSlot?.hour) && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                )}

                {/* Schedule Events */}
                {timeSlot?.schedules?.map((schedule, index) => {
                  const minutes = parseInt(schedule?.time?.split(':')?.[1]);
                  const position = (minutes / 60) * 100;
                  
                  return (
                    <button
                      key={`${schedule?.id}-${index}`}
                      onClick={() => onScheduleClick && onScheduleClick(schedule)}
                      className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 ${getScheduleColor(schedule)}`}
                      style={{ left: `${position}%` }}
                      title={`${schedule?.name} - ${schedule?.time}`}
                    >
                      <Icon 
                        name={getScheduleIcon(schedule)} 
                        size={12} 
                        color="white" 
                      />
                    </button>
                  );
                })}
              </div>

              {/* Schedule Count */}
              <div className="w-8 text-center">
                {timeSlot?.schedules?.length > 0 && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {timeSlot?.schedules?.length}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {timelineData?.every(slot => slot?.schedules?.length === 0) && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="Calendar" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No schedules for this day
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Create a schedule to see it on the timeline
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTimeline;