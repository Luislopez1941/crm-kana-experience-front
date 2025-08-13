import React from 'react';
import './styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Cotizaciones Activas',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: 'description',
      color: 'var(--primary)',
      bgColor: 'var(--primary-light)'
    },
    {
      title: 'Reservas del Mes',
      value: '18',
      change: '+8%',
      changeType: 'positive',
      icon: 'event',
      color: 'var(--success)',
      bgColor: 'var(--success-light)'
    },
    {
      title: 'Yates Disponibles',
      value: '12',
      change: '-2',
      changeType: 'negative',
      icon: 'sailing',
      color: 'var(--warning)',
      bgColor: 'var(--warning-light)'
    },
    {
      title: 'Ingresos del Mes',
      value: '$85,420',
      change: '+15%',
      changeType: 'positive',
      icon: 'trending_up',
      color: 'var(--info)',
      bgColor: 'var(--info-light)'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Nueva cotización generada',
      description: 'Cotización #2024-001 para Cliente Premium',
      time: 'Hace 2 horas',
      icon: 'description',
      type: 'cotizacion',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Reserva confirmada',
      description: 'Yate Luxury Pearl - 15-20 Marzo 2024',
      time: 'Hace 4 horas',
      icon: 'check_circle',
      type: 'reserva',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Pago recibido',
      description: 'Pago de $12,500 procesado exitosamente',
      time: 'Hace 6 horas',
      icon: 'payment',
      type: 'pago',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Mantenimiento programado',
      description: 'Yate Ocean Dream - Revisión semanal',
      time: 'Hace 1 día',
      icon: 'build',
      type: 'mantenimiento',
      priority: 'low'
    },
    {
      id: 5,
      title: 'Nuevo cliente registrado',
      description: 'María González - Cliente VIP',
      time: 'Hace 1 día',
      icon: 'person_add',
      type: 'cliente',
      priority: 'medium'
    }
  ];

  const upcomingReservations = [
    {
      id: 1,
      yacht: 'Luxury Pearl',
      client: 'Carlos Mendoza',
      date: '15 Mar 2024',
      duration: '5 días',
      status: 'confirmada',
      amount: '$15,000',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&h=100&fit=crop'
    },
    {
      id: 2,
      yacht: 'Ocean Dream',
      client: 'Ana Rodríguez',
      date: '22 Mar 2024',
      duration: '3 días',
      status: 'pendiente',
      amount: '$8,500',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&h=100&fit=crop'
    },
    {
      id: 3,
      yacht: 'Sea Breeze',
      client: 'Roberto Silva',
      date: '28 Mar 2024',
      duration: '7 días',
      status: 'confirmada',
      amount: '$21,000',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&h=100&fit=crop'
    }
  ];

  const quickActions = [
    {
      title: 'Nueva Cotización',
      icon: 'add_circle',
      description: 'Crear cotización para cliente',
      color: 'var(--primary)',
      action: () => console.log('Nueva cotización')
    },
    {
      title: 'Crear Reserva',
      icon: 'add_box',
      description: 'Reservar yate para cliente',
      color: 'var(--success)',
      action: () => console.log('Crear reserva')
    },
    {
      title: 'Agregar Cliente',
      icon: 'person_add',
      description: 'Registrar nuevo cliente',
      color: 'var(--info)',
      action: () => console.log('Agregar cliente')
    },
    {
      title: 'Generar Contrato',
      icon: 'note_add',
      description: 'Crear contrato de servicio',
      color: 'var(--warning)',
      action: () => console.log('Generar contrato')
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--error)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'remove';
      case 'low': return 'low_priority';
      default: return 'remove';
    }
  };

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="dashboard__header">
        <div className="dashboard__header-content">
          <div className="dashboard__title-section">
            <div className="dashboard__title-icon">
              <span className="material-icons">dashboard</span>
            </div>
            <div className="dashboard__title-text">
              <h1 className="dashboard__title">Panel Principal</h1>
              <p className="dashboard__subtitle">
                Resumen general del sistema de gestión de yates
              </p>
            </div>
          </div>
          <div className="dashboard__header-actions">
            <button className="dashboard__refresh-btn">
              <span className="material-icons">refresh</span>
              Actualizar
            </button>
            <button className="dashboard__settings-btn">
              <span className="material-icons">settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard__stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="dashboard__stat-card">
            <div className="dashboard__stat-header">
              <div className="dashboard__stat-icon" style={{ backgroundColor: stat.bgColor }}>
                <span className="material-icons" style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div className="dashboard__stat-change" data-type={stat.changeType}>
                <span className="material-icons">
                  {stat.changeType === 'positive' ? 'trending_up' : 'trending_down'}
                </span>
                {stat.change}
              </div>
            </div>
            <div className="dashboard__stat-content">
              <div className="dashboard__stat-value">{stat.value}</div>
              <div className="dashboard__stat-title">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard__main-grid">
        {/* Recent Activities */}
        <div className="dashboard__card dashboard__activities-card">
          <div className="dashboard__card-header">
            <div className="dashboard__card-title">
              <span className="material-icons">notifications</span>
              <h2>Actividad Reciente</h2>
            </div>
            <button className="dashboard__card-action">
              Ver todo
              <span className="material-icons">arrow_forward</span>
            </button>
          </div>
          <div className="dashboard__card-body">
            <div className="dashboard__activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="dashboard__activity-item" data-priority={activity.priority}>
                  <div className="dashboard__activity-icon">
                    <span className="material-icons">{activity.icon}</span>
                    <div className="dashboard__activity-priority" style={{ backgroundColor: getPriorityColor(activity.priority) }}>
                      <span className="material-icons">{getPriorityIcon(activity.priority)}</span>
                    </div>
                  </div>
                  <div className="dashboard__activity-content">
                    <h4 className="dashboard__activity-title">{activity.title}</h4>
                    <p className="dashboard__activity-description">{activity.description}</p>
                    <span className="dashboard__activity-time">
                      <span className="material-icons">schedule</span>
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="dashboard__card dashboard__reservations-card">
          <div className="dashboard__card-header">
            <div className="dashboard__card-title">
              <span className="material-icons">event</span>
              <h2>Próximas Reservas</h2>
            </div>
            <button className="dashboard__card-action">
              Ver calendario
              <span className="material-icons">calendar_today</span>
            </button>
          </div>
          <div className="dashboard__card-body">
            <div className="dashboard__reservations-list">
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="dashboard__reservation-item">
                  <div className="dashboard__reservation-image">
                    <img src={reservation.image} alt={reservation.yacht} />
                  </div>
                  <div className="dashboard__reservation-info">
                    <h4 className="dashboard__reservation-yacht">{reservation.yacht}</h4>
                    <p className="dashboard__reservation-client">
                      <span className="material-icons">person</span>
                      {reservation.client}
                    </p>
                    <div className="dashboard__reservation-details">
                      <span className="dashboard__reservation-date">
                        <span className="material-icons">event</span>
                        {reservation.date}
                      </span>
                      <span className="dashboard__reservation-duration">
                        <span className="material-icons">schedule</span>
                        {reservation.duration}
                      </span>
                    </div>
                    <div className="dashboard__reservation-amount">{reservation.amount}</div>
                  </div>
                  <div className={`dashboard__reservation-status dashboard__reservation-status--${reservation.status}`}>
                    <span className="material-icons">
                      {reservation.status === 'confirmada' ? 'check_circle' : 'schedule'}
                    </span>
                    {reservation.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard__quick-actions">
        <div className="dashboard__section-header">
          <h2 className="dashboard__section-title">
            <span className="material-icons">flash_on</span>
            Acciones Rápidas
          </h2>
          <p className="dashboard__section-description">
            Accede rápidamente a las funciones más utilizadas
          </p>
        </div>
        <div className="dashboard__quick-actions-grid">
          {quickActions.map((action, index) => (
            <button 
              key={index} 
              className="dashboard__quick-action-btn"
              onClick={action.action}
              style={{ '--action-color': action.color } as React.CSSProperties}
            >
              <div className="dashboard__quick-action-icon">
                <span className="material-icons">{action.icon}</span>
              </div>
              <div className="dashboard__quick-action-content">
                <span className="dashboard__quick-action-title">{action.title}</span>
                <span className="dashboard__quick-action-description">{action.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="dashboard__performance-section">
        <div className="dashboard__card">
          <div className="dashboard__card-header">
            <div className="dashboard__card-title">
              <span className="material-icons">analytics</span>
              <h2>Rendimiento del Mes</h2>
            </div>
            <div className="dashboard__card-period-selector">
              <button className="dashboard__period-btn dashboard__period-btn--active">Mes</button>
              <button className="dashboard__period-btn">Trimestre</button>
              <button className="dashboard__period-btn">Año</button>
            </div>
          </div>
          <div className="dashboard__card-body">
            <div className="dashboard__chart-placeholder">
              <div className="dashboard__chart-content">
                <span className="material-icons">insert_chart</span>
                <p>Gráfico de rendimiento</p>
                <small>Aquí se mostrará el gráfico de ingresos y reservas</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
