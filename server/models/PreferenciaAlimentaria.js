const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class PreferenciaAlimentaria extends Model {}

PreferenciaAlimentaria.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  residenteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Residentes',
      key: 'id'
    }
  },
  tipoMenu: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'normal',
    validate: {
      isIn: [['normal', 'blando', 'diabético', 'sin_sal', 'vegetariano']]
    }
  },
  alergias: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  },
  intolerancias: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  creadoPor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  },
  actualizadoPor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'PreferenciaAlimentaria',
  tableName: 'preferencias_alimentarias'
});

module.exports = PreferenciaAlimentaria;