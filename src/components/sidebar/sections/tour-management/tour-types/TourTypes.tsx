import React, { useEffect, useState } from 'react';
import TourTypeModal from './tour-type-modal/TourTypeModal';
import APIs from '../../../../../services/services/APIs';
import './styles/TourTypes.css';

interface TourType {
  id: number;
  name: string;
  tours?: any[];
  createdAt?: string;
  updatedAt?: string;
}

const TourTypes: React.FC = () => {

  const [tourTypes, setTourTypes] = useState<TourType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingType, setEditingType] = useState<TourType | null>(null);

  // Calculate filtered tour types locally
  const filteredTourTypes = tourTypes.filter(type => {
    return searchTerm === '' || 
      type.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchTourTypes = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllTourTypes();
      if (response.data) {
        setTourTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching tour types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTourTypes();
  }, []);

  const handleEdit = (type: TourType) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de tour?')) {
      try {
        await APIs.deleteTourType(id);
        // Recargar datos después de eliminar
        await fetchTourTypes();
      } catch (error) {
        console.error('Error deleting tour type:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
  };


  return (
    <div className="tour-types-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons">category</span>
            Tipos de Tours
          </h1>
          <p className="page-subtitle">
            Administra las categorías y tipos de tours en tu sistema
          </p>
        </div>
        <button 
          className="btn btn-primary create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-icons">add_circle</span>
          Nuevo Tipo
        </button>
      </div>

      {/* Tour Types Section */}
      <div className="tour-types-section">
        <div className="section-header">
          <h2 className="section-title">Lista de Tipos de Tours</h2>
          <div className="section-actions">
            <div className="search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar tipos de tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando tipos de tours...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTourTypes.length === 0 && (
          <div className="empty-state">
            <span className="material-icons">category</span>
            <h3>No hay tipos de tours</h3>
            <p>
              {searchTerm 
                ? 'No se encontraron tipos de tours con ese nombre.'
                : 'Comienza creando tu primer tipo de tour.'
              }
            </p>
            {!searchTerm && (
              <button 
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="material-icons">add</span>
                Crear Primer Tipo
              </button>
            )}
          </div>
        )}

        {/* Tour Types Grid */}
        {!isLoading && filteredTourTypes.length > 0 && (
          <>
            {/* Desktop Grid View */}
            <div className="desktop-grid">
              {/* Header */}
              <div className="grid-header">
                <div className="grid-cell header-cell">Tipo</div>
                <div className="grid-cell header-cell">Tours</div>
                <div className="grid-cell header-cell">Fecha Creación</div>
                <div className="grid-cell header-cell">Acciones</div>
              </div>
              
              {/* Rows */}
              {filteredTourTypes.map((type) => (
                <div key={type.id} className="grid-row">
                  <div className="grid-cell type-cell">
                    <div className="type-info">
                      <div className="type-icon">
                        <span className="material-icons">explore</span>
                      </div>
                      <div>
                        <div className="type-name">{type.name}</div>
                        <div className="type-details">Tipo de tour</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid-cell tours-cell">
                    <span className="material-icons">explore</span>
                    {type.tours ? type.tours.length : 0} tours
                  </div>
                  <div className="grid-cell date-cell">
                    {new Date(type.createdAt || '').toLocaleDateString()}
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
              {filteredTourTypes.map((type) => (
                <div key={type.id} className="type-card">
                  <div className="card-header">
                    <div className="type-icon">
                      <span className="material-icons">explore</span>
                    </div>
                    <div className="type-actions">
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
                  <div className="type-content">
                    <h3>{type.name}</h3>
                    <div className="type-stats">
                      <div className="stat">
                        <span className="material-icons">explore</span>
                        <span>{type.tours ? type.tours.length : 0} tours</span>
                      </div>
                      <div className="stat">
                        <span className="material-icons">schedule</span>
                        <span>{new Date(type.createdAt || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Tour Type Modal */}
      <TourTypeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchTourTypes}
        editingType={editingType}
      />
    </div>
  );
};

export default TourTypes; 