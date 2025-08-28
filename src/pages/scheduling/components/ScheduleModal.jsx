import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ScheduleModal = ({ 
  isOpen = false, 
  onClose, 
  onSave,
  schedule = null,
  availableLamps = [],
  availableScenes = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    time: '20:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    lamps: [],
    action: {
      type: 'turn_on',
      brightness: 80,
      color: '#FFFFFF',
      sceneName: ''
    },
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dayOptions = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  useEffect(() => {
    if (schedule) {
      setFormData({
        name: schedule?.name || '',
        time: schedule?.time || '20:00',
        days: schedule?.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        lamps: schedule?.lamps || [],
        action: schedule?.action || {
          type: 'turn_on',
          brightness: 80,
          color: '#FFFFFF',
          sceneName: ''
        },
        isActive: schedule?.isActive !== undefined ? schedule?.isActive : true
      });
    } else {
      setFormData({
        name: '',
        time: '20:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        lamps: [],
        action: {
          type: 'turn_on',
          brightness: 80,
          color: '#FFFFFF',
          sceneName: ''
        },
        isActive: true
      });
    }
    setErrors({});
  }, [schedule, isOpen]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Schedule name is required';
    }
    
    if (formData?.days?.length === 0) {
      newErrors.days = 'At least one day must be selected';
    }
    
    if (formData?.lamps?.length === 0) {
      newErrors.lamps = 'At least one lamp must be selected';
    }
    
    if (formData?.action?.type === 'scene' && !formData?.action?.sceneName) {
      newErrors.scene = 'Scene selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const scheduleData = {
        ...formData,
        id: schedule?.id || `schedule_${Date.now()}`,
        createdAt: schedule?.createdAt || new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };
      
      await onSave(scheduleData);
      handleClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
      setErrors({ submit: 'Failed to save schedule. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      days: prev?.days?.includes(day)
        ? prev?.days?.filter(d => d !== day)
        : [...prev?.days, day]
    }));
  };

  const handleLampToggle = (lampId) => {
    setFormData(prev => ({
      ...prev,
      lamps: prev?.lamps?.includes(lampId)
        ? prev?.lamps?.filter(id => id !== lampId)
        : [...prev?.lamps, lampId]
    }));
  };

  const handleQuickDaySelection = (type) => {
    switch (type) {
      case 'all':
        setFormData(prev => ({ ...prev, days: dayOptions?.map(d => d?.key) }));
        break;
      case 'weekdays':
        setFormData(prev => ({ ...prev, days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }));
        break;
      case 'weekends':
        setFormData(prev => ({ ...prev, days: ['saturday', 'sunday'] }));
        break;
      case 'none':
        setFormData(prev => ({ ...prev, days: [] }));
        break;
    }
  };

  const handleSelectAllLamps = () => {
    const allSelected = formData?.lamps?.length === availableLamps?.length;
    setFormData(prev => ({
      ...prev,
      lamps: allSelected ? [] : availableLamps?.map(lamp => lamp?.id)
    }));
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
                <Icon name="Clock" size={20} color="white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {schedule ? 'Edit Schedule' : 'Create Schedule'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Automate your lamp control with time-based rules
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              iconName="X"
              iconSize={20}
            />
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Schedule Name */}
            <Input
              label="Schedule Name"
              type="text"
              value={formData?.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
              placeholder="e.g., Evening Lights, Morning Routine"
              error={errors?.name}
              required
            />

            {/* Time Selection */}
            <Input
              label="Time"
              type="time"
              value={formData?.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e?.target?.value }))}
              description="When should this schedule activate?"
            />

            {/* Days Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Days of Week {errors?.days && <span className="text-error">*</span>}
                </label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleQuickDaySelection('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleQuickDaySelection('weekdays')}
                  >
                    Weekdays
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleQuickDaySelection('weekends')}
                  >
                    Weekends
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleQuickDaySelection('none')}
                  >
                    None
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {dayOptions?.map((day) => (
                  <button
                    key={day?.key}
                    onClick={() => handleDayToggle(day?.key)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 touch-target ${
                      formData?.days?.includes(day?.key)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {day?.label}
                  </button>
                ))}
              </div>
              {errors?.days && (
                <p className="text-sm text-error">{errors?.days}</p>
              )}
            </div>

            {/* Lamp Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Select Lamps {errors?.lamps && <span className="text-error">*</span>}
                </label>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleSelectAllLamps}
                >
                  {formData?.lamps?.length === availableLamps?.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableLamps?.map((lamp) => (
                  <div
                    key={lamp?.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      formData?.lamps?.includes(lamp?.id)
                        ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => handleLampToggle(lamp?.id)}
                  >
                    <Checkbox
                      checked={formData?.lamps?.includes(lamp?.id)}
                      onChange={() => handleLampToggle(lamp?.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {lamp?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lamp?.room}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      lamp?.isOnline ? 'bg-success' : 'bg-error'
                    }`}></div>
                  </div>
                ))}
              </div>
              {errors?.lamps && (
                <p className="text-sm text-error">{errors?.lamps}</p>
              )}
            </div>

            {/* Action Configuration */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">Action</label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    action: { ...prev?.action, type: 'turn_on' }
                  }))}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData?.action?.type === 'turn_on' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Turn On
                </button>
                <button
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    action: { ...prev?.action, type: 'turn_off' }
                  }))}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData?.action?.type === 'turn_off' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Turn Off
                </button>
                <button
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    action: { ...prev?.action, type: 'scene' }
                  }))}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData?.action?.type === 'scene' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Scene
                </button>
              </div>

              {/* Turn On Options */}
              {formData?.action?.type === 'turn_on' && (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Brightness</label>
                      <span className="text-sm font-mono text-muted-foreground">
                        {formData?.action?.brightness}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={formData?.action?.brightness}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        action: { ...prev?.action, brightness: parseInt(e?.target?.value) }
                      }))}
                      className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData?.action?.color}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          action: { ...prev?.action, color: e?.target?.value }
                        }))}
                        className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                      />
                      <span className="text-sm font-mono text-muted-foreground">
                        {formData?.action?.color}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Scene Selection */}
              {formData?.action?.type === 'scene' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Select Scene {errors?.scene && <span className="text-error">*</span>}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableScenes?.map((scene) => (
                      <button
                        key={scene?.id}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          action: { ...prev?.action, sceneName: scene?.name }
                        }))}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200 ${
                          formData?.action?.sceneName === scene?.name
                            ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-cool flex items-center justify-center">
                          <Icon name="Palette" size={16} color="white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{scene?.name}</p>
                          <p className="text-xs text-muted-foreground">{scene?.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors?.scene && (
                    <p className="text-sm text-error">{errors?.scene}</p>
                  )}
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Active</p>
                <p className="text-xs text-muted-foreground">
                  Enable this schedule to run automatically
                </p>
              </div>
              <button
                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev?.isActive }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  formData?.isActive ? 'bg-primary' : 'bg-muted-foreground'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    formData?.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {errors?.submit && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error">{errors?.submit}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isLoading}
              className="flex-1"
            >
              {schedule ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ScheduleModal;