import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigation = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Control',
      path: '/dashboard',
      icon: 'Home',
      badge: null,
      tooltip: 'Lamp Dashboard'
    },
    {
      label: 'Scenes',
      path: '/scenes-management',
      icon: 'Palette',
      badge: null,
      tooltip: 'Scene Management'
    },
    {
      label: 'Schedule',
      path: '/scheduling',
      icon: 'Clock',
      badge: null,
      tooltip: 'Automation & Scheduling'
    }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location?.pathname === '/dashboard' || location?.pathname === '/lamp-control-detail';
    }
    return location?.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-90 bg-card border-t border-border ${className}`}>
        <div className="flex items-center justify-around h-20 px-4">
          {navigationItems?.map((item) => {
            const active = isActive(item?.path);
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 touch-target min-w-[60px] ${
                  active
                    ? 'bg-primary text-primary-foreground scale-interaction'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={item?.tooltip}
              >
                <div className="relative">
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    className={active ? 'text-primary-foreground' : 'text-current'}
                  />
                  {item?.badge && (
                    <span className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {item?.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${active ? 'text-primary-foreground' : 'text-current'}`}>
                  {item?.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      {/* Desktop Sidebar Navigation */}
      <nav className={`hidden lg:block fixed left-0 top-16 bottom-0 w-64 z-90 bg-card border-r border-border ${className}`}>
        <div className="flex flex-col h-full">
          <div className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigationItems?.map((item) => {
                const active = isActive(item?.path);
                return (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 touch-target ${
                      active
                        ? 'bg-primary text-primary-foreground glow-effect'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    title={item?.tooltip}
                  >
                    <div className="relative">
                      <Icon 
                        name={item?.icon} 
                        size={20} 
                        className={active ? 'text-primary-foreground' : 'text-current'}
                      />
                      {item?.badge && (
                        <span className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {item?.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${active ? 'text-primary-foreground' : 'text-current'}`}>
                      {item?.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted">
              <div className="w-8 h-8 bg-gradient-cool rounded-full flex items-center justify-center">
                <Icon name="Lightbulb" size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Smart Lamp</p>
                <p className="text-xs text-muted-foreground">Controller v2.1</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer for mobile bottom navigation */}
      <div className="lg:hidden h-20"></div>
      {/* Spacer for desktop sidebar */}
      <div className="hidden lg:block w-64"></div>
    </>
  );
};

export default BottomTabNavigation;