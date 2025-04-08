import React, { useState, useEffect } from 'react';
import './AttendanceControl.css';

const AttendanceControl = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await fetch('/api/asistencia');
      if (!response.ok) {
        throw new Error('Error al cargar los registros de asistencia');
      }
      const data = await response.json();
      setAttendance(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateAttendanceStatus = async (residentId, status) => {
    try {
      const response = await fetch(`/api/asistencia/${residentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: status, fecha: new Date().toISOString() })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la asistencia');
      }

      fetchAttendance(); // Recargar los datos
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Cargando registros de asistencia...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="attendance-control-container">
      <h2>Control de Asistencia</h2>
      <div className="date-selector">
        <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
      </div>
      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Residente</th>
              <th>Estado</th>
              <th>Última Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td>{record.residente.nombre}</td>
                <td className={`status ${record.estado.toLowerCase()}`}>
                  {record.estado}
                </td>
                <td>{new Date(record.fecha).toLocaleString()}</td>
                <td className="actions">
                  <button
                    className="status-btn presente"
                    onClick={() => updateAttendanceStatus(record.residenteId, 'PRESENTE')}
                  >
                    Presente
                  </button>
                  <button
                    className="status-btn ausente"
                    onClick={() => updateAttendanceStatus(record.residenteId, 'AUSENTE')}
                  >
                    Ausente
                  </button>
                  <button
                    className="status-btn justificado"
                    onClick={() => updateAttendanceStatus(record.residenteId, 'JUSTIFICADO')}
                  >
                    Justificado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceControl;