const express = require('express');
const rutaPaquetes = express.Router();
const db = require('../dataBase/db');
const { verificarTokenAdmin } = require('../verificador/autorizador');
const multer = require('multer');

// Configuración de Multer para imágenes
const upload = multer({ dest: 'uploads/' });

/**
 * Crear paquete (solo admin)
 */
rutaPaquetes.post('/', verificarTokenAdmin, upload.single('imagen'), (req, res) => {
  const {
    destino, fechaSalida, hora, transporte, traslado, servicios,
    alimentacion, bebidas, actividades, monto
  } = req.body;

  const rif_admin = req.user.rif;
  const imagen_url = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO paquetes
    (destino, fechaSalida, hora, transporte, traslado, servicios, alimentacion, bebidas, actividades,
    monto, rif_admin, imagen_url, estadoPaqueteActivo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;

  db.query(sql, [
    destino, fechaSalida, hora, transporte, traslado, servicios,
    alimentacion, bebidas, actividades, monto, rif_admin, imagen_url
  ], (err, result) => {
    if (err) {
      console.error("Error INSERT paquete:", err);
      return res.status(500).json({ mensaje: 'Error al crear paquete' });
    }
    res.status(201).json({ mensaje: 'Paquete creado', idPaquete: result.insertId });
  });
});

/**
 * Obtener todos los paquetes (activos e inactivos)
 */
rutaPaquetes.get('/', (req, res) => {
  db.query('SELECT * FROM paquetes ORDER BY estadoPaqueteActivo DESC, fechaSalida ASC', (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener paquetes' });
    res.json(results || []);
  });
});

/**
 * Obtener paquetes públicos (solo activos)
 */
rutaPaquetes.get('/public', (req, res) => {
  db.query('SELECT * FROM paquetes WHERE estadoPaqueteActivo=1 ORDER BY fechaSalida ASC', (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener paquetes públicos' });
    res.json(results || []);
  });
});

/**
 * Obtener paquetes para admin
 */
rutaPaquetes.get('/admin', verificarTokenAdmin, (req, res) => {
  db.query('SELECT * FROM paquetes ORDER BY estadoPaqueteActivo DESC, fechaSalida ASC', (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener paquetes admin' });
    res.json(results || []);
  });
});

/**
 * Obtener paquete por ID
 */
rutaPaquetes.get('/:id', (req, res) => {
  db.query('SELECT * FROM paquetes WHERE idPaquete = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener paquete' });
    res.json(results[0] || null);
  });
});

/**
 * ✅ Consultar si un paquete tiene reservaciones activas
 */
rutaPaquetes.get('/:id/reservaciones/check', verificarTokenAdmin, (req, res) => {
  const idPaquete = req.params.id;
  const sql = "SELECT COUNT(*) AS total FROM reservaciones WHERE paquete_id=? AND estado='activa'";
  db.query(sql, [idPaquete], (err, rows) => {
    if (err) {
      console.error("Error SELECT reservaciones:", err);
      return res.status(500).json({ mensaje: "Error al verificar reservaciones" });
    }
    const total = rows[0].total;
    res.json({ paquete_id: idPaquete, total, tieneReservaciones: total > 0 });
  });
});

/**
 * Actualizar paquete (solo admin)
 */
rutaPaquetes.put('/:id', verificarTokenAdmin, upload.single('imagen'), (req, res) => {
  const rif_admin = req.user.rif;
  const idPaquete = req.params.id;

  const campos = [];
  const valores = [];

  const permitidos = [
    "destino", "fechaSalida", "hora", "transporte", "traslado", "servicios",
    "alimentacion", "bebidas", "actividades", "monto", "estadoPaqueteActivo"
  ];

  permitidos.forEach((campo) => {
    if (req.body[campo] !== undefined) {
      campos.push(`${campo}=?`);
      valores.push(req.body[campo]);
    }
  });

  if (req.file) {
    campos.push("imagen_url=?");
    valores.push(req.file.filename);
  }

  if (campos.length === 0) {
    return res.status(400).json({ mensaje: "No se enviaron campos para actualizar" });
  }

  const sql = `UPDATE paquetes SET ${campos.join(", ")} WHERE idPaquete=? AND rif_admin=?`;
  valores.push(idPaquete, rif_admin);

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error("Error UPDATE paquete:", err);
      return res.status(500).json({ mensaje: "Error al actualizar paquete" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Paquete no encontrado o no autorizado" });
    }
    res.json({ mensaje: "Paquete actualizado" });
  });
});

/**
 * Inactivar paquete (solo admin)
 */
rutaPaquetes.patch('/:id/inactivar', verificarTokenAdmin, (req, res) => {
  const rif_admin = req.user.rif;
  const idPaquete = req.params.id;

  const sql = 'UPDATE paquetes SET estadoPaqueteActivo=0 WHERE idPaquete=? AND rif_admin=?';
  db.query(sql, [idPaquete, rif_admin], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al inactivar paquete' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Paquete no encontrado o no autorizado' });
    res.json({ mensaje: 'Paquete inactivado' });
  });
});

/**
 * Eliminar paquete definitivo (solo admin)
 */
rutaPaquetes.delete('/:id', verificarTokenAdmin, (req, res) => {
  const rif_admin = req.user.rif;
  const idPaquete = req.params.id;

  const checkSql = 'SELECT COUNT(*) AS total FROM reservaciones WHERE paquete_id=? AND estado="activa"';
  db.query(checkSql, [idPaquete], (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al verificar reservaciones' });

    if (rows[0].total > 0) {
      return res.status(400).json({ mensaje: 'No se puede eliminar, el paquete tiene reservaciones activas. Use Inactivar.' });
    }

    const deleteSql = 'DELETE FROM paquetes WHERE idPaquete=? AND rif_admin=?';
    db.query(deleteSql, [idPaquete, rif_admin], (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error al eliminar paquete' });
      if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Paquete no encontrado o no autorizado' });
      res.json({ mensaje: 'Paquete eliminado definitivamente' });
    });
  });
});

/**
 * Reactivar paquete (solo admin)
 */
rutaPaquetes.patch('/:id/reactivar', verificarTokenAdmin, (req, res) => {
  const rif_admin = req.user.rif;
  const idPaquete = req.params.id;

  const sql = 'UPDATE paquetes SET estadoPaqueteActivo=1 WHERE idPaquete=? AND rif_admin=?';
  db.query(sql, [idPaquete, rif_admin], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al reactivar paquete' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Paquete no encontrado o no autorizado' });
    res.json({ mensaje: 'Paquete reactivado' });
  });
});

module.exports = rutaPaquetes;
