import { create } from 'zustand';

export interface YachtType {
  id: number;
  name: string;
  yachts?: any[];
  stateId: number;
  municipalityId: number;
  localityId: number;
  createdAt: string;
  updatedAt: string;
}

interface YachtTypeStore {
  // State
  yachtTypes: YachtType[];
  searchTerm: string;
  editingType: YachtType | null;
  
  // Actions
  setYachtTypes: (yachtTypes: YachtType[]) => void;
  addYachtType: (yachtType: YachtType) => void;
  updateYachtType: (id: number, yachtType: Partial<YachtType>) => void;
  deleteYachtType: (id: number) => void;
  setSearchTerm: (term: string) => void;
  setEditingType: (type: YachtType | null) => void;
}

export const useYachtTypeStore = create<YachtTypeStore>((set) => ({
  // Initial state
  yachtTypes: [],
  searchTerm: '',
  editingType: null,

  // Actions
  setYachtTypes: (yachtTypes: YachtType[]) => {
    set({ yachtTypes });
  },

  addYachtType: (yachtType: YachtType) => {
    set((state) => ({
      yachtTypes: [...state.yachtTypes, yachtType]
    }));
  },

  updateYachtType: (id: number, yachtTypeData: Partial<YachtType>) => {
    set((state) => ({
      yachtTypes: state.yachtTypes.map(type =>
        type.id === id ? { ...type, ...yachtTypeData, updatedAt: new Date().toISOString() } : type
      )
    }));
  },

  deleteYachtType: (id: number) => {
    set((state) => ({
      yachtTypes: state.yachtTypes.filter(type => type.id !== id)
    }));
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setEditingType: (type: YachtType | null) => {
    set({ editingType: type });
  }
})); 