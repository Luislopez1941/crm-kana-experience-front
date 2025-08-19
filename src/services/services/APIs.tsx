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

  getYachts: async (data: any, customPath?: string) => {
    const path = customPath || 'yachts/get-yacht-by-ids';
    return ConfigurationAPIs.post(path, data);
  },


  getYachtByYachtCategory: async (yachtCategoryId: any, page: number = 1) => {
    const path = `yachts/by-category`;
    return ConfigurationAPIs.post(path, { yachtCategoryId: yachtCategoryId, page });
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

  getCategories: async (data: any, customPath?: string) => {
    const path = customPath || 'yacht-categories/get-categories-by-ids';
    return ConfigurationAPIs.post(path, data);
  },


  getCategoriesAll: async (userId: number, customPath?: string) => {
    const path = customPath || 'yacht-categories/get-categories';
    return ConfigurationAPIs.post(path, { userId });
  },

  createYachtType: async (data: any, customPath?: string) => {
    const path = customPath || 'yacht-categories/create';
    return ConfigurationAPIs.post(path, data);
  },

  updateYachtType: async (id: number, data: any, customPath?: string) => {
    const path = customPath || `yacht-types/update/${id}`;
    return ConfigurationAPIs.patch(path, data);
  },

  deleteYachtType: async (id: number, customPath?: string) => {
    const path = customPath || `yacht-types/delete/${id}`;
    return ConfigurationAPIs.delete(path);
  },

  // Yacht Categories
  createYachtCategory: async (data: any, customPath?: string) => {
    const path = customPath || 'yacht-categories/create';
    return ConfigurationAPIs.post(path, data);
  },

  getAllYachtCategories: async (data: { userId: number; state: number; municipality: number; locality: number }, customPath?: string) => {
    const path = customPath || 'yacht-categories/get-categories-by-ids';
    return ConfigurationAPIs.post(path, data);
  },

  updateYachtCategory: async (id: number, data: any, customPath?: string) => {
    const path = customPath || `yacht-categories/update/${id}`;
    return ConfigurationAPIs.patch(path, data);
  },

  deleteYachtCategory: async (id: number, customPath?: string) => {
    const path = customPath || `yacht-categories/delete/${id}`;
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
    const path = customPath || `municipalities/by-state/${stateId}`;
    return ConfigurationAPIs.get(path);
  },

  // Localities
  getLocalities: async (data: any, customPath?: string) => {
    const path = customPath || 'localities/get-by-ids';
    return ConfigurationAPIs.post(path, data);
  },

  getLocalitiesByMunicipality: async (municipalityId: number, customPath?: string) => {
    const path = customPath || `localities/by-municipality/${municipalityId}`;
    return ConfigurationAPIs.get(path);
  },

  // User Management
  getAllUsers: async (customPath?: string) => {
    const path = customPath || 'users/get-all';
    return ConfigurationAPIs.get(path);
  },

  createUser: async (data: any, customPath?: string) => {
    const path = customPath || 'users/create';
    return ConfigurationAPIs.post(path, data);
  },

  updateUser: async (id: number, data: any, customPath?: string) => {
    const path = customPath || `users/update/${id}`;
    return ConfigurationAPIs.patch(path, data);
  },

  deleteUser: async (id: number, customPath?: string) => {
    const path = customPath || `users/delete/${id}`;
    return ConfigurationAPIs.delete(path);
  },

  getUsersByRole: async (roleId: number, customPath?: string) => {
    const path = customPath || `users/by-role/${roleId}`;
    return ConfigurationAPIs.get(path);
  },

  // Role Management
  getAllRoles: async (customPath?: string) => {
    const path = customPath || 'roles/get-all';
    return ConfigurationAPIs.get(path);
  },

  createRole: async (data: any, customPath?: string) => {
    const path = customPath || 'roles/create';
    return ConfigurationAPIs.post(path, data);
  },

  updateRole: async (id: number, data: any, customPath?: string) => {
    const path = customPath || `roles/update/${id}`;
    return ConfigurationAPIs.patch(path, data);
  },

  deleteRole: async (id: number, customPath?: string) => {
    const path = customPath || `roles/delete/${id}`;
    return ConfigurationAPIs.delete(path);
  },

}




export default APIs;



