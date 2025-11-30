const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../dataBase/db');

const router = express.Router();

// Guardar pregunta de seguridad
router.post('/seguridad', (req, res) => {
    const { cliente_id, pregunta, respuesta } = req.body;

    if (!cliente_id || !pregunta || !respuesta) {
    return res.status(400).json({ message: 'Faltan datos' });
    }

    const sql = 'INSERT INTO clave_seguridad (cliente_id, pregunta, respuesta) VALUES (?, ?, ?)';
    db.query(sql, [cliente_id, pregunta, respuesta], (err) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al guardar la pregunta' });
    }
    res.json({ message: 'Pregunta de seguridad guardada exitosamente' });
    });
});

// Obtener pregunta por correo
router.get('/seguridad/:correo', (req, res) => {
    const { correo } = req.params;

    const sql = `
    SELECT cs.pregunta, u.cliente_id 
    FROM clave_seguridad cs
    JOIN cliente u ON cs.cliente_id = u.cliente_id
    WHERE u.correo = ?
    `;
    db.query(sql, [correo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });
    if (results.length === 0) return res.status(404).json({ message: 'cliente no encontrado' });

    res.json({ pregunta: results[0].pregunta, cliente_id: results[0].cliente_id });
    });
});

// Validar respuesta y cambiar contraseña
router.post('/recuperar', async (req, res) => {
    const { cliente_id, respuesta, nuevaContrasena } = req.body;

    if (!cliente_id || !respuesta || !nuevaContrasena) {
    return res.status(400).json({ message: 'Faltan datos' });
    }

    const sql = 'SELECT respuesta FROM clave_seguridad WHERE cliente_id = ?';
    db.query(sql, [cliente_id], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });
    if (results.length === 0) return res.status(404).json({ message: 'Pregunta no encontrada' });

    if (results[0].respuesta !== respuesta) {
        return res.status(401).json({ message: 'Respuesta incorrecta' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);

    const sqlUpdate = 'UPDATE cliente SET contrasena = ? WHERE cliente_id = ?';
    db.query(sqlUpdate, [hashedPassword, cliente_id], (err2) => {
        if (err2) return res.status(500).json({ message: 'Error al actualizar contraseña' });
        res.json({ message: 'Contraseña actualizada exitosamente' });
    });
    });
});

module.exports = router;
