import React, { useState } from 'react';
import { useReservationStore } from '../../../../../zustand/reservationStore';
import './styles/ReservationModal.css';

interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReservationForm {
  selectedYacht: any;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startDate: string;
  endDate: string;
  notes: string;
}

const ReservationModal: React.FC<CreateReservationModalProps> = ({ isOpen, onClose }) => {
  const { yachts, addReservation } = useReservationStore();
  const [currentStep, setCurrentStep] = useState(1);
  // Datos temporales aleatorios para pruebas
  const tempClients = [
    {
      name: 'Juan Carlos Pérez',
      email: 'juan.perez@email.com',
      phone: '+34 666 123 456',
      notes: 'Reserva de prueba - Celebración familiar'
    },
    {
      name: 'María González López',
      email: 'maria.gonzalez@outlook.com',
      phone: '+34 678 987 654',
      notes: 'Evento corporativo - Reunión de empresa'
    },
    {
      name: 'Roberto Martín Silva',
      email: 'roberto.martin@gmail.com',
      phone: '+34 645 321 789',
      notes: 'Cumpleaños especial - Necesita catering'
    },
    {
      name: 'Carmen Ruiz Fernández',
      email: 'carmen.ruiz@hotmail.com',
      phone: '+34 612 456 789',
      notes: 'Luna de miel - Solicita decoración romántica'
    },
    {
      name: 'Alejandro Torres',
      email: 'alex.torres@empresa.com',
      phone: '+34 689 654 321',
      notes: 'Escapada de fin de semana'
    }
  ];

  // Seleccionar cliente aleatorio
  const randomClient = tempClients[Math.floor(Math.random() * tempClients.length)];

  // Generar fechas aleatorias realistas
  const today = new Date();
  const startDays = Math.floor(Math.random() * 30) + 2; // Entre 2 y 31 días
  const duration = Math.floor(Math.random() * 6) + 1; // Entre 1 y 6 días

  const startDate = new Date(today);
  startDate.setDate(today.getDate() + startDays);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + duration);

  const [formData, setFormData] = useState<ReservationForm>({
    selectedYacht: null,
    clientName: randomClient.name,
    clientEmail: randomClient.email,
    clientPhone: randomClient.phone,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    notes: randomClient.notes
  });

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = (): number => {
    if (!formData.selectedYacht || !formData.startDate || !formData.endDate) return 0;
    const days = calculateDays(formData.startDate, formData.endDate);
    return formData.selectedYacht.price * days;
  };

  const generateRandomData = () => {
    const randomClient = tempClients[Math.floor(Math.random() * tempClients.length)];
    const today = new Date();
    const startDays = Math.floor(Math.random() * 30) + 2;
    const duration = Math.floor(Math.random() * 6) + 1;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() + startDays);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);

    setFormData(prev => ({
      ...prev,
      clientName: randomClient.name,
      clientEmail: randomClient.email,
      clientPhone: randomClient.phone,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      notes: randomClient.notes
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const handleYachtSelect = (yacht: any) => {
    setFormData(prev => ({ ...prev, selectedYacht: yacht }));
    setCurrentStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedYacht) return;

    const totalDays = calculateDays(formData.startDate, formData.endDate);
    const totalPrice = calculateTotalPrice();

    addReservation({
      yachtId: formData.selectedYacht.id,
      yachtName: formData.selectedYacht.name,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalDays,
      totalPrice,
      status: 'pending'
    });

    // Reset form and close modal
    setFormData({
      selectedYacht: null,
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      startDate: '',
      endDate: '',
      notes: ''
    });
    setCurrentStep(1);
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      selectedYacht: null,
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      startDate: '',
      endDate: '',
      notes: ''
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
            <span>Seleccionar Yate</span>
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
          {/* Step 1: Yacht Selection */}
          {currentStep === 1 && (
            <div className="step-content">
              <h3 className="step-title">Selecciona un Yate</h3>
              <p className="step-description">Elige el yate perfecto para la reserva</p>
              
              <div className="yachts-grid">
                {yachts.map((yacht) => (
                  <div 
                    key={yacht.id} 
                    className={`yacht-card ${!yacht.available ? 'unavailable' : ''}`}
                    onClick={() => yacht.available && handleYachtSelect(yacht)}
                  >
                    <div className="yacht-image">
                      <img src={yacht.image} alt={yacht.name} />
                      {!yacht.available && (
                        <div className="unavailable-overlay">
                          <span className="material-icons">block</span>
                          <span>No Disponible</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="yacht-info">
                      <div className="yacht-header">
                        <h4 className="yacht-name">{yacht.name}</h4>
                        <span className="yacht-type">{yacht.type}</span>
                      </div>
                      
                      <p className="yacht-description">{yacht.description}</p>
                      
                      <div className="yacht-details">
                        <div className="detail">
                          <span className="material-icons sm">group</span>
                          <span>{yacht.capacity} personas</span>
                        </div>
                        <div className="detail">
                          <span className="material-icons sm">payments</span>
                          <span>{formatPrice(yacht.price)}/hora</span>
                        </div>
                      </div>
                      
                      <div className="yacht-features">
                        {yacht.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="feature-tag">
                            {feature}
                          </span>
                        ))}
                        {yacht.features.length > 3 && (
                          <span className="feature-tag more">
                            +{yacht.features.length - 3} más
                          </span>
                        )}
                      </div>
                      
                      {yacht.available && (
                        <button className="select-yacht-btn">
                          <span className="material-icons">check_circle</span>
                          Seleccionar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Client Data */}
          {currentStep === 2 && (
            <div className="step-content">
              <div className="step-header">
                <button 
                  className="back-btn"
                  onClick={() => setCurrentStep(1)}
                >
                  <span className="material-icons">arrow_back</span>
                  Cambiar Yate
                </button>
                <div className="selected-yacht-summary">
                  <span className="material-icons">sailing</span>
                  <span>{formData.selectedYacht?.name}</span>
                  <span className="price">{formatPrice(formData.selectedYacht?.price || 0)}/hora</span>
                </div>
              </div>

              <div className="step-title-row">
                <div>
                  <h3 className="step-title">Datos del Cliente</h3>
                  <p className="step-description">Completa la información de contacto</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline random-data-btn"
                  onClick={generateRandomData}
                  title="Generar datos aleatorios"
                >
                  <span className="material-icons">shuffle</span>
                  Datos Random
                </button>
              </div>
              
              <form className="client-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="clientName">Nombre Completo *</label>
                    <div className="input-wrapper">
                      <span className="material-icons">person</span>
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        placeholder="Nombre del cliente"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="clientPhone">Teléfono *</label>
                    <div className="input-wrapper">
                      <span className="material-icons">phone</span>
                      <input
                        type="tel"
                        id="clientPhone"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleInputChange}
                        placeholder="+34 666 777 888"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="clientEmail">Correo Electrónico *</label>
                  <div className="input-wrapper">
                    <span className="material-icons">email</span>
                    <input
                      type="email"
                      id="clientEmail"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      placeholder="cliente@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Fecha de Inicio *</label>
                    <div className="input-wrapper">
                      <span className="material-icons">event</span>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endDate">Fecha de Fin *</label>
                    <div className="input-wrapper">
                      <span className="material-icons">event</span>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notas Adicionales</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Comentarios, solicitudes especiales, etc."
                    rows={3}
                  />
                </div>

                {/* Reservation Summary */}
                {formData.startDate && formData.endDate && (
                  <div className="reservation-summary">
                    <h4>Resumen de la Reserva</h4>
                    <div className="summary-details">
                      <div className="detail-row">
                        <span>Duración:</span>
                        <span>{calculateDays(formData.startDate, formData.endDate)} días</span>
                      </div>
                      <div className="detail-row">
                        <span>Precio por hora:</span>
                        <span>{formatPrice(formData.selectedYacht?.price || 0)}</span>
                      </div>
                      <div className="detail-row total">
                        <span>Total:</span>
                        <span>{formatPrice(calculateTotalPrice())}</span>
                      </div>
                    </div>
                  </div>
                )}
              </form>
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
                disabled={!formData.clientName || !formData.clientEmail || !formData.clientPhone || !formData.startDate || !formData.endDate}
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
