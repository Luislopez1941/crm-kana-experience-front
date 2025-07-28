import React, { useState, useEffect } from 'react';
import { useYachtTypeStore } from '../../../../../../zustand/yachtTypeStore';
import { usePopupStore } from '../../../../../../zustand/popupStore';
import APIs from '../../../../../../services/services/APIs';
import './styles/YachtTypeModal.css';

interface YachtTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface YachtTypeForm {
  name: string;
}

const YachtTypeModal: React.FC<YachtTypeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { editingType } = useYachtTypeStore();
  const { showSuccess, showError } = usePopupStore();
  const [formData, setFormData] = useState<YachtTypeForm>({
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    setErrors({});
  }, [editingType, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del tipo es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'El nombre no puede exceder 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (editingType) {
        // Update existing yacht type
        const response: any = await APIs.updateYachtType(editingType.id, formData);
        showSuccess(response.message || 'Tipo de yate actualizado exitosamente');
        onSuccess(); // Recargar datos
        handleClose();
      } else {
        // Create new yacht type
        const response = await APIs.createYachtType(formData);
        const responseData = response as any;
        showSuccess(responseData.message || 'Tipo de yate creado exitosamente');
        onSuccess(); // Recargar datos
        handleClose();
      }
    } catch (error: any) {
      console.error('Error saving yacht type:', error);
      
      // Handle different types of errors
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else if (error.message) {
        showError(error.message);
      } else {
        showError('Error al guardar el tipo de yate');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '' });
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="yacht-type-modal-overlay" onClick={handleClose}>
      <div className="yacht-type-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="yacht-type-modal-header">
          <h2 className="yacht-type-modal-title">
            <span className="material-icons">category</span>
            {editingType ? 'Editar Tipo de Yate' : 'Nuevo Tipo de Yate'}
          </h2>
          <button className="yacht-type-close-btn" onClick={handleClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <form className="yacht-type-modal-form" onSubmit={handleSubmit}>
          <div className="yacht-type-form-group">
            <label htmlFor="name" className="yacht-type-form-label">
              Nombre del Tipo *
            </label>
            <div className="yacht-type-input-wrapper">
              <span className="material-icons yacht-type-input-icon">category</span>
              <input
                type="text"
                id="name"
                name="name"
                className={`yacht-type-form-input ${errors.name ? 'error' : ''}`}
                placeholder="Ej: Yate de Lujo, Catamarán, Velero..."
                value={formData.name}
                onChange={handleInputChange}
                required
                autoFocus
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="yacht-type-form-error">{errors.name}</p>
            )}
            <p className="yacht-type-form-help">
              Define una categoría clara para agrupar yates similares (3-50 caracteres)
            </p>
          </div>

          <div className="yacht-type-modal-actions">
            <button 
              type="button" 
              className="yacht-type-btn yacht-type-btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="yacht-type-btn yacht-type-btn-primary"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? (
                <>
                  <div className="yacht-type-loading-spinner"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span className="material-icons">
                    {editingType ? 'save' : 'add'}
                  </span>
                  <span>{editingType ? 'Actualizar' : 'Crear'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YachtTypeModal; 