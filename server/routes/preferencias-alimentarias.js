const express = require('express');
const router = express.Router();
const { PreferenciaAlimentaria, Residente, Usuario } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Obtener preferencias alimentarias de un residente
router.get('/:residenteId', authenticateToken, async (req, res) => {
  try {
    const preferencias = await PreferenciaAlimentaria.findOne({
      where: { residenteId: req.params.residenteId },
      include: [
        {
          model: Residente,
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'actualizador',
          attributes: ['id', 'nombre', 'apellidos']
        }
      ]
    });

    if (!preferencias) {
      return res.status(404).json({ message: 'Preferencias alimentarias no encontradas' });
    }

    res.json(preferencias);
  } catch (error) {
    console.error('Error al obtener preferencias:', error);
    res.status(500).json({ message: 'Error al obtener las preferencias alimentarias' });
  }
});

// Crear o actualizar preferencias alimentarias
router.post('/:residenteId', authenticateToken, async (req, res) => {
  try {
    const { tipoMenu, alergias, intolerancias, observaciones } = req.body;

    const [preferencias, created] = await PreferenciaAlimentaria.findOrCreate({
      where: { residenteId: req.params.residenteId },
      defaults: {
        tipoMenu,
        alergias,
        intolerancias,
        observaciones,
        creadoPor: req.user.id
      }
    });

    if (!created) {
      await preferencias.update({
        tipoMenu,
        alergias,
        intolerancias,
        observaciones,
        actualizadoPor: req.user.id
      });
    }

    const preferenciasActualizadas = await PreferenciaAlimentaria.findByPk(preferencias.id, {
      include: [
        {
          model: Residente,
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'actualizador',
          attributes: ['id', 'nombre', 'apellidos']
        }
      ]
    });

    res.status(created ? 201 : 200).json(preferenciasActualizadas);
  } catch (error) {
    console.error('Error al crear/actualizar preferencias:', error);
    res.status(500).json({ message: 'Error al guardar las preferencias alimentarias' });
  }
});

// Solicitar cambio de menú para un día específico
router.post('/:residenteId/solicitud-cambio', authenticateToken, async (req, res) => {
  try {
    const { fecha, motivo } = req.body;
    const residente = await Residente.findByPk(req.params.residenteId);

    if (!residente) {
      return res.status(404).json({ message: 'Residente no encontrado' });
    }

    // Aquí se implementaría la lógica para crear una solicitud de cambio
    // y notificar al personal de cocina
    // Por ahora, solo enviamos una respuesta de éxito
    res.status(201).json({
      message: 'Solicitud de cambio registrada correctamente',
      solicitud: {
        residenteId: req.params.residenteId,
        fecha,
        motivo,
        solicitadoPor: req.user.id,
        estado: 'pendiente'
      }
    });
  } catch (error) {
    console.error('Error al solicitar cambio de menú:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud de cambio' });
  }
});

module.exports = router;