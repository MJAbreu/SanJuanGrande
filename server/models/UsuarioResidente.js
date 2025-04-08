const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class UsuarioResidente extends Model {}

UsuarioResidente.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  },
  residenteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Residentes',
      key: 'id'
    }
  },
  relacion: {
    type: DataTypes.ENUM('familiar', 'responsable_legal', 'contacto_emergencia'),
    allowNull: false
  },
  esContactoPrincipal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notificacionesActivas: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'UsuarioResidente',
  indexes: [
    {
      unique: true,
      fields: ['usuarioId', 'residenteId', 'relacion']
    }
  ]
});

module.exports = UsuarioResidente;