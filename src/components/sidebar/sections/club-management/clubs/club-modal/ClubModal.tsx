import React, { useState, useEffect } from 'react';
import { usePopupStore } from '../../../../../../zustand/popupStore';
import APIs from '../../../../../../services/services/APIs';
import './styles/ClubModal.css';

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingClub?: any;
}

interface ClubForm {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  typeId: number;
  stateId: number;
  municipalityId: number;
  localityId: number;
}

const ClubModal: React.FC<CreateClubModalProps> = ({ isOpen, onClose, onSuccess, editingClub }) => {
  const { showSuccess, showError } = usePopupStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false);
  
  const [formData, setFormData] = useState<ClubForm>({
    name: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    typeId: 0,
    stateId: 0,
    municipalityId: 0,
    localityId: 0
  });

  const [clubTypes, setClubTypes] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);

  // Fetch club types
  const fetchClubTypes = async () => {
    setIsLoadingTypes(true);
    try {
      const response: any = await APIs.getAllClubTypes();
      if (response.data) {
        setClubTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching club types:', error);
      showError('Error al cargar los tipos de club');
    } finally {
      setIsLoadingTypes(false);
    }
  };

  // Fetch states
  const fetchStates = async () => {
    setIsLoadingStates(true);
    try {
      const response: any = await APIs.getAllStates();
      if (response.data) {
        setStates(response.data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      showError('Error al cargar los estados');
    } finally {
      setIsLoadingStates(false);
    }
  };

  // Fetch municipalities
  const fetchMunicipalities = async (stateId: number) => {
    setIsLoadingMunicipalities(true);
    try {
      const response: any = await APIs.getMunicipalitiesByState(stateId);
      if (response.data) {
        setMunicipalities(response.data);
      }
    } catch (error) {
      console.error('Error fetching municipalities:', error);
      showError('Error al cargar los municipios');
    } finally {
      setIsLoadingMunicipalities(false);
    }
  };

  // Fetch localities
  const fetchLocalities = async (municipalityId: number) => {
    setIsLoadingLocalities(true);
    try {
      const response: any = await APIs.getLocalitiesByMunicipality(municipalityId);
      if (response.data) {
        setLocalities(response.data);
      }
    } catch (error) {
      console.error('Error fetching localities:', error);
      showError('Error al cargar las localidades');
    } finally {
      setIsLoadingLocalities(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (isOpen) {
      fetchClubTypes();
      fetchStates();
    }
  }, [isOpen]);

  // Load editing club data
  useEffect(() => {
    if (editingClub) {
      setFormData({
        name: editingClub.name || '',
        description: editingClub.description || '',
        address: editingClub.address || '',
        phone: editingClub.phone || '',
        website: editingClub.website || '',
        typeId: editingClub.typeId || 0,
        stateId: editingClub.stateId || 0,
        municipalityId: editingClub.municipalityId || 0,
        localityId: editingClub.localityId || 0
      });

      // Load related data
      if (editingClub.stateId) {
        fetchMunicipalities(editingClub.stateId);
      }
      if (editingClub.municipalityId) {
        fetchLocalities(editingClub.municipalityId);
      }
    } else {
      // Reset form for new club
      setFormData({
        name: '',
        description: '',
        address: '',
        phone: '',
        website: '',
        typeId: 0,
        stateId: 0,
        municipalityId: 0,
        localityId: 0
      });
      setMunicipalities([]);
      setLocalities([]);
    }
  }, [editingClub]);

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
  }, [formData.stateId]);

  // Handle municipality change
  useEffect(() => {
    if (formData.municipalityId && formData.municipalityId !== 0) {
      fetchLocalities(formData.municipalityId);
      setFormData(prev => ({
        ...prev,
        localityId: 0
      }));
    }
  }, [formData.municipalityId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'typeId' || name === 'stateId' || name === 'municipalityId' || name === 'localityId' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.typeId || !formData.stateId || !formData.municipalityId || !formData.localityId) {
        showError('Por favor completa todos los campos requeridos');
        return;
      }

      if (editingClub) {
        // Update existing club
        const response: any = await APIs.updateClub(editingClub.id, formData);
        showSuccess(response.message || 'Club actualizado exitosamente');
        onSuccess();
        handleClose();
      } else {
        // Create new club
        const response: any = await APIs.createClub(formData);
        showSuccess(response.message || 'Club creado exitosamente');
        onSuccess();
        handleClose();
      }
    } catch (error: any) {
      console.error('Error saving club:', error);
      
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else if (error.message) {
        showError(error.message);
      } else {
        showError('Error al guardar el club');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      website: '',
      typeId: 0,
      stateId: 0,
      municipalityId: 0,
      localityId: 0
    });
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="club-modal">
      <div className="modal-overlay" onClick={handleClose}>
        <div className="club-modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <div className="modal-title">
              <span className="material-icons">nightlife</span>
              <h2>{editingClub ? 'Editar Club' : 'Nuevo Club'}</h2>
            </div>
            <button className="close-btn" onClick={handleClose}>
              <span className="material-icons">close</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="modal-content">
            <form className="club-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Nombre del Club *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Club Nocturno Ibiza"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="typeId">Tipo de Club *</label>
                  <select
                    id="typeId"
                    name="typeId"
                    value={formData.typeId}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading || isLoadingTypes}
                  >
                    <option value="">
                      {isLoadingTypes ? 'Cargando tipos...' : 'Seleccionar tipo'}
                    </option>
                    {clubTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ej: +52 998 123 4567"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">Sitio Web</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Ej: https://www.club.com"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stateId">Estado *</label>
                  <select
                    id="stateId"
                    name="stateId"
                    value={formData.stateId}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading || isLoadingStates}
                  >
                    <option value="">
                      {isLoadingStates ? 'Cargando estados...' : 'Seleccionar estado'}
                    </option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="municipalityId">Municipio *</label>
                  <select
                    id="municipalityId"
                    name="municipalityId"
                    value={formData.municipalityId}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading || isLoadingMunicipalities || !formData.stateId}
                  >
                    <option value="">
                      {isLoadingMunicipalities ? 'Cargando municipios...' : 
                       !formData.stateId ? 'Selecciona un estado primero' : 'Seleccionar municipio'}
                    </option>
                    {municipalities.map(municipality => (
                      <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="localityId">Localidad *</label>
                  <select
                    id="localityId"
                    name="localityId"
                    value={formData.localityId}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading || isLoadingLocalities || !formData.municipalityId}
                  >
                    <option value="">
                      {isLoadingLocalities ? 'Cargando localidades...' : 
                       !formData.municipalityId ? 'Selecciona un municipio primero' : 'Seleccionar localidad'}
                    </option>
                    {localities.map(locality => (
                      <option key={locality.id} value={locality.id}>{locality.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">Dirección</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ej: Av. Tulum 123, Zona Hotelera"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe el club, ambiente, servicios, etc."
                  rows={4}
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
                      {editingClub ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <span className="material-icons">save</span>
                      {editingClub ? 'Actualizar Club' : 'Crear Club'}
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

export default ClubModal; 