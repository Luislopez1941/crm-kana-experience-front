import { create } from 'zustand';
import { persistLocalStorage, clearLocalStorage } from '../utils/localStorage.utility';

export interface UserRole {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  user: UserInfo;
  status: string;
  message: string;
  expiresIn: string;
}

export const EmptyUserState: UserInfo = {
  id: 0,
  email: '',
  firstName: '',
  lastName: '',
  role: {
    id: 0,
    name: '',
    description: '',
    permissions: [],
    createdAt: '',
    updatedAt: ''
  }
};

export const UserKey = 'userKana';
export const TokenKey = 'tokenKana';

interface UserStore {
  url_img: string;
  user: UserInfo;
  accessToken: string | null;
  getUser: (payload: LoginResponse) => void;
  updateUser: (payload: Partial<UserInfo>) => void;
  resetUser: () => void;
  getAccessToken: () => string | null;
  initializeFromStorage: () => void;
}

const useUserStore = create<UserStore>((set, get) => {
  // Initialize from localStorage
  let initialUser = EmptyUserState;
  let initialToken = null;
  
  try {
    const storedUser = localStorage.getItem(UserKey);
    const storedToken = localStorage.getItem(TokenKey);
    
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && typeof parsedUser === 'object' && parsedUser.id && parsedUser.role) {
        initialUser = parsedUser;
        initialToken = storedToken;
      }
    }
  } catch (error) {
    console.warn('Error initializing store from localStorage:', error);
  }

  return {
    user: initialUser,
    accessToken: initialToken,
    // url_img: 'http://hiplot.dyndns.org:84/', // URL base de la imagen
    url_img: 'http://localhost:3005/', // URL base de la imagen
    
    getUser: (payload: LoginResponse) => set(() => {
      try {
        persistLocalStorage(UserKey, payload.user);
        // Store token as string, not as object
        localStorage.setItem(TokenKey, payload.access_token);
        return { 
          user: payload.user, 
          accessToken: payload.access_token 
        };
      } catch (error) {
        console.error('Error storing user data:', error);
        return { 
          user: payload.user, 
          accessToken: payload.access_token 
        };
      }
    }),
    
    updateUser: (payload: Partial<UserInfo>) => set((state) => {
      try {
        const result = { ...state.user, ...payload };
        persistLocalStorage(UserKey, result);
        return { user: result };
      } catch (error) {
        console.error('Error updating user data:', error);
        return { user: { ...state.user, ...payload } };
      }
    }),
    
    resetUser: () => set(() => {
      try {
        clearLocalStorage(UserKey);
        clearLocalStorage(TokenKey);
      } catch (error) {
        console.error('Error clearing user data:', error);
      }
      return { 
        user: EmptyUserState, 
        accessToken: null 
      };
    }),
    
    getAccessToken: () => get().accessToken,
    
    initializeFromStorage: () => {
      const storedUser = localStorage.getItem(UserKey);
      const storedToken = localStorage.getItem(TokenKey);

      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          set({ user, accessToken: storedToken });
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
    }
  };
});

export default useUserStore;
