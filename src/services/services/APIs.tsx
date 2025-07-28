import ConfigurationAPIs from '../api/configurationAPIs';

const APIs = {
  login: async (data: any, customPath?: string) => {
    const path = customPath || 'auth/login';
    return ConfigurationAPIs.post(path, data);
  },


  // YACHTS
  createYacht: async (data: any, customPath?: string) => {
    const path = customPath || 'yachts/create';
    return ConfigurationAPIs.post(path, data);
  },

  getAllYachts: async (customPath?: string) => {
    const path = customPath || 'yachts/get-all';
    return ConfigurationAPIs.get(path);
  },

  updateYacht: async (id: number, data: any, customPath?: string) => {
    const path = customPath || `yachts/update/${id}`;
    return ConfigurationAPIs.patch(path, data);
  },

  deleteYacht: async (id: number, customPath?: string) => {
    const path = customPath || `yacht/delete/${id}`;
    return ConfigurationAPIs.delete(path);
  },

  // Yacht Types

  createYachtType: async (data: any, customPath?: string) => {
    const path = customPath || 'yacht-types/create';
    return ConfigurationAPIs.post(path, data);
  },

  getAllYachtType: async (customPath?: string) => {
    const path = customPath || 'yacht-types/get-all';
    return ConfigurationAPIs.get(path);
  },

  updateYachtType: async (id: number, data: any, customPath?: string) => {
    const path = customPath || `yacht-types/update/${id}`;
    return ConfigurationAPIs.patch(path, data);
  },

  deleteYachtType: async (id: number, customPath?: string) => {
    const path = customPath || `yacht-types/delete/${id}`;
    return ConfigurationAPIs.delete(path);
  },


    // Tours
    createTour: async (data: any, customPath?: string) => {
      const path = customPath || 'tours/create';
      return ConfigurationAPIs.post(path, data);
    },
  
    getAllTours: async (customPath?: string) => {
      const path = customPath || 'tours/get-all';
      return ConfigurationAPIs.get(path);
    },
  
    updateTour: async (id: number, data: any, customPath?: string) => {
      const path = customPath || `tours/update/${id}`;
      return ConfigurationAPIs.patch(path, data);
    },

  // Tour Types - Tour Type Management

  createTourType: async (data: any, customPath?: string) => {
    const path = customPath || 'tour-types/create';
    return ConfigurationAPIs.post(path, data);
  },

  getAllTourTypes: async (customPath?: string) => {
    const path = customPath || 'tour-types/get-all';
    return ConfigurationAPIs.get(path);
  },

  updateTourType: async (id: number, data: any, customPath?: string) => {
    const path = customPath || `tour-types/update/${id}`;
    return ConfigurationAPIs.patch(path, data);
  },

  deleteTourType: async (id: number, customPath?: string) => {
    const path = customPath || `tour-types/delete/${id}`;
    return ConfigurationAPIs.delete(path);
  },

  // Clubs
  createClub: async (data: any, customPath?: string) => {
    const path = customPath || 'clubs/create';
    return ConfigurationAPIs.post(path, data);
  },

  getAllClubs: async (customPath?: string) => {
    const path = customPath || 'clubs/get-all';
    return ConfigurationAPIs.get(path);
  },

  updateClub: async (id: number, data: any, customPath?: string) => {
    const path = customPath || `clubs/update/${id}`;
    return ConfigurationAPIs.patch(path, data);
  },

  deleteClub: async (id: number, customPath?: string) => {
    const path = customPath || `clubs/delete/${id}`;
    return ConfigurationAPIs.delete(path);
  },

  // Club Types
  createClubType: async (data: any, customPath?: string) => {
    const path = customPath || 'club-types/create';
    return ConfigurationAPIs.post(path, data);
  },

  getAllClubTypes: async (customPath?: string) => {
    const path = customPath || 'club-types/get-all';
    return ConfigurationAPIs.get(path);
  },

  updateClubType: async (id: number, data: any, customPath?: string) => {
    const path = customPath || `club-types/update/${id}`;
    return ConfigurationAPIs.patch(path, data);
  },

  deleteClubType: async (id: number, customPath?: string) => {
    const path = customPath || `club-types/delete/${id}`;
    return ConfigurationAPIs.delete(path);
  },

  // States
  getAllStates: async (customPath?: string) => {
    const path = customPath || 'states/get-all';
    return ConfigurationAPIs.get(path);
  },

  // Municipalities
  getMunicipalitiesByState: async (stateId: number, customPath?: string) => {
    const path = customPath || `municipalities/get-by-state/${stateId}`;
    return ConfigurationAPIs.get(path);
  },

  // Localities
  getLocalitiesByMunicipality: async (municipalityId: number, customPath?: string) => {
    const path = customPath || `localities/get-by-municipality/${municipalityId}`;
    return ConfigurationAPIs.get(path);
  },

}




export default APIs;



