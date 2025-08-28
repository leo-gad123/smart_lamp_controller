import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SceneFilters = ({ 
  searchQuery = '', 
  onSearchChange, 
  selectedFilter = 'all',
  onFilterChange,
  sceneCount = 0 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All Scenes', icon: 'Grid3X3' },
    { value: 'default', label: 'Default', icon: 'Star' },
    { value: 'custom', label: 'Custom', icon: 'User' },
    { value: 'recent', label: 'Recently Used', icon: 'Clock' },
    { value: 'favorites', label: 'Favorites', icon: 'Heart' }
  ];

  const handleFilterSelect = (value) => {
    if (onFilterChange) onFilterChange(value);
    setIsFilterOpen(false);
  };

  const getSelectedFilterLabel = () => {
    const selected = filterOptions?.find(option => option?.value === selectedFilter);
    return selected ? selected?.label : 'All Scenes';
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Search scenes..."
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e?.target?.value)}
          className="pl-10"
        />
        <Icon 
          name="Search" 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />
      </div>
      {/* Filter Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {sceneCount} {sceneCount === 1 ? 'scene' : 'scenes'}
          </span>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            iconName="Filter"
            iconPosition="left"
            className="min-w-[120px] justify-between"
          >
            {getSelectedFilterLabel()}
            <Icon name="ChevronDown" size={14} />
          </Button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-150">
              <div className="p-2">
                {filterOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => handleFilterSelect(option?.value)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                      selectedFilter === option?.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={option?.icon} size={16} />
                    {option?.label}
                    {selectedFilter === option?.value && (
                      <Icon name="Check" size={14} className="ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Active Filters Display */}
      {(searchQuery || selectedFilter !== 'all') && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          
          {searchQuery && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              <Icon name="Search" size={12} />
              <span>"{searchQuery}"</span>
              <button
                onClick={() => onSearchChange && onSearchChange('')}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}
          
          {selectedFilter !== 'all' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded-md text-xs">
              <Icon name="Filter" size={12} />
              <span>{getSelectedFilterLabel()}</span>
              <button
                onClick={() => handleFilterSelect('all')}
                className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SceneFilters;