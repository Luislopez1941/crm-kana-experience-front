import React from 'react';
import { useStore } from '../../zustand/useStore';
import useUserStore from '../../zustand/useUserStore';
import './styles/Header.css';

const Header: React.FC = () => {
  const { toggleSidebar, theme, toggleTheme, logout } = useStore();
  const { user } = useUserStore();

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = getCurrentDateTime();

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="mobile-menu-toggle"
          onClick={toggleSidebar}
        >
          <span className="material-icons">menu</span>
        </button>
        
        <div className="header-breadcrumb">
          <div className="breadcrumb-item">
            <span className="material-icons">home</span>
            <span>YachtCRM</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="header-search">
          <span className="material-icons search-icon">search</span>
          <input 
            type="text" 
            placeholder="Buscar clientes, yates, reservas..." 
            className="search-input"
          />
          <kbd className="search-shortcut">Ctrl+K</kbd>
        </div>
      </div>

      <div className="header-right">
        <div className="header-datetime">
          <div className="current-time">{time}</div>
          <div className="current-date">{date}</div>
        </div>

        <div className="header-actions">
          <button className="header-action-btn">
            <span className="material-icons">notifications</span>
            <span className="notification-badge">3</span>
          </button>

          <button className="header-action-btn" onClick={toggleTheme}>
            <span className="material-icons">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          <div className="header-divider"></div>

          <div className="user-profile">
            <div className="user-avatar">
              <span className="material-icons">person</span>
            </div>
            <div className="user-info">
              <div className="user-name">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Usuario'}</div>
              <div className="user-role">{user?.rol || 'Usuario'}</div>
            </div>
            <button className="user-menu-btn" onClick={logout} title="Cerrar Sesión">
              <span className="material-icons">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
