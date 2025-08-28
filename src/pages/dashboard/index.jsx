import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderStatusBar from '../../components/ui/HeaderStatusBar';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import LampControlModal from '../../components/ui/LampControlModal';
import DashboardStats from './components/DashboardStats';
import QuickActions from './components/QuickActions';
import LampGrid from './components/LampGrid';

const Dashboard = () => {
  const navigate = useNavigate();
  const [lamps, setLamps] = useState([]);
  const [selectedLamp, setSelectedLamp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [currentUser] = useState({
    name: "John Smith",
    email: "john.smith@example.com"
  });

  // Mock lamp data
  const mockLamps = [
    {
      id: "lamp_001",
      name: "Living Room Main",
      room: "Living Room",
      isOn: true,
      brightness: 75,
      color: "#FFE4B5",
      temperature: 3000,
      connectionStatus: "online",
      lastUpdate: new Date()
    },
    {
      id: "lamp_002", 
      name: "Kitchen Counter",
      room: "Kitchen",
      isOn: false,
      brightness: 50,
      color: "#FFFFFF",
      temperature: 4000,
      connectionStatus: "online",
      lastUpdate: new Date()
    },
    {
      id: "lamp_003",
      name: "Bedroom Nightstand",
      room: "Bedroom",
      isOn: true,
      brightness: 30,
      color: "#FFA07A",
      temperature: 2700,
      connectionStatus: "online",
      lastUpdate: new Date()
    },
    {
      id: "lamp_004",
      name: "Study Desk",
      room: "Study",
      isOn: true,
      brightness: 90,
      color: "#87CEEB",
      temperature: 5000,
      connectionStatus: "online",
      lastUpdate: new Date()
    },
    {
      id: "lamp_005",
      name: "Hallway Accent",
      room: "Hallway",
      isOn: false,
      brightness: 40,
      color: "#DDA0DD",
      temperature: 3500,
      connectionStatus: "offline",
      lastUpdate: new Date(Date.now() - 300000)
    },
    {
      id: "lamp_006",
      name: "Dining Room",
      room: "Dining Room",
      isOn: true,
      brightness: 65,
      color: "#F0E68C",
      temperature: 3200,
      connectionStatus: "online",
      lastUpdate: new Date()
    }
  ];

  // Initialize lamps data
  useEffect(() => {
    const initializeLamps = async () => {
      setIsLoading(true);
      try {
        // Simulate Firebase loading delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLamps(mockLamps);
        setConnectionStatus('online');
      } catch (error) {
        console.error('Error loading lamps:', error);
        setConnectionStatus('offline');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLamps();
  }, []);

  // Calculate stats
  const totalLamps = lamps?.length;
  const activeLamps = lamps?.filter(lamp => lamp?.isOn && lamp?.connectionStatus === 'online')?.length;
  const onlineLamps = lamps?.filter(lamp => lamp?.connectionStatus === 'online')?.length;

  // Handle lamp toggle
  const handleLampToggle = useCallback(async (lampId, newState) => {
    try {
      setLamps(prevLamps => 
        prevLamps?.map(lamp => 
          lamp?.id === lampId 
            ? { ...lamp, isOn: newState, lastUpdate: new Date() }
            : lamp
        )
      );
      
      // Simulate Firebase update delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error toggling lamp:', error);
      // Revert optimistic update on error
      setLamps(prevLamps => 
        prevLamps?.map(lamp => 
          lamp?.id === lampId 
            ? { ...lamp, isOn: !newState }
            : lamp
        )
      );
    }
  }, []);

  // Handle brightness change
  const handleBrightnessChange = useCallback(async (lampId, brightness) => {
    try {
      setLamps(prevLamps => 
        prevLamps?.map(lamp => 
          lamp?.id === lampId 
            ? { ...lamp, brightness, lastUpdate: new Date() }
            : lamp
        )
      );
      
      // Simulate Firebase update delay
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error changing brightness:', error);
    }
  }, []);

  // Handle lamp card click
  const handleLampClick = useCallback((lamp) => {
    setSelectedLamp(lamp);
    setIsModalOpen(true);
  }, []);

  // Handle modal save
  const handleModalSave = useCallback(async (updatedLamp) => {
    try {
      setLamps(prevLamps => 
        prevLamps?.map(lamp => 
          lamp?.id === updatedLamp?.id 
            ? { ...updatedLamp, lastUpdate: new Date() }
            : lamp
        )
      );
      
      // Simulate Firebase update delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error saving lamp:', error);
      throw error;
    }
  }, []);

  // Handle all lamps on
  const handleAllOn = useCallback(async () => {
    try {
      setLamps(prevLamps => 
        prevLamps?.map(lamp => 
          lamp?.connectionStatus === 'online'
            ? { ...lamp, isOn: true, lastUpdate: new Date() }
            : lamp
        )
      );
      
      // Simulate Firebase batch update delay
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.error('Error turning all lamps on:', error);
    }
  }, []);

  // Handle all lamps off
  const handleAllOff = useCallback(async () => {
    try {
      setLamps(prevLamps => 
        prevLamps?.map(lamp => 
          lamp?.connectionStatus === 'online'
            ? { ...lamp, isOn: false, lastUpdate: new Date() }
            : lamp
        )
      );
      
      // Simulate Firebase batch update delay
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.error('Error turning all lamps off:', error);
    }
  }, []);

  // Handle scene selection
  const handleSceneSelect = useCallback(async (sceneId) => {
    if (sceneId === 'manage') {
      navigate('/scenes-management');
      return;
    }

    try {
      const sceneConfigs = {
        bright: { brightness: 100, color: '#FFFFFF', temperature: 5000 },
        cozy: { brightness: 40, color: '#FFA07A', temperature: 2700 },
        focus: { brightness: 85, color: '#87CEEB', temperature: 4500 },
        relax: { brightness: 25, color: '#DDA0DD', temperature: 2200 }
      };

      const config = sceneConfigs?.[sceneId];
      if (!config) return;

      setLamps(prevLamps => 
        prevLamps?.map(lamp => 
          lamp?.connectionStatus === 'online'
            ? { 
                ...lamp, 
                isOn: true, 
                brightness: config?.brightness,
                color: config?.color,
                temperature: config?.temperature,
                lastUpdate: new Date() 
              }
            : lamp
        )
      );
      
      // Simulate Firebase batch update delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error applying scene:', error);
    }
  }, [navigate]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      // Simulate Firebase refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update connection statuses randomly for demo
      setLamps(prevLamps => 
        prevLamps?.map(lamp => ({
          ...lamp,
          connectionStatus: Math.random() > 0.1 ? 'online' : 'offline',
          lastUpdate: new Date()
        }))
      );
    } catch (error) {
      console.error('Error refreshing lamps:', error);
    }
  }, []);

  // Handle modal navigation
  const handleModalNext = useCallback(() => {
    const currentIndex = lamps?.findIndex(lamp => lamp?.id === selectedLamp?.id);
    const nextIndex = (currentIndex + 1) % lamps?.length;
    setSelectedLamp(lamps?.[nextIndex]);
  }, [lamps, selectedLamp]);

  const handleModalPrevious = useCallback(() => {
    const currentIndex = lamps?.findIndex(lamp => lamp?.id === selectedLamp?.id);
    const prevIndex = currentIndex === 0 ? lamps?.length - 1 : currentIndex - 1;
    setSelectedLamp(lamps?.[prevIndex]);
  }, [lamps, selectedLamp]);

  const hasNext = selectedLamp && lamps?.findIndex(lamp => lamp?.id === selectedLamp?.id) < lamps?.length - 1;
  const hasPrevious = selectedLamp && lamps?.findIndex(lamp => lamp?.id === selectedLamp?.id) > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderStatusBar
        connectionStatus={connectionStatus}
        lampCount={totalLamps}
        activeLamps={onlineLamps}
        currentUser={currentUser}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            {/* Dashboard Stats */}
            <DashboardStats
              totalLamps={totalLamps}
              activeLamps={activeLamps}
              connectionStatus={connectionStatus}
            />

            {/* Quick Actions */}
            <QuickActions
              onAllOn={handleAllOn}
              onAllOff={handleAllOff}
              onSceneSelect={handleSceneSelect}
              totalLamps={totalLamps}
              activeLamps={activeLamps}
            />

            {/* Lamp Grid */}
            <LampGrid
              lamps={lamps}
              onLampToggle={handleLampToggle}
              onLampClick={handleLampClick}
              onBrightnessChange={handleBrightnessChange}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Navigation */}
      <BottomTabNavigation />

      {/* Lamp Control Modal */}
      <LampControlModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lamp={selectedLamp}
        onSave={handleModalSave}
        onNext={handleModalNext}
        onPrevious={handleModalPrevious}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />
    </div>
  );
};

export default Dashboard;