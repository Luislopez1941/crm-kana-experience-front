import { create } from 'zustand';

interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

interface RoleStore {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  addRole: (role: Role) => void;
  updateRole: (id: number, role: Partial<Role>) => void;
  deleteRole: (id: number) => void;
  getRoleById: (id: number) => Role | undefined;
}

export const useRoleStore = create<RoleStore>((set, get) => ({
  roles: [],
  
  setRoles: (roles) => set({ roles }),
  
  addRole: (role) => set((state) => ({ 
    roles: [...state.roles, role] 
  })),
  
  updateRole: (id, updatedRole) => set((state) => ({
    roles: state.roles.map(role => 
      role.id === id ? { ...role, ...updatedRole } : role
    )
  })),
  
  deleteRole: (id) => set((state) => ({
    roles: state.roles.filter(role => role.id !== id)
  })),
  
  getRoleById: (id) => {
    const state = get();
    return state.roles.find(role => role.id === id);
  }
}));
