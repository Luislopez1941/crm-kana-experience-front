import React, { useState, useEffect } from 'react';
import ClubTypeModal from './club-type-modal/ClubTypeModal';
import APIs from '../../../../../services/services/APIs';
import './styles/ClubTypes.css';

interface ClubType {
  id: number;
  name: string;
  clubs: any[];
  createdAt: string;
  updatedAt: string;
}

const ClubTypes: React.FC = () => {
  const [clubTypes, setClubTypes] = useState<ClubType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingType, setEditingType] = useState<ClubType | null>(null);

  const fetchClubTypes = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllClubTypes();
      if (response.data) {
        setClubTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching club types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClubTypes();
  }, []);

  const handleEdit = (clubType: ClubType) => {
    setEditingType(clubType);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de club?')) {
      try {
        await APIs.deleteClubType(id);
        await fetchClubTypes();
      } catch (error) {
        console.error('Error deleting club type:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
  };

  const filteredClubTypes = clubTypes.filter(clubType =>
    clubType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="club-types-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons xl">category</span>
            Tipos de Club
          </h1>
          <p className="page-subtitle">
            Administra las categorías y tipos de clubs disponibles
          </p>
        </div>
        <button
          className="btn btn-primary create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-icons">add_circle</span>
          Nuevo Tipo de Club
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">
            <span className="material-icons">category</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{clubTypes.length}</div>
            <div className="stat-label">Tipos de Club</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <span className="material-icons">nightlife</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{clubTypes.reduce((acc, type) => acc + type.clubs.length, 0)}</div>
            <div className="stat-label">Clubs Totales</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <span className="material-icons">trending_up</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{clubTypes.filter(type => type.clubs.length > 0).length}</div>
            <div className="stat-label">Tipos Activos</div>
          </div>
        </div>
      </div>

      {/* Club Types Section */}
      <div className="club-types-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="material-icons">list</span>
            Categorías de Clubs
          </h2>
          <div className="section-actions">
            <div className="search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Buscar tipos de club..."
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
            <p>Cargando tipos de club...</p>
          </div>
        ) : filteredClubTypes.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">category</span>
            <h3>No hay tipos de club registrados</h3>
            <p>Crea tu primer tipo de club para organizar tus experiencias nocturnas</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-icons">add_circle</span>
              Crear Primer Tipo
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="club-types-grid-desktop desktop-only">
              <div className="grid-header">
                <div className="grid-cell">Tipo de Club</div>
                <div className="grid-cell">Descripción</div>
                <div className="grid-cell">Clubs</div>
                <div className="grid-cell">Estado</div>
                <div className="grid-cell">Acciones</div>
              </div>
              {filteredClubTypes.map((clubType) => (
                <div key={clubType.id} className="grid-row">
                  <div className="grid-cell club-type-cell">
                    <div className="club-type-info">
                      <div className="club-type-name">{clubType.name}</div>
                    </div>
                  </div>
                  <div className="grid-cell">-</div>
                  <div className="grid-cell">{clubType.clubs.length} clubs</div>
                  <div className="grid-cell">
                    <span className={`status-badge ${clubType.clubs.length > 0 ? 'active' : 'inactive'}`}>
                      {clubType.clubs.length > 0 ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="grid-cell actions-cell">
                    <button
                      className="btn btn-icon edit-btn"
                      onClick={() => handleEdit(clubType)}
                      title="Editar tipo de club"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="btn btn-icon delete-btn"
                      onClick={() => handleDelete(clubType.id)}
                      title="Eliminar tipo de club"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards View */}
            <div className="club-types-cards mobile-only">
              {filteredClubTypes.map((clubType) => (
                <div key={clubType.id} className="club-type-card">
                  <div className="card-header">
                    <div className="club-type-title">
                      <span className="material-icons">category</span>
                      <h3>{clubType.name}</h3>
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn btn-icon edit-btn"
                        onClick={() => handleEdit(clubType)}
                      >
                        <span className="material-icons">edit</span>
                      </button>
                      <button
                        className="btn btn-icon delete-btn"
                        onClick={() => handleDelete(clubType.id)}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <p className="club-type-description">Tipo de club</p>
                    
                    <div className="club-type-details">
                      <div className="detail">
                        <span className="material-icons sm">nightlife</span>
                        <span>{clubType.clubs.length} clubs</span>
                      </div>
                      <div className="detail">
                        <span className="material-icons sm">schedule</span>
                        <span>Actualizado: {new Date(clubType.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="status-info">
                      <span className={`status-badge ${clubType.clubs.length > 0 ? 'active' : 'inactive'}`}>
                        {clubType.clubs.length > 0 ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Club Type Modal */}
      <ClubTypeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchClubTypes}
        editingType={editingType}
      />
    </div>
  );
};

export default ClubTypes; 