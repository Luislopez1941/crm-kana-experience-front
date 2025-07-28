import { create } from 'zustand';
import type { PopupType } from '../components/popups/PopupSystem';

interface PopupState {
  isOpen: boolean;
  message: string;
  type: PopupType;
  duration: number;
}

interface PopupStore extends PopupState {
  // Actions
  showPopup: (message: string, type: PopupType, duration?: number) => void;
  hidePopup: () => void;
  showSuccess: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
}

const initialState: PopupState = {
  isOpen: false,
  message: '',
  type: 'success',
  duration: 3000
};

export const usePopupStore = create<PopupStore>((set) => ({
  ...initialState,

  showPopup: (message: string, type: PopupType, duration = 3000) => {
    set({
      isOpen: true,
      message,
      type,
      duration
    });
  },

  hidePopup: () => {
    set({
      isOpen: false,
      message: '',
      type: 'success',
      duration: 3000
    });
  },

  showSuccess: (message: string, duration = 3000) => {
    set({
      isOpen: true,
      message,
      type: 'success',
      duration
    });
  },

  showWarning: (message: string, duration = 3000) => {
    set({
      isOpen: true,
      message,
      type: 'warning',
      duration
    });
  },

  showError: (message: string, duration = 3000) => {
    set({
      isOpen: true,
      message,
      type: 'error',
      duration
    });
  }
})); 