const express = require('express');
const router = express.Router();
const { Comunicacion, Usuario, Residente } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Obtener todas las comunicaciones relacionadas con el usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { archivadas } = req.query;
    const where = {
      [Op.or]: [
        { emisorId: req.user.id },
        { destinatarios: { [Op.contains]: [req.user.id] } }
      ]
    };

    if (archivadas !== undefined) {
      where.archivado = archivadas === 'true';
    }

    const comunicaciones = await Comunicacion.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'emisor',
          attributes: ['id', 'nombre', 'apellidos', 'rol']
        },
        {
          model: Residente,
          attributes: ['id', 'nombre', 'apellidos']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(comunicaciones);
  } catch (error) {
    console.error('Error al obtener comunicaciones:', error);
    res.status(500).json({ message: 'Error al obtener las comunicaciones' });
  }
});

// Crear nueva comunicación
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tipo, titulo, mensaje, residenteId, destinatarios, prioridad, fechaLimite } = req.body;
    
    // Validar campos requeridos
    if (!tipo || !titulo || !mensaje || !destinatarios || !Array.isArray(destinatarios)) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos o el formato es incorrecto' 
      });
    }

    // Validar que los destinatarios existan
    const usuariosExistentes = await Usuario.findAll({
      where: { id: destinatarios }
    });

    if (usuariosExistentes.length !== destinatarios.length) {
      return res.status(400).json({ 
        message: 'Uno o más destinatarios no existen' 
      });
    }

    const comunicacion = await Comunicacion.create({
      tipo,
      titulo,
      mensaje,
      residenteId,
      emisorId: req.user.id,
      destinatarios,
      prioridad,
      fechaLimite,
      leido: [],
      archivado: false
    });

    const comunicacionConDetalles = await Comunicacion.findByPk(comunicacion.id, {
      include: [
        {
          model: Usuario,
          as: 'emisor',
          attributes: ['id', 'nombre', 'apellidos', 'rol']
        },
        {
          model: Residente,
          attributes: ['id', 'nombre', 'apellidos']
        }
      ]
    });

    res.status(201).json(comunicacionConDetalles);
  } catch (error) {
    console.error('Error al crear comunicación:', error);
    res.status(500).json({ message: 'Error al crear la comunicación' });
  }
});

// Marcar comunicación como leída
router.patch('/:id/leer', authenticateToken, async (req, res) => {
  try {
    const comunicacion = await Comunicacion.findByPk(req.params.id);
    if (!comunicacion) {
      return res.status(404).json({ message: 'Comunicación no encontrada' });
    }

    // Verificar si el usuario es destinatario o emisor
    if (comunicacion.emisorId !== req.user.id && !comunicacion.destinatarios.includes(req.user.id)) {
      return res.status(403).json({ 
        message: 'No tiene permisos para acceder a esta comunicación' 
      });
    }

    if (!comunicacion.leido.includes(req.user.id)) {
      comunicacion.leido = [...comunicacion.leido, req.user.id];
      await comunicacion.save();
    }

    res.json(comunicacion);
  } catch (error) {
    console.error('Error al marcar comunicación como leída:', error);
    res.status(500).json({ message: 'Error al actualizar la comunicación' });
  }
});

// Archivar comunicación
router.patch('/:id/archivar', authenticateToken, async (req, res) => {
  try {
    const comunicacion = await Comunicacion.findByPk(req.params.id);
    if (!comunicacion) {
      return res.status(404).json({ message: 'Comunicación no encontrada' });
    }

    // Verificar si el usuario es destinatario o emisor
    if (comunicacion.emisorId !== req.user.id && !comunicacion.destinatarios.includes(req.user.id)) {
      return res.status(403).json({ 
        message: 'No tiene permisos para archivar esta comunicación' 
      });
    }

    comunicacion.archivado = !comunicacion.archivado;
    await comunicacion.save();

    res.json({
      id: comunicacion.id,
      archivado: comunicacion.archivado,
      mensaje: `Comunicación ${comunicacion.archivado ? 'archivada' : 'desarchivada'} correctamente`
    });
  } catch (error) {
    console.error('Error al archivar comunicación:', error);
    res.status(500).json({ message: 'Error al archivar la comunicación' });
  }
});

// Eliminar comunicación (solo para emisores)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comunicacion = await Comunicacion.findByPk(req.params.id);
    if (!comunicacion) {
      return res.status(404).json({ message: 'Comunicación no encontrada' });
    }

    // Solo el emisor puede eliminar la comunicación
    if (comunicacion.emisorId !== req.user.id) {
      return res.status(403).json({ 
        message: 'No tiene permisos para eliminar esta comunicación' 
      });
    }

    await comunicacion.destroy();
    res.json({ message: 'Comunicación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar comunicación:', error);
    res.status(500).json({ message: 'Error al eliminar la comunicación' });
  }
});

module.exports = router;