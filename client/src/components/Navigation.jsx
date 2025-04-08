import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="main-nav">
      <ul className="nav-list">
        <li>
          <Link to="/" className="nav-link">Inicio</Link>
        </li>
        <li>
          <Link to="/usuarios" className="nav-link">Usuarios</Link>
        </li>
        <li>
          <Link to="/residentes" className="nav-link">Residentes</Link>
        </li>
        <li>
          <Link to="/menus" className="nav-link">Menús</Link>
        </li>
        <li>
          <Link to="/asistencia" className="nav-link">Asistencia</Link>
        </li>
        <li>
          <Link to="/comunicaciones" className="nav-link">Comunicaciones</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;