import React, { useState, useEffect } from 'react';
import ClubModal from './club-modal/ClubModal';
import APIs from '../../../../../services/services/APIs';
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
    createdAt: string;
    updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

const ClubManagement: React.FC = () => {

  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat('es-MX', {
  //     style: 'currency',
  //     currency: 'MXN'
  //   }).format(price);
  // };

  const fetchClubs = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllClubs();
      if (response.data) {
        setClubs(response.data);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este club?')) {
      try {
        // TODO: Implement delete API call
        console.log('Delete club:', id);
        await fetchClubs();
      } catch (error) {
        console.error('Error deleting club:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClub(null);
  };

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (club.address && club.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (club.type && club.type.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="club-management-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons xl">nightlife</span>
            Gestión de Clubs
          </h1>
          <p className="page-subtitle">
            Administra tus clubs, eventos y experiencias nocturnas
          </p>
        </div>
        <button
          className="btn btn-primary create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-icons">add_circle</span>
          Nuevo Club
        </button>
      </div>

      {/* Clubs Section */}
      <div className="clubs-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="material-icons">list</span>
            Clubs Disponibles
          </h2>
          <div className="section-actions">
            <div className="search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Buscar clubs..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <span className="material-icons">hourglass_empty</span>
            <p>Cargando clubs...</p>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">nightlife_off</span>
            <h3>No hay clubs registrados</h3>
            <p>Crea tu primer club para comenzar a ofrecer experiencias nocturnas</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-icons">add_circle</span>
              Crear Primer Club
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="clubs-grid-desktop desktop-only">
              <div className="grid-header">
                <div className="grid-cell">Club</div>
                <div className="grid-cell">Tipo</div>
                <div className="grid-cell">Dirección</div>
                <div className="grid-cell">Teléfono</div>
                <div className="grid-cell">Localidad</div>
                <div className="grid-cell">Estado</div>
                <div className="grid-cell">Acciones</div>
              </div>
              {filteredClubs.map((club) => (
                <div key={club.id} className="grid-row">
                  <div className="grid-cell club-cell">
                    <div className="club-info">
                      <div className="club-name">{club.name}</div>
                      <div className="club-description">{club.description || 'Sin descripción'}</div>
                    </div>
                  </div>
                  <div className="grid-cell">{club.type?.name || 'Sin tipo'}</div>
                  <div className="grid-cell">{club.address || 'Sin dirección'}</div>
                  <div className="grid-cell">{club.phone || 'Sin teléfono'}</div>
                  <div className="grid-cell">{club.locality?.name || 'Sin localidad'}</div>
                  <div className="grid-cell">
                    <span className="status-badge active">Activo</span>
                  </div>
                  <div className="grid-cell actions-cell">
                    <button
                      className="btn btn-icon edit-btn"
                      onClick={() => handleEdit(club)}
                      title="Editar club"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="btn btn-icon delete-btn"
                      onClick={() => handleDelete(club.id)}
                      title="Eliminar club"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards View */}
            <div className="clubs-cards mobile-only">
              {filteredClubs.map((club) => (
                <div key={club.id} className="club-card">
                  <div className="card-header">
                    <div className="club-title">
                      <span className="material-icons">nightlife</span>
                      <h3>{club.name}</h3>
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn btn-icon edit-btn"
                        onClick={() => handleEdit(club)}
                      >
                        <span className="material-icons">edit</span>
                      </button>
                      <button
                        className="btn btn-icon delete-btn"
                        onClick={() => handleDelete(club.id)}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <p className="club-description">{club.description || 'Sin descripción'}</p>
                    
                    <div className="club-details">
                      <div className="detail">
                        <span className="material-icons sm">category</span>
                        <span>{club.type?.name || 'Sin tipo'}</span>
                      </div>
                      <div className="detail">
                        <span className="material-icons sm">phone</span>
                        <span>{club.phone || 'Sin teléfono'}</span>
                      </div>
                      <div className="detail">
                        <span className="material-icons sm">location_on</span>
                        <span>{club.address || 'Sin dirección'}</span>
                      </div>
                      <div className="detail">
                        <span className="material-icons sm">place</span>
                        <span>{club.locality?.name || 'Sin localidad'}</span>
                      </div>
                    </div>

                    {club.website && (
                      <div className="website-info">
                        <span className="material-icons sm">language</span>
                        <a href={club.website} target="_blank" rel="noopener noreferrer">
                          {club.website}
                        </a>
                      </div>
                    )}
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