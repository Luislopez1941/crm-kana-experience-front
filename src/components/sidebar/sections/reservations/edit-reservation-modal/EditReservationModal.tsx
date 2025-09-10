import React, { useState, useEffect } from 'react';
import { useReservationStore } from '../../../../../zustand/reservationStore';
import APIs from '../../../../../services/services/APIs';
import './styles/EditReservationModal.css';

interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
}

const EditReservationModal: React.FC<EditReservationModalProps> = ({ 
  isOpen, 
  onClose, 
  reservation 
}) => {
  const { loadReservations } = useReservationStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reservationDate: '',
    quantity: 1,
    description: '',
    status: 'pending',
    folioId: 0
  });

  // Cargar datos de la reserva cuando se abre el modal
  useEffect(() => {
    if (reservation && isOpen) {
      // Extraer firstName y lastName del clientName
      const nameParts = reservation.clientName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData({
        firstName,
        lastName,
        email: reservation.clientEmail,
        phone: reservation.clientPhone,
        reservationDate: reservation.startDate,
        quantity: 1, // Por ahora fijo
        description: reservation.notes || '',
        status: reservation.status,
        folioId: reservation.folioId || 0
      });
    }
  }, [reservation, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('🔄 Updating reservation:', reservation.id, formData);
      
      // Preparar datos para la API
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        reservationDate: formData.reservationDate,
        quantity: formData.quantity,
        description: formData.description,
        status: formData.status,
        folioId: formData.folioId
      };
      
      // Llamar a la API de actualización
      const response = await APIs.updateReservation(reservation.id, updateData);
      console.log('✅ Reservation updated successfully:', response);
      
      // Recargar las reservaciones para mostrar los cambios
      await loadReservations();
      
      onClose();
    } catch (error) {
      console.error('💥 Error updating reservation:', error);
      alert('Error al actualizar la reserva. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content edit-reservation-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="material-icons">edit</span>
            Editar Reserva
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <form className="edit-form" onSubmit={handleSubmit}>
            {/* Información del Cliente */}
            <div className="form-section">
              <h3 className="section-title">Información del Cliente</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Nombre *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Apellido *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Información de la Reserva */}
            <div className="form-section">
              <h3 className="section-title">Información de la Reserva</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reservationDate">Fecha de Reserva *</label>
                  <input
                    type="date"
                    id="reservationDate"
                    name="reservationDate"
                    value={formData.reservationDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Cantidad *</label>
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
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="folioId">Folio *</label>
                  <input
                    type="number"
                    id="folioId"
                    name="folioId"
                    value={formData.folioId}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Estado de la Reserva */}
            <div className="form-section">
              <h3 className="section-title">Estado de la Reserva</h3>
              <div className="form-group">
                <label htmlFor="status">Estado *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="status-select"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            </div>

            {/* Información del Yate */}
            <div className="form-section">
              <h3 className="section-title">Información del Yate</h3>
              <div className="yacht-info-display">
                <div className="yacht-detail">
                  <span className="label">Yate:</span>
                  <span className="value">{reservation.yacht?.name || reservation.yachtName || 'No disponible'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">ID del Yate:</span>
                  <span className="value">{reservation.yachtId || 'No disponible'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">Capacidad:</span>
                  <span className="value">{reservation.yacht?.capacity || 'No disponible'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">Longitud:</span>
                  <span className="value">{reservation.yacht?.length || 'No disponible'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">Ubicación:</span>
                  <span className="value">{reservation.yacht?.location || 'No disponible'}</span>
                </div>
              </div>
            </div>

            {/* Información del Folio */}
            <div className="form-section">
              <h3 className="section-title">Información del Folio</h3>
              <div className="yacht-info-display">
                <div className="yacht-detail">
                  <span className="label">Folio ID:</span>
                  <span className="value">{reservation.folioId || 'No asignado'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">Número de Folio:</span>
                  <span className="value">{reservation.folio?.folio || 'No disponible'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">Número:</span>
                  <span className="value">{reservation.folio?.number || 'No disponible'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">Año:</span>
                  <span className="value">{reservation.folio?.year || 'No disponible'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">Creado:</span>
                  <span className="value">
                    {reservation.folio?.createdAt 
                      ? new Date(reservation.folio.createdAt).toLocaleDateString('es-ES')
                      : 'No disponible'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Información de la Reserva */}
            <div className="form-section">
              <h3 className="section-title">Detalles de la Reserva</h3>
              <div className="yacht-info-display">
                <div className="yacht-detail">
                  <span className="label">ID de Reserva:</span>
                  <span className="value">{reservation.id}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">Tipo:</span>
                  <span className="value">{reservation.type || 'No disponible'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">Producto ID:</span>
                  <span className="value">{reservation.productId || 'No disponible'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">Usuario ID:</span>
                  <span className="value">{reservation.userId || 'No disponible'}</span>
                </div>
                <div className="yacht-detail">
                  <span className="label">QR:</span>
                  <span className="value">{reservation.qr || 'No generado'}</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            <span className="material-icons">
              {loading ? 'refresh' : 'save'}
            </span>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReservationModal;
