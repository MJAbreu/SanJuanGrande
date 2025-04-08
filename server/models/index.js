const Usuario = require('./Usuario');
const Residente = require('./Residente');
const Asistencia = require('./Asistencia');
const Menu = require('./Menu');
const Comunicacion = require('./Comunicacion');
const UsuarioResidente = require('./UsuarioResidente');

// Definir relaciones
Asistencia.belongsTo(Residente, { foreignKey: 'residenteId' });
Residente.hasMany(Asistencia, { foreignKey: 'residenteId' });

Asistencia.belongsTo(Usuario, { foreignKey: 'registradoPor', as: 'registrador' });
Usuario.hasMany(Asistencia, { foreignKey: 'registradoPor', as: 'asistenciasRegistradas' });

Menu.belongsTo(Usuario, { foreignKey: 'creadoPor', as: 'creador' });
Menu.belongsTo(Usuario, { foreignKey: 'actualizadoPor', as: 'actualizador' });
Usuario.hasMany(Menu, { foreignKey: 'creadoPor', as: 'menusCreados' });

Comunicacion.belongsTo(Usuario, { foreignKey: 'emisorId', as: 'emisor' });
Comunicacion.belongsTo(Residente, { foreignKey: 'residenteId' });
Usuario.hasMany(Comunicacion, { foreignKey: 'emisorId', as: 'comunicacionesEnviadas' });
Residente.hasMany(Comunicacion, { foreignKey: 'residenteId' });

// Relación many-to-many entre Usuario y Residente
Usuario.belongsToMany(Residente, { through: UsuarioResidente, as: 'residentes', foreignKey: 'usuarioId' });
Residente.belongsToMany(Usuario, { through: UsuarioResidente, as: 'usuarios', foreignKey: 'residenteId' });

module.exports = {
  Usuario,
  Residente,
  Asistencia,
  Menu,
  Comunicacion,
  UsuarioResidente
};