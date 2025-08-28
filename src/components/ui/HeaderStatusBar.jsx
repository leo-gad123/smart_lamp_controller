import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const HeaderStatusBar = ({ 
  connectionStatus = 'online', 
  lampCount = 0, 
  activeLamps = 0,
  currentUser = null 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showConnectionDetails, setShowConnectionDetails] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    switch (location?.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/lamp-control-detail':
        return 'Lamp Control';
      case '/scenes-management':
        return 'Scenes';
      case '/scheduling':
        return 'Scheduling';
      default:
        return 'Smart Lamp Controller';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'online':
        return 'text-success';
      case 'offline':
        return 'text-error';
      case 'connecting':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'online':
        return 'Wifi';
      case 'offline':
        return 'WifiOff';
      case 'connecting':
        return 'Loader2';
      default:
        return 'Wifi';
    }
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
    setShowConnectionDetails(false);
  };

  const handleConnectionToggle = () => {
    setShowConnectionDetails(!showConnectionDetails);
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    navigate('/login');
    setShowUserMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.dropdown-container')) {
        setShowUserMenu(false);
        setShowConnectionDetails(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-100 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-cool rounded-lg">
              <Icon name="Lightbulb" size={24} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Smart Lamp</h1>
              <p className="text-xs text-muted-foreground -mt-1">Controller</p>
            </div>
          </div>
        </div>

        {/* Center - Page Title (Desktop) */}
        <div className="hidden lg:block">
          <h2 className="text-base font-medium text-foreground">{getPageTitle()}</h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Connection Status */}
          <div className="dropdown-container relative">
            <button
              onClick={handleConnectionToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200 touch-target"
            >
              <Icon 
                name={getConnectionStatusIcon()} 
                size={16} 
                className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-spin' : connectionStatus === 'online' ? 'breathing' : ''}`}
              />
              <span className="hidden md:inline text-sm font-medium text-muted-foreground">
                {activeLamps}/{lampCount}
              </span>
            </button>

            {/* Connection Details Dropdown */}
            {showConnectionDetails && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-150">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon 
                      name={getConnectionStatusIcon()} 
                      size={16} 
                      className={getConnectionStatusColor()}
                    />
                    <span className="text-sm font-medium capitalize">{connectionStatus}</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total Lamps:</span>
                      <span className="font-mono">{lampCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active:</span>
                      <span className="font-mono text-success">{activeLamps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Offline:</span>
                      <span className="font-mono text-error">{lampCount - activeLamps}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="dropdown-container relative">
            <button
              onClick={handleUserMenuToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200 touch-target"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="hidden lg:inline text-sm font-medium text-foreground">
                {currentUser?.name || 'User'}
              </span>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-150">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border mb-2">
                    <p className="text-sm font-medium text-foreground">
                      {currentUser?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser?.email || 'user@example.com'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors duration-200"
                  >
                    <Icon name="Settings" size={16} />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors duration-200"
                  >
                    <Icon name="HelpCircle" size={16} />
                    Help
                  </button>
                  <div className="border-t border-border my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-muted rounded-md transition-colors duration-200"
                  >
                    <Icon name="LogOut" size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderStatusBar;