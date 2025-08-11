import { create } from 'zustand';

export interface YachtCategory {
  id: number;
  name: string;
  yachts?: any[];
  createdAt: string;
  updatedAt: string;
}

interface YachtCategoryStore {
  // State
  yachtCategories: YachtCategory[];
  searchTerm: string;
  editingCategory: YachtCategory | null;
  
  // Actions
  setYachtCategories: (yachtCategories: YachtCategory[]) => void;
  addYachtCategory: (yachtCategory: YachtCategory) => void;
  updateYachtCategory: (id: number, yachtCategory: Partial<YachtCategory>) => void;
  deleteYachtCategory: (id: number) => void;
  setSearchTerm: (term: string) => void;
  setEditingCategory: (category: YachtCategory | null) => void;
}

export const useYachtCategoryStore = create<YachtCategoryStore>((set) => ({
  // Initial state
  yachtCategories: [],
  searchTerm: '',
  editingCategory: null,

  // Actions
  setYachtCategories: (yachtCategories: YachtCategory[]) => {
    set({ yachtCategories });
  },

  addYachtCategory: (yachtCategory: YachtCategory) => {
    set((state) => ({
      yachtCategories: [...state.yachtCategories, yachtCategory]
    }));
  },

  updateYachtCategory: (id: number, yachtCategoryData: Partial<YachtCategory>) => {
    set((state) => ({
      yachtCategories: state.yachtCategories.map(category =>
        category.id === id ? { ...category, ...yachtCategoryData, updatedAt: new Date().toISOString() } : category
      )
    }));
  },

  deleteYachtCategory: (id: number) => {
    set((state) => ({
      yachtCategories: state.yachtCategories.filter(category => category.id !== id)
    }));
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setEditingCategory: (category: YachtCategory | null) => {
    set({ editingCategory: category });
  }
})); 