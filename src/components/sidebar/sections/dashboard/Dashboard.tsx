import React from 'react';
import './styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Cotizaciones Activas',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: 'description'
    },
    {
      title: 'Reservas del Mes',
      value: '18',
      change: '+8%',
      changeType: 'positive',
      icon: 'event'
    },
    {
      title: 'Yates Disponibles',
      value: '12',
      change: '-2',
      changeType: 'negative',
      icon: 'sailing'
    },
    {
      title: 'Ingresos del Mes',
      value: '$85,420',
      change: '+15%',
      changeType: 'positive',
      icon: 'trending_up'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Nueva cotización generada',
      description: 'Cotización #2024-001 para Cliente Premium',
      time: 'Hace 2 horas',
      icon: 'description',
      type: 'cotizacion'
    },
    {
      id: 2,
      title: 'Reserva confirmada',
      description: 'Yate Luxury Pearl - 15-20 Marzo 2024',
      time: 'Hace 4 horas',
      icon: 'check_circle',
      type: 'reserva'
    },
    {
      id: 3,
      title: 'Pago recibido',
      description: 'Pago de $12,500 procesado exitosamente',
      time: 'Hace 6 horas',
      icon: 'payment',
      type: 'pago'
    },
    {
      id: 4,
      title: 'Mantenimiento programado',
      description: 'Yate Ocean Dream - Revisión semanal',
      time: 'Hace 1 día',
      icon: 'build',
      type: 'mantenimiento'
    }
  ];

  const upcomingReservations = [
    {
      id: 1,
      yacht: 'Luxury Pearl',
      client: 'Carlos Mendoza',
      date: '15 Mar 2024',
      duration: '5 días',
      status: 'confirmada'
    },
    {
      id: 2,
      yacht: 'Ocean Dream',
      client: 'Ana Rodríguez',
      date: '22 Mar 2024',
      duration: '3 días',
      status: 'pendiente'
    },
    {
      id: 3,
      yacht: 'Sea Breeze',
      client: 'Roberto Silva',
      date: '28 Mar 2024',
      duration: '7 días',
      status: 'confirmada'
    }
  ];

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="material-icons xl">dashboard</span>
          Panel Principal
        </h1>
        <p className="page-subtitle">
          Resumen general del sistema de gestión de yates
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
        {stats.map((stat, index) => (
          <div key={index} className="card stat-card">
            <div className="card-header">
              <span className="card-title">{stat.title}</span>
              <span className="material-icons">{stat.icon}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.changeType}`}>
              {stat.change} vs mes anterior
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-2">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="material-icons">notifications</span>
              Actividad Reciente
            </h2>
            <button className="btn btn-secondary">
              Ver todo
            </button>
          </div>
          <div className="card-body">
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    <span className="material-icons">{activity.icon}</span>
                  </div>
                  <div className="activity-content">
                    <h4 className="activity-title">{activity.title}</h4>
                    <p className="activity-description">{activity.description}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="material-icons">event</span>
              Próximas Reservas
            </h2>
            <button className="btn btn-secondary">
              Ver calendario
            </button>
          </div>
          <div className="card-body">
            <div className="reservations-list">
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="reservation-item">
                  <div className="reservation-info">
                    <h4 className="reservation-yacht">{reservation.yacht}</h4>
                    <p className="reservation-client">Cliente: {reservation.client}</p>
                    <div className="reservation-details">
                      <span className="reservation-date">
                        <span className="material-icons sm">event</span>
                        {reservation.date}
                      </span>
                      <span className="reservation-duration">
                        <span className="material-icons sm">schedule</span>
                        {reservation.duration}
                      </span>
                    </div>
                  </div>
                  <div className={`reservation-status ${reservation.status}`}>
                    {reservation.status === 'confirmada' ? (
                      <span className="material-icons">check_circle</span>
                    ) : (
                      <span className="material-icons">schedule</span>
                    )}
                    {reservation.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="content-section" style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2 className="section-title">
          <span className="material-icons">flash_on</span>
          Acciones Rápidas
        </h2>
        <div className="grid grid-4">
          <button className="quick-action-btn">
            <span className="material-icons">add_circle</span>
            <span>Nueva Cotización</span>
          </button>
          <button className="quick-action-btn">
            <span className="material-icons">add_box</span>
            <span>Crear Reserva</span>
          </button>
          <button className="quick-action-btn">
            <span className="material-icons">person_add</span>
            <span>Agregar Cliente</span>
          </button>
          <button className="quick-action-btn">
            <span className="material-icons">note_add</span>
            <span>Generar Contrato</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
