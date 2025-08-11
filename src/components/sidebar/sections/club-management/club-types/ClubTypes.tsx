import React, { useState, useEffect } from 'react';
import { usePopupStore } from '../../../../../zustand/popupStore';
import APIs from '../../../../../services/services/APIs';
import ClubTypeModal from './club-type-modal/ClubTypeModal';
import './styles/ClubTypes.css';

const ClubTypes: React.FC = () => {
  const [clubTypes, setClubTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClubType, setEditingClubType] = useState<any>(null);
  const { showSuccess, showError } = usePopupStore();

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

  const handleCreate = () => {
    setEditingClubType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (clubType: any) => {
    setEditingClubType(clubType);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de club?')) {
      try {
        await APIs.deleteClubType(id);
        showSuccess('Tipo de club eliminado exitosamente');
        fetchClubTypes();
      } catch (error: any) {
        console.error('Error deleting club type:', error);
        if (error.response?.data?.message) {
          showError(error.response.data.message);
        } else {
          showError('Error al eliminar el tipo de club');
        }
      }
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setEditingClubType(null);
    fetchClubTypes();
  };

  return (
    <div className="club-types-container">
      <div className="club-types-header">
        <div className="header-content">
          <h1>Categorías de Club</h1>
          <p>Gestiona los diferentes tipos de club disponibles en el sistema</p>
        </div>
        <button 
          className="create-btn"
          onClick={handleCreate}
          disabled={isLoading}
        >
          <span className="material-icons">add</span>
          Nueva Categoría
        </button>
      </div>

      <div className="club-types-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando categorías...</p>
          </div>
        ) : clubTypes.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">category</span>
            <h3>No hay categorías de club</h3>
            <p>Comienza creando tu primera categoría de club</p>
            <button 
              className="create-first-btn"
              onClick={handleCreate}
            >
              <span className="material-icons">add</span>
              Crear Primera Categoría
            </button>
          </div>
        ) : (
          <div className="club-types-grid">
            {clubTypes.map((clubType) => (
              <div key={clubType.id} className="club-type-card">
                <div className="card-header">
                  <div className="club-type-info">
                    <span className="material-icons">category</span>
                    <h3>{clubType.name}</h3>
                  </div>
                  <div className="card-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(clubType)}
                      title="Editar"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(clubType.id)}
                      title="Eliminar"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="club-type-details">
                    <p><strong>ID:</strong> {clubType.id}</p>
                    <p><strong>Creado:</strong> {new Date(clubType.createdAt).toLocaleDateString()}</p>
                    <p><strong>Actualizado:</strong> {new Date(clubType.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClubTypeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClubType(null);
        }}
        onSuccess={handleModalSuccess}
        editingClubType={editingClubType}
      />
    </div>
  );
};

export default ClubTypes; 