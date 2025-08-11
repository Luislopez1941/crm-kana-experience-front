import React, { useState, useEffect } from 'react';
import { usePopupStore } from '../../../../../../zustand/popupStore';
import APIs from '../../../../../../services/services/APIs';
import './styles/ClubTypeModal.css';

interface CreateClubTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingClubType?: any;
}

interface ClubTypeForm {
  name: string;
}

const ClubTypeModal: React.FC<CreateClubTypeModalProps> = ({ isOpen, onClose, onSuccess, editingClubType }) => {
  const { showSuccess, showError } = usePopupStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<ClubTypeForm>({
    name: ''
  });

  useEffect(() => {
    if (editingClubType) {
      setFormData({
        name: editingClubType.name || ''
      });
    } else {
      setFormData({
        name: ''
      });
    }
  }, [editingClubType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showError('Por favor ingresa el nombre del tipo de club');
      return;
    }

    setIsLoading(true);

    try {
      if (editingClubType) {
        // Update existing club type
        const response: any = await APIs.updateClubType(editingClubType.id, formData);
        showSuccess(response.message || 'Tipo de club actualizado exitosamente');
      } else {
        // Create new club type
        const response: any = await APIs.createClubType(formData);
        showSuccess(response.message || 'Tipo de club creado exitosamente');
      }
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Error saving club type:', error);
      
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else if (error.message) {
        showError(error.message);
      } else {
        showError('Error al guardar el tipo de club');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="club-type-modal">
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <div className="modal-title">
              <span className="material-icons">category</span>
              <h2>{editingClubType ? 'Editar Categoría de Club' : 'Nueva Categoría de Club'}</h2>
            </div>
            <button className="close-btn" onClick={handleClose}>
              <span className="material-icons">close</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="modal-content">
            <form className="club-type-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre de la Categoría *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Club Nocturno, Bar Lounge, etc."
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Modal Actions */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      {editingClubType ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <span className="material-icons">save</span>
                      {editingClubType ? 'Actualizar Categoría' : 'Crear Categoría'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubTypeModal; 