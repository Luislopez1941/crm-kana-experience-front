import React, { useState, useEffect, useCallback } from 'react';
import { usePopupStore } from '../../../../../../zustand/popupStore';
import useUserStore from '../../../../../../zustand/useUserStore';
import APIs from '../../../../../../services/services/APIs';
import './styles/TourTypeModal.css';

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

interface TourTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingType?: any;
}

interface TourTypeForm {
  name: string;
  stateId: number;
  municipalityId: number;
  localityId: number;
}

const TourTypeModal: React.FC<TourTypeModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingType 
}) => {
  const { showSuccess, showError } = usePopupStore();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TourTypeForm>({
    name: '',
    stateId: 0,
    municipalityId: 0,
    localityId: 0
  });
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
        // Update existing tour type
        const updateData = { ...formData, userId: user.id, typeUser: user.role.name };
        console.log('🔄 Updating tour type with data:', updateData);
        await APIs.updateTourType(editingType.id, updateData);

        showSuccess('Categoría de tour actualizada exitosamente');
      } else {
        // Create new tour type
        const createData = { ...formData, userId: user.id, typeUser: user.role.name };
        console.log('🆕 Creating tour type with data:', createData);
        await APIs.createTourType(createData);
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
                  className={errors.name ? 'error' : ''}
                  placeholder="Ej: Tour de Isla, Tour de Buceo, Tour Cultural"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="form-error">{errors.name}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="stateId">Estado *</label>
                <select
                  id="stateId"
                  name="stateId"
                  className={errors.stateId ? 'error' : ''}
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
                {errors.stateId && (
                  <p className="form-error">{errors.stateId}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="municipalityId">Municipio *</label>
                <select
                  id="municipalityId"
                  name="municipalityId"
                  className={errors.municipalityId ? 'error' : ''}
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
                {errors.municipalityId && (
                  <p className="form-error">{errors.municipalityId}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="localityId">Localidad *</label>
                <select
                  id="localityId"
                  name="localityId"
                  className={errors.localityId ? 'error' : ''}
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
                {errors.localityId && (
                  <p className="form-error">{errors.localityId}</p>
                )}
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
                  disabled={isLoading || !formData.name.trim() || !formData.stateId || !formData.municipalityId || !formData.localityId}
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