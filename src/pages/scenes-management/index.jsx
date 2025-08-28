import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderStatusBar from '../../components/ui/HeaderStatusBar';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import SceneCard from './components/SceneCard';
import CreateSceneModal from './components/CreateSceneModal';
import SceneActionMenu from './components/SceneActionMenu';
import SceneFilters from './components/SceneFilters';
import ActiveSceneIndicator from './components/ActiveSceneIndicator';
import DeleteSceneModal from './components/DeleteSceneModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ScenesManagement = () => {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState([]);
  const [filteredScenes, setFilteredScenes] = useState([]);
  const [activeScene, setActiveScene] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const [deletingScene, setDeletingScene] = useState(null);
  const [selectedSceneMenu, setSelectedSceneMenu] = useState(null);
  const [connectionStatus] = useState('online');
  const [currentUser] = useState({ name: 'John Doe', email: 'john@example.com' });

  // Mock lamp data
  const [availableLamps] = useState([
    {
      id: 'lamp-1',
      name: 'Living Room Main',
      room: 'Living Room',
      isOn: true,
      brightness: 75,
      color: '#FFE4B5',
      temperature: 3000,
      status: 'online'
    },
    {
      id: 'lamp-2',
      name: 'Kitchen Counter',
      room: 'Kitchen',
      isOn: false,
      brightness: 60,
      color: '#FFFFFF',
      temperature: 4000,
      status: 'online'
    },
    {
      id: 'lamp-3',
      name: 'Bedroom Bedside',
      room: 'Bedroom',
      isOn: true,
      brightness: 30,
      color: '#FFB6C1',
      temperature: 2700,
      status: 'online'
    },
    {
      id: 'lamp-4',
      name: 'Study Desk',
      room: 'Study',
      isOn: true,
      brightness: 90,
      color: '#87CEEB',
      temperature: 5000,
      status: 'online'
    },
    {
      id: 'lamp-5',
      name: 'Dining Room',
      room: 'Dining Room',
      isOn: false,
      brightness: 50,
      color: '#DDA0DD',
      temperature: 3500,
      status: 'offline'
    }
  ]);

  // Initialize mock scenes
  useEffect(() => {
    const mockScenes = [
      {
        id: 'scene-1',
        name: 'Movie Night',
        type: 'movie',
        lamps: [availableLamps?.[0], availableLamps?.[2]],
        lampSettings: {
          'lamp-1': { brightness: 20, color: '#FF6B35', temperature: 2700, isOn: true },
          'lamp-3': { brightness: 15, color: '#FF6B35', temperature: 2700, isOn: true }
        },
        colors: ['#FF6B35', '#FF6B35'],
        lampCount: 2,
        isDefault: true,
        createdAt: '12/15/2024',
        lastUsed: '2 hours ago'
      },
      {
        id: 'scene-2',
        name: 'Dinner Party',
        type: 'dinner',
        lamps: [availableLamps?.[0], availableLamps?.[4]],
        lampSettings: {
          'lamp-1': { brightness: 70, color: '#FFE4B5', temperature: 3000, isOn: true },
          'lamp-5': { brightness: 65, color: '#FFE4B5', temperature: 3000, isOn: true }
        },
        colors: ['#FFE4B5', '#FFE4B5'],
        lampCount: 2,
        isDefault: true,
        createdAt: '12/10/2024',
        lastUsed: 'Yesterday'
      },
      {
        id: 'scene-3',
        name: 'Reading Time',
        type: 'reading',
        lamps: [availableLamps?.[2], availableLamps?.[3]],
        lampSettings: {
          'lamp-3': { brightness: 80, color: '#FFFFFF', temperature: 4500, isOn: true },
          'lamp-4': { brightness: 90, color: '#FFFFFF', temperature: 5000, isOn: true }
        },
        colors: ['#FFFFFF', '#FFFFFF'],
        lampCount: 2,
        isDefault: true,
        createdAt: '12/08/2024',
        lastUsed: '3 days ago'
      },
      {
        id: 'scene-4',
        name: 'Good Night',
        type: 'sleep',
        lamps: [availableLamps?.[2]],
        lampSettings: {
          'lamp-3': { brightness: 10, color: '#FF69B4', temperature: 2200, isOn: true }
        },
        colors: ['#FF69B4'],
        lampCount: 1,
        isDefault: true,
        createdAt: '12/05/2024',
        lastUsed: 'Last week'
      },
      {
        id: 'scene-5',
        name: 'Work Focus',
        type: 'work',
        lamps: [availableLamps?.[3], availableLamps?.[1]],
        lampSettings: {
          'lamp-4': { brightness: 95, color: '#FFFFFF', temperature: 5500, isOn: true },
          'lamp-2': { brightness: 80, color: '#FFFFFF', temperature: 5000, isOn: true }
        },
        colors: ['#FFFFFF', '#FFFFFF'],
        lampCount: 2,
        isDefault: false,
        createdAt: '12/20/2024',
        lastUsed: null
      }
    ];

    setScenes(mockScenes);
    setFilteredScenes(mockScenes);
    setActiveScene(mockScenes?.[0]); // Set Movie Night as active
  }, [availableLamps]);

  // Filter scenes based on search and filter
  useEffect(() => {
    let filtered = scenes;

    // Apply search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(scene =>
        scene?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        scene?.type?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'default':
        filtered = filtered?.filter(scene => scene?.isDefault);
        break;
      case 'custom':
        filtered = filtered?.filter(scene => !scene?.isDefault);
        break;
      case 'recent':
        filtered = filtered?.filter(scene => scene?.lastUsed);
        break;
      case 'favorites':
        // Mock favorites filter
        filtered = filtered?.filter(scene => scene?.isFavorite);
        break;
      default:
        break;
    }

    setFilteredScenes(filtered);
  }, [scenes, searchQuery, selectedFilter]);

  const handleSceneActivate = (scene) => {
    if (activeScene?.id === scene?.id) {
      // Deactivate current scene
      setActiveScene(null);
    } else {
      // Activate new scene
      setActiveScene({
        ...scene,
        activatedAt: 'just now'
      });
    }
  };

  const handleSceneEdit = (scene) => {
    setEditingScene(scene);
    setIsCreateModalOpen(true);
    setSelectedSceneMenu(null);
  };

  const handleSceneDelete = (scene) => {
    setDeletingScene(scene);
    setIsDeleteModalOpen(true);
    setSelectedSceneMenu(null);
  };

  const handleSceneDuplicate = (scene) => {
    const duplicatedScene = {
      ...scene,
      id: `scene-${Date.now()}`,
      name: `${scene?.name} Copy`,
      isDefault: false,
      createdAt: new Date()?.toLocaleDateString(),
      lastUsed: null
    };
    setScenes(prev => [...prev, duplicatedScene]);
  };

  const handleSceneSchedule = (scene) => {
    navigate('/scheduling', { state: { selectedScene: scene } });
  };

  const handleSceneSave = (sceneData) => {
    if (editingScene) {
      // Update existing scene
      setScenes(prev => prev?.map(scene => 
        scene?.id === editingScene?.id ? sceneData : scene
      ));
    } else {
      // Add new scene
      setScenes(prev => [...prev, sceneData]);
    }
    setEditingScene(null);
  };

  const handleSceneDeleteConfirm = (scene) => {
    setScenes(prev => prev?.filter(s => s?.id !== scene?.id));
    if (activeScene?.id === scene?.id) {
      setActiveScene(null);
    }
  };

  const handleLongPress = (scene) => {
    setSelectedSceneMenu(selectedSceneMenu === scene?.id ? null : scene?.id);
  };

  const activeLamps = availableLamps?.filter(lamp => lamp?.status === 'online')?.length;

  return (
    <div className="min-h-screen bg-background">
      <HeaderStatusBar
        connectionStatus={connectionStatus}
        lampCount={availableLamps?.length}
        activeLamps={activeLamps}
        currentUser={currentUser}
      />
      <div className="lg:ml-64">
        <main className="container mx-auto px-4 py-6 pb-24 lg:pb-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Scenes</h1>
              <p className="text-muted-foreground">
                Manage your lighting presets and moods
              </p>
            </div>
            <Button
              variant="default"
              onClick={() => setIsCreateModalOpen(true)}
              iconName="Plus"
              iconPosition="left"
              className="hidden lg:flex"
            >
              Create Scene
            </Button>
          </div>

          {/* Active Scene Indicator */}
          {activeScene && (
            <ActiveSceneIndicator
              activeScene={activeScene}
              onDeactivate={() => setActiveScene(null)}
              className="mb-6"
            />
          )}

          {/* Filters */}
          <SceneFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            sceneCount={filteredScenes?.length}
          />

          {/* Scenes Grid */}
          <div className="mt-6">
            {filteredScenes?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScenes?.map((scene) => (
                  <div key={scene?.id} className="relative">
                    <SceneCard
                      scene={scene}
                      isActive={activeScene?.id === scene?.id}
                      onActivate={handleSceneActivate}
                      onEdit={handleSceneEdit}
                      onDelete={handleSceneDelete}
                      onLongPress={handleLongPress}
                    />
                    
                    {/* Mobile Action Menu */}
                    <SceneActionMenu
                      scene={scene}
                      isVisible={selectedSceneMenu === scene?.id}
                      onEdit={handleSceneEdit}
                      onDelete={handleSceneDelete}
                      onDuplicate={handleSceneDuplicate}
                      onSchedule={handleSceneSchedule}
                      onClose={() => setSelectedSceneMenu(null)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Search" size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No scenes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedFilter !== 'all' ?'Try adjusting your search or filter criteria' :'Create your first scene to get started'
                  }
                </p>
                {(!searchQuery && selectedFilter === 'all') && (
                  <Button
                    variant="default"
                    onClick={() => setIsCreateModalOpen(true)}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Create Your First Scene
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Create Button */}
          <div className="lg:hidden fixed bottom-24 right-4 z-40">
            <Button
              variant="default"
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
              iconName="Plus"
              className="w-14 h-14 rounded-full shadow-lg"
            />
          </div>
        </main>
      </div>
      <BottomTabNavigation />
      {/* Modals */}
      <CreateSceneModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingScene(null);
        }}
        onSave={handleSceneSave}
        editScene={editingScene}
        availableLamps={availableLamps}
      />
      <DeleteSceneModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingScene(null);
        }}
        onConfirm={handleSceneDeleteConfirm}
        scene={deletingScene}
      />
    </div>
  );
};

export default ScenesManagement;