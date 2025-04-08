import React, { useState, useEffect } from 'react';
import './UserList.css';

const UserForm = ({ user, onClose, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    rol: 'staff',
    activo: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        password: '',
        rol: user.rol || 'staff',
        activo: user.activo
      });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.apellidos || !formData.email || (!isEditing && !formData.password)) {
      setError('Por favor, complete todos los campos requeridos');
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el usuario');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre*</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellidos">Apellidos*</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
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
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {!isEditing && (
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="rol">Rol</label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
            >
              <option value="staff">Staff</option>
              <option value="admin">Administrador</option>
              <option value="cocina">Cocina</option>
              <option value="familiar">Familiar</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="activo">Estado</label>
            <select
              id="activo"
              name="activo"
              value={formData.activo}
              onChange={handleChange}
            >
              <option value={true}>Activo</option>
              <option value={false}>Inactivo</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;