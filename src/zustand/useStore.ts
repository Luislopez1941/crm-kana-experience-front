import { create } from 'zustand';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  isExpanded?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AppState {
  // Authentication
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Navigation
  activeMenuItem: string;
  setActiveMenuItem: (id: string) => void;
  
  // Menu items expansion
  expandedMenus: string[];
  toggleMenuExpansion: (menuId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Authentication
  isAuthenticated: localStorage.getItem('yachtcrm_auth') === 'true',
  user: JSON.parse(localStorage.getItem('yachtcrm_user') || 'null'),
  login: (user: User) => {
    set({ isAuthenticated: true, user });
    localStorage.setItem('yachtcrm_auth', 'true');
    localStorage.setItem('yachtcrm_user', JSON.stringify(user));
    window.location.href = '/';
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
    localStorage.removeItem('yachtcrm_auth');
    localStorage.removeItem('yachtcrm_user');
    window.location.href = '/login';
  },

  // Theme
  theme: 'light',
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
  },
  
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
  
  // Navigation
  activeMenuItem: 'dashboard',
  setActiveMenuItem: (id: string) => set({ activeMenuItem: id }),
  
  // Menu expansion
  expandedMenus: ['dashboard'],
  toggleMenuExpansion: (menuId: string) => {
    const expandedMenus = get().expandedMenus;
    const isExpanded = expandedMenus.includes(menuId);
    
    set({
      expandedMenus: isExpanded
        ? expandedMenus.filter(id => id !== menuId)
        : [...expandedMenus, menuId]
    });
  },
}));


