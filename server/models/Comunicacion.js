const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Comunicacion extends Model {}

Comunicacion.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.ENUM('general', 'residente', 'personal', 'urgente'),
    allowNull: false,
    defaultValue: 'general'
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  residenteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Residentes',
      key: 'id'
    }
  },
  emisorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  },
  destinatarios: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    defaultValue: []
  },
  leido: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    defaultValue: []
  },
  fechaLimite: {
    type: DataTypes.DATE,
    allowNull: true
  },
  prioridad: {
    type: DataTypes.ENUM('baja', 'media', 'alta'),
    allowNull: false,
    defaultValue: 'media'
  },
  archivado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Comunicacion'
});

module.exports = Comunicacion;