import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
  typeId: number;
  stateId: number;
  municipalityId: number;
  localityId: number;
  images: string[];
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
    typeId: 0,
    stateId: 0,
    municipalityId: 0,
    localityId: 0,
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

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
      // Handle images as array of objects or strings
      let images: string[] = [];
      let originalImages: any[] = [];
      
      if (editingClub.images) {
        if (Array.isArray(editingClub.images)) {
          // Check if it's an array of objects with url property (from backend)
          if (editingClub.images.length > 0 && typeof editingClub.images[0] === 'object' && (editingClub.images[0] as any)?.url) {
            // Keep the original objects for tracking IDs, but extract URLs for formData
            originalImages = editingClub.images;
            images = editingClub.images.map((img: any) => (img as any).url);
          } else {
            // It's already an array of strings (base64 or URLs)
            images = editingClub.images;
          }
        }
      }

      setFormData({
        name: editingClub.name || '',
        description: editingClub.description || '',
        address: editingClub.address || '',
        phone: editingClub.phone || '',
        typeId: editingClub.typeId || 0,
        stateId: editingClub.stateId || 0,
        municipalityId: editingClub.municipalityId || 0,
        localityId: editingClub.localityId || 0,
        images: images
      });

      setImagePreviews(images);
      setOriginalImages(originalImages);
      setDeletedImageIds([]);

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
        typeId: 0,
        stateId: 0,
        municipalityId: 0,
        localityId: 0,
        images: []
      });
      setImagePreviews([]);
      setOriginalImages([]);
      setDeletedImageIds([]);
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

  // Dropzone configuration for multiple images
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setImagePreviews(prev => {
          const updatedImages = [...prev, base64String];
          setFormData(formData => ({
            ...formData,
            images: updatedImages
          }));
          return updatedImages;
        });
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024 // 5MB per image
  });

  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      const updatedImages = prev.filter((_, i) => i !== index);
      setFormData(formData => ({
        ...formData,
        images: updatedImages
      }));
      return updatedImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend: any = {
      ...formData,
      images: imagePreviews
    };

    // Add delete_images for updates
    if (editingClub && deletedImageIds.length > 0) {
      dataToSend.delete_images = deletedImageIds;
    }
    
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.typeId || !formData.stateId || !formData.municipalityId || !formData.localityId) {
        showError('Por favor completa todos los campos requeridos');
        return;
      }

      if (editingClub) {
        // Update existing club
        const response: any = await APIs.updateClub(editingClub.id, dataToSend);
        showSuccess(response.message || 'Club actualizado exitosamente');
        onSuccess();
        handleClose();
      } else {
        // Create new club
        const response: any = await APIs.createClub(dataToSend);
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
      localityId: 0,
      images: []
    });
    setImagePreviews([]);
    setOriginalImages([]);
    setDeletedImageIds([]);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="club-modal">
      <div className="club-modal__overlay" onClick={handleClose}>
        <div className="club-modal__container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="club-modal__header">
            <div className="club-modal__title">
              <div className="club-modal__title-icon">
                <span className="material-icons">nightlife</span>
              </div>
              <div className="club-modal__title-content">
                <h2>{editingClub ? 'Editar Club' : 'Nuevo Club'}</h2>
                <p>Gestiona la información de tu club para el entretenimiento</p>
              </div>
            </div>
            <button className="club-modal__close-btn" onClick={handleClose}>
              <span className="material-icons">close</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="club-modal__content">
            <form className="club-modal__form" onSubmit={handleSubmit}>
              <div className="club-modal__form-grid">
                <div className="club-modal__form-group">
                  <label htmlFor="name">Nombre del Club *</label>
                  <div className="club-modal__input-wrapper">
                    <span className="club-modal__input-icon material-icons">nightlife</span>
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
                </div>

                <div className="club-modal__form-group">
                  <label htmlFor="typeId">Tipo de Club *</label>
                  <div className="club-modal__input-wrapper">
                    <span className="club-modal__input-icon material-icons">category</span>
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
                </div>

                <div className="club-modal__form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <div className="club-modal__input-wrapper">
                    <span className="club-modal__input-icon material-icons">phone</span>
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
                </div>

                <div className="club-modal__form-group">
                  <label htmlFor="stateId">Estado *</label>
                  <div className="club-modal__input-wrapper">
                    <span className="club-modal__input-icon material-icons">location_on</span>
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
                </div>

                <div className="club-modal__form-group">
                  <label htmlFor="municipalityId">Municipio *</label>
                  <div className="club-modal__input-wrapper">
                    <span className="club-modal__input-icon material-icons">location_city</span>
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
                </div>

                <div className="club-modal__form-group">
                  <label htmlFor="localityId">Localidad *</label>
                  <div className="club-modal__input-wrapper">
                    <span className="club-modal__input-icon material-icons">location_on</span>
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
              </div>

              <div className="club-modal__form-group full-width">
                <label htmlFor="address">Dirección</label>
                <div className="club-modal__input-wrapper">
                  <span className="club-modal__input-icon material-icons">business</span>
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
              </div>

              <div className="club-modal__form-group full-width">
                <label>Imágenes del Club</label>
                <div 
                  {...getRootProps()} 
                  className={`club-modal__image-dropzone ${isDragActive ? 'club-modal__drag-active' : ''} ${imagePreviews.length > 0 ? 'club-modal__has-images' : ''}`}
                >
                  <input {...getInputProps()} />
                  {imagePreviews.length > 0 ? (
                    <div className="club-modal__images-grid">
                      {imagePreviews.map((image, index) => (
                        <div key={index} className="club-modal__image-preview-item">
                          <img 
                            src={image} 
                            alt={`Preview ${index + 1}`} 
                          />
                          <button
                            type="button"
                            className="club-modal__remove-single-image-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                          >
                            <span className="material-icons">close</span>
                          </button>
                        </div>
                      ))}
                      <div className="club-modal__add-more-images">
                        <span className="material-icons">add_photo_alternate</span>
                        <p>Agregar más imágenes</p>
                      </div>
                    </div>
                  ) : (
                    <div className="club-modal__dropzone-content">
                      <span className="club-modal__dropzone-icon material-icons">cloud_upload</span>
                      <p>{isDragActive ? 'Suelta las imágenes aquí' : 'Haz clic o arrastra imágenes aquí'}</p>
                      <small>Formatos: JPG, PNG, GIF, WEBP (máx. 10 imágenes, 5MB cada una)</small>
                    </div>
                  )}
                </div>
                {imagePreviews.length > 0 && (
                  <button 
                    type="button" 
                    className="club-modal__remove-all-images-btn"
                    onClick={() => {
                      setImagePreviews([]);
                      setFormData(prev => ({ ...prev, images: [] }));
                    }}
                    disabled={isLoading}
                  >
                    <span className="material-icons">delete_sweep</span>
                    Eliminar todas las imágenes
                  </button>
                )}
              </div>

              <div className="club-modal__form-group full-width">
                <label htmlFor="description">Descripción</label>
                <div className="club-modal__input-wrapper">
                  <span className="club-modal__input-icon material-icons">description</span>
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
              </div>

              {/* Modal Actions */}
              <div className="club-modal__actions">
                <button
                  type="button"
                  className="club-modal__btn club-modal__btn-secondary"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  <span className="material-icons">close</span>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="club-modal__btn club-modal__btn-primary"
                  disabled={isLoading || !formData.name || !formData.typeId || !formData.stateId || !formData.municipalityId || !formData.localityId}
                >
                  {isLoading ? (
                    <>
                      <div className="club-modal__loading-spinner"></div>
                      <span>{editingClub ? 'Actualizando...' : 'Creando...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons">save</span>
                      <span>{editingClub ? 'Actualizar' : 'Crear'} Club</span>
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