import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useYachtStore } from '../../../../../zustand/yachtStore';
import YachtModal from './yacht-modal/YachtModal';
import APIs from '../../../../../services/services/APIs';
import './styles/YachtManagement.css';
import { useStore } from '../../../../../zustand/useStore';

const YachtManagement: React.FC = () => {
  const { url }: any = useStore();
  const navigate = useNavigate();
  const {
    yachts,
   
    searchTerm,
    setSearchTerm,
    setYachts,
    setEditingYacht
  } = useYachtStore();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };
  const fetchYachts = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllYachts();
      if (response?.data) {
        console.log('🔍 YACHTS DATA:', response.data);
        console.log('🔍 FIRST YACHT:', response.data[0]);
        setYachts(response.data);
      }
    } catch (error) {
      console.error('Error fetching yachts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYachts();
  }, []);



  const handleEdit = (yacht: any) => {
    setEditingYacht(yacht);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este yate?')) {
      try {
        await APIs.deleteYacht(id);
        await fetchYachts();
      } catch (error) {
        console.error('Error deleting yacht:', error);
      }
    }
  };



  return (
    <div className="yacht-management-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons xl">sailing</span>
            Gestión de Yates
          </h1>
          <p className="page-subtitle">
            Administra tu flota de yates, disponibilidad y características
          </p>
        </div>
        <button
          className="btn btn-primary create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-icons">add_circle</span>
          Nuevo Yate
        </button>
      </div>



      {/* Yachts Section */}
      <div className="yachts-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="material-icons">list</span>
            Flota Actual
          </h2>
          <div className="section-actions">
            <div className="search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Buscar yates..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando yates...</p>
          </div>
        ) : yachts.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">sailing</span>
            <h3>No hay yates registrados</h3>
            <p>Agrega tu primer yate para comenzar a gestionar la flota</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-icons">add_circle</span>
              Agregar Primer Yate
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="yachts-grid-desktop desktop-only">
              {/* Header */}
              <div className="grid-header">
                <div className="grid-cell">Yate</div>
                <div className="grid-cell">Tipo</div>
                <div className="grid-cell">Capacidad</div>
                <div className="grid-cell">Precio/Hora</div>
                <div className="grid-cell">Ubicación</div>
                <div className="grid-cell">Estado</div>
                <div className="grid-cell">Acciones</div>
              </div>

              {/* Rows */}
              {yachts.map((yacht: any) => (
                <div key={yacht.id} className="grid-row">
                  <div className="grid-cell yacht-cell">
                    <div className="yacht-info-grid">
                      <img src={`${url}/${(yacht.images?.[0] as any)?.url}`} alt={yacht.name} className="yacht-thumbnail" />
                      <div>
                        <div className="yacht-name">{yacht.name}</div>
                        <div className="yacht-details">{yacht.length}</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid-cell type-cell">
                    {typeof yacht.yachtType === 'string'
                      ? yacht.yachtType
                      : (yacht.yachtType as any)?.name || 'Sin tipo'
                    }
                  </div>
                  <div className="grid-cell capacity-cell">
                    <span className="material-icons sm">group</span>
                    {yacht.capacity} personas
                  </div>
                  <div className="grid-cell price-cell">{formatPrice(yacht.pricePerDay)}</div>
                  <div className="grid-cell location-cell">{yacht.location}</div>
                  <div className="grid-cell">
                    <span className="availability-badge available">
                      <span className="material-icons sm">check_circle</span>
                      Disponible
                    </span>
                  </div>
                  <div className="grid-cell actions-cell">
                    <button
                      className="action-btn"
                      title="Ver detalles"
                      onClick={() => navigate(`/yates/detalle/${yacht.id}`)}
                    >
                      <span className="material-icons">visibility</span>
                    </button>
                    <button
                      className="action-btn"
                      title="Editar"
                      onClick={() => handleEdit(yacht)}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="action-btn danger"
                      title="Eliminar"
                      onClick={() => handleDelete(yacht.id)}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards View */}
            <div className="yachts-grid mobile-only">
              {yachts.map((yacht) => (
                <div key={yacht.id} className="yacht-card">
                  <div className="card-image">
                    <img src={`${url}/${(yacht.images?.[0] as any)?.url}` || '/placeholder-yacht.jpg'} alt={yacht.name} />
                    <div className="availability-overlay available">
                      <span className="material-icons">check_circle</span>
                      <span>Disponible</span>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="yacht-name">{yacht.name}</h3>
                      <span className="yacht-type">
                        {typeof yacht.yachtType === 'string'
                          ? yacht.yachtType
                          : (yacht.yachtType as any)?.name || 'Sin tipo'
                        }
                      </span>
                    </div>

                    <div className="yacht-specs">
                      <div className="spec">
                        <span className="material-icons sm">straighten</span>
                        <span>{yacht.length}</span>
                      </div>
                      <div className="spec">
                        <span className="material-icons sm">group</span>
                        <span>{yacht.capacity} personas</span>
                      </div>
                      <div className="spec">
                        <span className="material-icons sm">location_on</span>
                        <span>{yacht.location}</span>
                      </div>
                    </div>

                    <div className="price-info">
                      <span className="price">{formatPrice(yacht.pricePerDay)}</span>
                      <span className="price-period">/hora</span>
                    </div>

                    {yacht.characteristics && Array.isArray(yacht.characteristics) && yacht.characteristics.length > 0 && (
                      <div className="features-preview">
                        {yacht.characteristics.slice(0, 3).map((characteristic, index) => (
                          <span key={index} className="feature-tag">
                            {typeof characteristic === 'string' 
                              ? characteristic 
                              : (characteristic as any)?.name || String(characteristic)
                            }
                          </span>
                        ))}
                        {yacht.characteristics.length > 3 && (
                          <span className="feature-tag more">+{yacht.characteristics.length - 3} más</span>
                        )}
                      </div>
                    )}

                    <div className="card-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/yates/detalle/${yacht.id}`)}
                      >
                        <span className="material-icons sm">visibility</span>
                        Ver Detalles
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(yacht)}
                      >
                        <span className="material-icons sm">edit</span>
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Yacht Modal */}
      <YachtModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchYachts}
      />
    </div>
  );
};

export default YachtManagement;
