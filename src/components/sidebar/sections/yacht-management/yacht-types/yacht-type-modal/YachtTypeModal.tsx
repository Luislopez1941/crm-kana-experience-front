import React, { useState, useEffect, useCallback } from 'react';
import { useYachtTypeStore } from '../../../../../../zustand/yachtTypeStore';
import { usePopupStore } from '../../../../../../zustand/popupStore';
import useUserStore from '../../../../../../zustand/useUserStore';
import APIs from '../../../../../../services/services/APIs';
import './styles/YachtTypeModal.css';

interface State {
  id: number;
  name: string;
}

interface Municipality {
  id: number;
  name: string;
}

interface Locality {
  id: number;
  name: string;
}

interface YachtTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface YachtTypeForm {
  name: string;
  stateId: number;
  municipalityId: number;
  localityId: number;
}

const YachtTypeModal: React.FC<YachtTypeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { editingType } = useYachtTypeStore();
  const { showSuccess, showError } = usePopupStore();
  const { user } = useUserStore();
  const [formData, setFormData] = useState<YachtTypeForm>({
    name: '',
    stateId: 0,
    municipalityId: 0,
    localityId: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [states, setStates] = useState<State[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false);

  // Fetch states
  const fetchStates = useCallback(async () => {
    setIsLoadingStates(true);
    try {
      const response: any = await APIs.getAllStates();
      if (response.data) {
        setStates(response.data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setIsLoadingStates(false);
    }
  }, []);

  // Fetch municipalities
  const fetchMunicipalities = useCallback(async (stateId: number) => {
    setIsLoadingMunicipalities(true);
    try {
      const response: any = await APIs.getMunicipalitiesByState(stateId);
      if (response.data) {
        setMunicipalities(response.data);
      }
    } catch (error) {
      console.error('Error fetching municipalities:', error);
    } finally {
      setIsLoadingMunicipalities(false);
    }
  }, []);

  // Fetch localities
  const fetchLocalities = useCallback(async (municipalityId: number) => {
    setIsLoadingLocalities(true);
    try {
      const response: any = await APIs.getLocalitiesByMunicipality(municipalityId);
      if (response.data) {
        setLocalities(response.data);
      }
    } catch (error) {
      console.error('Error fetching localities:', error);
    } finally {
      setIsLoadingLocalities(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchStates();
    }
  }, [isOpen, fetchStates]);

  // Handle state change
  useEffect(() => {
    if (formData.stateId && formData.stateId !== 0) {
      fetchMunicipalities(formData.stateId);
      setFormData(prev => ({
        ...prev,
        municipalityId: 0,
        localityId: 0
      }));
      setLocalities([]);
    }
  }, [formData.stateId, fetchMunicipalities]);

  // Handle municipality change
  useEffect(() => {
    if (formData.municipalityId && formData.municipalityId !== 0) {
      fetchLocalities(formData.municipalityId);
      setFormData(prev => ({
        ...prev,
        localityId: 0
      }));
    }
  }, [formData.municipalityId, fetchLocalities]);

  useEffect(() => {
    if (editingType) {
      setFormData({
        name: editingType.name,
        stateId: editingType.stateId || 0,
        municipalityId: editingType.municipalityId || 0,
        localityId: editingType.localityId || 0
      });
      
      // Load municipalities and localities if editing
      if (editingType.stateId) {
        fetchMunicipalities(editingType.stateId);
      }
      if (editingType.municipalityId) {
        fetchLocalities(editingType.municipalityId);
      }
    } else {
      setFormData({
        name: '',
        stateId: 0,
        municipalityId: 0,
        localityId: 0
      });
    }
    setErrors({});
  }, [editingType, isOpen, fetchMunicipalities, fetchLocalities]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del tipo es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'El nombre no puede exceder 50 caracteres';
    }

    if (!formData.stateId || formData.stateId === 0) {
      newErrors.stateId = 'Debe seleccionar un estado';
    }

    if (!formData.municipalityId || formData.municipalityId === 0) {
      newErrors.municipalityId = 'Debe seleccionar un municipio';
    }

    if (!formData.localityId || formData.localityId === 0) {
      newErrors.localityId = 'Debe seleccionar una localidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stateId' || name === 'municipalityId' || name === 'localityId' ? Number(value) : value
    }));
    
    // Clear error when user starts typing/selecting
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
        const updateData = { ...formData, userId: user.id, typeUser: user.role.name };
        console.log('🔄 Updating yacht type with data:', updateData);
        const response: any = await APIs.updateYachtType(editingType.id, updateData);
        showSuccess(response.message || 'Categoría de yate actualizada exitosamente');
        onSuccess(); // Recargar datos
        handleClose();
      } else {
        // Create new yacht type
        const createData = { ...formData, userId: user.id, typeUser: user.role.name };
        console.log('🆕 Creating yacht type with data:', createData);
        const response = await APIs.createYachtType(createData);
        const responseData = response as any;
        showSuccess(responseData.message || 'Categoría de yate creada exitosamente');
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
        showError('Error al guardar la categoría de yate');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ 
      name: '',
      stateId: 0,
      municipalityId: 0,
      localityId: 0
    });
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
            {editingType ? 'Editar Categoría de Yate' : 'Nueva Categoría de Yate'}
          </h2>
          <button className="yacht-type-close-btn" onClick={handleClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <form className="yacht-type-modal-form" onSubmit={handleSubmit}>
          <div className="yacht-type-form-group">
            <label htmlFor="name" className="yacht-type-form-label">
              Nombre de la Categoría *
            </label>
            <div className="yacht-type-input-wrapper">
              <span className="material-icons yacht-type-input-icon">category</span>
              <input
                type="text"
                id="name"
                name="name"
                className={`yacht-type-form-input ${errors.name ? 'error' : ''}`}
                placeholder="Ej: Yate de Lujo, Catamarán, Velero, Lancha..."
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

          <div className="yacht-type-form-group">
            <label htmlFor="stateId" className="yacht-type-form-label">
              Estado *
            </label>
            <div className="yacht-type-input-wrapper">
              <span className="material-icons yacht-type-input-icon">location_on</span>
              <select
                id="stateId"
                name="stateId"
                className={`yacht-type-form-select ${errors.stateId ? 'error' : ''}`}
                value={formData.stateId}
                onChange={handleInputChange}
                required
                disabled={isLoading || isLoadingStates}
              >
                <option value={0}>
                  {isLoadingStates ? 'Cargando estados...' : 'Seleccionar estado'}
                </option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>
            {errors.stateId && (
              <p className="yacht-type-form-error">{errors.stateId}</p>
            )}
          </div>

          <div className="yacht-type-form-group">
            <label htmlFor="municipalityId" className="yacht-type-form-label">
              Municipio *
            </label>
            <div className="yacht-type-input-wrapper">
              <span className="material-icons yacht-type-input-icon">location_city</span>
              <select
                id="municipalityId"
                name="municipalityId"
                className={`yacht-type-form-select ${errors.municipalityId ? 'error' : ''}`}
                value={formData.municipalityId}
                onChange={handleInputChange}
                required
                disabled={isLoading || isLoadingMunicipalities || !formData.stateId}
              >
                <option value={0}>
                  {isLoadingMunicipalities ? 'Cargando municipios...' : 
                   !formData.stateId ? 'Selecciona un estado primero' : 'Seleccionar municipio'}
                </option>
                {municipalities.map(municipality => (
                  <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
                ))}
              </select>
            </div>
            {errors.municipalityId && (
              <p className="yacht-type-form-error">{errors.municipalityId}</p>
            )}
          </div>

          <div className="yacht-type-form-group">
            <label htmlFor="localityId" className="yacht-type-form-label">
              Localidad *
            </label>
            <div className="yacht-type-input-wrapper">
              <span className="material-icons yacht-type-input-icon">location_on</span>
              <select
                id="localityId"
                name="localityId"
                className={`yacht-type-form-select ${errors.localityId ? 'error' : ''}`}
                value={formData.localityId}
                onChange={handleInputChange}
                required
                disabled={isLoading || isLoadingLocalities || !formData.municipalityId}
              >
                <option value={0}>
                  {isLoadingLocalities ? 'Cargando localidades...' : 
                   !formData.municipalityId ? 'Selecciona un municipio primero' : 'Seleccionar localidad'}
                </option>
                {localities.map(locality => (
                  <option key={locality.id} value={locality.id}>{locality.name}</option>
                ))}
              </select>
            </div>
            {errors.localityId && (
              <p className="yacht-type-form-error">{errors.localityId}</p>
            )}
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
              disabled={isLoading || !formData.name.trim() || !formData.stateId || !formData.municipalityId || !formData.localityId}
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