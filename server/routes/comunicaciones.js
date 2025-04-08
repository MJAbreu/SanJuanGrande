const express = require('express');
const router = express.Router();
const { Comunicacion, Usuario, Residente } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Obtener todas las comunicaciones relacionadas con el usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const comunicaciones = await Comunicacion.findAll({
      where: {
        [Op.or]: [
          { emisorId: req.user.id },
          { destinatarios: { [Op.contains]: [req.user.id] } }
        ]
      },
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
    
    const comunicacion = await Comunicacion.create({
      tipo,
      titulo,
      mensaje,
      residenteId,
      emisorId: req.user.id,
      destinatarios,
      prioridad,
      fechaLimite
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

    comunicacion.archivado = !comunicacion.archivado;
    await comunicacion.save();

    res.json(comunicacion);
  } catch (error) {
    console.error('Error al archivar comunicación:', error);
    res.status(500).json({ message: 'Error al archivar la comunicación' });
  }
});

module.exports = router;