// backend/routes/reservacionesEstado.js
const express = require('express');
const db = require('../dataBase/db'); // usa la misma conexión MySQL

const reservacionesEstado = express.Router();

// Cambiar estado de una reservación
reservacionesEstado.put('/:idReservacion/estado', (req, res) => {
    const { idReservacion } = req.params;
    const { estado } = req.body;

  // Validar que el estado sea correcto
    if (!['pendiente', 'aprobada', 'rechazada'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
    }

    const sql = 'UPDATE reservaciones SET estado = ? WHERE idReservacion = ?';
    db.query(sql, [estado, idReservacion], (err) => {
    if (err) {
        console.error('Error UPDATE reservaciones:', err);
        return res.status(500).json({ error: 'Error actualizando estado' });
    }
    res.json({ success: true, estado });
    });
});

module.exports = reservacionesEstado;
