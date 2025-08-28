import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderStatusBar from '../../components/ui/HeaderStatusBar';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import LampHeader from './components/LampHeader';
import PowerToggle from './components/PowerToggle';
import BrightnessControl from './components/BrightnessControl';
import ColorControl from './components/ColorControl';
import AdvancedControls from './components/AdvancedControls';
import ConnectionStatus from './components/ConnectionStatus';

const LampControlDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mock lamp data - in real app, this would come from Firebase
  const [lamps] = useState([
    {
      id: 1,
      name: "Living Room Main",
      room: "Living Room",
      isOn: true,
      brightness: 75,
      color: "#FFE4B5",
      temperature: 3200,
      status: "online",
      scene: "reading",
      group: "living-room",
      scheduleEnabled: true,
      batteryPowered: false,
      signalStrength: 92
    },
    {
      id: 2,
      name: "Bedroom Accent",
      room: "Bedroom",
      isOn: false,
      brightness: 30,
      color: "#DDA0DD",
      temperature: 2700,
      status: "online",
      scene: "sleep",
      group: "bedroom",
      scheduleEnabled: false,
      batteryPowered: true,
      batteryLevel: 68,
      signalStrength: 78
    },
    {
      id: 3,
      name: "Kitchen Under Cabinet",
      room: "Kitchen",
      isOn: true,
      brightness: 90,
      color: "#FFFFFF",
      temperature: 4000,
      status: "offline",
      scene: "work",
      group: "kitchen",
      scheduleEnabled: true,
      batteryPowered: false,
      signalStrength: 45
    }
  ]);

  const [currentLampIndex, setCurrentLampIndex] = useState(0);
  const [currentLamp, setCurrentLamp] = useState(lamps?.[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionRetrying, setConnectionRetrying] = useState(false);

  // Get lamp ID from URL params or location state
  useEffect(() => {
    const lampId = location?.state?.lampId || 1;
    const lampIndex = lamps?.findIndex(lamp => lamp?.id === lampId);
    if (lampIndex !== -1) {
      setCurrentLampIndex(lampIndex);
      setCurrentLamp(lamps?.[lampIndex]);
    }
  }, [location?.state, lamps]);

  // Mock current user data
  const currentUser = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com"
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentLampIndex < lamps?.length - 1) {
      const nextIndex = currentLampIndex + 1;
      setCurrentLampIndex(nextIndex);
      setCurrentLamp(lamps?.[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentLampIndex > 0) {
      const prevIndex = currentLampIndex - 1;
      setCurrentLampIndex(prevIndex);
      setCurrentLamp(lamps?.[prevIndex]);
    }
  };

  // Lamp control handlers with optimistic UI updates
  const handleUpdateLamp = async (updatedLamp) => {
    setIsLoading(true);
    
    // Optimistic UI update
    setCurrentLamp(updatedLamp);
    
    try {
      // Simulate Firebase update delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real app, update Firebase here
      console.log('Lamp updated:', updatedLamp);
      
    } catch (error) {
      console.error('Error updating lamp:', error);
      // Revert optimistic update on error
      setCurrentLamp(currentLamp);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePower = async (isOn) => {
    const updatedLamp = { ...currentLamp, isOn };
    await handleUpdateLamp(updatedLamp);
  };

  const handleUpdateBrightness = async (brightness) => {
    const updatedLamp = { ...currentLamp, brightness };
    await handleUpdateLamp(updatedLamp);
  };

  const handleUpdateColor = async (color) => {
    const updatedLamp = { ...currentLamp, color };
    await handleUpdateLamp(updatedLamp);
  };

  const handleRetryConnection = async () => {
    setConnectionRetrying(true);
    
    try {
      // Simulate connection retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedLamp = { ...currentLamp, status: 'online', signalStrength: 85 };
      setCurrentLamp(updatedLamp);
      
    } catch (error) {
      console.error('Connection retry failed:', error);
    } finally {
      setConnectionRetrying(false);
    }
  };

  // Calculate connection stats for header
  const onlineLamps = lamps?.filter(lamp => lamp?.status === 'online')?.length;
  const totalLamps = lamps?.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderStatusBar
        connectionStatus="online"
        lampCount={totalLamps}
        activeLamps={onlineLamps}
        currentUser={currentUser}
      />
      {/* Main Content */}
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="max-w-2xl mx-auto">
          {/* Lamp Header */}
          <LampHeader
            lamp={currentLamp}
            onUpdateLamp={handleUpdateLamp}
            onNext={handleNext}
            onPrevious={handlePrevious}
            hasNext={currentLampIndex < lamps?.length - 1}
            hasPrevious={currentLampIndex > 0}
          />

          {/* Control Sections */}
          <div className="space-y-1">
            {/* Power Toggle */}
            <PowerToggle
              lamp={currentLamp}
              onTogglePower={handleTogglePower}
              isLoading={isLoading}
            />

            {/* Brightness Control */}
            <BrightnessControl
              lamp={currentLamp}
              onUpdateBrightness={handleUpdateBrightness}
              disabled={!currentLamp?.isOn || currentLamp?.status !== 'online'}
            />

            {/* Color Control */}
            <ColorControl
              lamp={currentLamp}
              onUpdateColor={handleUpdateColor}
              disabled={!currentLamp?.isOn || currentLamp?.status !== 'online'}
            />

            {/* Advanced Controls */}
            <AdvancedControls
              lamp={currentLamp}
              onUpdateLamp={handleUpdateLamp}
              disabled={currentLamp?.status !== 'online'}
            />

            {/* Connection Status */}
            <ConnectionStatus
              lamp={currentLamp}
              onRetryConnection={handleRetryConnection}
            />
          </div>

          {/* Loading Overlay */}
          {(isLoading || connectionRetrying) && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center lg:ml-64">
              <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-foreground">
                    {connectionRetrying ? 'Reconnecting...' : 'Updating lamp...'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Bottom Navigation */}
      <BottomTabNavigation />
    </div>
  );
};

export default LampControlDetail;