const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Menu extends Model {}

Menu.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  desayuno: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      principal: '',
      alternativo: '',
      bebida: ''
    }
  },
  comida: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      primero: '',
      segundo: '',
      postre: '',
      alternativo: ''
    }
  },
  merienda: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      principal: '',
      alternativo: '',
      bebida: ''
    }
  },
  cena: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      primero: '',
      segundo: '',
      postre: '',
      alternativo: ''
    }
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
  modelName: 'Menu'
});

module.exports = Menu;