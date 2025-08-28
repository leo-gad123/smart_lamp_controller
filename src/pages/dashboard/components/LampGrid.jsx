import React, { useState, useCallback, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import LampCard from './LampCard';

const LampGrid = ({ 
  lamps = [], 
  onLampToggle, 
  onLampClick, 
  onBrightnessChange,
  onRefresh,
  isLoading = false,
  className = '' 
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // name, room, status
  const [filterBy, setFilterBy] = useState('all'); // all, online, offline, on, off

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing lamps:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const sortedAndFilteredLamps = React.useMemo(() => {
    let filtered = [...lamps];

    // Apply filters
    switch (filterBy) {
      case 'online':
        filtered = filtered?.filter(lamp => lamp?.connectionStatus === 'online');
        break;
      case 'offline':
        filtered = filtered?.filter(lamp => lamp?.connectionStatus === 'offline');
        break;
      case 'on':
        filtered = filtered?.filter(lamp => lamp?.isOn);
        break;
      case 'off':
        filtered = filtered?.filter(lamp => !lamp?.isOn);
        break;
      default:
        break;
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'room':
          return a?.room?.localeCompare(b?.room);
        case 'status':
          if (a?.connectionStatus !== b?.connectionStatus) {
            return a?.connectionStatus === 'online' ? -1 : 1;
          }
          return a?.isOn === b?.isOn ? 0 : a?.isOn ? -1 : 1;
        case 'name':
        default:
          return a?.name?.localeCompare(b?.name);
      }
    });

    return filtered;
  }, [lamps, sortBy, filterBy]);

  const filterOptions = [
    { value: 'all', label: 'All Lamps', count: lamps?.length },
    { value: 'online', label: 'Online', count: lamps?.filter(l => l?.connectionStatus === 'online')?.length },
    { value: 'offline', label: 'Offline', count: lamps?.filter(l => l?.connectionStatus === 'offline')?.length },
    { value: 'on', label: 'On', count: lamps?.filter(l => l?.isOn)?.length },
    { value: 'off', label: 'Off', count: lamps?.filter(l => !l?.isOn)?.length }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name', icon: 'AlphabeticalSort' },
    { value: 'room', label: 'Room', icon: 'Home' },
    { value: 'status', label: 'Status', icon: 'Activity' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            Smart Lamps ({sortedAndFilteredLamps?.length})
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            loading={refreshing}
            disabled={isLoading}
            className="touch-target"
          >
            <Icon name="RefreshCw" size={16} />
          </Button>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {filterOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setFilterBy(option?.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  filterBy === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option?.label} ({option?.count})
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="appearance-none bg-muted border border-border rounded-lg px-3 py-2 pr-8 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sortOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  Sort by {option?.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={14} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </div>
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Icon name="Loader2" size={20} className="animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading lamps...</span>
          </div>
        </div>
      )}
      {/* Empty State */}
      {!isLoading && sortedAndFilteredLamps?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Icon name="Lightbulb" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {filterBy === 'all' ? 'No lamps found' : `No ${filterBy} lamps`}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {filterBy === 'all' ?'Add your first smart lamp to get started'
              : `Try adjusting your filter or check lamp connections`
            }
          </p>
          {filterBy !== 'all' && (
            <Button
              variant="outline"
              onClick={() => setFilterBy('all')}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Show All Lamps
            </Button>
          )}
        </div>
      )}
      {/* Lamp Grid */}
      {!isLoading && sortedAndFilteredLamps?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedAndFilteredLamps?.map((lamp) => (
            <LampCard
              key={lamp?.id}
              lamp={lamp}
              onToggle={onLampToggle}
              onCardClick={onLampClick}
              onBrightnessChange={onBrightnessChange}
              className="scale-interaction"
            />
          ))}
        </div>
      )}
      {/* Pull to Refresh Indicator (Mobile) */}
      {refreshing && (
        <div className="lg:hidden fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-card border border-border rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Icon name="RefreshCw" size={16} className="animate-spin text-primary" />
            <span className="text-sm font-medium text-foreground">Refreshing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LampGrid;