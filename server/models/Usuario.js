const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const bcrypt = require('bcryptjs');

class Usuario extends Model {
  async validarPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

Usuario.init({
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('admin', 'staff', 'cocina', 'familiar'),
    allowNull: false,
    defaultValue: 'staff'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Usuario',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    }
  }
});

// Definir las relaciones después de que todos los modelos estén cargados
Usuario.associate = (models) => {
  Usuario.belongsToMany(models.Residente, {
    through: 'UsuarioResidente',
    as: 'residentes',
    foreignKey: 'usuarioId'
  });

  Usuario.hasMany(models.Comunicacion, {
    as: 'comunicacionesEnviadas',
    foreignKey: 'emisorId'
  });

  Usuario.hasMany(models.Menu, {
    as: 'menusCreados',
    foreignKey: 'creadoPor'
  });

  Usuario.hasMany(models.Menu, {
    as: 'menusActualizados',
    foreignKey: 'actualizadoPor'
  });

  Usuario.hasMany(models.Asistencia, {
    as: 'asistenciasRegistradas',
    foreignKey: 'registradoPor'
  });
};

module.exports = Usuario;