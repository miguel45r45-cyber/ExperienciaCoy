const express = require('express');
const rutaPaquetes = express.Router();
const db = require('../dataBase/db');
const { verificarTokenAdmin } = require('../verificador/autorizador');
const multer = require('multer');

// Configuración de Multer para guardar imágenes en /uploads
const upload = multer({ dest: 'uploads/' });

// Crear paquete (solo admin)
rutaPaquetes.post('/', verificarTokenAdmin, upload.single('imagen'), (req, res) => {
    const {
    destino, fechaSalida, hora, transporte, traslado, servicios,
    alimentacion, bebidas, actividades, monto
    } = req.body;

  const rif_admin = req.user.rif; // rif del admin desde el token
    const imagen_url = req.file ? req.file.filename : null;

    const sql = `
    INSERT INTO paquetes
    (destino, fechaSalida, hora, transporte, traslado, servicios, alimentacion, bebidas, actividades,
    monto, rif_admin, imagen_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
    destino, fechaSalida, hora, transporte, traslado, servicios, alimentacion, bebidas, actividades,
    monto, rif_admin, imagen_url
    ], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al crear paquete' });
    res.status(201).json({ mensaje: 'Paquete creado', idPaquete: result.insertId });
    });
});

// Leer todos los paquetes
rutaPaquetes.get('/', (req, res) => {
  db.query('SELECT * FROM paquetes ORDER BY fechaSalida ASC', (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener paquetes' });
    res.json(results);
    });
});

// Leer un paquete por ID
rutaPaquetes.get('/:id', (req, res) => {
  db.query('SELECT * FROM paquetes WHERE idPaquete = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener paquete' });
    res.json(results[0] || null);
    });
});

// Actualizar paquete (solo admin)
rutaPaquetes.put('/:id', verificarTokenAdmin, (req, res) => {
    const {
    destino, fechaSalida, hora, transporte, traslado, servicios,
    alimentacion, bebidas, actividades, monto, imagen_url
    } = req.body;

    const sql = `
    UPDATE paquetes SET
        destino=?, fechaSalida=?, hora=?, transporte=?, traslado=?, servicios=?,
        alimentacion=?, bebidas=?, actividades=?, monto=?, imagen_url=?
    WHERE idPaquete=?
    `;

    db.query(sql, [
    destino, fechaSalida, hora, transporte, traslado, servicios,
    alimentacion, bebidas, actividades, monto, imagen_url, req.params.id
    ], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar paquete' });
    res.json({ mensaje: 'Paquete actualizado' });
    });
});

// Eliminar paquete (solo admin)
rutaPaquetes.delete('/:id', verificarTokenAdmin, (req, res) => {
    db.query('DELETE FROM paquetes WHERE idPaquete = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al eliminar paquete' });
    res.json({ mensaje: 'Paquete eliminado' });
    });
});

module.exports = rutaPaquetes;
