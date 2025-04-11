import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Intentando conectar a:', import.meta.env.VITE_API_URL);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
        mode: 'cors',
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', response.status);

      if (response.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        console.error('Error en la respuesta:', data);
        setError(data.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error de conexión con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button">Iniciar Sesión</button>
        </form>
        <div className="auth-footer">
          <p>¿No tienes una cuenta?</p>
          <button 
            onClick={() => navigate('/register')} 
            className="button"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;