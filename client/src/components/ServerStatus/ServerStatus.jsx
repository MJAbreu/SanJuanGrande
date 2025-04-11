import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServerStatus.css';

const ServerStatus = () => {
  const [serverStatus, setServerStatus] = useState({
    status: 'checking',
    message: 'Verificando conexión...',
    database: 'checking',
    lastCheck: null
  });

  const checkServerStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/health`);
      setServerStatus({
        status: response.data.status,
        message: response.data.message,
        database: response.data.database,
        lastCheck: new Date().toLocaleTimeString()
      });
    } catch (error) {
      setServerStatus({
        status: 'error',
        message: 'No se puede conectar al servidor',
        database: 'desconectada',
        lastCheck: new Date().toLocaleTimeString()
      });
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 60000); // Verificar cada minuto
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (serverStatus.status) {
      case 'ok':
        return 'status-ok';
      case 'error':
        return 'status-error';
      default:
        return 'status-checking';
    }
  };

  return (
    <div className={`server-status ${getStatusColor()}`}>
      <div className="status-indicator"></div>
      <div className="status-details">
        <p>{serverStatus.message}</p>
        <p>Base de datos: {serverStatus.database}</p>
        {serverStatus.lastCheck && (
          <p className="last-check">Última verificación: {serverStatus.lastCheck}</p>
        )}
      </div>
      <button onClick={checkServerStatus} className="check-button">
        Verificar ahora
      </button>
    </div>
  );
};

export default ServerStatus;