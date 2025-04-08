const express = require('express');
const router = express.Router();
const { Asistencia, Residente, Usuario } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Registrar asistencia
router.post('/registro', authenticateToken, async (req, res) => {
  try {
    const { residenteId, estado, fecha, horaEntrada, horaSalida, tipoJustificacion, observaciones, actividadesRealizadas } = req.body;

    const residente = await Residente.findByPk(residenteId);
    if (!residente) {
      return res.status(404).json({ message: 'Residente no encontrado' });
    }

    const [asistencia, created] = await Asistencia.findOrCreate({
      where: { residenteId, fecha },
      defaults: {
        estado,
        horaEntrada,
        horaSalida,
        tipoJustificacion,
        observaciones,
        actividadesRealizadas,
        registradoPor: req.user.id
      }
    });

    if (!created) {
      await asistencia.update({
        estado,
        horaEntrada,
        horaSalida,
        tipoJustificacion,
        observaciones,
        actividadesRealizadas,
        modificadoPor: req.user.id
      });
    }

    const asistenciaConDetalles = await Asistencia.findByPk(asistencia.id, {
      include: [
        {
          model: Residente,
          as: 'residente',
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'registrador',
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'modificador',
          attributes: ['id', 'nombre', 'apellidos']
        }
      ]
    });

    // Notificar a familiares si el estado es ausente o justificado
    if (['ausente', 'justificado'].includes(estado) && !asistencia.notificacionEnviada) {
      await notificarFamiliares(asistenciaConDetalles);
      await asistencia.update({ notificacionEnviada: true });
    }

    res.status(created ? 201 : 200).json(asistenciaConDetalles);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar asistencia', error: error.message });
  }
});

// Obtener registro de asistencia por residente
router.get('/residente/:id', authenticateToken, async (req, res) => {
  try {
    const registros = await Asistencia.findAll({
      where: { residenteId: req.params.id },
      include: [
        {
          model: Residente,
          as: 'residente',
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'registrador',
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'modificador',
          attributes: ['id', 'nombre', 'apellidos']
        }
      ],
      order: [['fecha', 'DESC']]
    });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener registros', error: error.message });
  }
});

// Obtener registros por fecha
router.get('/fecha/:fecha', authenticateToken, async (req, res) => {
  try {
    const registros = await Asistencia.findAll({
      where: { fecha: req.params.fecha },
      include: [
        {
          model: Residente,
          as: 'residente',
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'registrador',
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'modificador',
          attributes: ['id', 'nombre', 'apellidos']
        }
      ],
      order: [['residente', 'nombre', 'ASC']]
    });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener registros', error: error.message });
  }
});

// Modificar estado de asistencia
router.put('/modificar/:id', authenticateToken, async (req, res) => {
  try {
    const { estado, tipoJustificacion, observaciones, actividadesRealizadas } = req.body;
    const asistencia = await Asistencia.findByPk(req.params.id);

    if (!asistencia) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    await asistencia.update({
      estado,
      tipoJustificacion,
      observaciones,
      actividadesRealizadas,
      modificadoPor: req.user.id
    });

    const asistenciaActualizada = await Asistencia.findByPk(asistencia.id, {
      include: [
        {
          model: Residente,
          as: 'residente',
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'registrador',
          attributes: ['id', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'modificador',
          attributes: ['id', 'nombre', 'apellidos']
        }
      ]
    });

    // Notificar cambios a los familiares si el estado cambia a ausente o justificado
    if (['ausente', 'justificado'].includes(estado) && !asistencia.notificacionEnviada) {
      await notificarFamiliares(asistenciaActualizada);
      await asistencia.update({ notificacionEnviada: true });
    }

    res.json(asistenciaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al modificar registro', error: error.message });
  }
});

// Función para notificar a familiares
async function notificarFamiliares(asistencia) {
  try {
    const residente = await Residente.findByPk(asistencia.residenteId, {
      include: [{
        model: Usuario,
        as: 'familiares',
        attributes: ['id', 'nombre', 'apellidos', 'email']
      }]
    });

    if (residente && residente.familiares) {
      // Aquí se implementará el envío de notificaciones por email o sistema de notificaciones
      console.log('Enviando notificaciones a familiares del residente:', residente.id);
      residente.familiares.forEach(familiar => {
        console.log('Notificación para:', familiar.email);
      });
    }
  } catch (error) {
    console.error('Error al enviar notificaciones:', error);
  }
}

module.exports = router;