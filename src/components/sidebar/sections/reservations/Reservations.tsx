import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservationStore } from '../../../../zustand/reservationStore';
import APIs from '../../../../services/services/APIs';

// Debug: Verificar qué se está importando
console.log('🔍 APIs object:', APIs);
console.log('🔍 APIs.getAllReservations:', APIs.getAllReservations);
console.log('🔍 typeof APIs.getAllReservations:', typeof APIs.getAllReservations);
import ReservationModal from './reservation-modal/ReservationModal';
import EditReservationModal from './edit-reservation-modal/EditReservationModal';
import './styles/Reservations.css';

const Reservaciones: React.FC = () => {
  console.log('🏗️ Reservaciones component rendering...');
  const navigate = useNavigate();
  const {
    filteredReservations,
    updateReservationStatus,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    loadReservations,
    loading
  } = useReservationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  // Cargar reservaciones al montar el componente
  useEffect(() => {
    console.log('🔄 Reservations component mounted, calling loadReservations...');
    console.log('🔍 loadReservations function:', loadReservations);
    
    // Llamada directa a la API para debuggear
    const loadReservationsDirect = async () => {
      try {
        console.log('🚀 DIRECT API CALL - Calling APIs.getAllReservations()...');
        const response = await APIs.getAllReservations();
        console.log('📦 DIRECT API RESPONSE:', response);
      } catch (error) {
        console.error('💥 DIRECT API ERROR:', error);
      }
    };
    
    loadReservationsDirect();
    
    if (typeof loadReservations === 'function') {
      loadReservations();
    } else {
      console.error('❌ loadReservations is not a function!');
    }
  }, []); // Remover loadReservations de las dependencias para evitar loops

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Pendiente';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const handleEditReservation = (reservation: any) => {
    setSelectedReservation(reservation);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedReservation(null);
  };

  console.log('📊 Current state - loading:', loading, 'filteredReservations:', filteredReservations.length);

  return (
    <div className="reservaciones-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons xl">event</span>
            Gestión de Reservas
          </h1>
          <p className="page-subtitle">
            Administra todas las reservas de yates y crea nuevas reservaciones
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={async () => {
              console.log('🔄 Manual reload triggered');
              try {
                console.log('🚀 MANUAL API CALL - Calling APIs.getAllReservations()...');
                const response = await APIs.getAllReservations();
                console.log('📦 MANUAL API RESPONSE:', response);
              } catch (error) {
                console.error('💥 MANUAL API ERROR:', error);
              }
              loadReservations();
            }}
            disabled={loading}
          >
            <span className="material-icons">refresh</span>
            {loading ? 'Cargando...' : 'Recargar'}
          </button>
          <button 
            className="btn btn-primary create-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-icons">add_circle</span>
            Nueva Reserva
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
   

      {/* Reservations List */}
      <div className="reservations-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="material-icons">list</span>
            Reservas Actuales
          </h2>
          <div className="section-actions">
            <div className="search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Buscar reservas..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="confirmed">Confirmadas</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading">
              <span className="material-icons">refresh</span>
              <span>Cargando reservaciones...</span>
            </div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">event_busy</span>
            <h3>No hay reservas registradas</h3>
            <p>Crea tu primera reserva para comenzar a gestionar la flota</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-icons">add_circle</span>
              Crear Primera Reserva
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-wrapper">
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>YATE</th>
                    <th>CLIENTE</th>
                    <th>FECHAS</th>
                    <th>ESTADO</th>
                    <th>TOTAL</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="yacht-cell">{reservation.yachtName}</td>
                      <td className="client-cell">
                        <div className="client-name">{reservation.clientName}</div>
                        <div className="client-email">{reservation.clientEmail}</div>
                      </td>
                      <td className="dates-cell">
                        <div className="date-range">
                          {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                        </div>
                        <div className="duration">{reservation.totalDays} días</div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                      </td>
                      <td className="price-cell">{formatPrice(reservation.totalPrice)}</td>
                      <td className="actions-cell">
                        <button
                          className="action-btn"
                          title="Ver detalles"
                          onClick={() => navigate(`/reservas/detalle/${reservation.id}`)}
                        >
                          <span className="material-icons">visibility</span>
                        </button>
                        <button 
                          className="action-btn" 
                          title="Editar"
                          onClick={() => handleEditReservation(reservation)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              className="action-btn"
                              title="Confirmar"
                              onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                            >
                              <span className="material-icons">check</span>
                            </button>
                            <button
                              className="action-btn danger"
                              title="Cancelar"
                              onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                            >
                              <span className="material-icons">cancel</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="reservations-grid">
              {filteredReservations.map((reservation) => (
                <div key={reservation.id} className="reservation-card">
                  <div className="card-header">
                    <div className="yacht-info">
                      <h3 className="yacht-name">{reservation.yachtName}</h3>
                      <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </div>
                    <div className="card-actions">
                      <button
                        className="action-btn"
                        title="Ver detalles"
                        onClick={() => navigate(`/reservas/detalle/${reservation.id}`)}
                      >
                        <span className="material-icons">visibility</span>
                      </button>
                      <button className="action-btn" title="Editar">
                        <span className="material-icons">edit</span>
                      </button>
                      <button className="action-btn danger" title="Cancelar">
                        <span className="material-icons">cancel</span>
                      </button>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="client-info">
                      <div className="info-row">
                        <span className="material-icons sm">person</span>
                        <div>
                          <strong>{reservation.clientName}</strong>
                          <p>{reservation.clientEmail}</p>
                        </div>
                      </div>
                      <div className="info-row">
                        <span className="material-icons sm">phone</span>
                        <span>{reservation.clientPhone}</span>
                      </div>
                    </div>

                    <div className="reservation-details">
                      <div className="detail-row">
                        <span className="material-icons sm">event</span>
                        <div>
                          <strong>Fechas:</strong>
                          <p>{formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}</p>
                        </div>
                      </div>
                      <div className="detail-row">
                        <span className="material-icons sm">schedule</span>
                        <div>
                          <strong>Duración:</strong>
                          <p>{reservation.totalDays} días</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="price-info">
                      <span className="price-label">Total:</span>
                      <span className="price-amount">{formatPrice(reservation.totalPrice)}</span>
                    </div>

                    {reservation.status === 'pending' && (
                      <div className="quick-actions">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                        >
                          <span className="material-icons sm">check</span>
                          Confirmar
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                        >
                          <span className="material-icons sm">close</span>
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Reservation Modal */}
      <ReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Edit Reservation Modal */}
      <EditReservationModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        reservation={selectedReservation}
      />
    </div>
  );
};

export default Reservaciones;
