import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useYachtStore } from '../../../../../zustand/yachtStore';
import { useYachtCategoryStore } from '../../../../../zustand/yachtCategoryStore';
import YachtModal from './yacht-modal/YachtModal';
import APIs from '../../../../../services/services/APIs';
import './styles/YachtManagement.css';


const YachtManagement: React.FC = () => {

  const navigate = useNavigate();
  const {
    yachts,
   
    searchTerm,
    setSearchTerm,
    setYachts,
    setEditingYacht
  } = useYachtStore();

  const { yachtCategories, setYachtCategories } = useYachtCategoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredYachts, setFilteredYachts] = useState<any[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const fetchYachtCategories = async () => {
    try {
      const response: any = await APIs.getAllYachtType();
      if (response?.data) {
        setYachtCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching yacht categories:', error);
    }
  };

  const fetchYachts = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllYachts();
      if (response?.data) {
        console.log('🔍 YACHTS DATA:', response.data);
        console.log('🔍 FIRST YACHT:', response.data[0]);
        setYachts(response.data);
        setFilteredYachts(response.data);
      }
    } catch (error) {
      console.error('Error fetching yachts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchYachtsByCategory = async (categoryId: number) => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getYachtByYachtCategory(categoryId);
      if (response?.data) {
        console.log('🔍 YACHTS BY CATEGORY:', response.data);
        setFilteredYachts(response.data);
      }
    } catch (error) {
      console.error('Error fetching yachts by category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === '') {
      // Si no hay categoría seleccionada, mostrar todos los yates
      setFilteredYachts(yachts);
    } else {
      // Filtrar por categoría seleccionada
      fetchYachtsByCategory(Number(categoryId));
    }
  };

  const reloadFilteredData = () => {
    if (selectedCategory === '') {
      fetchYachts();
    } else {
      fetchYachtsByCategory(Number(selectedCategory));
    }
  };

  useEffect(() => {
    fetchYachts();
    fetchYachtCategories();
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
      <div className="yacht-management-page__page-header">
        <div className="yacht-management-page__header-content">
          <h1 className="yacht-management-page__page-title">
            <span className="material-icons xl">sailing</span>
            Gestión de Yates
          </h1>
        </div>
        <button
          className="yacht-management-page__new-yacht-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-icons">add_circle</span>
          Nuevo Yate
        </button>
      </div>

      {/* Yachts Section */}
      <div className="yacht-management-page__yachts-section">
        <div className="yacht-management-page__section-header">
          {/* <h2 className="yacht-management-page__section-title">
            <span className="material-icons">list</span>
            Flota Actual
          </h2> */}
          <div className="yacht-management-page__section-actions">
            <div className="yacht-management-page__category-filter">
              <select
                className="yacht-management-page__category-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {yachtCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="yacht-management-page__search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Buscar yates..."
                className="yacht-management-page__search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="yacht-management-page__loading-state">
            <div className="yacht-management-page__loading-spinner"></div>
            <p>Cargando yates...</p>
          </div>
        ) : filteredYachts.length === 0 ? (
          <div className="yacht-management-page__empty-state">
            <span className="material-icons">sailing</span>
            <h3>No hay yates registrados</h3>
            <p>Agrega tu primer yate para comenzar a gestionar la flota</p>
            <button
              className="yacht-management-page__first-yacht-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-icons">add_circle</span>
              Agregar Primer Yate
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="yacht-management-page__yachts-grid-desktop yacht-management-page__desktop-only">
              {/* Header */}
              <div className="yacht-management-page__grid-header">
                <div className="yacht-management-page__grid-cell">Yate</div>
                <div className="yacht-management-page__grid-cell">Tipo</div>
                <div className="yacht-management-page__grid-cell">Capacidad</div>
                <div className="yacht-management-page__grid-cell">Precio/Hora</div>
                <div className="yacht-management-page__grid-cell">Ubicación</div>
                <div className="yacht-management-page__grid-cell">Estado</div>
                <div className="yacht-management-page__grid-cell">Acciones</div>
              </div>

              {/* Rows */}
              {filteredYachts.map((yacht: any) => (
                <div key={yacht.id} className="yacht-management-page__grid-row">
                  <div className="yacht-management-page__grid-cell yacht-management-page__yacht-cell">
                    <div className="yacht-management-page__yacht-info-grid">
                      <img src={yacht.images?.[0].url} alt={yacht.name} className="yacht-management-page__yacht-thumbnail" />
                      <div>
                        <div className="yacht-management-page__yacht-name">{yacht.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="yacht-management-page__grid-cell yacht-management-page__type-cell">
                    {typeof yacht.yachtType === 'string'
                      ? yacht.yachtType
                      : (yacht.yachtType as any)?.name || 'Sin tipo'
                    }
                  </div>
                  <div className="yacht-management-page__grid-cell yacht-management-page__capacity-cell">
                    <span className="material-icons sm">group</span>
                    {yacht.capacity} personas
                  </div>
                  <div className="yacht-management-page__grid-cell yacht-management-page__price-cell">{formatPrice(yacht.pricePerDay)}</div>
                  <div className="yacht-management-page__grid-cell yacht-management-page__location-cell">{yacht.location}</div>
                  <div className="yacht-management-page__grid-cell">
                    <span className="yacht-management-page__availability-badge available">
                      <span className="material-icons sm">check_circle</span>
                      Disponible
                    </span>
                  </div>
                  <div className="yacht-management-page__grid-cell yacht-management-page__actions-cell">
                    <button
                      className="yacht-management-page__action-btn"
                      title="Ver detalles"
                      onClick={() => navigate(`/yates/detalle/${yacht.id}`)}
                    >
                      <span className="material-icons">visibility</span>
                    </button>
                    <button
                      className="yacht-management-page__action-btn"
                      title="Editar"
                      onClick={() => handleEdit(yacht)}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="yacht-management-page__action-btn danger"
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
            <div className="yacht-management-page__yachts-grid yacht-management-page__mobile-only">
              {filteredYachts.map((yacht) => (
                <div key={yacht.id} className="yacht-management-page__yacht-card">
                  <div className="yacht-management-page__card-image">
                    <img src={(yacht.images?.[0] as any)?.url || '/placeholder-yacht.jpg'} alt={yacht.name} />
                    <div className="yacht-management-page__availability-overlay available">
                      <span className="material-icons">check_circle</span>
                      <span>Disponible</span>
                    </div>
                  </div>

                  <div className="yacht-management-page__card-content">
                    <div className="yacht-management-page__card-header">
                      <h3 className="yacht-management-page__yacht-name">{yacht.name}</h3>
                      <span className="yacht-management-page__yacht-type">
                        {typeof yacht.yachtType === 'string'
                          ? yacht.yachtType
                          : (yacht.yachtType as any)?.name || 'Sin tipo'
                        }
                      </span>
                    </div>

                    <div className="yacht-management-page__yacht-specs">
                      <div className="yacht-management-page__spec">
                        <span className="material-icons">group</span>
                        <span>{yacht.capacity} personas</span>
                      </div>
                      <div className="yacht-management-page__spec">
                        <span className="material-icons">straighten</span>
                        <span>{yacht.length} pies</span>
                      </div>
                    </div>

                    <div className="yacht-management-page__price-info">
                      <span className="yacht-management-page__price">{formatPrice(yacht.pricePerDay)}</span>
                      <span className="yacht-management-page__price-period">/hora</span>
                    </div>

                    <div className="yacht-management-page__features-preview">
                      {yacht.characteristics?.slice(0, 3).map((characteristic: any, index: any) => (
                        <span key={index} className="yacht-management-page__feature-tag">
                          {characteristic}
                        </span>
                      ))}
                      {yacht.characteristics && yacht.characteristics.length > 3 && (
                        <span className="yacht-management-page__feature-tag more">
                          +{yacht.characteristics.length - 3} más
                        </span>
                      )}
                    </div>

                    <div className="yacht-management-page__card-actions">
                      <button
                        className="yacht-management-page__btn-sm yacht-management-page__btn-warning"
                        onClick={() => handleEdit(yacht)}
                      >
                        <span className="material-icons">edit</span>
                        Editar
                      </button>
                      <button
                        className="yacht-management-page__btn-sm yacht-management-page__btn-success"
                        onClick={() => navigate(`/yates/detalle/${yacht.id}`)}
                      >
                        <span className="material-icons">visibility</span>
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Yacht Modal */}
      <YachtModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={reloadFilteredData}
      />
    </div>
  );
};

export default YachtManagement;
