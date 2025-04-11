const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Crear nuevo usuario
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Verificar si el usuario tiene permisos de administrador
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tiene permisos para crear usuarios' });
    }

    const { nombre, apellidos, email, password, rol } = req.body;

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const usuario = await Usuario.create({
      nombre,
      apellidos,
      email,
      password,
      rol
    });

    // Excluir el password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario.toJSON();
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
});

// Obtener todos los usuarios
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { rol } = req.query;
    const where = {};
    
    if (rol) {
      where.rol = rol;
    }

    const usuarios = await Usuario.findAll({
      where,
      attributes: { exclude: ['password'] }
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
});

// Obtener usuario por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

// Actualizar usuario
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Verificar permisos
    if (req.user.rol !== 'admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'No tiene permisos para actualizar este usuario' });
    }

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { nombre, apellidos, email, password, rol } = req.body;
    const actualizacion = { nombre, apellidos, email };

    // Solo el admin puede cambiar roles
    if (req.user.rol === 'admin' && rol) {
      actualizacion.rol = rol;
    }

    // Si se proporciona una nueva contraseña
    if (password) {
      actualizacion.password = password;
    }

    await usuario.update(actualizacion);
    
    const usuarioActualizado = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
});

// Activar/Desactivar usuario
router.patch('/:id/estado', authenticateToken, async (req, res) => {
  try {
    // Solo administradores pueden activar/desactivar usuarios
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tiene permisos para modificar el estado de usuarios' });
    }

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.activo = !usuario.activo;
    await usuario.save();

    res.json({
      id: usuario.id,
      activo: usuario.activo,
      mensaje: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} correctamente`
    });
  } catch (error) {
    console.error('Error al actualizar estado del usuario:', error);
    res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
  }
});

// Eliminar usuario
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Solo administradores pueden eliminar usuarios
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tiene permisos para eliminar usuarios' });
    }

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = router;