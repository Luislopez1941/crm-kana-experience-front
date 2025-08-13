import React from 'react';
import useUserStore from '../../zustand/useUserStore';
import './styles/Header.css';

const Header: React.FC = () => {
  const { user, resetUser } = useUserStore();

  const handleLogout = () => {
    resetUser();
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="mobile-menu-toggle"
          onClick={() => {
            // TODO: Implement sidebar toggle functionality
            console.log('Toggle sidebar clicked');
          }}
        >
          <span className="material-icons">menu</span>
        </button>
      </div>

      <div className="header-center">
        <div className="header-search">
          <span className="material-icons search-icon">search</span>
          <input 
            type="text" 
            placeholder="Buscar clientes, yates, reservas..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="header-action-btn">
            <span className="material-icons">notifications</span>
            <span className="notification-badge">3</span>
          </button>

          <button className="header-action-btn" onClick={() => {
            // TODO: Implement theme toggle functionality
            console.log('Toggle theme clicked');
          }}>
            <span className="material-icons">light_mode</span>
          </button>

          <div className="header-divider"></div>

          <div className="user-profile">
            <div className="user-avatar">
              <span className="material-icons">person</span>
            </div>
            <div className="user-info">
              <div className="user-name">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Usuario'}</div>
              <div className="user-role">{user?.role?.name || 'Usuario'}</div>
            </div>
            <button className="user-menu-btn" onClick={handleLogout} title="Cerrar Sesión">
              <span className="material-icons">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
