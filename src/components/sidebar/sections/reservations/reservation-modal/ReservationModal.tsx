import React, { useState, useEffect } from 'react';
import { useReservationStore } from '../../../../../zustand/reservationStore';
import APIs from '../../../../../services/services/APIs';
import './styles/ReservationModal.css';

interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReservationForm {
  selectedType: 'yacht' | 'tour' | 'club' | '';
  selectedItem: any;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reservationDate: string;
  quantity: number;
  description: string;
}

const ReservationModal: React.FC<CreateReservationModalProps> = ({ isOpen, onClose }) => {
  const { addReservation } = useReservationStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [tours, setTours] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [yachts, setYachts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingYachtDetails, setLoadingYachtDetails] = useState(false);

  const [formData, setFormData] = useState<ReservationForm>({
    selectedType: '',
    selectedItem: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reservationDate: '',
    quantity: 1,
    description: ''
  });


  // Cargar datos según el tipo seleccionado
  useEffect(() => {
    if (formData.selectedType && isOpen) {
      loadDataByType(formData.selectedType);
    }
  }, [formData.selectedType, isOpen]);

  const loadDataByType = async (type: 'yacht' | 'tour' | 'club') => {
    setLoading(true);
    try {
      switch (type) {
        case 'tour':
          const toursResponse = await APIs.getAllTours();
          console.log('Tours response:', toursResponse);
          if (toursResponse && (toursResponse as any).data) {
            setTours((toursResponse as any).data);
          } else {
            setTours([]);
          }
          break;
        case 'club':
          const clubsResponse = await APIs.getAllClubs();
          console.log('Clubs response:', clubsResponse);
          if (clubsResponse && (clubsResponse as any).data) {
            setClubs((clubsResponse as any).data);
          } else {
            setClubs([]);
          }
          break;
        case 'yacht':
          // Hacer petición para obtener todos los yates
          const yachtsResponse = await APIs.getYachtsAll({});
          console.log('Yachts response:', yachtsResponse);
          if (yachtsResponse && (yachtsResponse as any).data) {
            setYachts((yachtsResponse as any).data);
          } else {
            setYachts([]);
          }
          break;
      }
    } catch (error) {
      console.error(`Error loading ${type}s:`, error);
      // Limpiar datos en caso de error
      if (type === 'tour') setTours([]);
      if (type === 'club') setClubs([]);
      if (type === 'yacht') setYachts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (): number => {
    if (!formData.selectedItem || !formData.reservationDate) return 0;
    const pricePerItem = formData.selectedItem.pricing && formData.selectedItem.pricing.length > 0 
      ? formData.selectedItem.pricing[0].price 
      : 0;
    return pricePerItem * formData.quantity;
  };


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as 'yacht' | 'tour' | 'club' | '';
    setFormData(prev => ({ 
      ...prev, 
      selectedType: type, 
      selectedItem: null 
    }));
  };

  const handleItemSelect = async (item: any) => {
    if (formData.selectedType === 'yacht') {
      // Si es un yate, obtener detalles completos
      setLoadingYachtDetails(true);
      try {
        const yachtDetailsResponse = await APIs.getYachtsById(item.id);
        console.log('Yacht details response:', yachtDetailsResponse);
        if (yachtDetailsResponse && (yachtDetailsResponse as any).data) {
          setFormData(prev => ({ ...prev, selectedItem: (yachtDetailsResponse as any).data }));
        } else {
          setFormData(prev => ({ ...prev, selectedItem: item }));
        }
      } catch (error) {
        console.error('Error loading yacht details:', error);
        setFormData(prev => ({ ...prev, selectedItem: item }));
      } finally {
        setLoadingYachtDetails(false);
      }
    } else {
      // Para tours y clubs, usar directamente el item
      setFormData(prev => ({ ...prev, selectedItem: item }));
    }
    setCurrentStep(2);
  };

  const getCurrentItems = () => {
    switch (formData.selectedType) {
      case 'yacht':
        return yachts || [];
      case 'tour':
        return tours || [];
      case 'club':
        return clubs || [];
      default:
        return [];
    }
  };

  const hasItems = () => {
    const items = getCurrentItems();
    return items.length > 0;
  };

  const getItemTypeLabel = () => {
    switch (formData.selectedType) {
      case 'yacht':
        return 'Yate';
      case 'tour':
        return 'Tour';
      case 'club':
        return 'Club';
      default:
        return 'Item';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedItem) return;

    // Crear objeto de reserva según el schema del store
    const reservationData = {
      yachtId: formData.selectedType === 'yacht' ? formData.selectedItem.id : undefined,
      yachtName: formData.selectedItem.name,
      clientName: `${formData.firstName} ${formData.lastName}`,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      startDate: formData.reservationDate,
      endDate: formData.reservationDate, // Mismo día por ahora
      totalDays: 1,
      totalPrice: calculateTotalPrice(),
      status: 'pending' as const
    };

    addReservation(reservationData);

    // Reset form and close modal
    setFormData({
      selectedType: '',
      selectedItem: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      reservationDate: '',
      quantity: 1,
      description: ''
    });
    setCurrentStep(1);
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      selectedType: '',
      selectedItem: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      reservationDate: '',
      quantity: 1,
      description: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span className="material-icons">add_box</span>
            <h2>Nueva Reserva</h2>
          </div>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Seleccionar Tipo</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Datos del Cliente</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirmación</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          {/* Step 1: Type Selection */}
          {currentStep === 1 && (
            <div className="step-content">
              <h3 className="step-title">Selecciona el Tipo de Reserva</h3>
              <p className="step-description">Elige entre yates, tours o clubs</p>
              
              {/* Type Selection Dropdown */}
              <div className="type-selection-container">
                <div className="form-group">
                  <label htmlFor="reservationType">Tipo de Reserva *</label>
                  <div className="select-wrapper">
                    <span className="material-icons">expand_more</span>
                    <select
                      id="reservationType"
                      value={formData.selectedType}
                      onChange={handleTypeChange}
                      className="type-select"
                      required
                    >
                      <option value="">Selecciona un tipo...</option>
                      <option value="yacht">Yates</option>
                      <option value="tour">Tours</option>
                      <option value="club">Clubs</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items Selection */}
              {formData.selectedType && (
                <div className="items-selection">
                  <h4 className="items-title">Selecciona un {getItemTypeLabel()}</h4>
                  {loading ? (
                    <div className="loading">
                      <span className="material-icons">refresh</span>
                      <span>Cargando...</span>
                    </div>
                  ) : hasItems() ? (
                    <div className="items-grid">
                      {getCurrentItems().map((item) => (
                        <div 
                          key={item.id} 
                          className={`item-card ${item.status !== 'Activo' ? 'unavailable' : ''}`}
                          onClick={() => item.status === 'Activo' && handleItemSelect(item)}
                        >
                          <div className="item-image">
                            <img 
                              src={
                                (item.images && item.images.length > 0) 
                                  ? item.images[0].url 
                                  : '/placeholder-image.jpg'
                              } 
                              alt={item.name} 
                            />
                            {item.status !== 'Activo' && (
                              <div className="unavailable-overlay">
                                <span className="material-icons">block</span>
                                <span>No Disponible</span>
                              </div>
                            )}
                    </div>
                    
                          <div className="item-info">
                            <div className="item-header">
                              <h5 className="item-name">{item.name}</h5>
                              <span className="item-type">{item.yachtCategory?.name || item.type || item.category}</span>
                            </div>
                      
                            <p className="item-description">{item.description}</p>
                      
                            <div className="item-details">
                              {item.capacity && (
                                <div className="detail">
                                  <span className="material-icons sm">group</span>
                                  <span>{item.capacity} personas</span>
                                </div>
                              )}
                              {item.length && (
                                <div className="detail">
                                  <span className="material-icons sm">straighten</span>
                                  <span>{item.length} ft</span>
                                </div>
                              )}
                              {item.pricing && item.pricing.length > 0 && (
                                <div className="detail">
                                  <span className="material-icons sm">payments</span>
                                  <span>{formatPrice(item.pricing[0].price)}/{item.pricing[0].hours}h</span>
                                </div>
                              )}
                              {item.location && (
                                <div className="detail">
                                  <span className="material-icons sm">location_on</span>
                                  <span>{item.location}</span>
                                </div>
                              )}
                            </div>
                      
                            {item.features && (
                              <div className="item-features">
                                {typeof item.features === 'string' ? (
                                  <span className="feature-tag">
                                    {item.features}
                                  </span>
                                ) : Array.isArray(item.features) && item.features.length > 0 ? (
                                  <>
                                    {item.features.slice(0, 3).map((feature: any, index: number) => (
                          <span key={index} className="feature-tag">
                            {feature}
                          </span>
                        ))}
                                    {item.features.length > 3 && (
                          <span className="feature-tag more">
                                        +{item.features.length - 3} más
                          </span>
                        )}
                                  </>
                                ) : null}
                      </div>
                            )}
                      
                            {item.status === 'Activo' && (
                              <button className="select-item-btn">
                                <span className="material-icons">check_circle</span>
                                Seleccionar
                              </button>
                            )}
                    </div>
                  </div>
                ))}
              </div>
                  ) : (
                    <div className="no-items">
                      <span className="material-icons">info</span>
                      <p>No hay {getItemTypeLabel().toLowerCase()}s disponibles en este momento.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Client Data */}
          {currentStep === 2 && (
            <div className="step-content">
              {loadingYachtDetails ? (
                <div className="loading">
                  <span className="material-icons">refresh</span>
                  <span>Cargando detalles del yate...</span>
                </div>
              ) : (
                <>
                  <div className="step-header">
                    <button 
                      className="back-btn"
                      onClick={() => setCurrentStep(1)}
                    >
                      <span className="material-icons">arrow_back</span>
                      Cambiar {getItemTypeLabel()}
                    </button>
                    <div className="selected-item-summary">
                      <span className="material-icons">
                        {formData.selectedType === 'yacht' ? 'sailing' : 
                         formData.selectedType === 'tour' ? 'explore' : 'nightlife'}
                      </span>
                      <span>{formData.selectedItem?.name}</span>
                      <span className="price">
                        {formData.selectedItem?.pricing?.[0]?.price 
                          ? formatPrice(formData.selectedItem.pricing[0].price) 
                          : 'Precio no disponible'}
                      </span>
                    </div>
                  </div>

              <div className="step-title-row">
                <div>
                  <h3 className="step-title">Datos de la Reserva</h3>
                  <p className="step-description">Completa la información para proceder con la reserva</p>
                </div>
              </div>
              
              <form className="client-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Nombre *</label>
                    <div className="input-wrapper">
                      <span className="material-icons">person</span>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Nombre"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Apellido *</label>
                    <div className="input-wrapper">
                      <span className="material-icons">person</span>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Apellido"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico *</label>
                    <div className="input-wrapper">
                      <span className="material-icons">email</span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="correo@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Teléfono *</label>
                    <div className="input-wrapper">
                      <span className="material-icons">phone</span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+34 666 777 888"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reservationDate">Fecha de Reserva *</label>
                    <div className="input-wrapper">
                      <span className="material-icons">event</span>
                      <input
                        type="date"
                        id="reservationDate"
                        name="reservationDate"
                        value={formData.reservationDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="quantity">Cantidad *</label>
                    <div className="input-wrapper">
                      <span className="material-icons">group</span>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Comentarios, solicitudes especiales, etc."
                    rows={3}
                  />
                </div>

                {/* Reservation Summary */}
                {formData.reservationDate && formData.quantity > 0 && (
                  <div className="reservation-summary">
                    <h4>Resumen de la Reserva</h4>
                    <div className="summary-details">
                      <div className="detail-row">
                        <span>Cantidad:</span>
                        <span>{formData.quantity}</span>
                      </div>
                      <div className="detail-row">
                        <span>Precio unitario:</span>
                        <span>{formatPrice(formData.selectedItem?.pricing?.[0]?.price || 0)}</span>
                      </div>
                      <div className="detail-row total">
                        <span>Total:</span>
                        <span>{formatPrice(calculateTotalPrice())}</span>
                      </div>
                    </div>
                  </div>
                )}
              </form>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {currentStep === 1 && (
            <button className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
          )}
          
          {currentStep === 2 && (
            <div className="footer-actions">
              <button className="btn btn-secondary" onClick={handleClose}>
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!formData.selectedItem || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.reservationDate || formData.quantity < 1}
              >
                <span className="material-icons">check_circle</span>
                Crear Reserva
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
