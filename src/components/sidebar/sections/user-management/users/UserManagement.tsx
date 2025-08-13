import React, { useState, useEffect } from 'react';
import { usePopupStore } from '../../../../../zustand/popupStore';
import { useUserStore } from '../../../../../zustand/userStore';
import { useRoleStore } from '../../../../../zustand/roleStore';

import APIs from '../../../../../services/services/APIs';
import UserModal from './user-modal/UserModal';
import './styles/UserManagement.css';

interface User {
  id: number;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  phoneNumber?: string;
  profileImage?: string;
  typeUser: string;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
  parentId?: number;
  parent?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  subUsers: User[];
  createdAt: string;
  updatedAt: string;
}



const UserManagement: React.FC = () => {
  const { showSuccess, showError } = usePopupStore();
  const { users, setUsers } = useUserStore();
  const { roles, setRoles } = useRoleStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response: any = await APIs.getAllUsers();
      if (response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response: any = await APIs.getAllRoles();
      if (response.data) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Fetch users by role
  const fetchUsersByRole = async (roleId: string) => {
    if (roleId === '') {
      setFilteredUsers(users);
      return;
    }
    
    try {
      const response: any = await APIs.getUsersByRole(parseInt(roleId));
      if (response.data) {
        setFilteredUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users by role:', error);
    }
  };

  // Handle role change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setSelectedRole(selectedRole);
    
    if (selectedRole === '') {
      setFilteredUsers(users);
    } else {
      fetchUsersByRole(selectedRole);
    }
  };

  // Get filtered users
  const getFilteredUsers = () => {
    let filtered = filteredUsers;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.typeUser.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Handle create user
  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await APIs.deleteUser(userId);
        showSuccess('Usuario eliminado exitosamente');
        fetchUsers();
      } catch (error: any) {
        showError(error.response?.data?.message || 'Error al eliminar el usuario');
      }
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    fetchUsers();
    handleModalClose();
  };

  const filteredUsersList = getFilteredUsers();

  return (
    <div className="user-management-page">
      {/* Page Header */}
      <div className="user-management-page__header">
        <div className="user-management-page__title-section">
          <div className="user-management-page__title-icon">
            <span className="material-icons">person</span>
          </div>
          <div className="user-management-page__title-content">
            <h1 className="user-management-page__title">Gestión de Usuarios</h1>
            <p className="user-management-page__subtitle">
              Administra los usuarios del sistema y sus permisos
            </p>
          </div>
        </div>
        <button 
          className="user-management-page__create-btn"
          onClick={handleCreateUser}
        >
          <span className="material-icons">person_add</span>
          Nuevo Usuario
        </button>
      </div>

      {/* Section Actions */}
      <div className="user-management-page__section-actions">
        <div className="user-management-page__filters">
          <div className="user-management-page__role-filter">
            <label htmlFor="roleFilter">Filtrar por Rol:</label>
            <select
              id="roleFilter"
              className="user-management-page__role-select"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <option value="">Todos los roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="user-management-page__search">
          <div className="user-management-page__search-input-wrapper">
            <span className="user-management-page__search-icon material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="user-management-page__search-input"
            />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="user-management-page__content">
        {isLoading ? (
          <div className="user-management-page__loading">
            <div className="user-management-page__loading-spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : filteredUsersList.length === 0 ? (
          <div className="user-management-page__empty-state">
            <div className="user-management-page__empty-icon">
              <span className="material-icons">person_off</span>
            </div>
            <h3>No hay usuarios</h3>
            <p>
              {searchTerm || selectedRole 
                ? 'No se encontraron usuarios con los filtros aplicados'
                : 'Comienza creando el primer usuario del sistema'
              }
            </p>
            {!searchTerm && !selectedRole && (
              <button 
                className="user-management-page__first-user-btn"
                onClick={handleCreateUser}
              >
                <span className="material-icons">person_add</span>
                Crear Primer Usuario
              </button>
            )}
          </div>
        ) : (
          <div className="user-management-page__users-grid">
            {filteredUsersList.map((user) => (
              <div key={user.id} className="user-management-page__user-card">
                <div className="user-management-page__user-header">
                  <div className="user-management-page__user-avatar">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    ) : (
                      <span className="material-icons">person</span>
                    )}
                  </div>
                  <div className="user-management-page__user-status">
                    <span className={`user-management-page__status-badge user-management-page__status-badge--${user.typeUser.toLowerCase()}`}>
                      {user.typeUser}
                    </span>
                  </div>
                </div>
                
                <div className="user-management-page__user-info">
                  <h3 className="user-management-page__user-name">
                    {user.firstName} {user.middleName && `${user.middleName} `}{user.lastName}
                    {user.secondLastName && ` ${user.secondLastName}`}
                  </h3>
                  <p className="user-management-page__user-email">{user.email}</p>
                  <p className="user-management-page__user-role">{user.role.name}</p>
                  {user.phoneNumber && (
                    <p className="user-management-page__user-phone">
                      <span className="material-icons">phone</span>
                      {user.phoneNumber}
                    </p>
                  )}
                  {user.parent && (
                    <p className="user-management-page__user-parent">
                      <span className="material-icons">account_tree</span>
                      Supervisor: {user.parent.firstName} {user.parent.lastName}
                    </p>
                  )}
                </div>

                <div className="user-management-page__user-actions">
                  <button
                    className="user-management-page__action-btn user-management-page__action-btn--edit"
                    onClick={() => handleEditUser(user)}
                    title="Editar usuario"
                  >
                    <span className="material-icons">edit</span>
                  </button>
                  <button
                    className="user-management-page__action-btn user-management-page__action-btn--delete"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Eliminar usuario"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingUser={editingUser}
      />
    </div>
  );
};

export default UserManagement;
