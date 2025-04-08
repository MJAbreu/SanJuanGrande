import React from 'react';
import './ResidentList.css';

const ResidentDetails = ({ resident, onClose }) => {
  if (!resident) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content details-modal">
        <h2>Detalles del Residente</h2>
        <div className="details-container">
          <div className="detail-section">
            <h3>Información Personal</h3>
            <p><strong>Nombre:</strong> {resident.nombre}</p>
            <p><strong>Habitación:</strong> {resident.habitacion}</p>
            <p><strong>Estado:</strong> {resident.estado}</p>
          </div>

          <div className="detail-section">
            <h3>Información Médica</h3>
            <p><strong>Información Médica:</strong> {resident.informacionMedica || 'No especificada'}</p>
            <p><strong>Medicamentos:</strong> {resident.medicamentos || 'Ninguno'}</p>
            <p><strong>Alergias:</strong> {resident.alergias || 'Ninguna'}</p>
          </div>

          <div className="detail-section">
            <h3>Contacto de Emergencia</h3>
            <p><strong>Nombre:</strong> {resident.contactoEmergencia || 'No especificado'}</p>
            <p><strong>Teléfono:</strong> {resident.telefonoEmergencia || 'No especificado'}</p>
          </div>

          <div className="detail-section">
            <h3>Preferencias</h3>
            <p><strong>Preferencias Alimentarias:</strong> {resident.preferenciasAlimentarias || 'No especificadas'}</p>
            <p><strong>Actividades Preferidas:</strong> {resident.actividadesPreferidas || 'No especificadas'}</p>
          </div>

          <div className="detail-section">
            <h3>Observaciones</h3>
            <p>{resident.observaciones || 'Sin observaciones'}</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentDetails;