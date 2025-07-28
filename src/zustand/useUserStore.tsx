import { create } from 'zustand';
import { persistLocalStorage, clearLocalStorage } from '../utils/localStorage.utility';

export interface UserInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  rol: string;
}

export const EmptyUserState: UserInfo = {
  id: 0,
  email: '',
  firstName: '',
  lastName: '',
  rol: ''
};

export const UserKey = 'userKana';

interface UserStore {
  url_img: string;
  user: UserInfo;
  getUser: (payload: UserInfo) => void;
  updateUser: (payload: Partial<UserInfo>) => void;
  resetUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: localStorage.getItem(UserKey) ? JSON.parse(localStorage.getItem(UserKey)!) : EmptyUserState,
  url_img: 'http://hiplot.dyndns.org:84/', // URL base de la imagen
  getUser: (payload) => set(() => {
    persistLocalStorage(UserKey, payload);
    return { user: payload };
  }),
  updateUser: (payload) => set((state) => {
    const result = { ...state.user, ...payload };
    persistLocalStorage(UserKey, result);
    return { user: result };
  }),
  resetUser: () => set(() => {
    clearLocalStorage(UserKey);
    return { user: EmptyUserState };
  })
}));

export default useUserStore;
