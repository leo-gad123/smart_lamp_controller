import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatus = ({ lamp, onRetryConnection }) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [signalStrength, setSignalStrength] = useState(lamp?.signalStrength || 85);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lamp?.status === 'online') {
        setLastUpdate(new Date());
        // Simulate signal strength fluctuation
        setSignalStrength(prev => {
          const variation = (Math.random() - 0.5) * 10;
          return Math.max(60, Math.min(100, prev + variation));
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lamp?.status]);

  const getStatusConfig = () => {
    switch (lamp?.status) {
      case 'online':
        return {
          icon: 'Wifi',
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Connected',
          description: 'Real-time control active'
        };
      case 'offline':
        return {
          icon: 'WifiOff',
          color: 'text-error',
          bgColor: 'bg-error/10',
          label: 'Offline',
          description: 'Unable to reach device'
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
          description: 'Status unavailable'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return lastUpdate?.toLocaleDateString();
  };

  const getSignalIcon = () => {
    if (signalStrength >= 80) return 'Wifi';
    if (signalStrength >= 60) return 'Wifi';
    if (signalStrength >= 40) return 'Wifi';
    return 'WifiOff';
  };

  const getSignalBars = () => {
    const bars = Math.ceil(signalStrength / 25);
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 rounded-full transition-colors duration-300 ${
          i < bars ? 'bg-success' : 'bg-muted'
        }`}
        style={{ height: `${(i + 1) * 4 + 4}px` }}
      ></div>
    ));
  };

  return (
    <div className="p-6 bg-card">
      <div className="space-y-4">
        {/* Main Status */}
        <div className={`flex items-center justify-between p-4 rounded-lg ${statusConfig?.bgColor}`}>
          <div className="flex items-center gap-3">
            <Icon 
              name={statusConfig?.icon} 
              size={20} 
              className={`${statusConfig?.color} ${
                lamp?.status === 'connecting' ? 'animate-spin' : 
                lamp?.status === 'online' ? 'breathing' : ''
              }`}
            />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {statusConfig?.label}
              </h3>
              <p className="text-xs text-muted-foreground">
                {statusConfig?.description}
              </p>
            </div>
          </div>
          
          {lamp?.status === 'online' && (
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5 h-4">
                {getSignalBars()}
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {Math.round(signalStrength)}%
              </span>
            </div>
          )}
        </div>

        {/* Connection Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Clock" size={14} className="text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Last Update</span>
            </div>
            <p className="text-sm font-mono text-muted-foreground">
              {formatLastUpdate()}
            </p>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="MapPin" size={14} className="text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Location</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {lamp?.room || 'Living Room'}
            </p>
          </div>
        </div>

        {/* Network Information */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Router" size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">Network Info</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="font-mono">SmartHome_5G</span>
            </div>
            <div className="flex justify-between">
              <span>IP Address:</span>
              <span className="font-mono">192.168.1.{Math.floor(Math.random() * 200) + 10}</span>
            </div>
            <div className="flex justify-between">
              <span>MAC Address:</span>
              <span className="font-mono">AA:BB:CC:DD:EE:FF</span>
            </div>
          </div>
        </div>

        {/* Firmware Information */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Cpu" size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">Device Info</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Firmware:</span>
              <span className="font-mono">v2.1.4</span>
            </div>
            <div className="flex justify-between">
              <span>Model:</span>
              <span className="font-mono">SL-RGB-001</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span className="font-mono">7d 14h 32m</span>
            </div>
          </div>
        </div>

        {/* Retry Connection Button (if offline) */}
        {lamp?.status === 'offline' && (
          <button
            onClick={onRetryConnection}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            <Icon name="RefreshCw" size={16} />
            Retry Connection
          </button>
        )}

        {/* Connection Tips */}
        {lamp?.status !== 'online' && (
          <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-warning mt-0.5" />
              <div className="text-xs text-warning">
                <p className="font-medium mb-1">Connection Tips:</p>
                <ul className="space-y-0.5 list-disc list-inside">
                  <li>Check if the lamp is powered on</li>
                  <li>Ensure WiFi network is stable</li>
                  <li>Try moving closer to the router</li>
                  <li>Restart the lamp if needed</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;