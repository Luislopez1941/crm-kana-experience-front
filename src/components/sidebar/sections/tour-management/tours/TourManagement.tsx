import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TourModal from './tour-modal/TourModal';
import APIs from '../../../../../services/services/APIs';

import './styles/TourManagement.css';

interface Tour {
  id: number;
  name: string;
  description: string;
  location: string;
  status: string;
  horarios?: string;
  duracion?: string;
  edadMinima?: string;
  transportacion?: string;
  tourCategoryId: number;
  tourCategory: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  pricing: Array<{
    personas: number;
    precio: number;
  }>;
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

interface TourCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const TourManagement: React.FC = () => {
  const navigate = useNavigate();

  const [tours, setTours] = useState<Tour[]>([]);
  const [tourCategories, setTourCategories] = useState<TourCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const fetchTourCategories = async () => {
    try {
      const response: any = await APIs.getAllTourTypes();
      if (response?.data) {
        setTourCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching tour categories:', error);
    }
  };

  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllTours();
      if (response.data) {
        setTours(response.data);
        setFilteredTours(response.data);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchToursByCategory = async (categoryId: number) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to get tours by category
      const response: any = await APIs.getAllTours();
      if (response?.data) {
        const filtered = response.data.filter((tour: Tour) => tour.tourCategoryId === categoryId);
        setFilteredTours(filtered);
      }
    } catch (error) {
      console.error('Error fetching tours by category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === '') {
      // Si no hay categoría seleccionada, mostrar todos los tours
      setFilteredTours(tours);
    } else {
      // Filtrar por categoría seleccionada
      fetchToursByCategory(Number(categoryId));
    }
  };

  const reloadFilteredData = () => {
    if (selectedCategory === '') {
      fetchTours();
    } else {
      fetchToursByCategory(Number(selectedCategory));
    }
  };

  // Función para filtrar tours por search term y categoría
  const getFilteredTours = () => {
    let filtered = tours;
    
    // Filtrar por categoría si hay una seleccionada
    if (selectedCategory !== '') {
      filtered = filtered.filter(tour => tour.tourCategoryId === Number(selectedCategory));
    }
    
    // Filtrar por search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(tour =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.tourCategory.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  useEffect(() => {
    fetchTours();
    fetchTourCategories();
  }, []);

  useEffect(() => {
    setFilteredTours(getFilteredTours());
  }, [tours, selectedCategory, searchTerm]);

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

  return (
    <div className="tour-management-page">
      {/* Page Header */}
      <div className="tour-management-page__page-header">
        <div className="tour-management-page__header-content">
          <h1 className="tour-management-page__page-title">
            <span className="material-icons xl">explore</span>
            Gestión de Tours
          </h1>
        </div>
        <button
          className="tour-management-page__new-tour-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-icons">add_circle</span>
          Nuevo Tour
        </button>
      </div>

      {/* Tours Section */}
      <div className="tour-management-page__tours-section">
        <div className="tour-management-page__section-header">
          <div className="tour-management-page__section-actions">
            <div className="tour-management-page__category-filter">
              <select
                className="tour-management-page__category-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {tourCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="tour-management-page__search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Buscar tours..."
                className="tour-management-page__search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="tour-management-page__loading-state">
            <div className="tour-management-page__loading-spinner"></div>
            <p>Cargando tours...</p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="tour-management-page__empty-state">
            <span className="material-icons">explore_off</span>
            <h3>No hay tours registrados</h3>
            <p>Crea tu primer tour para comenzar a ofrecer experiencias únicas</p>
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="tour-management-page__tours-grid-desktop tour-management-page__desktop-only">
              {/* Table Header */}
              <div className="tour-management-page__grid-header">
                <div className="tour-management-page__grid-cell">Tour</div>
                <div className="tour-management-page__grid-cell">Categoría</div>
                <div className="tour-management-page__grid-cell">Capacidad</div>
                <div className="tour-management-page__grid-cell">Precio/Persona</div>
                <div className="tour-management-page__grid-cell">Ubicación</div>
                <div className="tour-management-page__grid-cell">Estado</div>
                <div className="tour-management-page__grid-cell">Acciones</div>
              </div>

              {/* Rows */}
              {filteredTours.map((tour) => (
                <div key={tour.id} className="tour-management-page__grid-row">
                  <div className="tour-management-page__grid-cell tour-management-page__tour-cell">
                    <div className="tour-management-page__tour-info-grid">
                      <div className="tour-management-page__tour-thumbnail">
                        {tour.images && tour.images.length > 0 ? (
                          <img 
                            src={tour.images[0].url} 
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
                        <div className="tour-management-page__tour-name">{tour.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="tour-management-page__grid-cell tour-management-page__type-cell">
                    {tour.tourCategory.name}
                  </div>
                  <div className="tour-management-page__grid-cell tour-management-page__capacity-cell">
                    <span className="material-icons sm">group</span>
                    {tour.pricing && tour.pricing.length > 0 ? `${tour.pricing[0].personas} personas` : 'N/A'}
                  </div>
                  <div className="tour-management-page__grid-cell tour-management-page__price-cell">
                    {tour.pricing && tour.pricing.length > 0 ? formatPrice(tour.pricing[0].precio) : 'N/A'}
                  </div>
                  <div className="tour-management-page__grid-cell tour-management-page__location-cell">{tour.location}</div>
                  <div className="tour-management-page__grid-cell">
                    <span className="tour-management-page__availability-badge available">
                      <span className="material-icons sm">check_circle</span>
                      Activo
                    </span>
                  </div>
                  <div className="tour-management-page__grid-cell tour-management-page__actions-cell">
                    <button
                      className="tour-management-page__action-btn"
                      title="Ver detalles"
                      onClick={() => navigate(`/tours/detalle/${tour.id}`)}
                    >
                      <span className="material-icons">visibility</span>
                    </button>
                    <button
                      className="tour-management-page__action-btn"
                      title="Editar"
                      onClick={() => handleEdit(tour)}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="tour-management-page__action-btn danger"
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
            <div className="tour-management-page__tours-grid tour-management-page__mobile-only">
              {filteredTours.map((tour) => (
                <div key={tour.id} className="tour-management-page__tour-card">
                  <div className="tour-management-page__card-image">
                    {tour.images && tour.images.length > 0 ? (
                      <img 
                        src={tour.images[0].url} 
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
                      className="tour-management-page__tour-image-placeholder"
                      style={{ display: tour.images && tour.images.length > 0 ? 'none' : 'flex' }}
                    >
                      <span className="material-icons">explore</span>
                    </div>
                    <div className="tour-management-page__availability-overlay available">
                      <span className="material-icons">check_circle</span>
                      <span>{tour.status}</span>
                    </div>
                  </div>

                  <div className="tour-management-page__card-content">
                    <div className="tour-management-page__card-header">
                      <h3 className="tour-management-page__tour-name">{tour.name}</h3>
                      <span className="tour-management-page__tour-type">
                        {tour.tourCategory.name}
                      </span>
                    </div>

                    <div className="tour-management-page__tour-specs">
                      <div className="tour-management-page__spec">
                        <span className="material-icons sm">schedule</span>
                        <span>Capacidad: {tour.pricing && tour.pricing.length > 0 ? tour.pricing[0].personas : 'N/A'}</span>
                      </div>
                      <div className="tour-management-page__spec">
                        <span className="material-icons sm">group</span>
                        <span>{tour.pricing && tour.pricing.length > 0 ? `${tour.pricing[0].personas} personas` : 'N/A'}</span>
                      </div>
                      <div className="tour-management-page__spec">
                        <span className="material-icons sm">location_on</span>
                        <span>{tour.location}</span>
                      </div>
                    </div>

                    <div className="tour-management-page__price-info">
                      <span className="tour-management-page__price">{tour.pricing && tour.pricing.length > 0 ? formatPrice(tour.pricing[0].precio) : 'N/A'}</span>
                      <span className="tour-management-page__price-period">/persona</span>
                    </div>

                    {tour.characteristics && tour.characteristics.length > 0 && (
                      <div className="tour-management-page__features-preview">
                        {tour.characteristics.slice(0, 3).map((characteristic) => (
                          <span key={characteristic.id} className="tour-management-page__feature-tag">
                            {characteristic.name}
                          </span>
                        ))}
                        {tour.characteristics.length > 3 && (
                          <span className="tour-management-page__feature-tag more">+{tour.characteristics.length - 3} más</span>
                        )}
                      </div>
                    )}

                    <div className="tour-management-page__card-actions">
                      <button
                        className="tour-management-page__btn tour-management-page__btn-secondary tour-management-page__btn-sm"
                        onClick={() => navigate(`/tours/detalle/${tour.id}`)}
                      >
                        <span className="material-icons sm">visibility</span>
                        Ver Detalles
                      </button>
                      <button
                        className="tour-management-page__btn tour-management-page__btn-primary tour-management-page__btn-sm"
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