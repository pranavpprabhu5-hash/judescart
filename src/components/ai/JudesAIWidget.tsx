'use client';

import React, { useState, useEffect } from 'react';
import { JudesAIFloatingLauncher } from './JudesAIFloatingLauncher';
import { JudesAIChatWindow } from './JudesAIChatWindow';

export function JudesAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!hasOpenedOnce) {
      setHasOpenedOnce(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <JudesAIFloatingLauncher
        isOpen={isOpen}
        onToggle={handleToggle}
        unreadCount={hasOpenedOnce ? 0 : 1}
      />
      <JudesAIChatWindow
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
}
