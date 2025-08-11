import React, { useState, useEffect } from 'react';
import { usePopupStore } from '../../../../../../zustand/popupStore';
import APIs from '../../../../../../services/services/APIs';
import './styles/TourTypeModal.css';

interface TourTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingType?: any;
}

interface TourTypeForm {
  name: string;
}

const TourTypeModal: React.FC<TourTypeModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingType 
}) => {
  const { showSuccess, showError } = usePopupStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TourTypeForm>({
    name: ''
  });

  useEffect(() => {
    if (editingType) {
      setFormData({
        name: editingType.name
      });
    } else {
      setFormData({
        name: ''
      });
    }
  }, [editingType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name.trim()) {
        showError('El nombre de la categoría de tour es requerido');
        return;
      }

      if (editingType) {
        // Update existing tour type
        await APIs.updateTourType(editingType.id, formData);

        showSuccess('Categoría de tour actualizada exitosamente');
      } else {
        // Create new tour type
        await APIs.createTourType(formData);
        showSuccess('Categoría de tour creada exitosamente');
      }

      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving tour type:', error);
      
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else if (error.message) {
        showError(error.message);
      } else {
        showError('Error al guardar la categoría de tour');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '' });
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="tour-type-modal">
      <div className="modal-overlay" onClick={handleClose}>
        <div className="tour-type-modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <div className="modal-title">
              <span className="material-icons">category</span>
              <h2>{editingType ? 'Editar Categoría de Tour' : 'Nueva Categoría de Tour'}</h2>
            </div>
            <button className="close-btn" onClick={handleClose}>
              <span className="material-icons">close</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="modal-content">
            <form className="tour-type-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre del Tipo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Tour de Isla, Tour de Buceo, Tour Cultural"
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
                      {editingType ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <span className="material-icons">save</span>
                      {editingType ? 'Actualizar' : 'Crear'}
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

export default TourTypeModal; 