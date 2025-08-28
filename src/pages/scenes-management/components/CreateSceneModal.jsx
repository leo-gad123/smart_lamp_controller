import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateSceneModal = ({ 
  isOpen = false, 
  onClose, 
  onSave,
  editScene = null,
  availableLamps = []
}) => {
  const [sceneData, setSceneData] = useState({
    name: '',
    type: 'custom',
    selectedLamps: [],
    lampSettings: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic Info, 2: Lamp Selection, 3: Settings

  useEffect(() => {
    if (editScene) {
      setSceneData({
        name: editScene?.name,
        type: editScene?.type,
        selectedLamps: editScene?.lamps?.map(lamp => lamp?.id) || [],
        lampSettings: editScene?.lampSettings || {}
      });
    } else {
      setSceneData({
        name: '',
        type: 'custom',
        selectedLamps: [],
        lampSettings: {}
      });
    }
    setCurrentStep(1);
  }, [editScene, isOpen]);

  const handleClose = () => {
    if (onClose) onClose();
    setCurrentStep(1);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const sceneToSave = {
        id: editScene?.id || Date.now()?.toString(),
        name: sceneData?.name,
        type: sceneData?.type,
        lamps: availableLamps?.filter(lamp => sceneData?.selectedLamps?.includes(lamp?.id)),
        lampSettings: sceneData?.lampSettings,
        colors: sceneData?.selectedLamps?.map(lampId => 
          sceneData?.lampSettings?.[lampId]?.color || '#FFFFFF'
        ),
        lampCount: sceneData?.selectedLamps?.length,
        isDefault: false,
        createdAt: editScene?.createdAt || new Date()?.toLocaleDateString(),
        lastUsed: null
      };

      if (onSave) {
        await onSave(sceneToSave);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving scene:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLampToggle = (lampId) => {
    setSceneData(prev => {
      const isSelected = prev?.selectedLamps?.includes(lampId);
      const newSelectedLamps = isSelected
        ? prev?.selectedLamps?.filter(id => id !== lampId)
        : [...prev?.selectedLamps, lampId];

      // Initialize lamp settings for newly selected lamps
      const newLampSettings = { ...prev?.lampSettings };
      if (!isSelected) {
        const lamp = availableLamps?.find(l => l?.id === lampId);
        newLampSettings[lampId] = {
          brightness: lamp?.brightness || 50,
          color: lamp?.color || '#FFFFFF',
          temperature: lamp?.temperature || 3000,
          isOn: true
        };
      } else {
        delete newLampSettings?.[lampId];
      }

      return {
        ...prev,
        selectedLamps: newSelectedLamps,
        lampSettings: newLampSettings
      };
    });
  };

  const handleLampSettingChange = (lampId, setting, value) => {
    setSceneData(prev => ({
      ...prev,
      lampSettings: {
        ...prev?.lampSettings,
        [lampId]: {
          ...prev?.lampSettings?.[lampId],
          [setting]: value
        }
      }
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return sceneData?.name?.trim()?.length > 0;
      case 2:
        return sceneData?.selectedLamps?.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="modal-content w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e?.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-cool rounded-lg flex items-center justify-center">
                <Icon name="Palette" size={20} color="white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {editScene ? 'Edit Scene' : 'Create New Scene'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of 3
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              {[1, 2, 3]?.map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Basic Info</span>
              <span>Select Lamps</span>
              <span>Configure</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Input
                  label="Scene Name"
                  type="text"
                  value={sceneData?.name}
                  onChange={(e) => setSceneData(prev => ({ ...prev, name: e?.target?.value }))}
                  placeholder="Enter scene name"
                  required
                />

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Scene Type</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { type: 'movie', label: 'Movie Night', icon: 'Film' },
                      { type: 'dinner', label: 'Dinner', icon: 'Utensils' },
                      { type: 'reading', label: 'Reading', icon: 'BookOpen' },
                      { type: 'sleep', label: 'Sleep', icon: 'Moon' },
                      { type: 'party', label: 'Party', icon: 'Music' },
                      { type: 'work', label: 'Work', icon: 'Briefcase' },
                      { type: 'relax', label: 'Relax', icon: 'Coffee' },
                      { type: 'custom', label: 'Custom', icon: 'Settings' }
                    ]?.map((option) => (
                      <button
                        key={option?.type}
                        onClick={() => setSceneData(prev => ({ ...prev, type: option?.type }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          sceneData?.type === option?.type
                            ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon name={option?.icon} size={20} className="mx-auto mb-2" />
                        <p className="text-xs font-medium">{option?.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Lamp Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Select Lamps</h3>
                  <p className="text-sm text-muted-foreground">
                    {sceneData?.selectedLamps?.length} selected
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {availableLamps?.map((lamp) => {
                    const isSelected = sceneData?.selectedLamps?.includes(lamp?.id);
                    return (
                      <button
                        key={lamp?.id}
                        onClick={() => handleLampToggle(lamp?.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          lamp?.isOn ? 'bg-gradient-warm' : 'bg-muted'
                        }`}>
                          <Icon name="Lightbulb" size={16} color={lamp?.isOn ? 'white' : 'currentColor'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{lamp?.name}</p>
                          <p className="text-sm text-muted-foreground">{lamp?.room}</p>
                        </div>
                        {isSelected && (
                          <Icon name="Check" size={16} className="text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Configure Settings */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Configure Lamp Settings</h3>
                
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {sceneData?.selectedLamps?.map((lampId) => {
                    const lamp = availableLamps?.find(l => l?.id === lampId);
                    const settings = sceneData?.lampSettings?.[lampId] || {};
                    
                    return (
                      <div key={lampId} className="p-4 bg-muted rounded-lg space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
                            <Icon name="Lightbulb" size={14} color="white" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{lamp?.name}</p>
                            <p className="text-xs text-muted-foreground">{lamp?.room}</p>
                          </div>
                        </div>
                        {/* Brightness */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-xs font-medium">Brightness</label>
                            <span className="text-xs font-mono">{settings?.brightness || 50}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings?.brightness || 50}
                            onChange={(e) => handleLampSettingChange(lampId, 'brightness', parseInt(e?.target?.value))}
                            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        {/* Color */}
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-medium">Color</label>
                          <input
                            type="color"
                            value={settings?.color || '#FFFFFF'}
                            onChange={(e) => handleLampSettingChange(lampId, 'color', e?.target?.value)}
                            className="w-8 h-8 rounded border border-border cursor-pointer"
                          />
                          <span className="text-xs font-mono text-muted-foreground">
                            {settings?.color || '#FFFFFF'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? handleClose : () => setCurrentStep(currentStep - 1)}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            <div className="flex gap-2">
              {currentStep < 3 ? (
                <Button
                  variant="default"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleSave}
                  loading={isLoading}
                  disabled={!canProceed()}
                >
                  {editScene ? 'Update Scene' : 'Create Scene'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CreateSceneModal;