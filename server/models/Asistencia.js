const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Asistencia extends Model {
  static associate(models) {
    Asistencia.belongsTo(models.Residente, {
      foreignKey: 'residenteId',
      as: 'residente'
    });
    Asistencia.belongsTo(models.Usuario, {
      foreignKey: 'registradoPor',
      as: 'registrador'
    });
    Asistencia.belongsTo(models.Usuario, {
      foreignKey: 'modificadoPor',
      as: 'modificador'
    });
  }
}

Asistencia.init({
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
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horaEntrada: {
    type: DataTypes.TIME,
    allowNull: true
  },
  horaSalida: {
    type: DataTypes.TIME,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('presente', 'ausente', 'justificado', 'tarde'),
    allowNull: false,
    defaultValue: 'presente'
  },
  tipoJustificacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  actividadesRealizadas: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  notificacionEnviada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  registradoPor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  },
  modificadoPor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Asistencia',
  indexes: [
    {
      unique: true,
      fields: ['residenteId', 'fecha']
    }
  ]
});

module.exports = Asistencia;