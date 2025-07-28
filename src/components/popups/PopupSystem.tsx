import React, { useEffect, useState } from 'react';
import './styles/PopupSystem.css';

export type PopupType = 'success' | 'warning' | 'error';

interface PopupSystemProps {
  isOpen: boolean;
  message: string;
  type: PopupType;
  onClose: () => void;
  duration?: number;
}

const PopupSystem: React.FC<PopupSystemProps> = ({ 
  isOpen, 
  message, 
  type, 
  onClose, 
  duration = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return '¡Éxito!';
      case 'warning':
        return 'Advertencia';
      case 'error':
        return 'Error';
      default:
        return 'Información';
    }
  };

  return (
    <div className={`popup-system-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`popup-system ${isVisible ? 'visible' : ''} ${type}`}>
        <div className="popup-icon">
          <span className="material-icons">{getIcon()}</span>
        </div>
        <div className="popup-content">
          <h3 className="popup-title">{getTitle()}</h3>
          <p className="popup-message">{message}</p>
        </div>
        <button className="popup-close-btn" onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}>
          <span className="material-icons">close</span>
        </button>
        
        {/* Progress bar */}
        <div className="popup-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default PopupSystem; 