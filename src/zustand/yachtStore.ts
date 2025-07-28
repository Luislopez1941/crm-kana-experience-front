import { create } from 'zustand';

export interface Yacht {
  id: number;
  name: string;
  capacity: number;
  length: string;
  location: string;
  images: string[];
  description: string;
  characteristics: string[];
  pricePerDay: number;
  yachtTypeId: number;
  yachtType?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface YachtStore {
  // State
  yachts: Yacht[];
  searchTerm: string;
  editingYacht: Yacht | null;
  
  // Actions
  setYachts: (yachts: Yacht[]) => void;
  addYacht: (yacht: Yacht) => void;
  updateYacht: (id: number, yacht: Partial<Yacht>) => void;
  deleteYacht: (id: number) => void;
  setSearchTerm: (term: string) => void;
  setEditingYacht: (yacht: Yacht | null) => void;
  
  // Computed
  filteredYachts: Yacht[];
}

export const useYachtStore = create<YachtStore>((set, get) => ({
  // Initial state
  yachts: [],
  searchTerm: '',
  editingYacht: null,

  // Actions
  setYachts: (yachts: Yacht[]) => {
    set({ yachts });
  },

  addYacht: (yacht: Yacht) => {
    set((state) => ({
      yachts: [...state.yachts, yacht]
    }));
  },

  updateYacht: (id: number, yachtData: Partial<Yacht>) => {
    set((state) => ({
      yachts: state.yachts.map(yacht =>
        yacht.id === id ? { ...yacht, ...yachtData, updatedAt: new Date().toISOString() } : yacht
      )
    }));
  },

  deleteYacht: (id: number) => {
    set((state) => ({
      yachts: state.yachts.filter(y => y.id !== id)
    }));
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setEditingYacht: (yacht: Yacht | null) => {
    set({ editingYacht: yacht });
  },

  // Computed
  get filteredYachts() {
    const { yachts, searchTerm } = get();
    return yachts.filter(yacht => {
      return searchTerm === '' || 
        yacht.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        yacht.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (yacht.yachtType?.name && yacht.yachtType.name.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }
})); 