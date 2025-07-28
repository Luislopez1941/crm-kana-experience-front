import React from 'react';
import { usePopupStore } from '../../zustand/popupStore';
import PopupSystem from './PopupSystem';

const GlobalPopup: React.FC = () => {
  const { isOpen, message, type, duration, hidePopup } = usePopupStore();

  return (
    <PopupSystem
      isOpen={isOpen}
      message={message}
      type={type}
      duration={duration}
      onClose={hidePopup}
    />
  );
};

export default GlobalPopup; 