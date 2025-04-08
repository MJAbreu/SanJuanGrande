const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Residente extends Model {}

Residente.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  dni: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  numeroExpediente: {
    type: DataTypes.STRING,
    unique: true
  },
  fechaIngreso: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tipoEstancia: {
    type: DataTypes.ENUM('residencia', 'centro_dia'),
    allowNull: false
  },
  habitacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  alergias: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  observacionesMedicas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contactoEmergencia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefonoEmergencia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Residente'
});

// Definir las relaciones después de que todos los modelos estén cargados
Residente.associate = (models) => {
  Residente.belongsToMany(models.Usuario, {
    through: 'UsuarioResidente',
    as: 'usuarios',
    foreignKey: 'residenteId'
  });

  Residente.hasMany(models.Asistencia, {
    as: 'asistencias',
    foreignKey: 'residenteId'
  });

  Residente.hasMany(models.Comunicacion, {
    as: 'comunicaciones',
    foreignKey: 'residenteId'
  });
};

module.exports = Residente;