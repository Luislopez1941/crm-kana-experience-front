import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TourModal from './tour-modal/TourModal';
import APIs from '../../../../../services/services/APIs';
import { useStore } from '../../../../../zustand/useStore';
import './styles/TourManagement.css';

interface Tour {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price: number;
  location: string;
  status: string;
  tourTypeId: number;
  tourType: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  images: Array<{
    id: number;
    url: string;
    tourId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  characteristics: Array<{
    id: number;
    name: string;
    tourId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const TourManagement: React.FC = () => {
  const navigate = useNavigate();
  const { url }: any = useStore();
  const [tours, setTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllTours();
      if (response.data) {
        setTours(response.data);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tour?')) {
      try {
        // TODO: Implement delete API call
        console.log('Delete tour:', id);
        await fetchTours();
      } catch (error) {
        console.error('Error deleting tour:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTour(null);
  };

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.tourType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tour-management-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons xl">explore</span>
            Gestión de Tours
          </h1>
          <p className="page-subtitle">
            Administra tus tours, itinerarios y experiencias turísticas
          </p>
        </div>
        <button
          className="btn btn-primary create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-icons">add_circle</span>
          Nuevo Tour
        </button>
      </div>

      {/* Tours Section */}
      <div className="tours-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="material-icons">list</span>
            Tours Disponibles
          </h2>
          <div className="section-actions">
            <div className="search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Buscar tours..."
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
            <p>Cargando tours...</p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">explore_off</span>
            <h3>No hay tours registrados</h3>
            <p>Crea tu primer tour para comenzar a ofrecer experiencias únicas</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-icons">add_circle</span>
              Crear Primer Tour
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="tours-grid-desktop desktop-only">
              {/* Table Header */}
              <div className="grid-header">
                <div className="grid-cell">Tour</div>
                <div className="grid-cell">Tipo</div>
                <div className="grid-cell">Capacidad</div>
                <div className="grid-cell">Precio/Hora</div>
                <div className="grid-cell">Ubicación</div>
                <div className="grid-cell">Estado</div>
                <div className="grid-cell">Acciones</div>
              </div>

              {/* Rows */}
              {filteredTours.map((tour) => (
                <div key={tour.id} className="grid-row">
                  <div className="grid-cell tour-cell">
                    <div className="tour-info-grid">
                      <div className="tour-thumbnail">
                        {tour.images && tour.images.length > 0 ? (
                          <img 
                            src={`${url}/${tour.images[0].url}`} 
                            alt={tour.name}
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const icon = target.nextElementSibling as HTMLElement;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span 
                          className="material-icons" 
                          style={{ display: tour.images && tour.images.length > 0 ? 'none' : 'flex' }}
                        >
                          explore
                        </span>
                      </div>
                      <div>
                        <div className="tour-name">{tour.name}</div>
                        <div className="tour-details">{tour.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid-cell type-cell">
                    {tour.tourType.name}
                  </div>
                  <div className="grid-cell capacity-cell">
                    <span className="material-icons sm">group</span>
                    {tour.capacity} personas
                  </div>
                  <div className="grid-cell price-cell">{formatPrice(tour.price)}</div>
                  <div className="grid-cell location-cell">{tour.location}</div>
                  <div className="grid-cell">
                    <span className="availability-badge available">
                      <span className="material-icons sm">check_circle</span>
                      Activo
                    </span>
                  </div>
                  <div className="grid-cell actions-cell">
                    <button
                      className="action-btn"
                      title="Ver detalles"
                      onClick={() => navigate(`/tours/detalle/${tour.id}`)}
                    >
                      <span className="material-icons">visibility</span>
                    </button>
                    <button
                      className="action-btn"
                      title="Editar"
                      onClick={() => handleEdit(tour)}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="action-btn danger"
                      title="Eliminar"
                      onClick={() => handleDelete(tour.id)}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards View */}
            <div className="tours-grid mobile-only">
              {filteredTours.map((tour) => (
                <div key={tour.id} className="tour-card">
                  <div className="card-image">
                    {tour.images && tour.images.length > 0 ? (
                      <img 
                        src={`${url}/${tour.images[0].url}`} 
                        alt={tour.name}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="tour-image-placeholder"
                      style={{ display: tour.images && tour.images.length > 0 ? 'none' : 'flex' }}
                    >
                      <span className="material-icons">explore</span>
                    </div>
                    <div className="availability-overlay available">
                      <span className="material-icons">check_circle</span>
                      <span>{tour.status}</span>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="tour-name">{tour.name}</h3>
                      <span className="tour-type">
                        {tour.tourType.name}
                      </span>
                    </div>

                    <div className="tour-specs">
                      <div className="spec">
                        <span className="material-icons sm">schedule</span>
                        <span>Capacidad: {tour.capacity}</span>
                      </div>
                      <div className="spec">
                        <span className="material-icons sm">group</span>
                        <span>{tour.capacity} personas</span>
                      </div>
                      <div className="spec">
                        <span className="material-icons sm">location_on</span>
                        <span>{tour.location}</span>
                      </div>
                    </div>

                    <div className="price-info">
                      <span className="price">{formatPrice(tour.price)}</span>
                      <span className="price-period">/hora</span>
                    </div>

                    {tour.characteristics && tour.characteristics.length > 0 && (
                      <div className="features-preview">
                        {tour.characteristics.slice(0, 3).map((characteristic) => (
                          <span key={characteristic.id} className="feature-tag">
                            {characteristic.name}
                          </span>
                        ))}
                        {tour.characteristics.length > 3 && (
                          <span className="feature-tag more">+{tour.characteristics.length - 3} más</span>
                        )}
                      </div>
                    )}

                    <div className="card-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/tours/detalle/${tour.id}`)}
                      >
                        <span className="material-icons sm">visibility</span>
                        Ver Detalles
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(tour)}
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

      {/* Tour Modal */}
      <TourModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchTours}
        editingTour={editingTour}
      />
    </div>
  );
};

export default TourManagement; 