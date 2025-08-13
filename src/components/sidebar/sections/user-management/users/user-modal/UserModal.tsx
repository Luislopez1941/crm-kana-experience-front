import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePopupStore } from '../../../../../../zustand/popupStore';
import { useRoleStore } from '../../../../../../zustand/roleStore';

import APIs from '../../../../../../services/services/APIs';
import './styles/UserModal.css';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingUser?: any;
}

interface UserForm {
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  phoneNumber: string;
  profileImage: string;
  typeUser: string;
  roleId: number;
  parentId: number;
}

const UserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSuccess, editingUser }) => {
  const { showSuccess, showError } = usePopupStore();
  const { roles } = useRoleStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  const [formData, setFormData] = useState<UserForm>({
    email: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    phoneNumber: '',
    profileImage: '',
    typeUser: '',
    roleId: 0,
    parentId: 0
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Fetch roles
  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const response: any = await APIs.getAllRoles();
      if (response.data) {
        // Roles will be loaded from the store
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // Fetch available users for parent selection
  const fetchAvailableUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response: any = await APIs.getAllUsers();
      if (response.data) {
        setAvailableUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      fetchAvailableUsers();
    }
  }, [isOpen]);

  // Load editing user data
  useEffect(() => {
    if (editingUser) {
      setFormData({
        email: editingUser.email || '',
        password: '', // Don't show password when editing
        firstName: editingUser.firstName || '',
        middleName: editingUser.middleName || '',
        lastName: editingUser.lastName || '',
        secondLastName: editingUser.secondLastName || '',
        phoneNumber: editingUser.phoneNumber || '',
        profileImage: editingUser.profileImage || '',
        typeUser: editingUser.typeUser || '',
        roleId: editingUser.roleId || 0,
        parentId: editingUser.parentId || 0
      });

      if (editingUser.profileImage) {
        setImagePreview(editingUser.profileImage);
      }
    } else {
      // Reset form for new user
      setFormData({
        email: '',
        password: '',
        firstName: '',
        middleName: '',
        lastName: '',
        secondLastName: '',
        phoneNumber: '',
        profileImage: '',
        typeUser: '',
        roleId: 0,
        parentId: 0
      });
      setImagePreview('');
    }
  }, [editingUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roleId' || name === 'parentId' ? Number(value) : value
    }));
  };

  // Dropzone configuration for profile image
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          profileImage: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      profileImage: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend: any = {
      ...formData
    };

    // Don't send password if it's empty (editing mode)
    if (editingUser && !formData.password) {
      delete dataToSend.password;
    }
    
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.email || (!editingUser && !formData.password) || !formData.firstName || !formData.lastName || !formData.typeUser || !formData.roleId) {
        showError('Por favor completa todos los campos requeridos');
        return;
      }

      if (editingUser) {
        // Update existing user
        const response: any = await APIs.updateUser(editingUser.id, dataToSend);
        showSuccess(response.message || 'Usuario actualizado exitosamente');
        onSuccess();
        handleClose();
      } else {
        // Create new user
        const response: any = await APIs.createUser(dataToSend);
        showSuccess(response.message || 'Usuario creado exitosamente');
        onSuccess();
        handleClose();
      }
    } catch (error: any) {
      console.error('Error saving user:', error);
      
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else if (error.message) {
        showError(error.message);
      } else {
        showError('Error al guardar el usuario');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      middleName: '',
      lastName: '',
      secondLastName: '',
      phoneNumber: '',
      profileImage: '',
      typeUser: '',
      roleId: 0,
      parentId: 0
    });
    setImagePreview('');
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal">
      <div className="user-modal__overlay" onClick={handleClose}>
        <div className="user-modal__container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="user-modal__header">
            <div className="user-modal__title">
              <div className="user-modal__title-icon">
                <span className="material-icons">person</span>
              </div>
              <div className="user-modal__title-content">
                <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <p>Gestiona la información del usuario del sistema</p>
              </div>
            </div>
            <button className="user-modal__close-btn" onClick={handleClose}>
              <span className="material-icons">close</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="user-modal__content">
            <form className="user-modal__form" onSubmit={handleSubmit}>
              <div className="user-modal__form-grid">
                <div className="user-modal__form-group">
                  <label htmlFor="email">Correo Electrónico *</label>
                  <div className="user-modal__input-wrapper">
                    <span className="user-modal__input-icon material-icons">email</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="usuario@ejemplo.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="user-modal__form-group">
                  <label htmlFor="password">{editingUser ? 'Nueva Contraseña' : 'Contraseña *'}</label>
                  <div className="user-modal__input-wrapper">
                    <span className="user-modal__input-icon material-icons">lock</span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={editingUser ? 'Dejar en blanco para mantener' : 'Ingresa la contraseña'}
                      required={!editingUser}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="user-modal__form-group">
                  <label htmlFor="firstName">Primer Nombre *</label>
                  <div className="user-modal__input-wrapper">
                    <span className="user-modal__input-icon material-icons">person</span>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="user-modal__form-group">
                  <label htmlFor="middleName">Segundo Nombre</label>
                  <div className="user-modal__input-wrapper">
                    <span className="user-modal__input-icon material-icons">person</span>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      placeholder="Ej: Carlos"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="user-modal__form-group">
                  <label htmlFor="lastName">Primer Apellido *</label>
                  <div className="user-modal__input-wrapper">
                    <span className="user-modal__input-icon material-icons">person</span>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Ej: Pérez"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="user-modal__form-group">
                  <label htmlFor="secondLastName">Segundo Apellido</label>
                  <div className="user-modal__input-wrapper">
                    <span className="user-modal__input-icon material-icons">person</span>
                    <input
                      type="text"
                      id="secondLastName"
                      name="secondLastName"
                      value={formData.secondLastName}
                      onChange={handleInputChange}
                      placeholder="Ej: García"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="user-modal__form-group">
                  <label htmlFor="phoneNumber">Teléfono</label>
                  <div className="user-modal__input-wrapper">
                    <span className="user-modal__input-icon material-icons">phone</span>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Ej: +52 998 123 4567"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="user-modal__form-group">
                  <label htmlFor="typeUser">Tipo de Usuario *</label>
                  <div className="user-modal__input-wrapper">
                    <span className="user-modal__input-icon material-icons">category</span>
                    <select
                      id="typeUser"
                      name="typeUser"
                      value={formData.typeUser}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="SUPER_ADMIN">Super Administrador</option>
                      <option value="ADMIN">Administrador</option>
                      <option value="USER">Usuario</option>
                    </select>
                  </div>
                </div>

                <div className="user-modal__form-group">
                  <label htmlFor="roleId">Rol *</label>
                  <div className="user-modal__input-wrapper">
                    <span className="user-modal__input-icon material-icons">security</span>
                    <select
                      id="roleId"
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading || isLoadingRoles}
                    >
                      <option value="">
                        {isLoadingRoles ? 'Cargando roles...' : 'Seleccionar rol'}
                      </option>
                      {roles.map((role: any) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="user-modal__form-group">
                  <label htmlFor="parentId">Usuario Supervisor</label>
                  <div className="user-modal__input-wrapper">
                    <span className="user-modal__input-icon material-icons">account_tree</span>
                    <select
                      id="parentId"
                      name="parentId"
                      value={formData.parentId}
                      onChange={handleInputChange}
                      disabled={isLoading || isLoadingUsers}
                    >
                      <option value="0">Sin supervisor</option>
                      {availableUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="user-modal__form-group full-width">
                <label>Imagen de Perfil</label>
                <div 
                  {...getRootProps()} 
                  className={`user-modal__image-dropzone ${isDragActive ? 'user-modal__drag-active' : ''} ${imagePreview ? 'user-modal__has-image' : ''}`}
                >
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <div className="user-modal__image-preview">
                      <img 
                        src={imagePreview} 
                        alt="Preview de perfil" 
                      />
                      <button
                        type="button"
                        className="user-modal__remove-image-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        <span className="material-icons">close</span>
                      </button>
                    </div>
                  ) : (
                    <div className="user-modal__dropzone-content">
                      <span className="user-modal__dropzone-icon material-icons">cloud_upload</span>
                      <p>{isDragActive ? 'Suelta la imagen aquí' : 'Haz clic o arrastra una imagen aquí'}</p>
                      <small>Formatos: JPG, PNG, GIF, WEBP (máx. 5MB)</small>
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <button 
                    type="button" 
                    className="user-modal__remove-all-images-btn"
                    onClick={removeImage}
                    disabled={isLoading}
                  >
                    <span className="material-icons">delete_sweep</span>
                    Eliminar imagen
                  </button>
                )}
              </div>

              {/* Modal Actions */}
              <div className="user-modal__actions">
                <button
                  type="button"
                  className="user-modal__btn user-modal__btn-secondary"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  <span className="material-icons">close</span>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="user-modal__btn user-modal__btn-primary"
                  disabled={isLoading || !formData.email || (!editingUser && !formData.password) || !formData.firstName || !formData.lastName || !formData.typeUser || !formData.roleId}
                >
                  {isLoading ? (
                    <>
                      <div className="user-modal__loading-spinner"></div>
                      <span>{editingUser ? 'Actualizando...' : 'Creando...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons">save</span>
                      <span>{editingUser ? 'Actualizar' : 'Crear'} Usuario</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
