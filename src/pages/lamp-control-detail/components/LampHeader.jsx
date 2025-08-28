import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LampHeader = ({ 
  lamp, 
  onUpdateLamp, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(lamp?.name || '');
  const navigate = useNavigate();

  const handleSaveName = () => {
    if (editName?.trim() && onUpdateLamp) {
      onUpdateLamp({ ...lamp, name: editName?.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(lamp?.name || '');
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="touch-target"
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>
        
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          lamp?.isOn ? 'bg-gradient-warm' : 'bg-muted'
        }`}>
          <Icon 
            name="Lightbulb" 
            size={24} 
            color={lamp?.isOn ? 'white' : 'currentColor'} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e?.target?.value)}
                placeholder="Enter lamp name"
                className="text-lg font-semibold"
                onKeyDown={(e) => {
                  if (e?.key === 'Enter') handleSaveName();
                  if (e?.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveName}
                className="touch-target"
              >
                <Icon name="Check" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelEdit}
                className="touch-target"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-lg lg:text-xl font-semibold text-foreground truncate">
                  {lamp?.name || 'Smart Lamp'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {lamp?.room || 'Living Room'} • {lamp?.isOn ? 'On' : 'Off'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="touch-target"
              >
                <Icon name="Edit2" size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {hasPrevious && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="touch-target"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
        )}
        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="touch-target"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LampHeader;