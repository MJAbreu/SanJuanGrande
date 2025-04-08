'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Usuarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apellidos: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rol: {
        type: Sequelize.ENUM('admin', 'staff', 'cocina'),
        allowNull: false,
        defaultValue: 'staff'
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('Residentes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apellidos: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fechaNacimiento: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      dni: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      numeroExpediente: {
        type: Sequelize.STRING,
        unique: true
      },
      fechaIngreso: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      tipoEstancia: {
        type: Sequelize.ENUM('residencia', 'centro_dia'),
        allowNull: false
      },
      habitacion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      alergias: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      observacionesMedicas: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      contactoEmergencia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      telefonoEmergencia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('Asistencias', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      residenteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Residentes',
          key: 'id'
        }
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      horaEntrada: {
        type: Sequelize.TIME,
        allowNull: true
      },
      horaSalida: {
        type: Sequelize.TIME,
        allowNull: true
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      registradoPor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('Menus', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        unique: true
      },
      desayuno: {
        type: Sequelize.JSON,
        allowNull: false
      },
      comida: {
        type: Sequelize.JSON,
        allowNull: false
      },
      merienda: {
        type: Sequelize.JSON,
        allowNull: false
      },
      cena: {
        type: Sequelize.JSON,
        allowNull: false
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      creadoPor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        }
      },
      actualizadoPor: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Usuarios',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('Comunicaciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tipo: {
        type: Sequelize.ENUM('general', 'residente', 'personal', 'urgente'),
        allowNull: false,
        defaultValue: 'general'
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mensaje: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      residenteId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Residentes',
          key: 'id'
        }
      },
      emisorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        }
      },
      destinatarios: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      leido: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
        defaultValue: []
      },
      fechaLimite: {
        type: Sequelize.DATE,
        allowNull: true
      },
      prioridad: {
        type: Sequelize.ENUM('baja', 'media', 'alta'),
        allowNull: false,
        defaultValue: 'media'
      },
      archivado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Crear índices
    await queryInterface.addIndex('Asistencias', ['residenteId', 'fecha'], {
      unique: true
    });
    await queryInterface.addIndex('Menus', ['fecha'], {
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comunicaciones');
    await queryInterface.dropTable('Menus');
    await queryInterface.dropTable('Asistencias');
    await queryInterface.dropTable('Residentes');
    await queryInterface.dropTable('Usuarios');
  }
};