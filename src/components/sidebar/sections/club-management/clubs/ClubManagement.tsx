import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopupStore } from '../../../../../zustand/popupStore';
import APIs from '../../../../../services/services/APIs';
import ClubModal from './club-modal/ClubModal';

import './styles/ClubManagement.css';

interface Club {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  typeId: number;
  type: {
    id: number;
    name: string;
  };
  stateId: number;
  state: {
    id: number;
    name: string;
  };
  municipalityId: number;
  municipality: {
    id: number;
    name: string;
  };
  localityId: number;
  locality: {
    id: number;
    name: string;
  };
  images: Array<{
    id: number;
    url: string;
    clubId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ClubType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const ClubManagement: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = usePopupStore();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubTypes, setClubTypes] = useState<ClubType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);

  const fetchClubTypes = async () => {
    try {
      const response: any = await APIs.getAllClubTypes();
      if (response?.data) {
        setClubTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching club types:', error);
    }
  };

  const fetchClubs = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllClubs();
      if (response.data) {
        setClubs(response.data);
        setFilteredClubs(response.data);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClubsByType = async (typeId: number) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to get clubs by type
      const response: any = await APIs.getAllClubs();
      if (response?.data) {
        const filtered = response.data.filter((club: Club) => club.typeId === typeId);
        setFilteredClubs(filtered);
      }
    } catch (error) {
      console.error('Error fetching clubs by type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    
    if (typeId === '') {
      // Si no hay tipo seleccionado, mostrar todos los clubs
      setFilteredClubs(clubs);
    } else {
      // Filtrar por tipo seleccionado
      fetchClubsByType(Number(typeId));
    }
  };

  const reloadFilteredData = () => {
    if (selectedType === '') {
      fetchClubs();
    } else {
      fetchClubsByType(Number(selectedType));
    }
  };

  // Función para filtrar clubs por search term y tipo
  const getFilteredClubs = () => {
    let filtered = clubs;
    
    // Filtrar por tipo si hay uno seleccionado
    if (selectedType !== '') {
      filtered = filtered.filter(club => club.typeId === Number(selectedType));
    }
    
    // Filtrar por search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.type.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  useEffect(() => {
    fetchClubs();
    fetchClubTypes();
  }, []);

  useEffect(() => {
    setFilteredClubs(getFilteredClubs());
  }, [clubs, selectedType, searchTerm]);

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este club?')) {
      try {
        await APIs.deleteClub(id);
        showSuccess('Club eliminado exitosamente');
        await fetchClubs();
      } catch (error) {
        console.error('Error deleting club:', error);
        showError('Error al eliminar el club');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClub(null);
  };

  return (
    <div className="club-management-page">
      {/* Page Header */}
      <div className="club-management-page__page-header">
        <div className="club-management-page__header-content">
          <h1 className="club-management-page__page-title">
            <span className="material-icons xl">nightlife</span>
            Gestión de Clubs
          </h1>
          <p className="club-management-page__page-subtitle">
            Administra tus clubs, antros y lugares de entretenimiento
          </p>
        </div>
        <button
          className="club-management-page__new-club-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-icons">add_circle</span>
          Nuevo Club
        </button>
      </div>

      {/* Clubs Section */}
      <div className="club-management-page__clubs-section">
        <div className="club-management-page__section-header">
          <div className="club-management-page__section-actions">
            <div className="club-management-page__type-filter">
              <select
                className="club-management-page__type-select"
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {clubTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="club-management-page__search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Buscar clubs..."
                className="club-management-page__search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="club-management-page__loading-state">
            <div className="club-management-page__loading-spinner"></div>
            <p>Cargando clubs...</p>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="club-management-page__empty-state">
            <span className="material-icons">nightlife_off</span>
            <h3>No hay clubs registrados</h3>
            <p>Crea tu primer club para comenzar a gestionar el entretenimiento</p>
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="club-management-page__clubs-grid-desktop club-management-page__desktop-only">
              {/* Table Header */}
              <div className="club-management-page__grid-header">
                <div className="club-management-page__grid-cell">Club</div>
                <div className="club-management-page__grid-cell">Tipo</div>
                <div className="club-management-page__grid-cell">Ubicación</div>
                <div className="club-management-page__grid-cell">Contacto</div>
                <div className="club-management-page__grid-cell">Estado</div>
                <div className="club-management-page__grid-cell">Acciones</div>
              </div>

              {/* Rows */}
              {filteredClubs.map((club) => (
                <div key={club.id} className="club-management-page__grid-row">
                  <div className="club-management-page__grid-cell club-management-page__club-cell">
                    <div className="club-management-page__club-info-grid">
                      <div className="club-management-page__club-thumbnail">
                        {club.images && club.images.length > 0 ? (
                          <img 
                            src={club.images[0].url} 
                            alt={club.name}
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
                          style={{ display: club.images && club.images.length > 0 ? 'none' : 'flex' }}
                        >
                          nightlife
                        </span>
                      </div>
                      <div>
                        <div className="club-management-page__club-name">{club.name}</div>
                        <div className="club-management-page__club-details">{club.address}</div>
                      </div>
                    </div>
                  </div>
                  <div className="club-management-page__grid-cell club-management-page__type-cell">
                    {club.type.name}
                  </div>
                  <div className="club-management-page__grid-cell club-management-page__location-cell">
                    <span className="material-icons sm">location_on</span>
                    {club.locality.name}, {club.municipality.name}
                  </div>
                  <div className="club-management-page__grid-cell club-management-page__contact-cell">
                    <span className="material-icons sm">phone</span>
                    {club.phone || 'N/A'}
                  </div>
                  <div className="club-management-page__grid-cell">
                    <span className="club-management-page__availability-badge available">
                      <span className="material-icons sm">check_circle</span>
                      Activo
                    </span>
                  </div>
                  <div className="club-management-page__grid-cell club-management-page__actions-cell">
                    <button
                      className="club-management-page__action-btn"
                      title="Ver detalles"
                      onClick={() => navigate(`/clubs/detalle/${club.id}`)}
                    >
                      <span className="material-icons">visibility</span>
                    </button>
                    <button
                      className="club-management-page__action-btn"
                      title="Editar"
                      onClick={() => handleEdit(club)}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="club-management-page__action-btn danger"
                      title="Eliminar"
                      onClick={() => handleDelete(club.id)}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards View */}
            <div className="club-management-page__clubs-grid club-management-page__mobile-only">
              {filteredClubs.map((club) => (
                <div key={club.id} className="club-management-page__club-card">
                  <div className="club-management-page__card-image">
                    {club.images && club.images.length > 0 ? (
                      <img 
                        src={club.images[0].url} 
                        alt={club.name}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="club-management-page__club-image-placeholder"
                      style={{ display: club.images && club.images.length > 0 ? 'none' : 'flex' }}
                    >
                      <span className="material-icons">nightlife</span>
                    </div>
                    <div className="club-management-page__availability-overlay available">
                      <span className="material-icons">check_circle</span>
                      <span>Activo</span>
                    </div>
                  </div>

                  <div className="club-management-page__card-content">
                    <div className="club-management-page__card-header">
                      <h3 className="club-management-page__club-name">{club.name}</h3>
                      <span className="club-management-page__club-type">
                        {club.type.name}
                      </span>
                    </div>

                    <div className="club-management-page__club-specs">
                      <div className="club-management-page__spec">
                        <span className="material-icons sm">location_on</span>
                        <span>{club.address}</span>
                      </div>
                      <div className="club-management-page__spec">
                        <span className="material-icons sm">map</span>
                        <span>{club.locality.name}, {club.municipality.name}</span>
                      </div>
                      <div className="club-management-page__spec">
                        <span className="material-icons sm">phone</span>
                        <span>{club.phone || 'Sin teléfono'}</span>
                      </div>
                    </div>

                    {club.website && (
                      <div className="club-management-page__website-info">
                        <span className="material-icons sm">language</span>
                        <a href={club.website} target="_blank" rel="noopener noreferrer">
                          {club.website}
                        </a>
                      </div>
                    )}

                    <div className="club-management-page__card-actions">
                      <button
                        className="club-management-page__btn club-management-page__btn-secondary club-management-page__btn-sm"
                        onClick={() => navigate(`/clubs/detalle/${club.id}`)}
                      >
                        <span className="material-icons sm">visibility</span>
                        Ver Detalles
                      </button>
                      <button
                        className="club-management-page__btn club-management-page__btn-primary club-management-page__btn-sm"
                        onClick={() => handleEdit(club)}
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

      {/* Club Modal */}
      <ClubModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchClubs}
        editingClub={editingClub}
      />
    </div>
  );
};

export default ClubManagement; 