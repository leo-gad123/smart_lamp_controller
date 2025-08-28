import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';

const SceneActionMenu = ({ 
  scene, 
  isVisible = false, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onSchedule,
  onClose 
}) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isVisible && !event?.target?.closest('.scene-action-menu')) {
        if (onClose) onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const handleEdit = () => {
    if (onEdit) onEdit(scene);
    if (onClose) onClose();
  };

  const handleDelete = () => {
    if (onDelete) onDelete(scene);
    if (onClose) onClose();
  };

  const handleDuplicate = () => {
    if (onDuplicate) onDuplicate(scene);
    if (onClose) onClose();
  };

  const handleSchedule = () => {
    if (onSchedule) onSchedule(scene);
    if (onClose) onClose();
  };

  return (
    <div className="scene-action-menu absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-150">
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="w-full justify-start"
          iconName="Edit2"
          iconPosition="left"
        >
          Edit Scene
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDuplicate}
          className="w-full justify-start"
          iconName="Copy"
          iconPosition="left"
        >
          Duplicate
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSchedule}
          className="w-full justify-start"
          iconName="Clock"
          iconPosition="left"
        >
          Schedule
        </Button>
        
        <div className="border-t border-border my-2"></div>
        
        {!scene?.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="w-full justify-start text-error hover:text-error"
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Scene
          </Button>
        )}
      </div>
    </div>
  );
};

export default SceneActionMenu;