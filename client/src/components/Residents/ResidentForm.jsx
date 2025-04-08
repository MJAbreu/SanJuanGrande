import React, { useState, useEffect } from 'react';
import './ResidentList.css';

const ResidentForm = ({ resident, onClose, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    dni: '',
    numeroExpediente: '',
    fechaIngreso: '',
    tipoEstancia: 'residencia',
    habitacion: '',
    alergias: '',
    observacionesMedicas: '',
    contactoEmergencia: '',
    telefonoEmergencia: '',
    activo: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (resident && isEditing) {
      setFormData({
        nombre: resident.nombre || '',
        apellidos: resident.apellidos || '',
        fechaNacimiento: resident.fechaNacimiento || '',
        dni: resident.dni || '',
        numeroExpediente: resident.numeroExpediente || '',
        fechaIngreso: resident.fechaIngreso || '',
        tipoEstancia: resident.tipoEstancia || 'residencia',
        habitacion: resident.habitacion || '',
        alergias: resident.alergias || '',
        observacionesMedicas: resident.observacionesMedicas || '',
        contactoEmergencia: resident.contactoEmergencia || '',
        telefonoEmergencia: resident.telefonoEmergencia || '',
        activo: resident.activo
      });
    }
  }, [resident, isEditing]);

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

    if (!formData.nombre || !formData.apellidos || !formData.dni || 
        !formData.fechaNacimiento || !formData.fechaIngreso || 
        !formData.contactoEmergencia || !formData.telefonoEmergencia) {
      setError('Por favor, complete todos los campos requeridos');
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el residente');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? 'Editar Residente' : 'Nuevo Residente'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="resident-form">
          <div className="form-section">
            <h3>Información Personal</h3>
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
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento*</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dni">DNI*</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="numeroExpediente">Número de Expediente</label>
              <input
                type="text"
                id="numeroExpediente"
                name="numeroExpediente"
                value={formData.numeroExpediente}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="fechaIngreso">Fecha de Ingreso*</label>
              <input
                type="date"
                id="fechaIngreso"
                name="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tipoEstancia">Tipo de Estancia</label>
              <select
                id="tipoEstancia"
                name="tipoEstancia"
                value={formData.tipoEstancia}
                onChange={handleChange}
              >
                <option value="residencia">Residencia</option>
                <option value="centro_dia">Centro de Día</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="habitacion">Habitación</label>
              <input
                type="text"
                id="habitacion"
                name="habitacion"
                value={formData.habitacion}
                onChange={handleChange}
              />
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
          </div>

          <div className="form-section">
            <h3>Información Médica</h3>
            <div className="form-group">
              <label htmlFor="observacionesMedicas">Observaciones Médicas</label>
              <textarea
                id="observacionesMedicas"
                name="observacionesMedicas"
                value={formData.observacionesMedicas}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label htmlFor="alergias">Alergias</label>
              <textarea
                id="alergias"
                name="alergias"
                value={formData.alergias}
                onChange={handleChange}
                rows="2"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Contacto de Emergencia</h3>
            <div className="form-group">
              <label htmlFor="contactoEmergencia">Nombre del Contacto*</label>
              <input
                type="text"
                id="contactoEmergencia"
                name="contactoEmergencia"
                value={formData.contactoEmergencia}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefonoEmergencia">Teléfono de Emergencia*</label>
              <input
                type="tel"
                id="telefonoEmergencia"
                name="telefonoEmergencia"
                value={formData.telefonoEmergencia}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {isEditing ? 'Guardar Cambios' : 'Crear Residente'}
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

export default ResidentForm;