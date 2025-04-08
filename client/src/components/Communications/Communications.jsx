import React, { useState, useEffect } from 'react';
import './Communications.css';

const Communications = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/comunicaciones');
      if (!response.ok) {
        throw new Error('Error al cargar los mensajes');
      }
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('/api/comunicaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contenido: newMessage,
          fecha: new Date().toISOString(),
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      setNewMessage('');
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Cargando mensajes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="communications-container">
      <h2>Comunicaciones</h2>
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <div className="message-header">
              <span className="sender">{message.usuario.nombre}</span>
              <span className="date">{new Date(message.fecha).toLocaleString()}</span>
            </div>
            <div className="message-content">{message.contenido}</div>
            {message.residente && (
              <div className="message-footer">
                Referente a: {message.residente.nombre}
              </div>
            )}
          </div>
        ))}
      </div>
      <form className="new-message-form" onSubmit={sendMessage}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escriba su mensaje aquí..."
          rows="4"
        />
        <button type="submit" className="send-button">
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
};

export default Communications;