import React, { useEffect, useState } from 'react';
import { useYachtTypeStore } from '../../../../../zustand/yachtTypeStore';
import YachtTypeModal from './yacht-type-modal/YachtTypeModal';
import APIs from '../../../../../services/services/APIs';
import './styles/YachtTypes.css';
import useUserStore from '../../../../../zustand/useUserStore';

interface State {
  id: number;
  name: string;
}

interface Municipality {
  id: number;
  name: string;
}

interface Locality {
  id: number;
  name: string;
}

const YachtTypes: React.FC = () => {
  const { 
    yachtTypes, 
    searchTerm,
    setSearchTerm,
    setYachtTypes,
    setEditingType
  } = useYachtTypeStore();

  // State variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState<number>(0);
  const [selectedMunicipality, setSelectedMunicipality] = useState<number>(0);
  const [selectedLocality, setSelectedLocality] = useState<number>(0);
  const [states, setStates] = useState<State[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false);
  const { user } = useUserStore();

  // Calculate filtered yacht types locally
  const filteredYachtTypes = yachtTypes.filter(type => {
    let matches = searchTerm === '' || 
      type.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by state
    if (selectedState > 0) {
      matches = matches && type.stateId === selectedState;
    }
    
    // Filter by municipality
    if (selectedMunicipality > 0) {
      matches = matches && type.municipalityId === selectedMunicipality;
    }
    
    // Filter by locality
    if (selectedLocality > 0) {
      matches = matches && type.localityId === selectedLocality;
    }
    
    return matches;
  });

  const fetchYachtTypes = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllYachtCategories({
        userId: user.id, 
        state: selectedState, 
        municipality: selectedMunicipality, 
        locality: selectedLocality
      });
      if (response.data) {
        setYachtTypes(response.data);
      }
    } catch (error) { 
      console.error('Error fetching yacht types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStates = async () => {
    setIsLoadingStates(true);
    try {
      const response: any = await APIs.getAllStates();
      if (response.success && response.data) {
        setStates(response.data);
      } else if (response.data) {
        // Fallback: some APIs return data directly
        setStates(response.data);
      } else {
        console.error('Invalid states response format:', response);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setIsLoadingStates(false);
    }
  };

  const fetchMunicipalities = async (stateId: number) => {
    setIsLoadingMunicipalities(true);
    try {
      const response: any = await APIs.getMunicipalitiesByState(stateId);
      if (response.success && response.data) {
        setMunicipalities(response.data);
      } else if (response.data) {
        // Fallback: some APIs return data directly
        setMunicipalities(response.data);
      } else {
        console.error('Invalid municipalities response format:', response);
      }
    } catch (error) {
      console.error('Error fetching municipalities:', error);
    } finally {
      setIsLoadingMunicipalities(false);
    }
  };

  const fetchLocalities = async (municipalityId: number) => {
    setIsLoadingLocalities(true);
    try {
      const response: any = await APIs.getLocalitiesByMunicipality(municipalityId);
      if (response.success && response.data) {
        setLocalities(response.data);
      } else if (response.data) {
        // Fallback: some APIs return data directly
        setLocalities(response.data);
      } else {
        console.error('Invalid localities response format:', response);
      }
    } catch (error) {
      console.error('Error fetching localities:', error);
    } finally {
      setIsLoadingLocalities(false);
    }
  };



  useEffect(() => {
    fetchYachtTypes();
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState > 0) {
      fetchMunicipalities(selectedState);
      setSelectedMunicipality(0);
      setSelectedLocality(0);
    } else {
      setMunicipalities([]);
      setLocalities([]);
      setSelectedMunicipality(0);
      setSelectedLocality(0);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedMunicipality > 0) {
      fetchLocalities(selectedMunicipality);
      setSelectedLocality(0);
    } else {
      setLocalities([]);
      setSelectedLocality(0);
    }
  }, [selectedMunicipality]);

  // Refetch yacht types when location filters change
  useEffect(() => {
    if (user?.id) {
      fetchYachtTypes();
    }
  }, [selectedState, selectedMunicipality, selectedLocality]);

  const handleEdit = (type: any) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
            if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría de yate?')) {
      try {
        await APIs.deleteYachtType(id);
        // Recargar datos después de eliminar
        await fetchYachtTypes();
      } catch (error) {
        console.error('Error deleting yacht type:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = parseInt(e.target.value);
    setSelectedState(stateId);
  };

  const handleMunicipalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const municipalityId = parseInt(e.target.value);
    setSelectedMunicipality(municipalityId);
  };

  const handleLocalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const localityId = parseInt(e.target.value);
    setSelectedLocality(localityId);
  };

  const clearFilters = () => {
    setSelectedState(0);
    setSelectedMunicipality(0);
    setSelectedLocality(0);
    // Los datos se recargarán automáticamente por el useEffect
  };


  return (
    <div className="yacht-types-page">
      {/* Types Section */}
      <div className="types-section">
        {/* Improved Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            {/* Search Box - Left side */}
            <div className="search-box">
              <span className="material-icons search-icon">search</span>
              <input
                type="text"
                placeholder="Buscar categorías por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="yacht-types-search-input"
              />
              {searchTerm && (
                <button 
                  className="yacht-types-clear-search-btn"
                  onClick={() => setSearchTerm('')}
                  title="Limpiar búsqueda"
                >
                  <span className="material-icons">close</span>
                </button>
              )}
            </div>
            
            {/* Create Button - Right side */}
            <button 
              className="btn btn-primary yacht-types-create-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-icons">add_circle</span>
              Nueva Categoría
            </button>
          </div>
          
          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">
                <span className="material-icons">location_on</span>
                Estado
              </label>
              <select
                className="yacht-types-filter-select"
                value={selectedState}
                onChange={handleStateChange}
                disabled={isLoadingStates}
              >
                <option value={0}>Seleccionar estado</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <span className="material-icons">business</span>
                Municipio
              </label>
              <select
                className="yacht-types-filter-select"
                value={selectedMunicipality}
                onChange={handleMunicipalityChange}
                disabled={isLoadingMunicipalities || selectedState === 0}
              >
                <option value={0}>
                  {selectedState === 0 ? 'Selecciona un estado primero' : 'Seleccionar municipio'}
                </option>
                {municipalities.map(municipality => (
                  <option key={municipality.id} value={municipality.id}>
                    {municipality.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <span className="material-icons">place</span>
                Localidad
              </label>
              <select
                className="yacht-types-filter-select"
                value={selectedLocality}
                onChange={handleLocalityChange}
                disabled={isLoadingLocalities || selectedMunicipality === 0}
              >
                <option value={0}>
                  {selectedMunicipality === 0 ? 'Selecciona un municipio primero' : 'Seleccionar localidad'}
                </option>
                {localities.map(locality => (
                  <option key={locality.id} value={locality.id}>
                    {locality.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-actions">
              <button
                className="yacht-types-clear-filters-btn"
                onClick={clearFilters}
                disabled={selectedState === 0 && selectedMunicipality === 0 && selectedLocality === 0}
              >
                <span className="material-icons">clear_all</span>
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando categorías de yates...</p>
          </div>
        ) : filteredYachtTypes.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">category</span>
            <h3>
              {yachtTypes.length === 0 
                ? 'No hay categorías de yates' 
                : 'No se encontraron resultados'
              }
            </h3>
            <p>
              {yachtTypes.length === 0 
                ? 'Comienza creando tu primera categoría de yate'
                : 'No hay categorías que coincidan con los filtros aplicados'
              }
            </p>
            {yachtTypes.length === 0 ? (
              <button 
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                Crear Primera Categoría
              </button>
            ) : (
              <button 
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Limpiar Filtros
              </button>
            )}
          </div>
                ) : (
          <>
            {/* Desktop Grid View */}
            <div className="desktop-grid">
              {/* Header */}
              <div className="grid-header">
                <div className="grid-cell header-cell">Tipo</div>
                <div className="grid-cell header-cell">Yates</div>
                <div className="grid-cell header-cell">Fecha Creación</div>
                <div className="grid-cell header-cell">Acciones</div>
              </div>
              
              {/* Rows */}
              {filteredYachtTypes.map((type) => (
                <div key={type.id} className="grid-row">
                  <div className="grid-cell type-cell">
                    <div className="type-info">
                      <div className="type-icon">
                        <span className="material-icons">category</span>
                      </div>
                      <div>
                        <div className="type-name">{type.name}</div>
                        <div className="type-details">Categoría de yate</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid-cell yachts-cell">
                    <span className="material-icons">sailing</span>
                    {type.yachts ? type.yachts.length : 0} yates
                  </div>
                  <div className="grid-cell date-cell">
                    {new Date(type.createdAt).toLocaleDateString()}
                  </div>
                  <div className="grid-cell actions-cell">
                    <button 
                      className="action-btn" 
                      title="Editar"
                      onClick={() => handleEdit(type)}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button 
                      className="action-btn danger" 
                      title="Eliminar"
                      onClick={() => handleDelete(type.id)}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards View */}
            <div className="types-grid">
              {filteredYachtTypes.map((type) => (
                <div key={type.id} className="type-card">
                  <div className="card-header">
                    <div className="type-icon">
                      <span className="material-icons">category</span>
                    </div>
                    <div className="type-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleEdit(type)}
                        title="Editar"
                      >
                        <span className="material-icons">edit</span>
                      </button>
                      <button 
                        className="action-btn danger"
                        onClick={() => handleDelete(type.id)}
                        title="Eliminar"
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="type-content">
                    <h3 className="type-name">{type.name}</h3>
                    <div className="type-stats">
                      <div className="stat">
                        <span className="material-icons">sailing</span>
                        <span>{type.yachts ? type.yachts.length : 0} yates</span>
                      </div>
                      <div className="stat">
                        <span className="material-icons">schedule</span>
                        <span>{new Date(type.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <YachtTypeModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchYachtTypes}
      />
    </div>
  );
};

export default YachtTypes; 