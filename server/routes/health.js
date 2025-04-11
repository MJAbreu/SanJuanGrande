const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    // Verificar la conexión a la base de datos
    await db.query('SELECT NOW()');
    
    res.status(200).json({
      status: 'ok',
      message: 'El servicio está funcionando correctamente',
      database: 'conectada',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Error en el health check:', error);
    res.status(503).json({
      status: 'error',
      message: 'Problemas con la conexión a la base de datos',
      database: 'desconectada',
      environment: process.env.NODE_ENV
    });
  }
});

module.exports = router;