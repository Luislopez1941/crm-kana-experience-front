import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useYachtStore } from '../../../../../../zustand/yachtStore';
import { useYachtCategoryStore } from '../../../../../../zustand/yachtCategoryStore';
import { usePopupStore } from '../../../../../../zustand/popupStore';
import { useStore } from '../../../../../../zustand/useStore';
import APIs from '../../../../../../services/services/APIs';
import './styles/YachtModal.css';

interface CreateYachtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PricingPackage {
  hours: number | null;
  price: number | null;
}

interface YachtForm {
  name: string;
  capacity: number;
  length: string;
  location: string;
  images: string[];
  description: string;
  features: string;
  pricing: PricingPackage[];
  status: string;
  yachtCategoryId: number;
}

const YachtModal: React.FC<CreateYachtModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { editingYacht } = useYachtStore();
  const { yachtCategories, setYachtCategories } = useYachtCategoryStore();
  const { showSuccess, showError } = usePopupStore();


  // Fetch yacht categories when modal opens
  const fetchYachtCategories = async () => {
    try {
      const response: any = await APIs.getAllYachtType();
      setYachtCategories(response.data);
    } catch (error) {
      console.error('Error fetching yacht categories:', error);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<YachtForm>({
    name: '',
    capacity: 1,
    length: '',
    location: '',
    images: [],
    description: '',
    features: '',
    pricing: [{ hours: null, price: null }],
    status: 'Activo',
    yachtCategoryId: 0
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newCharacteristic, setNewCharacteristic] = useState<string>('');
  const [newPricingPackage, setNewPricingPackage] = useState<PricingPackage>({ hours: null, price: null });

  // Dropzone configuration for multiple images
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setImagePreviews(prev => {
          const updatedImages = [...prev, base64String];
          // Always use base64 for formData when adding new images
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
    maxFiles: 10, // Allow up to 10 images
    maxSize: 5 * 1024 * 1024 // 5MB per image
  });

  const locations = [
    'Marina Valencia',
    'Puerto Banús',
    'Marina Ibiza',
    'Marina Barcelona',
    'Puerto José Banús',
    'Marina Palma',
    'Puerto de Sóller'
  ];

  useEffect(() => {
    if (isOpen) {
      fetchYachtCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingYacht) {
      // Handle images as array of objects or strings (for backward compatibility)
      let images: string[] = [];
      let originalImages: any[] = [];
      if (editingYacht.images) {
        if (Array.isArray(editingYacht.images)) {
          // Check if it's an array of objects with url property (from backend)
          if (editingYacht.images.length > 0 && typeof editingYacht.images[0] === 'object' && (editingYacht.images[0] as any)?.url) {
            // Keep the original objects for tracking IDs, but extract URLs for formData
            originalImages = editingYacht.images;
            images = editingYacht.images.map((img: any) => (img as any).url);
          } else {
            // It's already an array of strings (base64 or URLs)
            images = editingYacht.images;
          }
        } else if (typeof editingYacht.images === 'string') {
          // If it's a string, split by comma
          images = (editingYacht.images as string).split(',').filter((img: string) => img.trim() !== '');
        }
      }
      
             // Handle features (now a string field)
       let features: string = '';
       if (editingYacht.features) {
         features = editingYacht.features;
       }
      
                                // Handle pricing
      let pricing: PricingPackage[] = [{ hours: null, price: null }];
      if (editingYacht.pricing) {
        if (Array.isArray(editingYacht.pricing)) {
          pricing = editingYacht.pricing as unknown as PricingPackage[];
        } else if ((editingYacht as any).capacity && (editingYacht as any).pricePerDay) {
          // Fallback to old single price structure
          pricing = [{ hours: (editingYacht as any).capacity, price: (editingYacht as any).pricePerDay }];
        }
      }
      
      console.log('🔄 Setting formData with images:', images);
      console.log('🔄 Images type:', typeof images);
      console.log('🔄 Images length:', images.length);
             setFormData({
         name: editingYacht.name,
         capacity: editingYacht.capacity || 1,
         length: editingYacht.length,
         location: editingYacht.location,
         images: images,
         description: editingYacht.description,
         features: features,
         pricing: pricing,
         status: editingYacht.status || 'Activo',
         yachtCategoryId: editingYacht.yachtCategoryId || 0
       });
      console.log('🔄 Setting imagePreviews with:', images);
      setImagePreviews(images);
      setOriginalImages(originalImages);
      setDeletedImageIds([]);
         } else {
       setFormData({
         name: '',
         capacity: 1,
         length: '',
         location: '',
         images: [],
         description: '',
         features: '',
         pricing: [{ hours: null, price: null }],
         status: 'Activo',
         yachtCategoryId: 0
       });
       setImagePreviews([]);
     }
  }, [editingYacht]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const addFeature = () => {
    if (newCharacteristic.trim()) {
      setFormData(prev => ({
        ...prev,
        features: prev.features ? `${prev.features}, ${newCharacteristic.trim()}` : newCharacteristic.trim()
      }));
      setNewCharacteristic('');
    }
  };
 
  const removeFeature = (index: number) => {
    const featuresArray = formData.features.split(',').map(f => f.trim());
    const newFeatures = featuresArray.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: newFeatures.join(', ')
    }));
  };

  const addPricingPackage = () => {
    if (newPricingPackage.hours && newPricingPackage.price && newPricingPackage.hours > 0 && newPricingPackage.price > 0) {
      setFormData(prev => ({
        ...prev,
        pricing: [...prev.pricing, newPricingPackage]
      }));
      setNewPricingPackage({ hours: null, price: null });
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
    if (editingYacht && deletedImageIds.length > 0) {
      dataToSend.delete_images = deletedImageIds;
    }
    
    setIsLoading(true);
    
    try {
      // Validate required fields
             if (!formData.name || !formData.description || !formData.yachtCategoryId || !formData.location) {
        showError('Por favor completa todos los campos requeridos');
        return;
      }

      if (formData.pricing.length === 0) {
        showError('Por favor, agrega al menos un paquete de precios.');
        return;
      }

      // Validate pricing packages
      for (let i = 0; i < formData.pricing.length; i++) {
        const pkg = formData.pricing[i];
        if (!pkg.hours || pkg.hours <= 0) {
          showError(`Las horas del paquete ${i + 1} deben ser mayor a 0`);
          return;
        }
        if (!pkg.price || pkg.price <= 0) {
          showError(`El precio del paquete ${i + 1} debe ser mayor a 0`);
          return;
        }
      }

      if (editingYacht) {
        // Update existing yacht
        const response: any = await APIs.updateYacht(editingYacht.id, dataToSend);
        showSuccess(response.message || 'Yate actualizado exitosamente');
        onSuccess();
        handleClose();
      } else {
        // Create new yacht
        const response: any = await APIs.createYacht(dataToSend);
        showSuccess(response.message || 'Yate creado exitosamente');
        onSuccess();
        handleClose();
      }
    } catch (error: any) {
      console.error('Error saving yacht:', error);
      
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else if (error.message) {
        showError(error.message);
      } else {
        showError('Error al guardar el yate');
      }
    } finally {
      setIsLoading(false);
    }
  };

    const handleClose = () => {
    setFormData({
      name: '',
      capacity: 1,
      length: '',
      location: '',
      images: [],
      description: '',
      features: '',
      pricing: [{ hours: null, price: null }],
      status: 'Activo',
      yachtCategoryId: 0
    });
    setImagePreviews([]);
    setOriginalImages([]);
    setDeletedImageIds([]);
    setNewCharacteristic('');
    setNewPricingPackage({ hours: null, price: null });
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="yacht-modal__overlay" onClick={handleClose}>
      <div className="yacht-modal__container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="yacht-modal__header">
          <div className="yacht-modal__title">
            <div className="yacht-modal__title-icon">
              <span className="material-icons">sailing</span>
            </div>
            <div className="yacht-modal__title-content">
              <h2>{editingYacht ? 'Editar Yate' : 'Nuevo Yate'}</h2>
              <p>Gestiona la información de tu yate para la flota</p>
            </div>
          </div>
          <button className="yacht-modal__close-btn" onClick={handleClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="yacht-modal__content">
          <form className="yacht-modal__form" onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="yacht-modal__section">
              <div className="yacht-modal__section-header">
                <span className="material-icons">info</span>
                <h3>Información Básica</h3>
              </div>
              
              <div className="yacht-modal__form-grid">
                <div className="yacht-modal__form-group">
                  <label htmlFor="name">Nombre del Yate *</label>
                  <div className="yacht-modal__input-wrapper">
                    <span className="yacht-modal__input-icon material-icons">sailing</span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Ocean Paradise"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="yacht-modal__form-group">
                  <label htmlFor="yachtCategoryId">Categoría *</label>
                  <div className="yacht-modal__input-wrapper">
                    <span className="yacht-modal__input-icon material-icons">category</span>
                    <select
                      id="yachtCategoryId"
                      name="yachtCategoryId"
                      value={formData.yachtCategoryId}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    >
                      <option value={0}>Seleccionar categoría</option>
                      {yachtCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="yacht-modal__form-group">
                  <label htmlFor="capacity">Capacidad *</label>
                  <div className="yacht-modal__input-wrapper">
                    <span className="yacht-modal__input-icon material-icons">group</span>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="Ej: 8"
                      min="1"
                      required
                      disabled={isLoading}
                    />
                    <span className="yacht-modal__input-suffix">personas</span>
                  </div>
                </div>

                <div className="yacht-modal__form-group">
                  <label htmlFor="length">Eslora *</label>
                  <div className="yacht-modal__input-wrapper">
                    <span className="yacht-modal__input-icon material-icons">straighten</span>
                    <input
                      type="text"
                      id="length"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      placeholder="Ej: 25 metros"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="yacht-modal__form-group">
                  <label htmlFor="location">Ubicación *</label>
                  <div className="yacht-modal__input-wrapper">
                    <span className="yacht-modal__input-icon material-icons">location_on</span>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    >
                      <option value="">Seleccionar ubicación</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="yacht-modal__form-group">
                  <label htmlFor="status">Estado</label>
                  <div className="yacht-modal__input-wrapper">
                    <span className="yacht-modal__input-icon material-icons">check_circle</span>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="yacht-modal__section">
              <div className="yacht-modal__section-header">
                <span className="material-icons">attach_money</span>
                <h3>Precios por Horas</h3>
                <p>Define los paquetes de precios para diferentes duraciones</p>
              </div>
              
              <div className="yacht-modal__pricing-input-container">
                <div className="yacht-modal__pricing-input-row">
                  <div className="yacht-modal__pricing-input-group">
                    <label>Horas</label>
                    <div className="yacht-modal__input-wrapper">
                      <span className="yacht-modal__input-icon material-icons">schedule</span>
                      <input
                        type="number"
                        value={newPricingPackage.hours || ''}
                        onChange={(e) => setNewPricingPackage(prev => ({ 
                          ...prev, 
                          hours: e.target.value === '' ? null : Number(e.target.value) 
                        }))}
                        placeholder="Horas"
                        min="1"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="yacht-modal__pricing-input-group">
                    <label>Precio (MXN)</label>
                    <div className="yacht-modal__input-wrapper">
                      <span className="yacht-modal__input-icon material-icons">payments</span>
                      <input
                        type="number"
                        value={newPricingPackage.price || ''}
                        onChange={(e) => setNewPricingPackage(prev => ({ 
                          ...prev, 
                          price: e.target.value === '' ? null : Number(e.target.value) 
                        }))}
                        placeholder="Precio"
                        min="1"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="yacht-modal__add-pricing-btn"
                    onClick={addPricingPackage}
                    disabled={isLoading || !newPricingPackage.hours || !newPricingPackage.price || newPricingPackage.hours <= 0 || newPricingPackage.price <= 0}
                  >
                    <span className="material-icons">add</span>
                    Agregar
                  </button>
                </div>
                
                {formData.pricing.length > 0 && (
                  <div className="yacht-modal__pricing-packages-grid">
                    {formData.pricing.map((pkg, index) => (
                      <div key={index} className="yacht-modal__pricing-package-card">
                        <div className="yacht-modal__package-content">
                          <div className="yacht-modal__package-hours">
                            <span className="material-icons">schedule</span>
                            <span className="yacht-modal__hours-value">{pkg.hours || 0}</span>
                            <span className="yacht-modal__hours-label">horas</span>
                          </div>
                          <div className="yacht-modal__package-price">
                            <span className="yacht-modal__price-currency">$</span>
                            <span className="yacht-modal__price-value">{pkg.price || 0}</span>
                            <span className="yacht-modal__price-label">MXN</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="yacht-modal__remove-package-btn"
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
            <div className="yacht-modal__section">
              <div className="yacht-modal__section-header">
                <span className="material-icons">photo_library</span>
                <h3>Galería de Imágenes</h3>
                <p>Sube fotos de tu yate para mostrar su belleza</p>
              </div>
              
              <div className="yacht-modal__images-section">
                <div 
                  {...getRootProps()} 
                  className={`yacht-modal__image-dropzone ${isDragActive ? 'yacht-modal__drag-active' : ''} ${imagePreviews.length > 0 ? 'yacht-modal__has-images' : ''}`}
                >
                  <input {...getInputProps()} />
                  {imagePreviews.length > 0 ? (
                    <div className="yacht-modal__images-grid">
                      {imagePreviews.map((image, index) => (
                        <div key={index} className="yacht-modal__image-preview-card">
                          <img 
                            src={image} 
                            alt={`Preview ${index + 1}`} 
                          />
                          <button
                            type="button"
                            className="yacht-modal__remove-image-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreviews(prev => {
                                const newImages = prev.filter((_, i) => i !== index);
                                
                                if (originalImages[index] && originalImages[index].id) {
                                  setDeletedImageIds(prev => [...prev, originalImages[index].id]);
                                }
                                
                                setFormData(formData => ({
                                  ...formData,
                                  images: newImages
                                }));
                                return newImages;
                              });
                            }}
                          >
                            <span className="material-icons">close</span>
                          </button>
                        </div>
                      ))}
                      <div className="yacht-modal__add-more-images">
                        <span className="material-icons">add_photo_alternate</span>
                        <p>Agregar más</p>
                      </div>
                    </div>
                  ) : (
                    <div className="yacht-modal__dropzone-content">
                      <div className="yacht-modal__dropzone-icon">
                        <span className="material-icons">cloud_upload</span>
                      </div>
                      <h4>{isDragActive ? 'Suelta las imágenes aquí' : 'Sube imágenes de tu yate'}</h4>
                      <p>Haz clic o arrastra imágenes aquí para comenzar</p>
                      <div className="yacht-modal__dropzone-info">
                        <span className="material-icons">info</span>
                        <small>Formatos: JPG, PNG, GIF, WEBP • Máx. 10 imágenes • 5MB cada una</small>
                      </div>
                    </div>
                  )}
                </div>
                
                {imagePreviews.length > 0 && (
                  <div className="yacht-modal__images-actions">
                    <button 
                      type="button" 
                      className="yacht-modal__remove-all-images-btn"
                      onClick={() => {
                        setImagePreviews([]);
                        setFormData(prev => ({ ...prev, images: [] }));
                      }}
                      disabled={isLoading}
                    >
                      <span className="material-icons">delete_sweep</span>
                      Eliminar todas
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="yacht-modal__section">
              <div className="yacht-modal__section-header">
                <span className="material-icons">description</span>
                <h3>Descripción</h3>
                <p>Cuenta la historia de tu yate</p>
              </div>
              
              <div className="yacht-modal__form-group yacht-modal__full-width">
                <label htmlFor="description">Descripción del Yate *</label>
                <div className="yacht-modal__input-wrapper">
                  <span className="yacht-modal__input-icon material-icons">edit</span>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe las características principales, comodidades y experiencia que ofrece tu yate..."
                    rows={4}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="yacht-modal__section">
              <div className="yacht-modal__section-header">
                <span className="material-icons">star</span>
                <h3>Características y Equipamiento</h3>
                <p>Destaca las características especiales de tu yate</p>
              </div>
              
              <div className="yacht-modal__features-input-container">
                <div className="yacht-modal__features-input-row">
                  <div className="yacht-modal__input-wrapper">
                    <span className="yacht-modal__input-icon material-icons">add_circle</span>
                    <input
                      type="text"
                      value={newCharacteristic}
                      onChange={(e) => setNewCharacteristic(e.target.value)}
                      placeholder="Ej: bar, capitán, wifi, equipos de buceo..."
                      disabled={isLoading}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="yacht-modal__add-feature-btn"
                    onClick={addFeature}
                    disabled={isLoading || !newCharacteristic.trim()}
                  >
                    <span className="material-icons">add</span>
                    Agregar
                  </button>
                </div>
                
                {formData.features && formData.features.split(',').length > 0 && (
                  <div className="yacht-modal__features-grid">
                    {formData.features.split(',').map((feature, index) => (
                      <div key={index} className="yacht-modal__feature-card">
                        <span className="yacht-modal__feature-text">{feature.trim()}</span>
                        <button
                          type="button"
                          className="yacht-modal__remove-feature-btn"
                          onClick={() => removeFeature(index)}
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
            <div className="yacht-modal__footer">
              <div className="yacht-modal__footer-actions">
                <button 
                  type="button"
                  className="yacht-modal__btn yacht-modal__btn-secondary" 
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  <span className="material-icons">close</span>
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="yacht-modal__btn yacht-modal__btn-primary"
                  disabled={isLoading || !formData.name || !formData.location || !formData.description || formData.yachtCategoryId === 0}
                >
                  {isLoading ? (
                    <>
                      <div className="yacht-modal__loading-spinner"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons">sailing</span>
                      <span>{editingYacht ? 'Actualizar' : 'Crear'} Yate</span>
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

export default YachtModal;
