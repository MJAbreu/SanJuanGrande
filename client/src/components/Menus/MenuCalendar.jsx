import React, { useState, useEffect } from 'react';
import './MenuCalendar.css';

const MenuCalendar = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchMenus();
  }, [currentDate]);

  const fetchMenus = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await fetch(`/api/menus?year=${year}&month=${month}`);
      if (!response.ok) {
        throw new Error('Error al cargar los menús');
      }
      const data = await response.json();
      setMenus(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) return <div className="loading">Cargando menús...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="menu-calendar-container">
      <h2>Gestión de Menús</h2>
      <div className="calendar-navigation">
        <button onClick={() => changeMonth(-1)}>&lt; Mes anterior</button>
        <h3>{formatDate(currentDate)}</h3>
        <button onClick={() => changeMonth(1)}>Mes siguiente &gt;</button>
      </div>
      <button className="add-menu-btn">Agregar Menú</button>
      <div className="menu-grid">
        {menus.map((menu) => (
          <div key={menu.id} className="menu-card">
            <div className="menu-date">{new Date(menu.fecha).getDate()}</div>
            <div className="menu-content">
              <h4>Comida</h4>
              <p>{menu.comida}</p>
              <h4>Cena</h4>
              <p>{menu.cena}</p>
            </div>
            <div className="menu-actions">
              <button className="edit-btn">Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCalendar;