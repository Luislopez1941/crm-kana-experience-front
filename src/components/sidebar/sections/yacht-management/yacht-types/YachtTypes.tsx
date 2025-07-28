import React, { useEffect, useState } from 'react';
import { useYachtTypeStore } from '../../../../../zustand/yachtTypeStore';
import YachtTypeModal from './yacht-type-modal/YachtTypeModal';
import APIs from '../../../../../services/services/APIs';
import './styles/YachtTypes.css';

const YachtTypes: React.FC = () => {
  const { 
    yachtTypes, 
    searchTerm,
    setSearchTerm,
    setYachtTypes,
    setEditingType
  } = useYachtTypeStore();

  // Calculate filtered yacht types locally
  const filteredYachtTypes = yachtTypes.filter(type => {
    return searchTerm === '' || 
      type.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchYachtTypes = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllYachtType();
      if (response.data) {
        setYachtTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching yacht types:', error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchYachtTypes();
  }, []);

  const handleEdit = (type: any) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de yate?')) {
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


  return (
    <div className="yacht-types-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons">category</span>
            Tipos de Yates
          </h1>
          <p className="page-subtitle">
            Administra las categorías y tipos de yates en tu flota
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

      {/* Statistics Cards */}
    

      {/* Types Section */}
      <div className="types-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="material-icons">list</span>
            Tipos de Yates
          </h2>
          <div className="section-actions">
            <div className="search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Buscar tipos de yates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando tipos de yates...</p>
          </div>
        ) : filteredYachtTypes.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">category</span>
            <h3>No hay tipos de yates</h3>
            <p>Comienza creando tu primer tipo de yate</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Crear Primer Tipo
            </button>
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
                        <div className="type-details">Tipo de yate</div>
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