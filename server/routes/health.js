const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'El servicio está funcionando correctamente' });
});

module.exports = router;