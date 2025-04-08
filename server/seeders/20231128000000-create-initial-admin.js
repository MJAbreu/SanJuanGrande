'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await queryInterface.bulkInsert('Usuarios', [{
      nombre: 'Administrador',
      apellidos: 'Sistema',
      email: 'admin@sanjuangrande.es',
      password: hashedPassword,
      rol: 'admin',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuarios', {
      email: 'admin@sanjuangrande.es'
    }, {});
  }
};