import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePopupStore } from '../../../../../../zustand/popupStore';

import APIs from '../../../../../../services/services/APIs';
import './styles/TourModal.css';

interface CreateTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTour?: any;
}

interface PricingPackage {
  personas: number | null;
  precio: number | null;
}

interface TourForm {
  name: string;
  description: string;
  tourCategoryId: number;
  pricing: PricingPackage[];
  location: string;
  status: string;
  horarios?: string;
  duracion?: string;
  edadMinima?: string;
  transportacion?: string;
  images: string[];
  characteristics: string[];
  stateId: number;
  municipalityId: number;
  localityId: number;
}

const TourModal: React.FC<CreateTourModalProps> = ({ isOpen, onClose, onSuccess, editingTour }) => {
  const { showSuccess, showError } = usePopupStore();


  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<TourForm>({
    name: '',
    description: '',
    tourCategoryId: 0,
    pricing: [],
    location: '',
    status: 'Activo',
    horarios: '',
    duracion: '',
    edadMinima: '',
    transportacion: '',
    images: [],
    characteristics: [],
    stateId: 0,
    municipalityId: 0,
    localityId: 0
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newCharacteristic, setNewCharacteristic] = useState<string>('');
  const [newPricingPackage, setNewPricingPackage] = useState<PricingPackage>({ personas: null, precio: null });
  const [states, setStates] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false);
  console.log(originalImages)
  // Fetch tour categories
  const fetchTourCategories = async () => {
    setIsLoadingTypes(true);
    try {
      const response: any = await APIs.getAllTourTypes();
      if (response.data) {
        setTourTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching tour categories:', error);
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

  // Load tour categories on component mount
  useEffect(() => {
    if (isOpen) {
      fetchTourCategories();
      fetchStates();
    }
  }, [isOpen]);

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

  // Load editing tour data
  useEffect(() => {
    if (editingTour) {
      // Handle images as array of objects or strings
      let images: string[] = [];
      let originalImages: any[] = [];
      
      if (editingTour.images) {
        if (Array.isArray(editingTour.images)) {
          // Check if it's an array of objects with url property (from backend)
          if (editingTour.images.length > 0 && typeof editingTour.images[0] === 'object' && (editingTour.images[0] as any)?.url) {
            // Keep the original objects for tracking IDs, but extract URLs for formData
            originalImages = editingTour.images;
            images = editingTour.images.map((img: any) => (img as any).url);
          } else {
            // It's already an array of strings (base64 or URLs)
            images = editingTour.images;
          }
        }
      }

      // Handle characteristics
      let characteristics: string[] = [];
      if (editingTour.characteristics) {
        if (Array.isArray(editingTour.characteristics)) {
          if (editingTour.characteristics.length > 0 && typeof editingTour.characteristics[0] === 'object' && (editingTour.characteristics[0] as any)?.name) {
            // Extract names from characteristic objects
            characteristics = editingTour.characteristics.map((char: any) => (char as any).name);
          } else {
            // It's already an array of strings
            characteristics = editingTour.characteristics;
          }
        }
      }

             // Handle pricing
       let pricing: PricingPackage[] = [];
       if (editingTour.pricing) {
         if (Array.isArray(editingTour.pricing)) {
           pricing = editingTour.pricing;
         } else if (editingTour.price && editingTour.capacity) {
           // Fallback to old single price structure
           pricing = [{ personas: editingTour.capacity, precio: editingTour.price }];
         }
       }

      setFormData({
        name: editingTour.name || '',
        description: editingTour.description || '',
        tourCategoryId: editingTour.tourCategoryId || 0,
        pricing: pricing,
        location: editingTour.location || '',
        status: editingTour.status || 'Activo',
        horarios: editingTour.horarios || '',
        duracion: editingTour.duracion || '',
        edadMinima: editingTour.edadMinima || '',
        transportacion: editingTour.transportacion || '',
        images: images,
        characteristics: characteristics,
        stateId: editingTour.stateId || 0,
        municipalityId: editingTour.municipalityId || 0,
        localityId: editingTour.localityId || 0
      });

      setImagePreviews(images);
      setOriginalImages(originalImages);
      setDeletedImageIds([]);
      setNewCharacteristic('');
      setNewPricingPackage({ personas: null, precio: null });
    } else {
             // Reset form for new tour
       setFormData({
         name: '',
         description: '',
         tourCategoryId: 0,
         pricing: [],
         location: '',
         status: 'Activo',
         horarios: '',
         duracion: '',
         edadMinima: '',
         transportacion: '',
         images: [],
         characteristics: [],
         stateId: 0,
         municipalityId: 0,
         localityId: 0
       });
      setImagePreviews([]);
      setOriginalImages([]);
      setDeletedImageIds([]);
      setNewCharacteristic('');
      setNewPricingPackage({ personas: null, precio: null });
    }
  }, [editingTour]);

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

  const [tourTypes, setTourTypes] = useState<any[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);



  const statusOptions = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'price' || name === 'tourTypeId' ? Number(value) : value
    }));
  };

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

  const addCharacteristic = () => {
    if (newCharacteristic.trim() && !formData.characteristics.includes(newCharacteristic.trim())) {
      setFormData(prev => ({
        ...prev,
        characteristics: [...prev.characteristics, newCharacteristic.trim()]
      }));
      setNewCharacteristic('');
    }
  };

  const removeCharacteristic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      characteristics: prev.characteristics.filter((_, i) => i !== index)
    }));
  };

  const addPricingPackage = () => {
    if (newPricingPackage.personas && newPricingPackage.precio && newPricingPackage.personas > 0 && newPricingPackage.precio > 0) {
      setFormData(prev => ({
        ...prev,
        pricing: [...prev.pricing, { ...newPricingPackage }]
      }));
      setNewPricingPackage({ personas: null, precio: null });
    }
  };

  const removePricingPackage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend: any = {
      ...formData,
      images: imagePreviews
    };

    // Add delete_images for updates
    if (editingTour && deletedImageIds.length > 0) {
      dataToSend.delete_images = deletedImageIds;
    }
    
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.tourCategoryId || !formData.stateId || !formData.municipalityId || !formData.localityId) {
        showError('Por favor completa todos los campos requeridos');
        return;
      }

             // No validation for empty pricing array - user can add packages as needed

      // Validate pricing packages
      for (let i = 0; i < formData.pricing.length; i++) {
        const pkg = formData.pricing[i];
        if (!pkg.personas || pkg.personas <= 0) {
          showError(`Las personas del paquete ${i + 1} deben ser mayor a 0`);
          return;
        }
        if (!pkg.precio || pkg.precio <= 0) {
          showError(`El precio del paquete ${i + 1} debe ser mayor a 0`);
          return;
        }
      }

      if (editingTour) {
        // Update existing tour
        const response: any = await APIs.updateTour(editingTour.id, dataToSend);
        showSuccess(response.message || 'Tour actualizado exitosamente');
        onSuccess();
        handleClose();
      } else {
        // Create new tour
        const response: any = await APIs.createTour(dataToSend);
        showSuccess(response.message || 'Tour creado exitosamente');
        onSuccess();
        handleClose();
      }
    } catch (error: any) {
      console.error('Error saving tour:', error);
      
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else if (error.message) {
        showError(error.message);
      } else {
        showError('Error al guardar el tour');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      tourCategoryId: 0,
      pricing: [],
      location: '',
      status: 'Activo',
      horarios: '',
      duracion: '',
      edadMinima: '',
      transportacion: '',
      images: [],
      characteristics: [],
      stateId: 0,
      municipalityId: 0,
      localityId: 0
    });
    setImagePreviews([]);
    setOriginalImages([]);
    setDeletedImageIds([]);
    setNewCharacteristic('');
    setNewPricingPackage({ personas: null, precio: null });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="tour-modal__overlay" onClick={handleClose}>
      <div className="tour-modal__container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="tour-modal__header">
          <div className="tour-modal__title">
            <div className="tour-modal__title-icon">
              <span className="material-icons">explore</span>
            </div>
            <div className="tour-modal__title-content">
              <h2>{editingTour ? 'Editar Tour' : 'Nuevo Tour'}</h2>
              <p>Gestiona la información de tu tour para la experiencia</p>
            </div>
          </div>
          <button className="tour-modal__close-btn" onClick={handleClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="tour-modal__content">
          <form className="tour-modal__form" onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="tour-modal__section">
              <div className="tour-modal__section-header">
                <span className="material-icons">info</span>
                <h3>Información Básica</h3>
              </div>
              
              <div className="tour-modal__form-grid">
                <div className="tour-modal__form-group">
                  <label htmlFor="name">Nombre del Tour *</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">explore</span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Tour Isla Mujeres"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="tour-modal__form-group">
                  <label htmlFor="tourCategoryId">Categoría de Tour *</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">category</span>
                    <select
                      id="tourCategoryId"
                      name="tourCategoryId"
                      value={formData.tourCategoryId}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading || isLoadingTypes}
                    >
                      <option value={0}>
                        {isLoadingTypes ? 'Cargando categorías...' : 'Seleccionar categoría'}
                      </option>
                      {tourTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="tour-modal__form-group">
                  <label htmlFor="stateId">Estado *</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">location_on</span>
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

                <div className="tour-modal__form-group">
                  <label htmlFor="municipalityId">Municipio *</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">location_city</span>
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

                <div className="tour-modal__form-group">
                  <label htmlFor="localityId">Localidad *</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">location_on</span>
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

                <div className="tour-modal__form-group">
                  <label htmlFor="location">Ubicación Específica</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">business</span>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Ej: Centro de Cancún, Zona Hotelera"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="tour-modal__form-group">
                  <label htmlFor="status">Estado</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">check_circle</span>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="tour-modal__form-group">
                  <label htmlFor="horarios">Horarios</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">schedule</span>
                    <input
                      type="text"
                      id="horarios"
                      name="horarios"
                      value={formData.horarios}
                      onChange={handleInputChange}
                      placeholder="Ej: De lunes a sábado. A las 09:00, 11:00, 13:00 y 15:00 horas."
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="tour-modal__form-group">
                  <label htmlFor="duracion">Duración</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">timer</span>
                    <input
                      type="text"
                      id="duracion"
                      name="duracion"
                      value={formData.duracion}
                      onChange={handleInputChange}
                      placeholder="Ej: 105 minutos"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="tour-modal__form-group">
                  <label htmlFor="edadMinima">Edad Mínima</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">child_care</span>
                    <input
                      type="text"
                      id="edadMinima"
                      name="edadMinima"
                      value={formData.edadMinima}
                      onChange={handleInputChange}
                      placeholder="Ej: A partir de los 12 años"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="tour-modal__form-group">
                  <label htmlFor="transportacion">Transportación</label>
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">directions_bus</span>
                    <input
                      type="text"
                      id="transportacion"
                      name="transportacion"
                      value={formData.transportacion}
                      onChange={handleInputChange}
                      placeholder="Ej: Rutas desde el hotel Dreams Natura Resort & Spa hasta el Riu Dunamar y centro de Cancún."
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Packages Section */}
            <div className="tour-modal__section">
              <div className="tour-modal__section-header">
                <span className="material-icons">attach_money</span>
                <h3>Paquetes de Precios por Personas</h3>
                <p>Define los precios para diferentes cantidades de personas</p>
              </div>
              
              <div className="tour-modal__pricing-input-container">
                <div className="tour-modal__pricing-input-row">
                  <div className="tour-modal__pricing-input-group">
                    <label>Personas</label>
                    <div className="tour-modal__input-wrapper">
                      <span className="tour-modal__input-icon material-icons">group</span>
                      <input
                        type="number"
                        value={newPricingPackage.personas || ''}
                        onChange={(e) => setNewPricingPackage(prev => ({ 
                          ...prev, 
                          personas: e.target.value === '' ? null : Number(e.target.value) 
                        }))}
                        placeholder="Personas"
                        min="1"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="tour-modal__pricing-input-group">
                    <label>Precio (MXN)</label>
                    <div className="tour-modal__input-wrapper">
                      <span className="tour-modal__input-icon material-icons">payments</span>
                      <input
                        type="number"
                        value={newPricingPackage.precio || ''}
                        onChange={(e) => setNewPricingPackage(prev => ({ 
                          ...prev, 
                          precio: e.target.value === '' ? null : Number(e.target.value) 
                        }))}
                        placeholder="Precio"
                        min="0"
                        step="0.01"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="tour-modal__add-pricing-btn"
                    onClick={addPricingPackage}
                    disabled={isLoading || !newPricingPackage.personas || !newPricingPackage.precio || newPricingPackage.personas <= 0 || newPricingPackage.precio <= 0}
                  >
                    <span className="material-icons">add</span>
                    Agregar
                  </button>
                </div>
                
                {formData.pricing.length > 0 && (
                  <div className="tour-modal__pricing-packages-grid">
                    {formData.pricing.map((pkg, index) => (
                      <div key={index} className="tour-modal__pricing-package-card">
                        <div className="tour-modal__package-content">
                          <div className="tour-modal__package-people">
                            <span className="material-icons">group</span>
                            <span className="tour-modal__people-value">{pkg.personas || 0}</span>
                            <span className="tour-modal__people-label">personas</span>
                          </div>
                          <div className="tour-modal__package-price">
                            <span className="tour-modal__price-currency">$</span>
                            <span className="tour-modal__price-value">{pkg.precio || 0}</span>
                            <span className="tour-modal__price-label">MXN</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="tour-modal__remove-package-btn"
                          onClick={() => removePricingPackage(index)}
                          disabled={isLoading}
                        >
                          <span className="material-icons">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Images Section */}
            <div className="tour-modal__section">
              <div className="tour-modal__section-header">
                <span className="material-icons">photo_library</span>
                <h3>Imágenes del Tour</h3>
              </div>
              <div 
                {...getRootProps()} 
                className={`tour-modal__image-dropzone ${isDragActive ? 'tour-modal__drag-active' : ''} ${imagePreviews.length > 0 ? 'tour-modal__has-images' : ''}`}
              >
                <input {...getInputProps()} />
                {imagePreviews.length > 0 ? (
                  <div className="tour-modal__images-grid">
                    {imagePreviews.map((image, index) => (
                      <div key={index} className="tour-modal__image-preview-item">
                        <img 
                          src={image} 
                          alt={`Preview ${index + 1}`} 
                        />
                        <button
                          type="button"
                          className="tour-modal__remove-single-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                        >
                          <span className="material-icons">close</span>
                        </button>
                      </div>
                    ))}
                    <div className="tour-modal__add-more-images">
                      <span className="material-icons">add_photo_alternate</span>
                      <p>Agregar más imágenes</p>
                    </div>
                  </div>
                ) : (
                  <div className="tour-modal__dropzone-content">
                    <span className="material-icons">cloud_upload</span>
                    <p>{isDragActive ? 'Suelta las imágenes aquí' : 'Haz clic o arrastra imágenes aquí'}</p>
                    <small>Formatos: JPG, PNG, GIF, WEBP (máx. 10 imágenes, 5MB cada una)</small>
                  </div>
                )}
              </div>
              {imagePreviews.length > 0 && (
                <button 
                  type="button" 
                  className="tour-modal__remove-all-images-btn"
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

            {/* Description Section */}
            <div className="tour-modal__section">
              <div className="tour-modal__section-header">
                <span className="material-icons">description</span>
                <h3>Descripción del Tour</h3>
                <p>Cuenta la historia de tu tour</p>
              </div>
              
              <div className="tour-modal__form-group tour-modal__full-width">
                <label htmlFor="description">Descripción del Tour *</label>
                <div className="tour-modal__input-wrapper">
                  <span className="tour-modal__input-icon material-icons">edit</span>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe el tour, actividades incluidas, características especiales, etc."
                    rows={4}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Characteristics Section */}
            <div className="tour-modal__section">
              <div className="tour-modal__section-header">
                <span className="material-icons">local_offer</span>
                <h3>Características del Tour</h3>
                <p>Destaca las características especiales de tu tour</p>
              </div>
              
              <div className="tour-modal__features-input-container">
                <div className="tour-modal__features-input-row">
                  <div className="tour-modal__input-wrapper">
                    <span className="tour-modal__input-icon material-icons">add_circle</span>
                    <input
                      type="text"
                      value={newCharacteristic}
                      onChange={(e) => setNewCharacteristic(e.target.value)}
                      placeholder="Ej: Incluye snorkel, almuerzo buffet, bebidas..."
                      disabled={isLoading}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCharacteristic();
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="tour-modal__add-feature-btn"
                    onClick={addCharacteristic}
                    disabled={isLoading || !newCharacteristic.trim()}
                  >
                    <span className="material-icons">add</span>
                    Agregar
                  </button>
                </div>
                
                {formData.characteristics.length > 0 && (
                  <div className="tour-modal__features-grid">
                    {formData.characteristics.map((characteristic, index) => (
                      <div key={index} className="tour-modal__feature-card">
                        <span className="tour-modal__feature-text">{characteristic}</span>
                        <button
                          type="button"
                          className="tour-modal__remove-feature-btn"
                          onClick={() => removeCharacteristic(index)}
                          disabled={isLoading}
                        >
                          <span className="material-icons">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="tour-modal__footer">
              <div className="tour-modal__footer-actions">
                <button
                  type="button"
                  className="tour-modal__btn tour-modal__btn-secondary"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  <span className="material-icons">close</span>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="tour-modal__btn tour-modal__btn-primary"
                  disabled={isLoading || !formData.name || !formData.location || !formData.description || formData.tourCategoryId === 0}
                >
                  {isLoading ? (
                    <>
                      <div className="tour-modal__loading-spinner"></div>
                      <span>{editingTour ? 'Actualizando...' : 'Creando...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons">save</span>
                      <span>{editingTour ? 'Actualizar' : 'Crear'} Tour</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourModal; 