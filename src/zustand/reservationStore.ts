import { create } from 'zustand';
import APIs from '../services/services/APIs';

export interface Yacht {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  image: string;
  description: string;
  features: string[];
  available: boolean;
  length: string;
  year: number;
  location: string;
}

export interface Reservation {
  id: string;
  yachtId: string;
  yachtName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

interface ReservationStore {
  // Reservations
  reservations: Reservation[];
  filteredReservations: Reservation[];
  searchTerm: string;
  statusFilter: string;
  loading: boolean;
  
  // Yachts
  yachts: Yacht[];
  
  // Actions
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  deleteReservation: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  loadReservations: () => Promise<void>;
  
  // Yacht actions
  addYacht: (yacht: Omit<Yacht, 'id'>) => void;
  updateYacht: (id: string, yacht: Partial<Yacht>) => void;
  deleteYacht: (id: string) => void;
  toggleYachtAvailability: (id: string) => void;
  
  // Helper function
  filterReservations: (reservations: Reservation[], searchTerm: string, statusFilter: string) => Reservation[];
}

// Mock data
const mockYachts: Yacht[] = [
  {
    id: '1',
    name: 'Luxury Pearl',
    type: 'Yate de Lujo',
    capacity: 12,
    price: 2500,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    description: 'Yate de lujo con todas las comodidades para una experiencia inolvidable.',
    features: ['Jacuzzi', 'Bar', 'Cocina completa', 'Sala de estar', 'Cubierta solar'],
    available: true,
    length: '28 metros',
    year: 2020,
    location: 'Marina Valencia'
  },
  {
    id: '2',
    name: 'Ocean Dream',
    type: 'Catamarán',
    capacity: 8,
    price: 1800,
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400',
    description: 'Catamarán espacioso ideal para grupos familiares y navegación suave.',
    features: ['Doble casco', 'Estabilidad superior', 'Área de descanso', 'Snorkel incluido'],
    available: true,
    length: '22 metros',
    year: 2019,
    location: 'Puerto Banús'
  },
  {
    id: '3',
    name: 'Sea Breeze',
    type: 'Velero',
    capacity: 6,
    price: 1200,
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400',
    description: 'Elegante velero para los amantes de la navegación tradicional.',
    features: ['Navegación a vela', 'Cabina acogedora', 'Experiencia auténtica'],
    available: true,
    length: '18 metros',
    year: 2018,
    location: 'Marina Ibiza'
  },
  {
    id: '4',
    name: 'Marina Explorer',
    type: 'Yate Deportivo',
    capacity: 10,
    price: 3200,
    image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400',
    description: 'Yate deportivo de alta velocidad con tecnología de punta.',
    features: ['Motor potente', 'Velocidad máxima', 'Deportes acuáticos', 'Sistema de sonido'],
    available: false,
    length: '32 metros',
    year: 2021,
    location: 'Marina Barcelona'
  },
  {
    id: '5',
    name: 'Sunset Paradise',
    type: 'Mega Yate',
    capacity: 20,
    price: 5000,
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=400',
    description: 'Mega yate de lujo con helipuerto y todas las comodidades imaginables.',
    features: ['Helipuerto', 'Spa', 'Piscina', 'Gimnasio', 'Cine privado'],
    available: true,
    length: '45 metros',
    year: 2022,
    location: 'Puerto José Banús'
  }
];


export const useReservationStore = create<ReservationStore>((set, get) => ({
  // Initial state
  reservations: [],
  filteredReservations: [],
  searchTerm: '',
  statusFilter: '',
  loading: false,
  yachts: mockYachts,

  // Reservation actions
  addReservation: (reservationData) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    set((state) => {
      const newReservations = [...state.reservations, newReservation];
      return {
        reservations: newReservations,
        filteredReservations: get().filterReservations(newReservations, state.searchTerm, state.statusFilter)
      };
    });
  },

  updateReservationStatus: (id: string, status: Reservation['status']) => {
    set((state) => {
      const newReservations = state.reservations.map(reservation =>
        reservation.id === id ? { ...reservation, status } : reservation
      );
      return {
        reservations: newReservations,
        filteredReservations: get().filterReservations(newReservations, state.searchTerm, state.statusFilter)
      };
    });
  },

  deleteReservation: (id: string) => {
    set((state) => {
      const newReservations = state.reservations.filter(r => r.id !== id);
      return {
        reservations: newReservations,
        filteredReservations: get().filterReservations(newReservations, state.searchTerm, state.statusFilter)
      };
    });
  },

  setSearchTerm: (term: string) => {
    set((state) => ({
      searchTerm: term,
      filteredReservations: get().filterReservations(state.reservations, term, state.statusFilter)
    }));
  },

  setStatusFilter: (status: string) => {
    set((state) => ({
      statusFilter: status,
      filteredReservations: get().filterReservations(state.reservations, state.searchTerm, status)
    }));
  },

  loadReservations: async () => {
    console.log('🚀 loadReservations called');
    set({ loading: true });
    try {
      console.log('📡 Calling APIs.getAllReservations()...');
      const response = await APIs.getAllReservations();
      console.log('📦 Reservations response:', response);
      
      if (response && (response as any).data) {
        console.log('✅ Response has data, mapping reservations...');
        console.log('📊 Raw data from API:', (response as any).data);
        
        // Mapear los datos de la API al formato del store
        const apiReservations = (response as any).data.map((reservation: any) => {
          console.log('🔄 Mapping reservation:', reservation);
          return {
            id: reservation.id.toString(),
            yachtId: reservation.yachtId?.toString() || reservation.productId?.toString() || '',
            yachtName: reservation.yacht?.name || `Yate ID: ${reservation.yachtId || reservation.productId}`,
            clientName: `${reservation.firstName} ${reservation.lastName}`,
            clientEmail: reservation.email,
            clientPhone: reservation.phone,
            startDate: reservation.reservationDate,
            endDate: reservation.reservationDate, // Mismo día por ahora
            totalDays: 1,
            totalPrice: 0, // TODO: Calcular precio real
            status: reservation.status,
            createdAt: reservation.createdAt,
            notes: reservation.description,
            // Información adicional del folio y yate
            folioId: reservation.folioId,
            folio: reservation.folio,
            yacht: reservation.yacht,
            type: reservation.type,
            productId: reservation.productId,
            userId: reservation.userId,
            qr: reservation.qr
          };
        });

        console.log('🔄 Mapped reservations:', apiReservations);
        set((state) => ({
          reservations: apiReservations,
          filteredReservations: get().filterReservations(apiReservations, state.searchTerm, state.statusFilter),
          loading: false
        }));
        console.log('✅ Reservations loaded successfully');
      } else {
        console.log('❌ No data in response');
        set({ loading: false });
      }
    } catch (error) {
      console.error('💥 Error loading reservations:', error);
      set({ loading: false });
    }
  },

  // Yacht actions
  addYacht: (yachtData) => {
    const newYacht: Yacht = {
      ...yachtData,
      id: Date.now().toString()
    };
    set((state) => ({
      yachts: [...state.yachts, newYacht]
    }));
  },

  updateYacht: (id: string, yachtData: Partial<Yacht>) => {
    set((state) => ({
      yachts: state.yachts.map(yacht =>
        yacht.id === id ? { ...yacht, ...yachtData } : yacht
      )
    }));
  },

  deleteYacht: (id: string) => {
    set((state) => ({
      yachts: state.yachts.filter(y => y.id !== id)
    }));
  },

  toggleYachtAvailability: (id: string) => {
    set((state) => ({
      yachts: state.yachts.map(yacht =>
        yacht.id === id ? { ...yacht, available: !yacht.available } : yacht
      )
    }));
  },

  // Helper function
  filterReservations: (reservations: Reservation[], searchTerm: string, statusFilter: string) => {
    return reservations.filter(reservation => {
      const matchesSearch = searchTerm === '' || 
        reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.yachtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || reservation.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }
}));
