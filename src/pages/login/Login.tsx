import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../zustand/useStore';
import './Login.css';
import APIs from '../../services/services/APIs';
import useUserStore from '../../zustand/useUserStore';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Login: React.FC = () => {
  const { theme, toggleTheme } = useStore();
  const { getUser }: any = useUserStore()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // SuperAdmin123!
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res: any = await APIs.login(formData);
      console.log('Respuesta del login:', res);
      
      getUser({ ...res.user, rol: 'SUPER_ADMIN' });
      toast.success(res.message || 'Inicio de sesión exitoso');
      
      console.log('Redirigiendo a /');
      navigate('/');
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error en login:', err);
      toast.error('Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <div className="yacht-login-container">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      {/* Background Pattern */}
      <div className="yacht-login-background">
        <div className="yacht-bg-pattern"></div>
        <div className="yacht-bg-overlay"></div>
      </div>

      {/* Login Card */}
      <div className="yacht-login-card">
        {/* Header with Theme Toggle */}
        <div className="yacht-login-header">
          <button className="yacht-theme-toggle-login" onClick={toggleTheme}>
            <span className="material-icons">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
        </div>

        {/* Logo and Branding */}
        <div className="yacht-login-branding">
          <div className="yacht-login-logo">
            <span className="material-icons">sailing</span>
          </div>
          <h1 className="yacht-login-title">YachtCRM</h1>
          <p className="yacht-login-subtitle">Sistema de Gestión de Yates</p>
        </div>

        {/* Login Form */}
        <form className="yacht-login-form" onSubmit={handleSubmit}>
          <div className="yacht-form-group">
            <label htmlFor="email" className="yacht-form-label">
              Correo Electrónico
            </label>
            <div className="yacht-input-wrapper">
              <span className="material-icons yacht-input-icon">email</span>
              <input
                type="email"
                id="email"
                name="email"
                className="yacht-form-input"
                placeholder="admin@yachtcrm.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="yacht-form-group">
            <label htmlFor="password" className="yacht-form-label">
              Contraseña
            </label>
            <div className="yacht-input-wrapper">
              <span className="material-icons yacht-input-icon">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="yacht-form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="yacht-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-icons">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="yacht-form-options">
            <label className="yacht-checkbox-wrapper">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
              />
              <span className="yacht-checkbox-custom"></span>
              <span className="yacht-checkbox-label">Recordarme</span>
            </label>
            <Link to="/forgot-password" className="yacht-forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="yacht-login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="yacht-loading-spinner"></div>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span className="material-icons">login</span>
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        {/* <div className="yacht-demo-credentials">
          <h4>Credenciales de Demo:</h4>
          <p><strong>Email:</strong> admin@yachtcrm.com</p>
          <p><strong>Contraseña:</strong> admin123</p>
        </div> */}

        {/* Footer */}
        <div className="yacht-login-footer">
          <div className="yacht-footer-links">
            <Link to="/privacy">Política de Privacidad</Link>
            <span>•</span>
            <Link to="/terms">Términos de Servicio</Link>
          </div>
          <p className="yacht-copyright">
            © 2024 YachtCRM. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Features Sidebar */}
      <div className="yacht-features-sidebar">
        <div className="yacht-features-content">
          <h2>Gestión Integral de Yates</h2>
          <p>Administra tu flota, clientes y reservas desde una sola plataforma.</p>
          <div className="yacht-feature-list">
            <div className="yacht-feature-item">
              <span className="material-icons">sailing</span>
              <div>
                <h4>Gestión de Flota</h4>
                <p>Control completo de disponibilidad y mantenimiento</p>
              </div>
            </div>
            <div className="yacht-feature-item">
              <span className="material-icons">event</span>
              <div>
                <h4>Reservas Inteligentes</h4>
                <p>Sistema avanzado de calendario y reservas</p>
              </div>
            </div>
            <div className="yacht-feature-item">
              <span className="material-icons">analytics</span>
              <div>
                <h4>Reportes Detallados</h4>
                <p>Análisis completo de ventas y rendimiento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
