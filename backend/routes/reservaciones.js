const express = require('express');
const rutaReservaciones = express.Router();
const db = require('../dataBase/db');

// Crear reservación
rutaReservaciones.post('/', (req, res) => {
  const {
    cliente_id,
    paquete_id,
    destino,
    nombre_cliente,
    ci_cliente,
    telefono_cliente,
    correo_cliente,
    cupos,
    montoPagar,
    metodoPago_id
  } = req.body;

  // Validar datos obligatorios
  if (!cliente_id || !paquete_id || !destino || !nombre_cliente || !ci_cliente ||
      !telefono_cliente || !correo_cliente || !cupos || !montoPagar || !metodoPago_id) {
    return res.status(400).json({ mensaje: "Datos incompletos para la reservación" });
  }

  // 1. Obtener formaPago desde metodo_pago
  const sqlMetodo = "SELECT formaPago FROM metodo_pago WHERE idMetodoPago = ?";
  db.query(sqlMetodo, [metodoPago_id], (err, resultMetodo) => {
    if (err || resultMetodo.length === 0) {
      console.error("Error SELECT metodo_pago:", err);
      return res.status(500).json({ mensaje: "Método de pago inválido" });
    }

    const formaPago = resultMetodo[0].formaPago;

    // 2. Obtener rif_admin desde el paquete
    const sqlPaquete = "SELECT rif_admin FROM paquetes WHERE idPaquete = ?";
    db.query(sqlPaquete, [paquete_id], (err, resultPaquete) => {
      if (err || resultPaquete.length === 0) {
        console.error("Error SELECT paquetes:", err);
        return res.status(500).json({ mensaje: "Paquete inválido" });
      }

      const rif_admin = resultPaquete[0].rif_admin;

      // 3. Insertar reservación con rif_admin incluido
      const sqlInsert = `
        INSERT INTO reservaciones 
        (cliente_id, paquete_id, rif_admin, destino, nombre_cliente, ci_cliente, telefono_cliente, correo_cliente, cupos, montoPagar, metodoPago_id, formaPago)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(sqlInsert, [
        cliente_id, paquete_id, rif_admin, destino, nombre_cliente, ci_cliente,
        telefono_cliente, correo_cliente, cupos, montoPagar, metodoPago_id, formaPago
      ], (err, resultInsert) => {
        if (err) {
          console.error("Error INSERT reservaciones:", err);
          return res.status(500).json({ mensaje: "Error al crear reservación" });
        }
        res.status(201).json({ mensaje: "Reservación creada", idReservacion: resultInsert.insertId });
      });
    });
  });
});

// Obtener todas las reservaciones (para admin)
rutaReservaciones.get('/', (req, res) => {
  const sql = `
    SELECT r.idReservacion, r.destino, r.nombre_cliente, r.ci_cliente, r.telefono_cliente,
           r.correo_cliente, r.cupos, r.montoPagar, r.fechaReserva, r.estado,
           r.rif_admin, p.destino AS paqueteDestino, r.formaPago
    FROM reservaciones r
    JOIN paquetes p ON r.paquete_id = p.idPaquete
    JOIN metodo_pago m ON r.metodoPago_id = m.idMetodoPago
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error SELECT reservaciones:", err);
      return res.status(500).json({ mensaje: "Error al obtener reservaciones" });
    }
    res.json(results);
  });
});

// ✅ Nuevo endpoint: verificar si un paquete tiene reservaciones activas
rutaReservaciones.get('/paquete/:id/check', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT COUNT(*) AS total FROM reservaciones WHERE paquete_id = ? AND estado = 'activa'";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error SELECT reservaciones:", err);
      return res.status(500).json({ mensaje: "Error al verificar reservaciones" });
    }
    const total = result[0].total;
    res.json({ paquete_id: id, total, tieneReservaciones: total > 0 });
  });
});

module.exports = rutaReservaciones;
