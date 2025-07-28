import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePopupStore } from '../../../../../../zustand/popupStore';
import { useStore } from '../../../../../../zustand/useStore';
import APIs from '../../../../../../services/services/APIs';
import './styles/TourModal.css';

interface CreateTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTour?: any;
}

interface TourForm {
  name: string;
  description: string;
  tourTypeId: number;
  capacity: number;
  price: number;
  location: string;
  status: string;
  images: string[];
  characteristics: string[];
}

const TourModal: React.FC<CreateTourModalProps> = ({ isOpen, onClose, onSuccess, editingTour }) => {
  const { showSuccess, showError } = usePopupStore();
  const { url }: any = useStore();

  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<TourForm>({
    name: '',
    description: '',
    tourTypeId: 0,
    capacity: 10,
    price: 1000,
    location: '',
    status: 'Activo',
    images: [],
    characteristics: []
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newCharacteristic, setNewCharacteristic] = useState<string>('');
  console.log(originalImages)
  // Fetch tour types
  const fetchTourTypes = async () => {
    setIsLoadingTypes(true);
    try {
      const response: any = await APIs.getAllTourTypes();
      if (response.data) {
        setTourTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching tour types:', error);
      showError('Error al cargar los tipos de tours');
    } finally {
      setIsLoadingTypes(false);
    }
  };

  // Load tour types on component mount
  useEffect(() => {
    if (isOpen) {
      fetchTourTypes();
    }
  }, [isOpen]);

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

      setFormData({
        name: editingTour.name || '',
        description: editingTour.description || '',
        tourTypeId: editingTour.tourTypeId || 0,
        capacity: editingTour.capacity || 10,
        price: editingTour.price || 1000,
        location: editingTour.location || '',
        status: editingTour.status || 'Activo',
        images: images,
        characteristics: characteristics
      });

      setImagePreviews(images);
      setOriginalImages(originalImages);
      setDeletedImageIds([]);
      setNewCharacteristic('');
    } else {
      // Reset form for new tour
      setFormData({
        name: '',
        description: '',
        tourTypeId: 0,
        capacity: 10,
        price: 1000,
        location: '',
        status: 'Activo',
        images: [],
        characteristics: []
      });
      setImagePreviews([]);
      setOriginalImages([]);
      setDeletedImageIds([]);
      setNewCharacteristic('');
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

  const locations = [
    'Cancún',
    'Cozumel',
    'Isla Mujeres',
    'Playa del Carmen',
    'Tulum',
    'Puerto Morelos',
    'Holbox',
    'Bacalar',
    'Mahahual',
    'Xcalak'
  ];

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
      if (!formData.name || !formData.description || !formData.tourTypeId || !formData.location) {
        showError('Por favor completa todos los campos requeridos');
        return;
      }

      if (formData.capacity <= 0) {
        showError('La capacidad debe ser mayor a 0');
        return;
      }

      if (formData.price <= 0) {
        showError('El precio debe ser mayor a 0');
        return;
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
      tourTypeId: 0,
      capacity: 10,
      price: 1000,
      location: '',
      status: 'Activo',
      images: [],
      characteristics: []
    });
    setImagePreviews([]);
    setOriginalImages([]);
    setDeletedImageIds([]);
    setNewCharacteristic('');
    onClose();
  };

  if (!isOpen) return null;

    return (
    <div className="tour-modal">
      <div className="modal-overlay" onClick={handleClose}>
        <div className="tour-modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <div className="modal-title">
              <span className="material-icons">explore</span>
              <h2>{editingTour ? 'Editar Tour' : 'Nuevo Tour'}</h2>
            </div>
            <button className="close-btn" onClick={handleClose}>
              <span className="material-icons">close</span>
            </button>
          </div>

        {/* Modal Content */}
        <div className="modal-content">
          <form className="tour-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nombre del Tour *</label>
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

              <div className="form-group">
                <label htmlFor="tourTypeId">Tipo de Tour *</label>
                <select
                  id="tourTypeId"
                  name="tourTypeId"
                  value={formData.tourTypeId}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading || isLoadingTypes}
                >
                  <option value="">
                    {isLoadingTypes ? 'Cargando tipos...' : 'Seleccionar tipo'}
                  </option>
                  {tourTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacidad (personas) *</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Precio por Hora (MXN) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Ubicación *</label>
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

              <div className="form-group">
                <label htmlFor="status">Estado</label>
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

              <div className="form-group full-width">
                <label>Imagen del Tour</label>
                <div 
                  {...getRootProps()} 
                  className={`image-dropzone ${isDragActive ? 'drag-active' : ''} ${imagePreviews.length > 0 ? 'has-images' : ''}`}
                >
                  <input {...getInputProps()} />
                  {imagePreviews.length > 0 ? (
                    <div className="images-grid">
                      {imagePreviews.map((image, index) => (
                        <div key={index} className="image-preview-item">
                          <img 
                            src={image.startsWith('data:') ? image : `${url}/${image}`} 
                            alt={`Preview ${index + 1}`} 
                          />
                          <button
                            type="button"
                            className="remove-single-image-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                          >
                            <span className="material-icons">close</span>
                          </button>
                        </div>
                      ))}
                      <div className="add-more-images">
                        <span className="material-icons">add_photo_alternate</span>
                        <p>Agregar más imágenes</p>
                      </div>
                    </div>
                  ) : (
                    <div className="dropzone-content">
                      <span className="material-icons">cloud_upload</span>
                      <p>{isDragActive ? 'Suelta las imágenes aquí' : 'Haz clic o arrastra imágenes aquí'}</p>
                      <small>Formatos: JPG, PNG, GIF, WEBP (máx. 10 imágenes, 5MB cada una)</small>
                    </div>
                  )}
                </div>
                {imagePreviews.length > 0 && (
                  <button 
                    type="button" 
                    className="remove-all-images-btn"
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

              <div className="form-group full-width">
                <label htmlFor="description">Descripción *</label>
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

              <div className="form-group full-width">
                <label>Características del Tour</label>
                <div className="characteristics-input">
                  <input
                    type="text"
                    value={newCharacteristic}
                    onChange={(e) => setNewCharacteristic(e.target.value)}
                    placeholder="Ej: Incluye snorkel, almuerzo buffet, bebidas"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCharacteristic();
                      }
                    }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="add-characteristic-btn"
                    onClick={addCharacteristic}
                    disabled={isLoading || !newCharacteristic.trim()}
                  >
                    <span className="material-icons">add</span>
                  </button>
                </div>
                {formData.characteristics.length > 0 && (
                  <div className="characteristics-list">
                    {formData.characteristics.map((characteristic, index) => (
                      <div key={index} className="characteristic-tag">
                        <span>{characteristic}</span>
                        <button
                          type="button"
                          className="remove-characteristic"
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
                    {editingTour ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    <span className="material-icons">save</span>
                    {editingTour ? 'Actualizar Tour' : 'Crear Tour'}
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

export default TourModal; 