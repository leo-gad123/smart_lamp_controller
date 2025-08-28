import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ConnectionStatusIndicator = ({ 
  status = 'online',
  lampConnections = [],
  showDetails = false,
  onToggleDetails,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      if (status === 'online') {
        setLastUpdate(new Date());
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [status]);

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: 'Wifi',
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Online',
          description: 'All systems connected'
        };
      case 'offline':
        return {
          icon: 'WifiOff',
          color: 'text-error',
          bgColor: 'bg-error/10',
          label: 'Offline',
          description: 'Connection lost'
        };
      case 'connecting':
        return {
          icon: 'Loader2',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Connecting',
          description: 'Establishing connection'
        };
      default:
        return {
          icon: 'AlertCircle',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Unknown',
          description: 'Status unknown'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const onlineLamps = lampConnections?.filter(lamp => lamp?.status === 'online')?.length;
  const totalLamps = lampConnections?.length;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (onToggleDetails) {
      onToggleDetails(!isExpanded);
    }
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return lastUpdate?.toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Status Indicator */}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-muted ${statusConfig?.bgColor}`}
      >
        <div className="relative">
          <Icon 
            name={statusConfig?.icon} 
            size={16} 
            className={`${statusConfig?.color} ${
              status === 'connecting' ? 'animate-spin' : 
              status === 'online' ? 'breathing' : ''
            }`}
          />
          {status === 'online' && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse"></div>
          )}
        </div>
        
        {/* Desktop: Show full info */}
        <div className="hidden md:flex items-center gap-2">
          <span className={`text-sm font-medium ${statusConfig?.color}`}>
            {statusConfig?.label}
          </span>
          {totalLamps > 0 && (
            <span className="text-xs text-muted-foreground font-mono">
              {onlineLamps}/{totalLamps}
            </span>
          )}
        </div>

        {/* Mobile: Show count only */}
        <div className="md:hidden">
          {totalLamps > 0 && (
            <span className="text-xs text-muted-foreground font-mono">
              {onlineLamps}/{totalLamps}
            </span>
          )}
        </div>

        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={14} 
          className="text-muted-foreground" 
        />
      </button>
      {/* Expanded Details */}
      {(isExpanded || showDetails) && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-150">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${statusConfig?.bgColor}`}>
                <Icon 
                  name={statusConfig?.icon} 
                  size={20} 
                  className={statusConfig?.color}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Connection Status
                </h3>
                <p className="text-xs text-muted-foreground">
                  {statusConfig?.description}
                </p>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-lg font-mono font-semibold text-success">
                  {onlineLamps}
                </p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-lg font-mono font-semibold text-error">
                  {totalLamps - onlineLamps}
                </p>
                <p className="text-xs text-muted-foreground">Offline</p>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-lg font-mono font-semibold text-foreground">
                  {totalLamps}
                </p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>

            {/* Individual Lamp Status */}
            {lampConnections?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Device Status
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {lampConnections?.map((lamp, index) => (
                    <div key={lamp?.id || index} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          lamp?.status === 'online' ? 'bg-success' : 'bg-error'
                        }`}></div>
                        <span className="text-sm text-foreground truncate">
                          {lamp?.name || `Lamp ${index + 1}`}
                        </span>
                      </div>
                      <span className={`text-xs font-medium ${
                        lamp?.status === 'online' ? 'text-success' : 'text-error'
                      }`}>
                        {lamp?.status === 'online' ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Update */}
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Last updated:</span>
                <span className="font-mono">{formatLastUpdate()}</span>
              </div>
            </div>

            {/* Reconnect Button (if offline) */}
            {status === 'offline' && (
              <div className="mt-3">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200">
                  <Icon name="RefreshCw" size={14} />
                  Reconnect
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;