import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'residente'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones del formulario
    if (!userData.nombre || !userData.apellidos) {
      setError('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (!userData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Por favor, ingrese un correo electrónico válido');
      return;
    }

    if (userData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      console.log('Intentando registrar en:', import.meta.env.VITE_API_URL);
      const { confirmPassword, ...dataToSend } = userData;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend),
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
        let errorMessage = 'Error al registrar usuario.';
        if (data.message && data.message.includes('already exists')) {
          errorMessage = 'Este correo electrónico ya está registrado. Por favor, utilice otro.';
        } else if (data.message && data.message.includes('validation')) {
          errorMessage = 'Por favor, verifique que todos los datos sean correctos.';
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('No se pudo conectar con el servidor. Por favor, verifique su conexión a internet o inténtelo más tarde.');
      // Intentar limpiar el mensaje de error después de un tiempo
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Registro de Usuario</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={userData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={userData.apellidos}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
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
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tipoUsuario">Tipo de Usuario</label>
            <select
              id="tipoUsuario"
              name="tipoUsuario"
              value={userData.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="residente">Residente</option>
              <option value="usuario">Usuario</option>
              <option value="familiar">Familiar</option>
              <option value="trabajador">Trabajador</option>
            </select>
          </div>
          <button type="submit" className="auth-button">Registrarse</button>
          <button type="button" className="button" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Volver</button>
        </form>
      </div>
    </div>
  );
};

export default Register;