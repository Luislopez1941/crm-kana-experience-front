import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useYachtStore } from '../../../../../../zustand/yachtStore';
import { useYachtTypeStore } from '../../../../../../zustand/yachtTypeStore';
import { usePopupStore } from '../../../../../../zustand/popupStore';
import { useStore } from '../../../../../../zustand/useStore';
import APIs from '../../../../../../services/services/APIs';
import './styles/YachtModal.css';

interface CreateYachtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface YachtForm {
  name: string;
  capacity: number;
  length: string;
  location: string;
  images: string[];
  description: string;
  characteristics: string[];
  pricePerDay: number;
  yachtTypeId: number;
}

const YachtModal: React.FC<CreateYachtModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { editingYacht } = useYachtStore();
  const { yachtTypes, setYachtTypes } = useYachtTypeStore();
  const { showSuccess, showError } = usePopupStore();
  const { url }: any = useStore();

  // Fetch yacht types when modal opens
  const fetchYachtTypes = async () => {
    try {
      const response: any = await APIs.getAllYachtType();
      setYachtTypes(response.data);
    } catch (error) {
      console.error('Error fetching yacht types:', error);
      showError('Error al cargar los tipos de yate');
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<YachtForm>({
    name: '',
    capacity: 6,
    length: '',
    location: '',
    images: [],
    description: '',
    characteristics: [],
    pricePerDay: 1000,
    yachtTypeId: 0
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newCharacteristic, setNewCharacteristic] = useState<string>('');

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
      fetchYachtTypes();
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
      
      // Handle characteristics as array of objects or strings (for backward compatibility)
      let characteristics: string[] = [];
      if (editingYacht.characteristics) {
        if (Array.isArray(editingYacht.characteristics)) {
          // Check if it's an array of objects with name property
          if (editingYacht.characteristics.length > 0 && typeof editingYacht.characteristics[0] === 'object' && (editingYacht.characteristics[0] as any)?.name) {
            // Convert array of objects to array of names
            characteristics = editingYacht.characteristics.map((char: any) => (char as any).name);
          } else {
            // It's already an array of strings
            characteristics = editingYacht.characteristics;
          }
        } else if (typeof editingYacht.characteristics === 'string') {
          // If it's a string, split by comma
          characteristics = (editingYacht.characteristics as string).split(',').filter((char: string) => char.trim() !== '');
        }
      }
      
      console.log('🔄 Setting formData with images:', images);
      console.log('🔄 Images type:', typeof images);
      console.log('🔄 Images length:', images.length);
      setFormData({
        name: editingYacht.name,
        capacity: editingYacht.capacity,
        length: editingYacht.length,
        location: editingYacht.location,
        images: images,
        description: editingYacht.description,
        characteristics: characteristics,
        pricePerDay: editingYacht.pricePerDay,
        yachtTypeId: editingYacht.yachtTypeId
      });
      console.log('🔄 Setting imagePreviews with:', images);
      setImagePreviews(images);
      setOriginalImages(originalImages);
      setDeletedImageIds([]);
    } else {
      setFormData({
        name: '',
        capacity: 6,
        length: '',
        location: '',
        images: [],
        description: '',
        characteristics: [],
        pricePerDay: 1000,
        yachtTypeId: 0
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
    if (editingYacht && deletedImageIds.length > 0) {
      dataToSend.delete_images = deletedImageIds;
    }
    
    setIsLoading(true);
    
    try {
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
      capacity: 6,
      length: '',
      location: '',
      images: [],
      description: '',
      characteristics: [],
      pricePerDay: 1000,
      yachtTypeId: 0
    });
    setImagePreviews([]);
    setOriginalImages([]);
    setDeletedImageIds([]);
    setNewCharacteristic('');
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="yacht-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span className="material-icons">sailing</span>
            <h2>{editingYacht ? 'Editar Yate' : 'Nuevo Yate'}</h2>
          </div>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          <form className="yacht-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nombre del Yate *</label>
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

              <div className="form-group">
                <label htmlFor="yachtTypeId">Tipo de Yate *</label>
                <select
                  id="yachtTypeId"
                  name="yachtTypeId"
                  value={formData.yachtTypeId}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value={0}>Seleccionar tipo</option>
                  {yachtTypes.map(type => (
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
                  min="2"
                  max="50"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="pricePerDay">Precio por hora (MXN) *</label>
                <input
                  type="number"
                  id="pricePerDay"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  min="100"
                  step="50"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="length">Eslora *</label>
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

              <div className="form-group full-width">
                <label>Imagen del Yate</label>
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
                              setImagePreviews(prev => {
                                const newImages = prev.filter((_, i) => i !== index);
                                
                                // Check if this is an original image (has ID)
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
                  placeholder="Describe las características principales del yate..."
                  rows={3}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group full-width">
                <label>Características y equipamiento</label>
                <div className="characteristics-input">
                  <input
                    type="text"
                    value={newCharacteristic}
                    onChange={(e) => setNewCharacteristic(e.target.value)}
                    placeholder="Ej: bar, capitán, wifi, etc."
                    disabled={isLoading}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCharacteristic();
                      }
                    }}
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
                        <span>
                          {typeof characteristic === 'string' 
                            ? characteristic 
                            : (characteristic as any)?.name || String(characteristic)
                          }
                        </span>
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
            
            {/* Modal Footer */}
            <div className="modal-footer">
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
                disabled={isLoading || !formData.name || !formData.location || !formData.description || formData.yachtTypeId === 0}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default YachtModal;
