const express = require('express');
const router = express.Router();
const { Menu, Usuario, Residente } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Obtener menú del día
router.get('/diario', authenticateToken, async (req, res) => {
  try {
    const fecha = req.query.fecha || new Date().toISOString().split('T')[0];
    const menuDiario = await Menu.findOne({
      where: { fecha },
      include: [
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
    
    if (!menuDiario) {
      return res.status(404).json({ message: 'No hay menú disponible para esta fecha' });
    }
    
    res.json(menuDiario);
  } catch (error) {
    console.error('Error al obtener menú:', error);
    res.status(500).json({ message: 'Error al obtener menú' });
  }
});

// Crear o actualizar menú del día
router.post('/diario', authenticateToken, async (req, res) => {
  try {
    const { fecha, desayuno, comida, merienda, cena, observaciones } = req.body;
    
    const [menu, created] = await Menu.findOrCreate({
      where: { fecha },
      defaults: {
        desayuno,
        comida,
        merienda,
        cena,
        observaciones,
        creadoPor: req.user.id
      }
    });

    if (!created) {
      await menu.update({
        desayuno,
        comida,
        merienda,
        cena,
        observaciones,
        actualizadoPor: req.user.id
      });
    }

    const menuActualizado = await Menu.findByPk(menu.id, {
      include: [
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

    res.status(created ? 201 : 200).json(menuActualizado);
  } catch (error) {
    console.error('Error al crear/actualizar menú:', error);
    res.status(500).json({ message: 'Error al crear/actualizar menú' });
  }
});

// Obtener menús por rango de fechas
router.get('/rango', authenticateToken, async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    const menus = await Menu.findAll({
      where: {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      },
      include: [
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
      ],
      order: [['fecha', 'ASC']]
    });

    res.json(menus);
  } catch (error) {
    console.error('Error al obtener menús:', error);
    res.status(500).json({ message: 'Error al obtener menús' });
  }
});

// Eliminar menú
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menú no encontrado' });
    }

    await menu.destroy();
    res.json({ message: 'Menú eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar menú:', error);
    res.status(500).json({ message: 'Error al eliminar menú' });
  }
});

module.exports = router;