import React, { useState, useEffect } from 'react';
import './ResidentList.css';
import ResidentForm from './ResidentForm';
import ResidentDetails from './ResidentDetails';

const ResidentList = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/residentes');
      if (!response.ok) {
        throw new Error('Error al cargar los residentes');
      }
      const data = await response.json();
      setResidents(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddResident = () => {
    setSelectedResident(null);
    setShowForm(true);
  };

  const handleEditResident = (resident) => {
    setSelectedResident(resident);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleViewDetails = (resident) => {
    setSelectedResident(resident);
    setShowDetails(true);
    setShowForm(false);
  };

  const handleDeleteResident = async (residentId) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este residente?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/residentes/${residentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el residente');
      }

      await fetchResidents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (formData) => {
    const isEditing = !!selectedResident;
    const url = isEditing
      ? `http://localhost:3000/api/residentes/${selectedResident.id}`
      : 'http://localhost:3000/api/residentes';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el residente');
      }

      await fetchResidents();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div className="loading">Cargando residentes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="resident-list-container">
      <h2>Gestión de Residentes</h2>
      <button className="add-resident-btn" onClick={handleAddResident}>Agregar Residente</button>
      <div className="table-container">
        <table className="resident-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Habitación</th>
              <th>Estado</th>
              <th>Contacto Emergencia</th>
              <th>Teléfono Emergencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id}>
                <td>{resident.nombre}</td>
                <td>{resident.habitacion}</td>
                <td>{resident.estado}</td>
                <td>{resident.contactoEmergencia}</td>
                <td>{resident.telefonoEmergencia}</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => handleEditResident(resident)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDeleteResident(resident.id)}>Eliminar</button>
                  <button className="view-btn" onClick={() => handleViewDetails(resident)}>Ver Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <ResidentForm
          resident={selectedResident}
          isEditing={!!selectedResident}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
      {showDetails && (
        <ResidentDetails
          resident={selectedResident}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default ResidentList;