import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  phoneNumber?: string;
  profileImage?: string;
  typeUser: string;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
  parentId?: number;
  parent?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  subUsers: User[];
  createdAt: string;
  updatedAt: string;
}

interface UserStore {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
  getUserById: (id: number) => User | undefined;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  
  setUsers: (users) => set({ users }),
  
  addUser: (user) => set((state) => ({ 
    users: [...state.users, user] 
  })),
  
  updateUser: (id, updatedUser) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, ...updatedUser } : user
    )
  })),
  
  deleteUser: (id) => set((state) => ({
    users: state.users.filter(user => user.id !== id)
  })),
  
  getUserById: (id) => {
    const state = get();
    return state.users.find(user => user.id === id);
  }
}));
