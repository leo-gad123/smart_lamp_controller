import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteSceneModal = ({ 
  isOpen = false, 
  onClose, 
  onConfirm,
  scene = null 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (onConfirm) {
        await onConfirm(scene);
      }
      handleClose();
    } catch (error) {
      console.error('Error deleting scene:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !scene) return null;

  const getSceneIcon = () => {
    switch (scene?.type) {
      case 'movie':
        return 'Film';
      case 'dinner':
        return 'Utensils';
      case 'reading':
        return 'BookOpen';
      case 'sleep':
        return 'Moon';
      case 'party':
        return 'Music';
      case 'work':
        return 'Briefcase';
      default:
        return 'Lightbulb';
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="modal-content w-full max-w-md"
          onClick={(e) => e?.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="Trash2" size={20} className="text-error" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Delete Scene</h2>
              <p className="text-sm text-muted-foreground">This action cannot be undone</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg mb-4">
              <div className="w-10 h-10 bg-gradient-cool rounded-lg flex items-center justify-center">
                <Icon name={getSceneIcon()} size={20} color="white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{scene?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {scene?.lampCount} {scene?.lampCount === 1 ? 'lamp' : 'lamps'} • 
                  Created {scene?.createdAt}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Are you sure you want to delete the "{scene?.name}" scene? This will:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Permanently remove the scene configuration</li>
                <li>Cancel any scheduled activations</li>
                <li>Remove it from your scene library</li>
              </ul>
              <p className="text-error font-medium">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              loading={isLoading}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Scene
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeleteSceneModal;