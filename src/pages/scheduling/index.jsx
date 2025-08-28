import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import HeaderStatusBar from '../../components/ui/HeaderStatusBar';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import ScheduleCard from './components/ScheduleCard';
import ScheduleModal from './components/ScheduleModal';
import ScheduleTimeline from './components/ScheduleTimeline';
import QuickScheduleActions from './components/QuickScheduleActions';

const SchedulingPage = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'timeline'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'

  // Mock data for schedules
  const mockSchedules = [
    {
      id: 'schedule_1',
      name: 'Morning Routine',
      time: '07:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      lamps: ['lamp_1', 'lamp_2'],
      action: {
        type: 'turn_on',
        brightness: 80,
        color: '#FFFFFF'
      },
      isActive: true,
      createdAt: '2025-08-20T10:00:00Z',
      updatedAt: '2025-08-27T15:30:00Z'
    },
    {
      id: 'schedule_2',
      name: 'Evening Ambiance',
      time: '20:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      lamps: ['lamp_3', 'lamp_4', 'lamp_5'],
      action: {
        type: 'turn_on',
        brightness: 60,
        color: '#FFE4B5'
      },
      isActive: true,
      createdAt: '2025-08-21T14:00:00Z',
      updatedAt: '2025-08-26T18:45:00Z'
    },
    {
      id: 'schedule_3',
      name: 'Bedtime',
      time: '23:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      lamps: ['lamp_1', 'lamp_2', 'lamp_3', 'lamp_4', 'lamp_5'],
      action: {
        type: 'turn_off'
      },
      isActive: true,
      createdAt: '2025-08-22T09:00:00Z',
      updatedAt: '2025-08-25T20:15:00Z'
    },
    {
      id: 'schedule_4',
      name: 'Weekend Late Start',
      time: '09:00',
      days: ['saturday', 'sunday'],
      lamps: ['lamp_1', 'lamp_2'],
      action: {
        type: 'turn_on',
        brightness: 40,
        color: '#FFF8DC'
      },
      isActive: false,
      createdAt: '2025-08-23T16:00:00Z',
      updatedAt: '2025-08-24T11:30:00Z'
    },
    {
      id: 'schedule_5',
      name: 'Dinner Scene',
      time: '19:00',
      days: ['friday', 'saturday', 'sunday'],
      lamps: ['lamp_3', 'lamp_4'],
      action: {
        type: 'scene',
        sceneName: 'Romantic Dinner'
      },
      isActive: true,
      createdAt: '2025-08-24T12:00:00Z',
      updatedAt: '2025-08-27T14:20:00Z'
    }
  ];

  // Mock data for available lamps
  const mockLamps = [
    { id: 'lamp_1', name: 'Living Room Main', room: 'Living Room', isOnline: true },
    { id: 'lamp_2', name: 'Living Room Corner', room: 'Living Room', isOnline: true },
    { id: 'lamp_3', name: 'Bedroom Ceiling', room: 'Bedroom', isOnline: true },
    { id: 'lamp_4', name: 'Bedroom Bedside', room: 'Bedroom', isOnline: false },
    { id: 'lamp_5', name: 'Kitchen Counter', room: 'Kitchen', isOnline: true }
  ];

  // Mock data for available scenes
  const mockScenes = [
    { id: 'scene_1', name: 'Romantic Dinner', description: 'Warm, dim lighting' },
    { id: 'scene_2', name: 'Movie Night', description: 'Low ambient lighting' },
    { id: 'scene_3', name: 'Reading Time', description: 'Bright, focused lighting' },
    { id: 'scene_4', name: 'Party Mode', description: 'Colorful, dynamic lighting' }
  ];

  // Mock current user
  const currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  useEffect(() => {
    // Simulate loading schedules
    const loadSchedules = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSchedules(mockSchedules);
      } catch (error) {
        console.error('Error loading schedules:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, []);

  const handleCreateSchedule = (template = null) => {
    setSelectedSchedule(template);
    setIsModalOpen(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        setSchedules(prev => prev?.filter(s => s?.id !== scheduleId));
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const handleToggleSchedule = async (scheduleId, isActive) => {
    try {
      setSchedules(prev => prev?.map(s => 
        s?.id === scheduleId ? { ...s, isActive } : s
      ));
    } catch (error) {
      console.error('Error toggling schedule:', error);
    }
  };

  const handleSaveSchedule = async (scheduleData) => {
    try {
      if (scheduleData?.id && schedules?.find(s => s?.id === scheduleData?.id)) {
        // Update existing schedule
        setSchedules(prev => prev?.map(s => 
          s?.id === scheduleData?.id ? scheduleData : s
        ));
      } else {
        // Create new schedule
        const newSchedule = {
          ...scheduleData,
          id: `schedule_${Date.now()}`,
          createdAt: new Date()?.toISOString(),
          updatedAt: new Date()?.toISOString()
        };
        setSchedules(prev => [...prev, newSchedule]);
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      throw error;
    }
  };

  const handleBulkAction = async (action, scheduleIds) => {
    try {
      switch (action) {
        case 'enable':
          setSchedules(prev => prev?.map(s => 
            scheduleIds?.includes(s?.id) ? { ...s, isActive: true } : s
          ));
          break;
        case 'disable':
          setSchedules(prev => prev?.map(s => 
            scheduleIds?.includes(s?.id) ? { ...s, isActive: false } : s
          ));
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${scheduleIds?.length} schedule(s)?`)) {
            setSchedules(prev => prev?.filter(s => !scheduleIds?.includes(s?.id)));
          }
          break;
      }
      setSelectedSchedules([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleScheduleClick = (schedule) => {
    handleEditSchedule(schedule);
  };

  const handleImportSchedule = () => {
    // Mock import functionality
    console.log('Import schedule functionality would be implemented here');
  };

  const filteredSchedules = schedules?.filter(schedule => {
    const matchesSearch = schedule?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && schedule?.isActive) ||
      (filterStatus === 'inactive' && !schedule?.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const activeSchedules = schedules?.filter(s => s?.isActive)?.length;
  const onlineLamps = mockLamps?.filter(lamp => lamp?.isOnline)?.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderStatusBar 
          connectionStatus="online"
          lampCount={mockLamps?.length}
          activeLamps={onlineLamps}
          currentUser={currentUser}
        />
        <BottomTabNavigation />
        <main className="lg:ml-64 pt-16 pb-20 lg:pb-0">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading schedules...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderStatusBar 
        connectionStatus="online"
        lampCount={mockLamps?.length}
        activeLamps={onlineLamps}
        currentUser={currentUser}
      />
      <BottomTabNavigation />
      <main className="lg:ml-64 pt-16 pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Scheduling</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Automate your lighting with time-based rules and patterns
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'list' ? 'timeline' : 'list')}
                iconName={viewMode === 'list' ? 'Calendar' : 'List'}
                iconPosition="left"
                iconSize={16}
              >
                {viewMode === 'list' ? 'Timeline' : 'List'} View
              </Button>
              <Button
                variant="default"
                onClick={() => handleCreateSchedule()}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Add Schedule
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="control-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-cool rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} color="white" />
                </div>
                <div>
                  <p className="text-lg font-mono font-semibold text-foreground">{schedules?.length}</p>
                  <p className="text-xs text-muted-foreground">Total Schedules</p>
                </div>
              </div>
            </div>
            
            <div className="control-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-warm rounded-lg flex items-center justify-center">
                  <Icon name="Play" size={20} color="white" />
                </div>
                <div>
                  <p className="text-lg font-mono font-semibold text-success">{activeSchedules}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
            
            <div className="control-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name="Pause" size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-mono font-semibold text-muted-foreground">
                    {schedules?.length - activeSchedules}
                  </p>
                  <p className="text-xs text-muted-foreground">Inactive</p>
                </div>
              </div>
            </div>
            
            <div className="control-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-neutral rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-mono font-semibold text-foreground">Today</p>
                  <p className="text-xs text-muted-foreground">8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Filters */}
              <div className="control-card p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Icon 
                      name="Search" 
                      size={16} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                    />
                    <input
                      type="text"
                      placeholder="Search schedules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        filterStatus === 'all' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterStatus('active')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        filterStatus === 'active' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setFilterStatus('inactive')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        filterStatus === 'inactive' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>

              {/* Content based on view mode */}
              {viewMode === 'list' ? (
                <div className="space-y-4">
                  {filteredSchedules?.length > 0 ? (
                    filteredSchedules?.map((schedule) => (
                      <ScheduleCard
                        key={schedule?.id}
                        schedule={schedule}
                        onEdit={handleEditSchedule}
                        onDelete={handleDeleteSchedule}
                        onToggle={handleToggleSchedule}
                      />
                    ))
                  ) : (
                    <div className="control-card p-8 text-center">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon name="Clock" size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Schedules Found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchQuery || filterStatus !== 'all' ?'Try adjusting your search or filter criteria' :'Create your first schedule to automate your lighting'
                        }
                      </p>
                      <Button
                        variant="default"
                        onClick={() => handleCreateSchedule()}
                        iconName="Plus"
                        iconPosition="left"
                        iconSize={16}
                      >
                        Create Schedule
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <ScheduleTimeline
                  schedules={filteredSchedules}
                  selectedDate={selectedDate}
                  onScheduleClick={handleScheduleClick}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <QuickScheduleActions
                onCreateSchedule={handleCreateSchedule}
                onImportSchedule={handleImportSchedule}
                onBulkAction={handleBulkAction}
                selectedSchedules={selectedSchedules}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSchedule(null);
        }}
        onSave={handleSaveSchedule}
        schedule={selectedSchedule}
        availableLamps={mockLamps}
        availableScenes={mockScenes}
      />
    </div>
  );
};

export default SchedulingPage;