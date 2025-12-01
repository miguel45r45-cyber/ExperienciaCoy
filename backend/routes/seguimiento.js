// backend/routes/seguimiento.js
const express = require('express');
const db = require('../dataBase/db'); // usa la misma conexión que en server.js

const seguimiento = express.Router();

// Guardar comentario
seguimiento.post('/', (req, res) => {
  const { idReservacion, comentario } = req.body;
  if (!idReservacion || !comentario) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const sql = 'INSERT INTO seguimiento (idReservacion, comentario) VALUES (?, ?)';
  db.query(sql, [idReservacion, comentario], (err, result) => {
    if (err) {
      console.error('Error INSERT seguimiento:', err);
      return res.status(500).json({ error: 'Error guardando comentario' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// Obtener comentarios de una reservación
seguimiento.get('/:idReservacion', (req, res) => {
  const { idReservacion } = req.params;
  const sql = 'SELECT * FROM seguimiento WHERE idReservacion = ? ORDER BY fecha DESC';
  db.query(sql, [idReservacion], (err, rows) => {
    if (err) {
      console.error('Error SELECT seguimiento:', err);
      return res.status(500).json({ error: 'Error cargando comentarios' });
    }
    res.json(rows);
  });
});

module.exports = seguimiento; 
