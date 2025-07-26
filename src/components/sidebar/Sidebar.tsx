
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore} from '../../zustand/useStore';
import menuItems from './json/Menu.json';
import './styles/Sidebar.css';

// Definir la interfaz MenuItem para tipado del menú importado
interface MenuItem {
  id: string;
  label: string;
  icon?: string; // Ahora opcional
  path?: string;
  children?: MenuItem[];
}

interface SidebarItemProps {
  item: MenuItem;
  level: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, level }) => {
  const { 
    activeMenuItem, 
    setActiveMenuItem, 
    expandedMenus, 
    toggleMenuExpansion,
    sidebarCollapsed 
  } = useStore();

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedMenus.includes(item.id);
  const isActive = activeMenuItem === item.id;

  const handleClick = () => {
    if (hasChildren) {
      toggleMenuExpansion(item.id);
    } else {
      setActiveMenuItem(item.id);
    }
  };

  const ItemContent = (
    <div
      className={`sidebar-item ${isActive ? 'active' : ''} ${level > 0 ? 'submenu' : ''}`}
      onClick={handleClick}
      data-tooltip={sidebarCollapsed ? item.label : ''}
    >
      <div className="sidebar-item-content">
        <span className="material-icons md">{item.icon || 'menu'}</span>
        {!sidebarCollapsed && (
          <>
            <span className="sidebar-item-label">{item.label}</span>
            {hasChildren && (
              <span className={`material-icons sidebar-expand-icon ${isExpanded ? 'expanded' : ''}`}>
                expand_more
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="sidebar-item-wrapper">
      {item.path ? (
        <Link to={item.path} className="sidebar-link">
          {ItemContent}
        </Link>
      ) : (
        ItemContent
      )}
      
      {hasChildren && isExpanded && !sidebarCollapsed && (
        <div className="sidebar-submenu">
          {item.children!.map((child) => (
            <SidebarItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme } = useStore();

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="material-icons xl">sailing</span>
          {!sidebarCollapsed && (
            <div className="sidebar-brand">
              <h2>YachtCRM</h2>
              {/* <span className="sidebar-subtitle">Sistema de Gestión</span> */}
            </div>
          )}
        </div>
        {/* Botón de menú hamburguesa eliminado */}
      </div>

      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <SidebarItem key={item.id} item={item} level={0} />
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          <span className="material-icons md">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
          {!sidebarCollapsed && (
            <span>{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</span>
          )}
        </button>
      </div>

      {/* Botón flotante dentro del sidebar con position: absolute */}
      <button
        className="sidebar-float-toggle"
        onClick={toggleSidebar}
      >
        <span className="material-icons md">
          {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>
    </div>
  );
};

export default Sidebar;
