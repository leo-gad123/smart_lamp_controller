import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = ({ 
  totalLamps = 0, 
  activeLamps = 0, 
  connectionStatus = 'online',
  className = '' 
}) => {
  const offlineLamps = totalLamps - activeLamps;
  const activePercentage = totalLamps > 0 ? Math.round((activeLamps / totalLamps) * 100) : 0;

  const getConnectionStatusConfig = () => {
    switch (connectionStatus) {
      case 'online':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'All Systems Online'
        };
      case 'offline':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          label: 'Connection Issues'
        };
      case 'connecting':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Connecting...'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Status Unknown'
        };
    }
  };

  const statusConfig = getConnectionStatusConfig();

  return (
    <div className={`bg-card border border-border rounded-lg p-4 lg:p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">System Overview</h2>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig?.bgColor}`}>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'online' ? 'bg-success animate-pulse' : 
            connectionStatus === 'offline' ? 'bg-error' : 'bg-warning'
          }`}></div>
          <span className={`text-xs font-medium ${statusConfig?.color}`}>
            {statusConfig?.label}
          </span>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Lamps */}
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mx-auto mb-2">
            <Icon name="Lightbulb" size={20} className="text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground font-mono">{totalLamps}</p>
          <p className="text-xs text-muted-foreground">Total Lamps</p>
        </div>

        {/* Active Lamps */}
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg mx-auto mb-2">
            <Icon name="Zap" size={20} className="text-success" />
          </div>
          <p className="text-2xl font-bold text-success font-mono">{activeLamps}</p>
          <p className="text-xs text-muted-foreground">Active Now</p>
        </div>

        {/* Offline Lamps */}
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg mx-auto mb-2">
            <Icon name="WifiOff" size={20} className="text-error" />
          </div>
          <p className="text-2xl font-bold text-error font-mono">{offlineLamps}</p>
          <p className="text-xs text-muted-foreground">Offline</p>
        </div>

        {/* Activity Percentage */}
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg mx-auto mb-2">
            <Icon name="Activity" size={20} className="text-accent" />
          </div>
          <p className="text-2xl font-bold text-accent font-mono">{activePercentage}%</p>
          <p className="text-xs text-muted-foreground">Activity</p>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">System Activity</span>
          <span className="text-sm text-muted-foreground">{activeLamps}/{totalLamps}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-success to-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${activePercentage}%` }}
          ></div>
        </div>
      </div>
      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated:</span>
          <span className="font-mono">
            {new Date()?.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;