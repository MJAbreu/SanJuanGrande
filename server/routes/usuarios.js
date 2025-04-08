const express = require('express');
const router = express.Router();

// Almacenamiento temporal hasta implementar la base de datos
let usuarios = [];

// Crear nuevo usuario (residente o usuario del centro de día)
router.post('/', (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      tipo, // 'residente' o 'usuario'
      fechaNacimiento,
      contactoEmergencia,
      familiarReferencia,
      estadoAsistencia = 'asiste', // estado por defecto
      necesidadesEspeciales
    } = req.body;

    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre,
      apellidos,
      tipo,
      fechaNacimiento,
      contactoEmergencia,
      familiarReferencia,
      estadoAsistencia,
      necesidadesEspeciales,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
});

// Obtener todos los usuarios
router.get('/', (req, res) => {
  try {
    const { tipo } = req.query;
    let resultado = usuarios;

    if (tipo) {
      resultado = usuarios.filter(usuario => usuario.tipo === tipo);
    }

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
});

// Obtener usuario por ID
router.get('/:id', (req, res) => {
  try {
    const usuario = usuarios.find(u => u.id === req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

// Actualizar usuario
router.put('/:id', (req, res) => {
  try {
    const index = usuarios.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuarioActualizado = {
      ...usuarios[index],
      ...req.body,
      updatedAt: new Date()
    };

    usuarios[index] = usuarioActualizado;
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
});

// Actualizar estado de asistencia
router.patch('/:id/asistencia', (req, res) => {
  try {
    const { estadoAsistencia, modificadoPor } = req.body;
    const usuario = usuarios.find(u => u.id === req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.estadoAsistencia = estadoAsistencia;
    usuario.ultimaModificacion = {
      fecha: new Date(),
      modificadoPor
    };

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
  }
});

// Eliminar usuario
router.delete('/:id', (req, res) => {
  try {
    const index = usuarios.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuarios.splice(index, 1);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = router;