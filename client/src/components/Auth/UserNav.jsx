import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const UserNav = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="user-nav">
      <span className="user-info">
        {user?.nombre || 'Usuario'}
      </span>
      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default UserNav;